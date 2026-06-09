import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    SafeAreaView,
    Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";

interface VoiceRecognitionModalProps {
    visible: boolean;
    onClose: () => void;
    onResult: (text: string) => void;
}

const VoiceRecognitionModal: React.FC<VoiceRecognitionModalProps> = ({
    visible,
    onClose,
    onResult,
}) => {
    const {
        isStarting,
        isListening,
        results,
        partialResults,
        error,
        errorCode,
        startRecognizing,
        stopRecognizing,
        resetResults,
    } = useVoiceRecognition();

    const [displayState, setDisplayState] = useState<"listening" | "processing" | "error">("listening");
    const [hasSubmittedResult, setHasSubmittedResult] = useState(false);
    const scaleAnim = React.useRef(new Animated.Value(1)).current;
    const pulseLoopRef = React.useRef<Animated.CompositeAnimation | null>(null);
    const startPulse = () => {
        pulseLoopRef.current?.stop();
        pulseLoopRef.current = Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        );
        pulseLoopRef.current.start();
    };

    // Auto-start when modal opens
    useEffect(() => {
        if (visible) {
            setDisplayState("listening");
            setHasSubmittedResult(false);
            resetResults();
            void startRecognizing();
        } else {
            void stopRecognizing();
            pulseLoopRef.current?.stop();
            scaleAnim.setValue(1);
        }
    }, [visible, resetResults, startRecognizing, stopRecognizing, scaleAnim]);

    // Pulse animation for mic while actively listening
    useEffect(() => {
        if (!visible) return;

        if (displayState === "listening" && isListening) {
            startPulse();
        } else {
            pulseLoopRef.current?.stop();
            scaleAnim.setValue(1);
        }
    }, [visible, displayState, isListening, scaleAnim]);

    // Handle results/errors
    useEffect(() => {

        const finalText = String(results?.[0] || "").trim();
        const partialText = String(partialResults?.[0] || "").trim();
        const transcript = finalText || partialText;
        const hasTranscript = transcript.length > 0;
        const shouldSubmit =
            !hasSubmittedResult &&
            hasTranscript &&
            (results.length > 0 || !isListening || Boolean(error));

        if (shouldSubmit) {
            setHasSubmittedResult(true);
            setDisplayState("processing");
            const timer = setTimeout(() => {
                onResult(transcript);
                onClose();
            }, 500);
            return () => clearTimeout(timer);
        }
        if (error && !hasTranscript) {
            setDisplayState("error");
        }
    }, [results, partialResults, isListening, error, hasSubmittedResult, onResult, onClose]);


    const handleRetry = () => {
        setDisplayState("listening");
        setHasSubmittedResult(false);
        resetResults();
        void startRecognizing();
    };

    const handleMicPress = () => {
        if (displayState === "error") {
            handleRetry();
            return;
        }

        if (isListening) {
            void stopRecognizing();
            return;
        }

        setDisplayState("listening");
        setHasSubmittedResult(false);
        resetResults();
        void startRecognizing();
    };

    const getStatusText = () => {
        if (displayState === "error") return error || "Don't get that";
        if (displayState === "processing") return String(results?.[0] || partialResults?.[0] || "Processing...");
        if (isStarting) return "Starting microphone...";
        if (isListening && partialResults?.[0]) return partialResults[0];
        if (isListening) return "Listening...";
        return "Speak now";
    }

    const getSubText = () => {
        if (displayState === "error") {
            if (errorCode === "not-allowed" || errorCode === "service-not-allowed") {
                return "Allow microphone and speech permission, then try again";
            }
            if (errorCode === "network") {
                return "Check internet connection and try again";
            }
            return "Tap the microphone to try again";
        }
        if (displayState === "processing") return "Searching...";
        if (isStarting) return "Please wait...";
        return 'Try saying "Appliances"';
    }

    return (
        <Modal
            visible={visible}
            transparent={false}
            animationType="fade"
            onRequestClose={onClose}
        >
            <SafeAreaView style={styles.container}>
                {/* Close Button */}
                <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                    <Ionicons name="close" size={wp("6%")} color="#000" />
                </TouchableOpacity>

                <View style={styles.content}>
                    {/* Status Text */}
                    <Text style={styles.statusText}>{getStatusText()}</Text>

                    {/* Sub Text / Hint */}
                    <Text style={styles.subText}>{getSubText()}</Text>

                    {/* Mic Icon Section */}
                    <View style={styles.micContainer}>
                        {displayState === 'listening' && (isListening || isStarting) && (
                            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: scaleAnim }] }]} />
                        )}

                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleMicPress}
                            style={[styles.micButton, displayState === 'error' ? styles.micError : styles.micActive]}
                        >
                            <Ionicons
                                name={displayState === 'error' ? "mic-off" : "mic"}
                                size={wp("8%")}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    closeButton: {
        alignSelf: "flex-start",
        padding: wp("4%"),
        marginTop: hp("1%"),
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: wp("5%"),
        marginTop: -hp("10%"), // Push up slightly visually
    },
    statusText: {
        fontSize: wp("6%"),
        fontFamily: "Poppins-SemiBold", // Assuming font exists per project
        color: "#000",
        marginBottom: hp("2%"),
        textAlign: 'center'
    },
    subText: {
        fontSize: wp("3.5%"),
        fontFamily: "Poppins-Regular",
        color: "#666",
        marginBottom: hp("8%"),
        textAlign: 'center'
    },
    micContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: wp("30%"),
        height: wp("30%"),
    },
    pulseCircle: {
        position: 'absolute',
        width: wp("25%"),
        height: wp("25%"),
        borderRadius: wp("12.5%"),
        backgroundColor: "rgba(108, 99, 255, 0.1)", // Light purple
    },
    micButton: {
        width: wp("18%"),
        height: wp("18%"),
        borderRadius: wp("9%"),
        alignItems: "center",
        justifyContent: "center",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    micActive: {
        backgroundColor: "#6C63FF",
    },
    micError: {
        backgroundColor: "#ff3b30",
    },
});

export default VoiceRecognitionModal;
