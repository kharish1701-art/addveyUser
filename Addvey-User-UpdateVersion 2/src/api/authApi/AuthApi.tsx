import { BaseUrl } from "./BaseUrl";

export const loginApi = async (
  param: {
    url: string;
    body?: any;
    token?: string;
  },
  setLoading: (loading: boolean) => void
) => {
  try {
    setLoading(true);
console.log('___loginApi_param',param)
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    if (param.token) {
      myHeaders.append("Authorization", `Bearer ${param.token}`);
    }
console.log('__api__param__',param)
    const requestOptions: RequestInit = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(param.body),
      redirect: "follow",
    };

    const response = await fetch(`${BaseUrl}${param.url}`, requestOptions);
    const text = await response.text();
    console.log('___response___loginApi',response)
    let resJson;
    try {
      resJson = JSON.parse(text);
    console.log("---- POST___API___resJson ----", resJson);

    } catch {
      resJson = { success: false, message: text };
    }

    setLoading(false);
    return resJson;
  } catch (error) {
    console.error("POST API Error:", error);
    setLoading(false);
    return null;
  }
};
