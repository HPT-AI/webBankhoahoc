import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./locales/en/translation.json";
import viTranslation from "./locales/vi/translation.json";

// Khởi tạo i18n
i18n
  .use(initReactI18next) // Kết nối với React
  .init({
    resources: {
      en: {
        translation: enTranslation, // Tiếng Anh
      },
      vi: {
        translation: viTranslation, // Tiếng Việt
      },
    },
    lng: "vi", // Ngôn ngữ mặc định
    fallbackLng: "en", // Ngôn ngữ dự phòng
    interpolation: {
      escapeValue: false, // Không cần phải escape giá trị
    },
  });

export default i18n;
