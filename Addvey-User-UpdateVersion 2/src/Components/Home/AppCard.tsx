import React from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface AppCardProps {
    heading: string;
    image: any;
    title: string;
    subtitle: string;
    category: string;
    buttonText: string;
    comingSoon?: boolean;
    disabled?: boolean;
    showDivider?: boolean;
}

const AppCard: React.FC<AppCardProps> = ({
    heading,
    image,
    title,
    subtitle,
    category,
    buttonText,
    comingSoon = false,
    disabled = false,
    showDivider = false,
    onPress,
}) => {
    return (
        <View style={styles.cardWrapper}>
            {/* Heading */}
            <Text style={styles.heading}>{heading}</Text>

            {/* Row */}
            <View style={styles.row}>
                {/* Left: Image */}
                <View style={styles.imageWrapper}>
                    <Image source={image} style={styles.appIcon} />
                    {comingSoon && (
                        <View style={styles.comingSoonOverlay}>
                            <Text style={styles.comingSoonText}>Coming Soon</Text>
                        </View>
                    )}
                </View>

                {/* Middle: Title + Subtitles */}
                <View style={styles.middle}>
                    <Text style={[styles.title, disabled && { color: "#999" }]}>
                        {title}
                    </Text>
                    <Text style={[styles.subtitle, disabled && { color: "#aaa" }]}>
                        {category} {"   "} • {"   "} {subtitle}
                    </Text>
                </View>

                {/* Right: Button */}
                <TouchableOpacity
                    style={[
                        styles.button,
                        disabled && { backgroundColor: "#bba8f2" },
                    ]}
                    disabled={disabled}
                    onPress={onPress}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            disabled && { color: "#FFFFFF" },
                        ]}
                    >
                        {buttonText}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Divider sirf tab jab prop true ho */}
            {showDivider && <View style={styles.divider} />}
        </View>
    );
};

export default AppCard;

const styles = StyleSheet.create({
    cardWrapper: {
        marginBottom: hp("2%"),
        backgroundColor: "#fff",
        paddingHorizontal: wp(4),
    },
    heading: {
        fontSize: wp("3.8%"),
        fontWeight: "600",
        marginBottom: hp("2.2%"),
        marginLeft: wp("2%"),
        color: "#000",
        paddingHorizontal: wp(2),
        fontFamily: "Poppins-Medium",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: wp("2%"),
        marginBottom: hp("1%"),
    },
    imageWrapper: {
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
    },
    appIcon: {
        width: wp("15%"),
        height: wp("15%"),
        borderRadius: 12,
        resizeMode: "contain",
    },
    comingSoonOverlay: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
    comingSoonText: {
        fontSize: wp("1.7%"),
        color: "#007AFF",
        fontWeight: "600",
        backgroundColor: "#fff",
        paddingHorizontal: wp("2%"),
        paddingVertical: hp("0.3%"),
        borderRadius: 6,
        overflow: "hidden",
    },
    middle: {
        flex: 1,
        marginLeft: wp("2%"),
    },
    title: {
        fontSize: wp("3.2%"),
        fontWeight: "600",
        color: "#000",
        fontFamily: 'Poppins-Medium'
    },
    subtitle: {
        fontSize: wp("2.8%"),
        color: "#666",
        marginTop: hp("0.2%"),
    },
    button: {
        backgroundColor: "#6C63FF",
        paddingVertical: hp("1.1%"),
        paddingHorizontal: wp("4.5%"),
        borderRadius: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: wp("2.8%"),
        fontWeight: "600",
        fontFamily: 'Poppins-Regular'
    },
    divider: {
        height: 1,
        backgroundColor: "#eee",
        marginTop: hp("1.5%"),
    },
});
