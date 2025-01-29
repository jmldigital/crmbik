// stores/referenceStore.js
import { writable } from 'svelte/store';

const initialData = {
    sources: [
        { value: "Telegram", text: "Telegram" },
        { value: "VK", text: "VK" },
        { value: "Наружка", text: "Наружка" },
        { value: "Шел мимо", text: "Шел мимо" },
        { value: "Другой источник", text: "Другой источник" }
    ],
    statuses: [
        { value: "Новый", text: "Новый" },
        { value: "В работе", text: "В работе" },
        { value: "Завершен", text: "Завершен" }
    ],
    objects: [
        { value: "ЮЗ-Б", text: "ЮЗ-Б" },
        { value: "ЮЗ-А Закончен", text: "ЮЗ-А Закончен" },
        { value: "БИК TOWER", text: "БИК TOWER" }
    ]
};

function createReferenceStore() {
    const { subscribe, set, update } = writable(initialData);

    return {
        subscribe,
        updateSources: (sources) => update(data => ({ ...data, sources })),
        updateStatuses: (statuses) => update(data => ({ ...data, statuses })),
        updateObjects: (objects) => update(data => ({ ...data, objects })),
        reset: () => set(initialData)
    };
}

export const referenceStore = createReferenceStore();