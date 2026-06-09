import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
// @ts-ignore
import Truecaller, { TrueProfile, TrueButton } from '@ajitpatel28/react-native-truecaller';

interface TruecallerLoginProps {
    onSuccess: (profile: TrueProfile) => void;
    onFailure?: (error: any) => void;
}

const TruecallerLogin: React.FC<TruecallerLoginProps> = ({ onSuccess, onFailure }) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Initialize Truecaller
        const init = async () => {
            try {
                // You might need to check if supported first depending on the package
                Truecaller.initializeClient(); // Some versions auto-init or use init method
            } catch (e) {
                console.log("Truecaller init error", e);
            }
        };
        init();
    }, []);

    const handleTruecallerLogin = async () => {
        try {
            setLoading(true);

            // Check if Truecaller is supported/installed
            // const isSupported = await Truecaller.isSupported(); // Verify method availability

            Truecaller.on("onSuccess", (profile: TrueProfile) => {
                console.log("Truecaller Success:", profile);
                setLoading(false);
                onSuccess(profile);
            });

            Truecaller.on("onFailure", (error: any) => {
                console.log("Truecaller Failure:", error);
                setLoading(false);
                if (onFailure) onFailure(error);
                else Alert.alert("Truecaller Login Failed", error?.message || "Unknown error");
            });

            // Request verification
            if (Platform.OS === 'android') {
                Truecaller.initializeClient(); // Android specific init if needed per docs
            }

            Truecaller.requestTrueProfile();

        } catch (error: any) {
            setLoading(false);
            console.error(error);
            Alert.alert("Error", "Failed to initiate Truecaller login");
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={handleTruecallerLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                ) : (
                    <Text style={styles.text}>Login with Truecaller</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        width: '100%',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#0087FF', // Truecaller Blue
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 24,
        width: '90%',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2.5,
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'System'
    }
});

export default TruecallerLogin;
