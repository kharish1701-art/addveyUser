const {
    withAndroidManifest,
    withInfoPlist,
    withEntitlementsPlist,
} = require("expo/config-plugins");

const withTruecallerAndroid = (config, { androidPartnerKey }) => {
    return withAndroidManifest(config, async (config) => {
        const mainApplication = config.modResults.manifest.application[0];

        const metaDataName = "com.truecaller.android.sdk.PartnerKey";

        // Remove existing if any (to avoid duplicates)
        if (mainApplication['meta-data']) {
            mainApplication['meta-data'] = mainApplication['meta-data'].filter(
                (item) => item.$['android:name'] !== metaDataName
            );
        } else {
            mainApplication['meta-data'] = [];
        }

        // Add new meta-data
        mainApplication["meta-data"].push({
            $: {
                "android:name": metaDataName,
                "android:value": androidPartnerKey || "YOUR_ANDROID_PARTNER_KEY",
            },
        });

        return config;
    });
};

const withTruecalleriOS = (config, { iosAppKey, iosAppLink }) => {
    return withInfoPlist(config, (config) => {
        // Add LSApplicationQueriesSchemes
        if (!config.modResults.LSApplicationQueriesSchemes) {
            config.modResults.LSApplicationQueriesSchemes = [];
        }
        if (!config.modResults.LSApplicationQueriesSchemes.includes("truecaller")) {
            config.modResults.LSApplicationQueriesSchemes.push("truecaller");
        }

        return config;
    });
};

const withTruecaller = (config, props = {}) => {
    const { androidPartnerKey, iosAppKey, iosAppLink } = props;

    config = withTruecallerAndroid(config, { androidPartnerKey });
    config = withTruecalleriOS(config, { iosAppKey, iosAppLink });

    // Note: iOS Associated Domains usually require 'entitlements-plist' modification
    // but react-native-truecaller documentation primarily focuses on URL schemes for older methods
    // or Universal Links. If 'iosAppLink' is provided, we might need to add it to Associated Domains.
    // For now, we focus on the basic setup.

    return config;
};

module.exports = withTruecaller;
