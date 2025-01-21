import axios from "axios";
import { useStateContext } from "./context/ContextProvider.jsx";

// Create an Axios instance
const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

// Request interceptor to add the Authorization header
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ACCESS_TOKEN');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


// Response interceptor for handling errors
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;

    // Handle 401 Unauthorized
    if (response && response.status === 401) {
      localStorage.removeItem('ACCESS_TOKEN');
      // Optionally, you can redirect to the login page or show a notification
      // window.location.reload();
    }

    // Handle 404 Not Found
    if (response && response.status === 404) {
      // Show a notification or alert for not found
      console.error("Resource not found");
    }

    // Handle other errors
    if (response && response.data && response.data.message) {
      // Show the error message from the server
      console.error(response.data.message);
    } else {
      // Handle generic error
      console.error("An unexpected error occurred");
    }

    // Optionally, you can use the context to show notifications
    // const { setNotification } = useStateContext();
    // setNotification(response.data.message || "An error occurred");

    throw error; // Re-throw the error to be handled by the calling code
  }
);

export default axiosClient;