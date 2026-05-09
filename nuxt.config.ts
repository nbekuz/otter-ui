export default defineNuxtConfig({
  compatibilityDate: '2026-04-13',
  devtools: { enabled: false },
  experimental: {
    appManifest: false,
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],
  vite: {
    resolve: {
      dedupe: ['vue'],
    },
    server: {
      watch: {
        ignored: [
          '**/.git/**',
          '**/node_modules/**',
          '**/.nuxt/**',
          '**/.output/**',
          '**/.venv-ocr/**',
        ],
      },
    },
  },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Otter - Планировщик задач',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' },
        { name: 'description', content: 'Otter - умный планировщик задач' },
        { name: 'theme-color', content: '#21A038' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' },
      ],
    },
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://159.194.221.54:8005/api/v1/',
      firebase: {
        apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCwg8YuF1oNhGbhqTwo08wQTjjtYEe9_S4',
        authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'otter-6bdac.firebaseapp.com',
        projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID || 'otter-6bdac',
        // Konsolda `*.appspot.com` ko‘rsatsa: NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET orqali yozing
        storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'otter-6bdac.firebasestorage.app',
        messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '911773858551',
        appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID || '1:911773858551:web:dd939daa464da5af74f1f2',
        measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-D48K735BKD',
        /** `true` bo‘lsa — har yerda Google popup; aks holda faqat localhost/127.0.0.1 da popup, boshqa joyda redirect */
        firebaseGoogleUsePopup: process.env.NUXT_PUBLIC_FIREBASE_GOOGLE_POPUP === 'true',
      },
    },
  },
})
