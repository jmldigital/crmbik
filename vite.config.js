// vite.config.js
import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'



 export default defineConfig({
  plugins: [svelte()],
  base: '/', // Правильно - соответствует имени вашего репозитория
})


// .для деплоя
// export default defineConfig({
//   plugins: [svelte()],
//   base: '/crmbik', // Правильно - соответствует имени вашего репозитория
// })