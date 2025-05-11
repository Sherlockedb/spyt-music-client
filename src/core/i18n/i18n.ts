import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 导入翻译文件
import translationEN from './locales/en.json';
import translationZH from './locales/zh.json';

// 配置资源
const resources = {
  en: {
    translation: translationEN
  },
  zh: {
    translation: translationZH
  }
};

i18n
  // 使用语言检测器
  .use(LanguageDetector)
  // 将i18n实例传递给react-i18next
  .use(initReactI18next)
  // 初始化i18next
  .init({
    resources,
    fallbackLng: 'zh', // 默认使用中文
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false // 不转义HTML
    }
  });

export default i18n;