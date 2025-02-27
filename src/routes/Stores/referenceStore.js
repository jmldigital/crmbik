// stores/referenceStore.js
import { writable } from 'svelte/store';


const initialData = {
  sources: [
    { value: "Заявка из чата (лид)", text: "Заявка из чата (лид)" },
    { value: "Зашел с улицы", text: "Зашел с улицы" },
    { value: "Клиент заказал звонок с сайта", text: "Клиент заказал звонок с сайта" },
    { value: "АВИТО (звонок или сообщение)", text: "АВИТО (звонок или сообщение)" },
    { value: "ЦИАН", text: "ЦИАН" },
    { value: "Звонок без категории", text: "Звонок без категории" },
    { value: "Клиент агенства", text: "Клиент агенства" },
    { value: "Постоянный клиент", text: "Постоянный клиент" }
  ],
  statuses: [
    { value: "Новый", text: "Новый" },
    { value: "В работе", text: "В работе" },
    { value: "Завершен", text: "Завершен" },
  ],
  objects: [
    { value: "ЮЗ Строится", text: "ЮЗ Строится" },
    { value: "ЮЗ Готов", text: "ЮЗ Готов" },
    { value: "БТ-1", text: "БТ-1" },
    { value: "БТ-2", text: "БТ-2" },
  ],
  eventStatus: [
  { value: "Звонок с телефона", text: "Звонок с телефона" },
  { value: "Сообщение в месенджере", text: "Сообщение в месенджере" },
  { value: "Встреча", text: "Встреча" },
  { value: "Запись к руководителю", text: "Запись к руководителю"}
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