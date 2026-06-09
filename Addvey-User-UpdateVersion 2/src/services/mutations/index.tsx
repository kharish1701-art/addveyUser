import axios from 'axios';
const SERVER_URL = "https://api.addvey.com/api"
import { useMutation } from '@tanstack/react-query';
import { Alert, Linking } from 'react-native';

const useApi = (
  urlWithOutBase,
  userToken,
  customConfig = {},
  whenSuccess,
  whenError,
  method = 'post',
  contentType = 'application/json',
) => {
  console.log('urlWithOutBase___----',urlWithOutBase,'whenSuccess',whenSuccess,userToken , )
  const defaultConfig = {
    method,
    baseURL: SERVER_URL,
    headers: {
      'Content-Type': contentType,
      Authorization: userToken ? `Bearer ${userToken}` : '',
    },
  };
  const config = {
    ...defaultConfig,
    ...customConfig,
  };
  const postData = async body => {

    try {
      const response = await axios.request({
        url: urlWithOutBase,
        data: body,
        ...config,
      });
console.log('api__user__UPdate__',response.data)

      return response.data;
    } catch (error) {
      console.log('error in', error, urlWithOutBase);
      const message = error?.response?.data?.message;

      throw new Error(
        message || error.message || 'Something went wrong try again later.',
      );
    }
  };

  return useMutation({
    mutationFn: postData,
    onSuccess: responseData => {
      whenSuccess(responseData);
    },
    onError: err => {
      console.log('Error sending data:', err);
      whenError(err);
    },
  });
};

export default useApi;

export const Base_URL = "https://api.addvey.com/api/public/"

export const openWhatsApp = (phoneNumber, message) => {
  // Remove spaces & special chars if needed
  const formattedNumber = phoneNumber.replace(/[^\d]/g, '');
  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://wa.me/${formattedNumber}?text=${encodedMessage}`;

  Linking.canOpenURL(whatsappURL)
    .then((supported) => {
      if (!supported) {
        Alert.alert('Error', 'WhatsApp is not installed on your device');
      } else {
        return Linking.openURL(whatsappURL);
      }
    })
    .catch((err) => console.error('Error opening WhatsApp', err));
};
