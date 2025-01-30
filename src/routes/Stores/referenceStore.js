// stores/referenceStore.js
import { writable } from 'svelte/store';


const initialData = {
    sources: [
        { value: "Заявка с сайта", text: "Заявка с сайта" },
        { value: "Зашел с улицы", text: "Зашел с улицы" },
        { value: "Позвонил через сайт", text: "Позвонил через сайт" },
        { value: "Звонок на телефон", text: "Звонок на телефон" },
        { value: "Клиент агенства", text: "Клиент агенства" },
        { value: "Постоянный клиент", text: "Постоянный клиент" }
    ],
    statuses: [
        { value: "Новый", text: "Новый" },
        { value: "В работе", text: "В работе" },
        { value: "Завершен", text: "Завершен" }
    ],
    objects: [
        { value: "ЮЗ Строится", text: "ЮЗ Строится" },
        { value: "ЮЗ Готов", text: "ЮЗ Готов" },
        { value: "БТ-1", text: "БТ-1" },
        { value: "БТ-2", text: "БТ-2" }
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