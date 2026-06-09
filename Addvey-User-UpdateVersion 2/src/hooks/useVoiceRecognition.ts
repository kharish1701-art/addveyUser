import { useState, useCallback, useRef } from "react";
import {
    ExpoSpeechRecognitionModule,
    useSpeechRecognitionEvent,
} from "expo-speech-recognition";

interface UseVoiceRecognitionReturn {
    isStarting: boolean;
    isListening: boolean;
    results: string[];
    partialResults: string[];
    error: string | null;
    errorCode: string | null;
    startRecognizing: () => Promise<void>;
    stopRecognizing: () => Promise<void>;
    cancelRecognizing: () => Promise<void>;
    resetResults: () => void;
}

const getFriendlyErrorMessage = (event: any): string => {
    const code = String(event?.error || "").toLowerCase();

    switch (code) {
        case "not-allowed":
        case "service-not-allowed":
            return "Microphone or speech permission not allowed";
        case "no-speech":
        case "speech-timeout":
            return "Couldn't hear clearly. Please speak again";
        case "network":
            return "Network issue during speech recognition";
        case "busy":
            return "Voice recognition is busy. Please try again";
        case "language-not-supported":
            return "Selected language is not supported";
        default:
            return String(event?.message || "Voice recognition failed");
    }
};

export const useVoiceRecognition = (): UseVoiceRecognitionReturn => {
    const [isStarting, setIsStarting] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [results, setResults] = useState<string[]>([]);
    const [partialResults, setPartialResults] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [errorCode, setErrorCode] = useState<string | null>(null);
    const hasTranscriptRef = useRef(false);
    const isAbortedRef = useRef(false);
    const isManualStopRef = useRef(false);

    const extractTranscript = (result: any): string => {
        if (typeof result === "string") return result;
        if (typeof result?.transcript === "string") return result.transcript;
        if (Array.isArray(result) && typeof result?.[0]?.transcript === "string") {
            return result[0].transcript;
        }
        if (typeof result?.[0]?.transcript === "string") return result[0].transcript;
        return "";
    };

    useSpeechRecognitionEvent("start", () => {
        setIsStarting(false);
        setIsListening(true);
        setError(null);
        setErrorCode(null);
    });
    useSpeechRecognitionEvent("audiostart", () => {
        setIsStarting(false);
        setIsListening(true);
        setError(null);
        setErrorCode(null);
    });

    useSpeechRecognitionEvent("speechstart", () => {
        setIsStarting(false);
        setError(null);
        setErrorCode(null);
    });

    useSpeechRecognitionEvent("end", () => {
        setIsStarting(false);
        setIsListening(false);
        if (isAbortedRef.current || isManualStopRef.current) {
            isAbortedRef.current = false;
            isManualStopRef.current = false;
            return;
        }
        if (!hasTranscriptRef.current) {
            setErrorCode("no-speech");
            setError("Couldn't hear clearly. Please try again");
        }
    });

    useSpeechRecognitionEvent("result", (event) => {
        if (event.results && event.results.length > 0) {
            const transcripts = event.results
                .map((result: any) => extractTranscript(result))
                .filter((txt: string) => String(txt || "").trim().length > 0);

            if (transcripts.length > 0) {
                hasTranscriptRef.current = true;
                setError(null);
                setErrorCode(null);
                if (event.isFinal) {
                    setResults(transcripts);
                    setPartialResults([]);
                } else {
                    setPartialResults(transcripts);
                }
            }
        }
        if (event.isFinal) {
            setIsListening(false);
        }
    });
    useSpeechRecognitionEvent("nomatch", () => {
        setIsStarting(false);
        setIsListening(false);
        setErrorCode("nomatch");
        setError("Couldn't understand. Please try again");
    });

    useSpeechRecognitionEvent("error", (event) => {
        setIsStarting(false);
        setIsListening(false);
        const code = String(event?.error || "").toLowerCase();
        if (code === "aborted") {
            isAbortedRef.current = true;
            setError(null);
            setErrorCode(null);
            return;
        }
        setErrorCode(code || null);
        setError(getFriendlyErrorMessage(event));
    });

    const startRecognizing = useCallback(async () => {
        setIsStarting(true);
        setResults([]);
        setPartialResults([]);
        setError(null);
        setErrorCode(null);
        hasTranscriptRef.current = false;
        isAbortedRef.current = false;
        isManualStopRef.current = false;

        try {
            const result = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
            if (!result.granted) {
                setIsStarting(false);
                setError("Microphone permission denied");
                setErrorCode("not-allowed");
                return;
            }

            const isRecognitionAvailable = ExpoSpeechRecognitionModule.isRecognitionAvailable();
            if (!isRecognitionAvailable) {
                setIsStarting(false);
                setError("Speech recognition is not available on this device");
                setErrorCode("service-not-allowed");
                return;
            }

            let locale = "hi-IN";
            try {
                const resolvedLocale = Intl.DateTimeFormat().resolvedOptions().locale;
                if (resolvedLocale) locale = resolvedLocale;
            } catch (_ignored) {
                locale = "hi-IN";
            }

            await ExpoSpeechRecognitionModule.start({
                lang: locale,
                interimResults: true,
                maxAlternatives: 1,
                continuous: false,
                requiresOnDeviceRecognition: false,
                addsPunctuation: false,
                iosTaskHint: "search",
            });
        } catch (e: any) {
            setIsStarting(false);
            console.error(e);
            setError(e?.message || "Unable to start voice recognition");
            setErrorCode("unknown");
        }
    }, []);

    const stopRecognizing = useCallback(async () => {
        try {
            isManualStopRef.current = true;
            setIsStarting(false);
            if (isListening) {
                ExpoSpeechRecognitionModule.stop();
            }
        } catch (e: any) {
            console.error(e);
        }
    }, [isListening]);

    const cancelRecognizing = useCallback(async () => {
        try {
            isManualStopRef.current = true;
            setIsStarting(false);
            ExpoSpeechRecognitionModule.stop();
        } catch (e: any) {
            console.error(e);
        }
    }, []);

    const resetResults = useCallback(() => {
        setIsStarting(false);
        setResults([]);
        setPartialResults([]);
        setError(null);
        setErrorCode(null);
        hasTranscriptRef.current = false;
        isAbortedRef.current = false;
        isManualStopRef.current = false;
    }, []);

    return {
        isStarting,
        isListening,
        results,
        partialResults,
        error,
        errorCode,
        startRecognizing,
        stopRecognizing,
        cancelRecognizing,
        resetResults,
    };
};
