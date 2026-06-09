import axios from "axios";
import { BaseUrl } from "../authApi/BaseUrl";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EndPoints } from "../../services/EndPoints";
import { showLoginAlert } from "../../utils/authGuard";
export const getApi = async (
  endpoint: string,
  setLoading?: (l: boolean) => void,
  token?: string,
  requireAuth: boolean = false,
  _from?:string,
) => {
  try {
    console.log('_from ', _from)
     if (requireAuth && !token) {
      showLoginAlert();
      return { success: false, message: "User not logged in" };
    }
    setLoading && setLoading(true);

    const url =
      //  endpoint.startsWith("http")
      //   ? endpoint
      //   :
      `${BaseUrl}${endpoint}`;
    console.log(url, "this is url");
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: url,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    console.log("📡 Fetching:", url);

    const response = await axios.request(config);
    return response.data;
  } catch (error: any) {
    console.error("GET API Error:", error?.response?.data || error?.message);
    return (
      error?.response?.data || {
        success: false,
        message: "Something went wrong",
      }
    );
  } finally {
    setLoading && setLoading(false);
  }
};
export const deleteApi = async (
  param: any,
  setLoading?: (l: boolean) => void,
  
) => {
  try {
    setLoading && setLoading(true);
    console.log(param);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if (param?.token)
      myHeaders.append("Authorization", `Bearer ${param?.token}`);

    const requestOptions: RequestInit = {
      method: "DELETE",
      headers: myHeaders,
      // body: body ? JSON.stringify(body) : undefined, // GET me normally body optional
      redirect: "follow",
    };

    const response = await fetch(`${BaseUrl}${param?.url}`, requestOptions);
    const data = await response.json(); // JSON me convert
    console.log(data);
    return data;
  } catch (error) {
    console.error("GET API Error:", error);
    Toast.show({
      type: "error",
      text1: "Error!",
      text2: error?.message || "Something went wrong",
      position: "top",
    });
    return { success: false, message: "Something went wrong" };
  } finally {
    setLoading && setLoading(false);
  }
};
export const PostAPi = async (
  param: {
    url: string;
    body?: any;
    token?: string;
    method?: string;
    requireAuth?: boolean;
  },
  setLoading?: (loading: boolean) => void // <-- optional now
) => {
  try {
    if (param.requireAuth && !param.token) {
      showLoginAlert();
      return { success: false, message: "User not logged in" };
    }
    if (setLoading) setLoading(true);

    console.log("param", param);

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (param.token) {
      myHeaders.append("Authorization", `Bearer ${param.token}`);
    }

    const requestOptions: RequestInit = {
      method: param?.method ?? "POST",
      headers: myHeaders,
      body: JSON.stringify(param.body),
      redirect: "follow",
    };

    const response = await fetch(`${BaseUrl}${param.url}`, requestOptions);
    const text = await response.text();
    console.log("___response___loginApi", response);

    let resJson;
    try {
      resJson = JSON.parse(text);
      console.log("---- POST___API___resJson ----", resJson);
    } catch {
      resJson = { success: false, message: text };
    }

    if (setLoading) setLoading(false);
    return resJson;
  } catch (error: any) {
    console.error("POST API Error:", error);
    Toast.show({
      type: "error",
      text1: "Error!",
      text2: error?.message || "Something went wrong",
      position: "top",
    });
    if (setLoading) setLoading(false);
    return null;
  }
};

export const handleFavorite = async (id) => {
  const token = await AsyncStorage.getItem("authToken");

  const param = {
    url: EndPoints.addFavorite,
    token: token,
    body: {
      productId: id,
    },
    requireAuth: true,
  };
  const dd = await PostAPi(param);
  console.log(dd);
  return dd;
};

export const handleUnFavorite = async (id) => {
  try {
    const token = await AsyncStorage.getItem("authToken");

    if (!token) {
      console.log("No auth token found");
      return false;
    }

    // Ensure id is an array
    const productIds = Array.isArray(id) ? id : [id];

    // Get user ID
    // const userId = await AsyncStorage.getItem("userId") || '16';

    const url = `https://api.addvey.com/api/favorites/remove-from-favorites`;

    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productIds: productIds,
      }),
    };

    console.log("UNFAV REQUEST ===>", {
      url: url,
      productIds: productIds,
      body: JSON.stringify({ productIds: productIds }),
    });

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.log("UNFAV HTTP ERROR ===>", response.status, errorText);
      return false;
    }

    const result = await response.json();
    console.log("UNFAV RESPONSE ===>", result);

    return result?.success === true;
  } catch (error) {
    console.log("UNFAV ERROR ===>", error);
    return false;
  }
};

interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  token?: string;
  setLoading?: (l: boolean) => void;
}

export const apiHelper = async (endpoint: string, options: ApiOptions = {}) => {
  const { method = "GET", body, token, setLoading } = options;

  try {
    if (setLoading) setLoading(true);

    // ✅ Headers
    const headers: any = {
      "Content-Type": "application/json",
    };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    // ✅ Request options
    const requestOptions: RequestInit = {
      method,
      headers,
      redirect: "follow",
    };

    // ✅ Attach body only if not GET
    if (body && method !== "GET") {
      requestOptions.body = JSON.stringify(body);
    }

    const url = `${BaseUrl}${endpoint}`;
    console.log("🌐 API call:", url);

    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ API Error:", JSON.stringify(error));
    return { success: false, message: "Something went wrong" };
  } finally {
    if (setLoading) setLoading(false);
  }
};

export const getAllSliders = async (
  setLoading?: (l: boolean) => void,
  token?: string
) => {
  return await getApi("general/view-all-sliders", setLoading, token);
};

export const showSuccessToast = (message: string) => {
  Toast.show({
    type: "success",
    text1: "Success",
    text2: message,
    position: "top",
    visibilityTime: 3000,
  });
};



export const selectLocationById = async (locationId: number) => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    if (!token || !locationId) return;
console.log(locationId, 'locationId')
    const res = await fetch(
      `https://api.addvey.com/api/location/select-location/${locationId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await res.json();
    console.log("Select Location:", json);

    if (json?.success) {
      // navigation.goBack();
    }
  } catch (error) {
    console.log("Select location error:", error);
  }
};