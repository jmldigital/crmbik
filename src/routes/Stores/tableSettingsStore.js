import { writable } from 'svelte/store';

// Функция для загрузки состояния из localStorage
function loadInitialState() {
  const savedState = localStorage.getItem('tableSettings');
  return savedState ? JSON.parse(savedState) : { showColumnSelector: false };
}

// Создаем store с начальным состоянием из localStorage
export const tableSettingsStore = writable(loadInitialState());

// Подписываемся на изменения store и сохраняем состояние в localStorage
tableSettingsStore.subscribe(state => {
  localStorage.setItem('tableSettings', JSON.stringify(state));
});