import './app.css'
import App from './App.svelte'
import { mount } from 'svelte'

const app = mount(App, {
  target: document.getElementById('app'),
  props: {
    url: window.location.pathname
  }
});
console.log('Component initialized main');
export default app