import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    StatusBar,
    ScrollView,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const AddveySettingsScreen: React.FC = () => {
    const navigation = useNavigation<any>();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#fff" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={18} color="black" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 22 }} />
            </View>

            {/* Content */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 80 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ marginTop: hp(2) }}>
                    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Notification')}>
                        <Feather name="bell" size={14} color="#000" />
                        <Text style={styles.itemText}>Notification</Text>
                        <Ionicons name="chevron-forward" size={15} color="#000" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('LinkedDevice')}>
                        <Feather name="link" size={14} color="#000" />
                        <Text style={styles.itemText}>Linked Devices</Text>
                        <Ionicons name="chevron-forward" size={15} color="#000" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Personalization')}>
                        <Feather name="clock" size={14} color="#000" />
                        <Text style={styles.itemText}>Personalization</Text>
                        <Ionicons name="chevron-forward" size={15} color="#000" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Bottom Delete Button */}
            <View style={styles.footer}>
                <TouchableOpacity style={styles.deleteBtn}>
                    <Ionicons name="trash-outline" size={18} color="red" />
                    <Text style={styles.deleteText}>
                        Delete Addvey Account
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default AddveySettingsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: "5%",
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5E5",
        backgroundColor: "#fff",
        marginTop: hp(3.5),
    },
    headerTitle: {
        fontSize: wp(4.5),
        color: "#000",
        fontFamily: 'Poppins-Medium',
        marginLeft: wp(3),
        marginTop: hp(0.4)
    },
    content: {
        flex: 1,
        backgroundColor: "#fff",
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(8),
    },
    itemText: {
        flex: 1,
        marginLeft: 12,
        fontSize: wp(3.6),
        color: "#000",
        fontFamily: 'Poppins-Medium',
        marginTop: hp(0.3)
    },
    footer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: hp(10),
        paddingHorizontal: "5%",
        backgroundColor: "#fff",
    },
    deleteBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    deleteText: {
        marginLeft: 8,
        fontSize: wp(3.8),
        color: "#FF0303",
        fontFamily: 'Poppins-Regular',
        marginTop: hp(0.3)
    },
});
