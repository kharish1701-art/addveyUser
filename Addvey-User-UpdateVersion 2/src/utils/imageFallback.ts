import { ImageSourcePropType } from "react-native";
import { IMAGE_BASE_URL } from "../api/authApi/BaseUrl";

export const NO_IMAGE_PLACEHOLDER = require("../../assets/images/no image.png");

export const buildImageSource = (imagePath?: string | null): ImageSourcePropType => {
  const normalizedPath = String(imagePath ?? "").trim();
  const lowerPath = normalizedPath.toLowerCase();

  if (
    !normalizedPath ||
    lowerPath === "null" ||
    lowerPath === "undefined" ||
    lowerPath === "n/a" ||
    lowerPath === "na"
  ) {
    return NO_IMAGE_PLACEHOLDER;
  }

  if (normalizedPath.startsWith("http://") || normalizedPath.startsWith("https://")) {
    return { uri: normalizedPath };
  }

  return { uri: `${IMAGE_BASE_URL}${normalizedPath}` };
};
