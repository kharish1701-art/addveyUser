import { memo } from "react";
import { Alert, Image, Linking, Platform, Share } from "react-native";
// import * as Sharing from "expo-sharing";
// import * as Clipboard from 'expo-clipboard';

export const goPlayStore = () => {
  if (Platform.OS === "ios") {
    const url = "https://apps.apple.com/in/app/addvey/id6447718851";
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  } else {
    const url = "https://play.google.com/store/apps/details?id=com.addvey.app";
    Linking.openURL(url).catch((err) =>
      console.error("Couldn't load page", err)
    );
  }
};

export const shareApp = async () => {
  const appUrl = Platform.OS === "ios" 
    ? "https://apps.apple.com/in/app/addvey/id6447718851"
    : "https://play.google.com/store/apps/details?id=com.addvey.app";
  
  const message = "Check out Addvey - an amazing app for your needs!\n\nDownload it from: ";
  const shareContent = `${message}${appUrl}`;

  try {
    const result = await Share.share({
      message: shareContent,
      title: 'Share Addvey App',
      url: Platform.OS === 'ios' ? appUrl : undefined,
    });

    if (result.action === Share.dismissedAction) {
      console.log('Share dismissed by user');
    }
  } catch (error) {
    console.error("Error sharing app:", error);
    // Fallback to clipboard
    // await Clipboard.setStringAsync(shareContent);
    Alert.alert("Link Copied!", "App link has been copied to clipboard. You can paste it anywhere to share.");
  }
};



export const shareProduct = async (id) => {
  const appUrl = Platform.OS === "ios" 
    ? "https://apps.apple.com/in/app/addvey/id6447718851"
    : "https://play.google.com/store/apps/details?id=com.addvey.app/ads="+id;
  
  const message = "Check out Addvey Product - an amazing app for your needs!\n\nDownload it from: ";
  const shareContent = `${message}${appUrl}`;

  try {
    const result = await Share.share({
      message: shareContent,
      title: 'Share Addvey Product',
      url: Platform.OS === 'ios' ? appUrl : undefined,
    });

    if (result.action === Share.dismissedAction) {
      console.log('Share dismissed by user');
    }
  } catch (error) {
    console.error("Error sharing app:", error);
    // Fallback to clipboard
    // await Clipboard.setStringAsync(shareContent);
    Alert.alert("Link Copied!", "App link has been copied to clipboard. You can paste it anywhere to share.");
  }
};



export const SocialIcon = memo(({ platform, size = 35,  }) => {
  // console.log(platform)
  // Local image mapping
  const socialIcons = {
    twitter: require('../../assets/images/social/X.png'),
    x: require('../../assets/images/social/X.png'),
    facebook: require('../../assets/images/social/Facebook.png'),
    instagram: require('../../assets/images/social/Instagram.png'),
    linkedin: require('../../assets/images/social/LinkedIn.png'),
    youtube: require('../../assets/images/social/Youtube.png'),
    whatsapp: require('../../assets/images/social/Whatsapp.png'),
    telegram: require('../../assets/images/social/Telegram.png'),
    tiktok: require('../../assets/images/social/Tiktok.png'),
    snapchat: require('../../assets/images/social/Snapchat.png'),
    pinterest: require('../../assets/images/social/Pinterest.png'),
    reddit: require('../../assets/images/social/Reddit.png'),
    discord: require('../../assets/images/social/Discord.png'),
    spotify: require('../../assets/images/social/Spotify.png'),
    default: require('../../assets/images/social/Slack.png'),
  }

    const platformKey = platform?.toLowerCase() || 'default';
  const iconSource = socialIcons[platformKey] || socialIcons.default;

  return (
    <Image
      source={iconSource}
      style={[
        // styles.icon,
        {
          width: size,
          height: size,
          // tintColor: color,
        }
      ]}
      resizeMode="contain"
    />
  );

})