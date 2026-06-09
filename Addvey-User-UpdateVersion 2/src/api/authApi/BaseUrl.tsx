import axios from "axios";

export const BaseUrl = 'https://api.addvey.com/api'
export const OLA_MAPS_API_KEY = "h58KI3uUYQH9Bh7oX456vQHyXv0fgVqVCfPtbgx6"; // Replace with valid key

export const IMAGE_BASE_URL = "https://api.addvey.com/api/public/";

const apiClient = axios.create({
  baseURL: BaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;