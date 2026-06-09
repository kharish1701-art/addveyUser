import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    ScrollView,
    StatusBar,
    Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const AddwayWalletScreen = () => {
    const navigation = useNavigation<any>();
    const [amount, setAmount] = useState("1000");
    const [selectedAmount, setSelectedAmount] = useState<string | null>(null);

    const amounts = [
        { value: "100" },
        { value: "500", popular: true },
        { value: "1500" },
        { value: "2000" },
    ];

    const transactions = [
        {
            id: "#833AML156015",
            amount: "+₹ 300",
            type: "credit",
            date: "28 Dec 2024, 01:40 PM",
            method: "UPI"
        },
        {
            id: "#833AML156015",
            amount: "₹ 300",
            type: "debit",
            date: "28 Dec 2024, 01:40 PM",
            method: "UPI - Addvey Wallet"
        },
        {
            id: "#833AML156015",
            amount: "₹ 300",
            type: "debit",
            date: "28 Dec 2024, 01:40 PM",
            method: "UPI - Addvey Wallet"
        },
        {
            id: "#833AML156015",
            amount: "+₹ 300",
            type: "credit",
            date: "28 Dec 2024, 01:40 PM",
            method: "UPI"
        },
        {
            id: "#833AML156015",
            amount: "₹ 300",
            type: "debit",
            date: "28 Dec 2024, 01:40 PM",
            method: "UPI - Addvey Wallet"
        }
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />
            {/* Top Bar */}
            <View style={styles.topBar}>
                <Ionicons name="arrow-back" size={20} color="#000" />
                <Text style={styles.topBarTitle}>Addvey Wallet</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView
                contentContainerStyle={{
                    paddingBottom: hp("5%"),
                }}
            >
                {/* Balance Card */}
                <View style={styles.balanceCard}>
                    <View>
                        <Text style={styles.balanceLabel}>Available balance</Text>
                        <Text style={styles.balanceValue}>₹ 300</Text>
                    </View>
                    <Image
                        source={require('../../assets/images/walet.png')}
                        style={styles.balanceImg}
                    />
                </View>

                {/* Features Row */}
                <View style={styles.featuresRow}>
                    <View style={styles.featureItem}>
                        <Image
                            source={require('../../assets/images/zap.png')}
                            style={styles.sameImg}
                        />
                        <Text style={styles.featureText}>
                            Easy & Fast {"\n"}Payments
                        </Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Image
                            source={require('../../assets/images/walet.png')}
                            style={styles.sameImg}
                        />
                        <Text style={styles.featureText}>Zero failures</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Image
                            source={require('../../assets/images/ruppe.png')}
                            style={styles.sameImg}
                        />
                        <Text style={styles.featureText}>
                            Instant {"\n"}Refunds
                        </Text>
                    </View>
                </View>

                {/* Add Money Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>
                        Add Money to Addvey Wallet
                    </Text>

                    {/* Input and Label inside one bordered view */}
                    <View style={styles.inputOuter}>
                        <Text style={styles.inputLabel}>Enter the amount</Text>
                        <View style={styles.inputRow}>
                            <Text style={styles.currency}>₹</Text>
                            <TextInput
                                style={styles.input}
                                value={amount}
                                keyboardType="numeric"
                                onChangeText={setAmount}
                                placeholder="0"
                            />
                        </View>
                    </View>

                    {/* Amount Buttons */}
                    <View style={styles.amountRow}>
                        {amounts.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.amountBox,
                                    selectedAmount === item.value &&
                                    styles.amountBoxActive,
                                ]}
                                onPress={() => {
                                    setAmount(item.value);
                                    setSelectedAmount(item.value);
                                }}
                            >
                                <Text style={styles.amountText}>₹ {item.value}</Text>
                                {item.popular && (
                                    <View style={styles.popularBadge}>
                                        <Text style={styles.popularText}>POPULAR</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Note Section */}
                <View style={styles.noteBox}>
                    <Text style={styles.noteTitle}>Note</Text>
                    <Text style={styles.noteText}>
                        • Addvey Wallet Money is Lifetime valid
                    </Text>
                    <Text style={styles.noteText}>
                        • Addvey Wallet Money cannot be transferred to a bank account
                        as per RBI guidelines
                    </Text>
                </View>

                {/* Bottom Button (inside scroll) */}
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Add money to Wallet</Text>
                </TouchableOpacity>

                {/* Recent Transactions Section */}
                <View style={styles.transactionsSection}>
                    <View style={styles.transactionHeader}>
                        <View style={styles.line} />
                        <Text style={styles.transactionsTitle}>Recent Transaction</Text>
                        <View style={styles.line} />
                    </View>
                    {transactions.map((item, index) => (
                        <View key={index} style={styles.transactionCard}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.transactionId}>
                                    Placed Order ID {item.id}
                                </Text>
                                <Text style={styles.transactionDate}>{item.date}</Text>
                                <Text style={styles.transactionMethod}>{item.method}</Text>
                            </View>
                            <Text style={[
                                styles.transactionAmount,
                                item.type === "credit" ? styles.credit : styles.debit
                            ]}>
                                {item.amount}
                            </Text>
                        </View>
                    ))}
                    <TouchableOpacity style={styles.seeAllBtn} onPress={() => navigation.navigate('Transaction')}>
                        <Text style={styles.seeAllText}>See All <Feather name="arrow-right" size={12} color="#6C63FF" /></Text>
                    </TouchableOpacity>
                </View>

                {/* FAQ and How it Works */}
                <View style={styles.extraSection}>
                    <TouchableOpacity style={styles.extraRow}>
                        <Text style={styles.extraText}>FAQ</Text>
                        <MaterialIcons name="keyboard-arrow-down" size={18} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.extraRow}>
                        <Text style={styles.extraText}>How it Works</Text>
                        <Image
                            source={require('../../assets/images/share.png')}
                            style={{ width: wp(5), height: hp(2), resizeMode: 'contain' }}
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AddwayWalletScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#D9D9D94A",
        paddingHorizontal: wp(0.8)
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: wp("4%"),
        marginTop: hp(4)
    },
    topBarTitle: {
        fontSize: wp("4.5%"),
        textAlign: "center",
        fontFamily: 'Poppins-Medium'
    },
    balanceCard: {
        margin: wp("4%"),
        padding: wp("5%"),
        backgroundColor: "#fff",
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    balanceImg: {
        width: wp(10),
        height: hp(6),
        resizeMode: 'contain'
    },
    sameImg: {
        width: wp(6),
        height: hp(3.5),
        resizeMode: 'contain'
    },
    balanceLabel: {
        fontSize: wp("2.8%"),
        color: "#000000",
        fontFamily: 'Poppins-Medium'
    },
    balanceValue: {
        fontSize: wp("4%"),
        fontWeight: "700",
        marginTop: 2,
    },
    featuresRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: hp("2%"),
    },
    featureItem: {
        alignItems: "center",
        width: wp("28%"),
    },
    featureText: {
        fontSize: wp("2.6%"),
        textAlign: "center",
        marginTop: 4,
        color: "#000000",
        fontFamily: 'Poppins-Regular'
    },
    section: {
        marginHorizontal: wp("4%"),
        marginTop: hp("1.8%"),
    },
    sectionTitle: {
        fontSize: wp("3.5%"),
        color: '#000000',
        fontFamily: "Poppins-Medium",
        marginBottom: hp(0.8)
    },
    inputOuter: {
        borderWidth: 1,
        borderColor: "#6C63FF",
        borderRadius: 8,
        backgroundColor: "#fff",
        paddingHorizontal: wp("3%"),
        paddingVertical: hp("1.5%"),
        marginTop: hp("1.5%"),
        marginBottom: hp("2%"),
    },
    inputLabel: {
        fontSize: wp("2.5%"),
        color: "#000000",
        marginBottom: 6,
        fontFamily: "Poppins-Regular"
    },
    inputRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    currency: {
        fontSize: wp("4.2%"),
        fontWeight: "600",
        marginRight: 6,
        color: "#000000",
    },
    input: {
        flex: 1,
        fontSize: wp("4%"),
        paddingVertical: 0,
        fontFamily: 'Poppins-Medium',
        paddingTop: hp(0.3)
    },
    amountRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    amountBox: {
        width: "48%",
        paddingVertical: hp("1.5%"),
        borderWidth: 0.5,
        borderColor: "#D1D5DB",
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: hp("2%"),
        backgroundColor: "#fff",
        position: "relative",
    },
    amountBoxActive: {
        borderColor: "#6366F1",
        borderWidth: 1,
    },
    amountText: {
        fontSize: wp("3.5%"),
        fontFamily: 'Poppins-Regular'
    },
    popularBadge: {
        position: "absolute",
        top: hp(4.5),
        right: wp(14),
        backgroundColor: "#FF0303",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    popularText: {
        color: "#fff",
        fontSize: wp("2.2%"),
        fontWeight: "600",
    },
    noteBox: {
        marginHorizontal: wp("4%"),
        marginTop: hp("2%"),
    },
    noteTitle: {
        fontSize: wp("4%"),
        marginBottom: 2,
        fontFamily: 'Poppins-Bold'
    },
    noteText: {
        fontSize: wp("3%"),
        color: "#6B7280",
        marginBottom: 1,
        fontFamily: 'Poppins-Regular'
    },
    button: {
        marginHorizontal: wp("4%"),
        marginTop: hp("3%"),
        backgroundColor: "#6C63FF",
        paddingVertical: hp("1.8%"),
        alignItems: "center",
        borderRadius: wp(10),
    },
    buttonText: {
        color: "#fff",
        fontSize: wp("3.8%"),
        fontWeight: "600",
        fontFamily: 'Poppins-Medium'
    },
    transactionsSection: {
        marginHorizontal: wp("4%"),
        marginTop: hp("3%")
    },
    transactionHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: hp("2%")
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: "#D9D9D9",
        marginHorizontal: 8
    },
    transactionsTitle: {
        fontSize: wp("4%"),
        fontFamily: "Poppins-Medium",
        textAlign: "center",
    },
    transactionCard: {
        backgroundColor: "#fff",
        padding: wp("4%"),
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: hp("1.8%")
    },
    transactionId: {
        fontSize: wp("3.2%"),
        fontFamily: "Poppins-Medium",
        marginBottom: 5,
        color: "#000"
    },
    transactionDate: {
        fontSize: wp("2.8%"),
        color: "#6B7280",
        marginBottom: 5,
        fontFamily: "Poppins-Regular"
    },
    transactionMethod: {
        fontSize: wp("2.8%"),
        color: "#6B7280",
        fontFamily: "Poppins-Regular"
    },
    transactionAmount: {
        fontSize: wp("3.5%"),
        fontFamily: "Poppins-Medium"
    },
    credit: {
        color: "#729358",
        fontFamily: 'Poppins-Medium'
    },
    debit: {
        color: "#000"
    },
    seeAllBtn: {
        alignItems: "center",
        marginTop: hp("1%"),
    },
    seeAllText: {
        fontSize: wp("3.8%"),
        color: "#6C63FF",
        fontFamily: "Poppins-Medium"
    },
    extraSection: {
        marginTop: hp("2%"),
        marginHorizontal: wp("4%"),
    },
    extraRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: hp("1%"),
        paddingHorizontal: wp("4%"),
        marginBottom: hp("1.2%")
    },
    extraText: {
        fontSize: wp("3.5%"),
        color: "#000",
        fontFamily: "Poppins-Medium"
    }
});
