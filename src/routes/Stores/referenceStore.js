// stores/referenceStore.js
import { writable } from 'svelte/store';


const initialData = {
  sources: [
    { id: 1,value: "Заявка из чата (лид)", text: "Заявка из чата (лид)" },
    { id: 2,value: "Зашел с улицы", text: "Зашел с улицы" },
    { id: 3,value: "Клиент заказал звонок с сайта", text: "Клиент заказал звонок с сайта" },
    { id: 4,value: "АВИТО (звонок или сообщение)", text: "АВИТО (звонок или сообщение)" },
    { id: 5,value: "ЦИАН", text: "ЦИАН" },
    { id: 6,value: "Звонок без категории", text: "Звонок без категории" },
    { id: 7,value: "Клиент агенства", text: "Клиент агенства" },
    { id: 8,value: "Постоянный клиент", text: "Постоянный клиент" }
  ],
  statuses: [
    { id: 1,value: "Новый", text: "Новый" },
    { id: 2,value: "В работе", text: "В работе" },
    { id: 3,value: "Завершен", text: "Завершен" },
    {id: 4, value: "Отказался", text: "Отказался" },
  ],
  objects: [
    {id: 1, value: "ЮЗ Строится", text: "ЮЗ Строится" },
    { id: 2, value: "ЮЗ Готов", text: "ЮЗ Готов" },
    {id: 3, value: "БТ-1", text: "БТ-1" },
    { id: 4,value: "БТ-2", text: "БТ-2" },
  ],
  eventStatus: [
  { id: 1,value: "Звонок с телефона", text: "Звонок с телефона" },
  {id: 2, value: "Сообщение в месенджере", text: "Сообщение в месенджере" },
  { id: 3,value: "Встреча", text: "Встреча" },
  { id: 4,value: "Запись к руководителю", text: "Запись к руководителю"}
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