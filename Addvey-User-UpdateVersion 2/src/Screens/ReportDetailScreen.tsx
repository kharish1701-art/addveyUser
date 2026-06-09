import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    TextInput,
    Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import MainHomeCard from "../Components/Home/MainHomeCard";
import { MaterialIcons } from '@expo/vector-icons';


const AdCard = () => {
    return (
        <View style={styles.adCard}>
            <MainHomeCard />
        </View>
    );
};

//ThisWeek with Like/Dislike Logic
const ThisWeek = () => {
    const [showComment, setShowComment] = useState<boolean | null>(null);

    return (
        <View style={styles.tabContainer}>
            {/* Top Info Row with Image + Time */}
            <View style={styles.infoRow}>
                <Image
                    source={require("../../assets/images/car.png")}
                    style={styles.infoImage}
                />
                <Text style={styles.infoTime}>Nanda</Text>
            </View>

            {/* Fake Ad Text */}
            <Text style={styles.fakeAdTitle}>Fake Ad</Text>

            {/* Agree / Disagree Buttons - right side */}
            <View style={styles.btnRowRight}>
                <TouchableOpacity
                    style={[
                        styles.actionBtn,
                        showComment === false && styles.activeBtn,
                    ]}
                    onPress={() => setShowComment(false)}
                >
                    <Ionicons
                        name="thumbs-up"
                        size={wp("4.5%")}
                        color={showComment === false ? "#6C63FF" : "#777"}
                    />
                    <Text
                        style={[
                            styles.btnText,
                            showComment === false && styles.activeBtnText,
                        ]}
                    >
                        Agree
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.actionBtn,
                        showComment === true && styles.activeBtnOutline,
                    ]}
                    onPress={() => setShowComment(true)}
                >
                    <Ionicons
                        name="thumbs-down"
                        size={wp("4.5%")}
                        color={showComment === true ? "#6C63FF" : "#777"}
                    />
                    <Text
                        style={[
                            styles.btnText,
                            showComment === true && styles.activeBtnOutlineText,
                        ]}
                    >
                        Disagree
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Comment Box (only when Disagree) */}
            {showComment === true && (
                <View style={styles.commentBox}>
                    {/* Reason + Arrow */}
                    <View style={styles.reasonRow}>
                        <Text style={styles.reasonTitle}>Reason</Text>
                        <MaterialIcons name="arrow-drop-up" size={20} color="#6C63FF" />
                    </View>

                    {/* Floating label input */}
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Comment</Text>
                        <TextInput
                            style={styles.commentInput}
                            placeholder="Type here..."
                            placeholderTextColor="#999"
                            multiline
                        />
                    </View>

                    <TouchableOpacity style={styles.submitBtn}>
                        <Text style={styles.submitBtnText}>Submit</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const LastWeek = () => (
    <View style={styles.tabContainer}>
        <Text style={styles.tabText}>Last Week Performance</Text>
    </View>
);

const ThisMonth = () => (
    <View style={styles.tabContainer}>
        <Text style={styles.tabText}>This Month Performance</Text>
    </View>
);

const ReportDetailsScreen = () => {
    const navigation = useNavigation();
    const [activeTab, setActiveTab] = useState<"thisWeek" | "lastWeek" | "thisMonth">("thisWeek");

    const renderTabContent = () => {
        switch (activeTab) {
            case "thisWeek":
                return <ThisWeek />;
            case "lastWeek":
                return <LastWeek />;
            case "thisMonth":
                return <ThisMonth />;
            default:
                return <ThisWeek />;
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#fff" barStyle="dark-content" />

            {/* Fixed Topbar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons
                        name="arrow-back"
                        size={wp("5%")}
                        style={{ marginRight: wp(3) }}
                        color="#000"
                    />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Reports details</Text>
                <View style={{ width: wp("6%") }} />
            </View>

            {/* Scrollable Content */}
            <ScrollView
                contentContainerStyle={{ paddingBottom: hp("5%") }}
                showsVerticalScrollIndicator={false}
            >
                {/* Ad Card Component */}
                <AdCard />

                {/* Tabs */}
                <View style={styles.tabsWrapper}>
                    <View style={styles.tabsContainer}>
                        <TouchableOpacity
                            onPress={() => setActiveTab("thisWeek")}
                            style={[
                                styles.tabButton,
                                activeTab === "thisWeek" && styles.activeTab,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabButtonText,
                                    activeTab === "thisWeek" && styles.activeTabText,
                                ]}
                            >
                                This Week
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveTab("lastWeek")}
                            style={[
                                styles.tabButton,
                                activeTab === "lastWeek" && styles.activeTab,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabButtonText,
                                    activeTab === "lastWeek" && styles.activeTabText,
                                ]}
                            >
                                Last Week
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => setActiveTab("thisMonth")}
                            style={[
                                styles.tabButton,
                                activeTab === "thisMonth" && styles.activeTab,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.tabButtonText,
                                    activeTab === "thisMonth" && styles.activeTabText,
                                ]}
                            >
                                This Month
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tab Content */}
                {renderTabContent()}
            </ScrollView>
        </View>
    );
};

