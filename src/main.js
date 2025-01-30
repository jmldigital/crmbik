import './app.css'
import App from './App.svelte'
import { mount } from 'svelte'
const base = "/crmbik";

const app = mount(App, {
  target: document.getElementById('app'),
  props: {
    url: window.location.pathname
  }
});
// Добавьте эту проверку для отладки
console.log('Main.js - Base URL:', base);
console.log('Main.js - Window location:', window.location.href);
export default app

// import './app.css'
// import App from './App.svelte'
// import { mount } from 'svelte';  // Правильный импорт для Svelte 5

// const base = "/crmbik";

// // Обработка базового пути
// const path = window.location.pathname;
// if (!path.startsWith(base)) {
//   const newPath = base + (path === '/' ? '' : path);
//   window.history.replaceState(null, '', newPath);
// }

// // Используем mount вместо new App
// const app = mount(App, {
//   target: document.getElementById('app'),
//   props: {
//     url: window.location.pathname
//   }
// });

// console.log('Main.js - Base URL:', base);
// console.log('Main.js - Window location:', window.location.href);

// export default app