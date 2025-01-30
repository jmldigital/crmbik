// src/Stores/tableSettingsStore.js
import { writable } from 'svelte/store';

export const tableSettingsStore = writable({
    showColumnSelector: false
});