export default ReportDetailsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        height: hp("7%"),
        paddingHorizontal: wp("4%"),
        backgroundColor: "#fff",
        marginTop: hp(4),
    },
    topBarTitle: {
        fontSize: wp("4%"),
        fontWeight: "600",
        color: "#000",
    },
    adCard: {
        marginTop: hp(2),
        borderRadius: wp("3%"),
        marginHorizontal: wp(5),
    },
    tabsWrapper: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: wp("4%"),
        marginBottom: hp("2%"),
        marginTop: hp("2%"),
    },
    tabsContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    tabButton: {
        marginRight: wp("5%"),
        paddingVertical: hp("0.5%"),
    },
    tabButtonText: {
        fontSize: wp("3.6%"),
        color: "#777",
    },
    activeTab: {
        borderBottomWidth: 2,
        borderColor: "#6C63FF",
    },
    activeTabText: {
        color: "#000000",
        fontWeight: "600",
    },
    tabContainer: {
        paddingHorizontal: wp("6%"),
        paddingTop: hp("2%"),
        backgroundColor: '#eee',
        marginHorizontal: wp(4),
        borderRadius: 10
    },
    tabText: {
        fontSize: wp("4%"),
        textAlign: "center",
        marginTop: hp("2%"),
    },

    // ThisWeek Styles
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: hp("1.5%"),
    },
    infoImage: {
        width: wp("10%"),
        height: wp("10%"),
        borderRadius: wp("2%"),
        marginRight: wp("3%"),
    },
    infoTime: {
        fontSize: wp("3.2%"),
        color: "#555",
    },
    fakeAdTitle: {
        fontSize: wp("4%"),
        fontWeight: "600",
        color: "#000",
        marginBottom: hp("1%"),
    },
    btnRowRight: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginVertical: hp("1%"),
    },
    actionBtn: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 20,
        paddingVertical: hp("1%"),
        paddingHorizontal: wp("4%"),
        marginLeft: wp("3%"),
    },
    btnText: {
        fontSize: wp("3.5%"),
        marginLeft: wp("1%"),
        color: "#777",
    },
    activeBtn: {
        borderColor: "#6C63FF",
        borderRadius: 20
    },
    activeBtnText: {
        color: "#6C63FF",
    },
    activeBtnOutline: {
        borderColor: "#6C63FF",
        borderRadius: 20
    },
    activeBtnOutlineText: {
        color: "#6C63FF",
        fontWeight: "600",
    },
    commentBox: {
        marginTop: hp("2%"),
    },
    reasonRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: hp("1%"),
    },
    reasonTitle: {
        fontSize: wp("3.8%"),
        fontWeight: "600",
        color: "#000",
    },
    inputWrapper: {
        position: "relative",
        marginBottom: hp("2%"),
    },
    inputLabel: {
        position: "absolute",
        top: -hp("0.2%"),
        left: wp("5%"),
        fontSize: wp("2.3%"),
        color: "#00000099",
        backgroundColor: "#eee",
        paddingHorizontal: wp("1%"),
    },
    commentInput: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: wp("2%"),
        padding: wp("3%"),
        fontSize: wp("3.5%"),
        minHeight: hp("10%"),
        textAlignVertical: "top",
        marginTop: hp(1)
    },
    submitBtn: {
        backgroundColor: "#6C63FF",
        borderRadius: 15,
        paddingVertical: hp("1.5%"),
        alignItems: "center",
        marginBottom: hp(2)
    },
    submitBtnText: {
        fontSize: wp("3.8%"),
        fontWeight: "600",
        color: "#fff",
    },
});
