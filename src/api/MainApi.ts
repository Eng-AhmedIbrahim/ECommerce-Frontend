import axios, { type AxiosInstance } from "axios";

// const mainApiUrl = `https://localhost:7019`;
const mainApiUrl = `https://menemsite.runasp.net`;




const MainApi: AxiosInstance = axios.create({
  baseURL: mainApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 8000,
});


// MainApi.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token"); // أو من Redux / Zustand حسب مشروعك
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Interceptor للردود (اختياري - لمعالجة الأخطاء)
// MainApi.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.warn("🔒 Unauthorized! Redirecting to login...");
//       // ممكن تعمل redirect هنا أو تمسح التوكن:
//       // localStorage.removeItem("token");
//       // window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );



export default MainApi;