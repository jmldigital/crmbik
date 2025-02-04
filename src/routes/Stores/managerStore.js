// managerStore.js
import { writable, get } from 'svelte/store';
import { supabase } from '../supabase'; // Импортируем клиент Supabase

function createManagerStore() {
    const { subscribe, set, update } = writable({
        managers: [], // Список менеджеров
        loading: false, // Состояние загрузки
        error: null, // Ошибка, если есть
    });

    return {
        subscribe,
        setManagers: (managers) => update(state => ({ ...state, managers })),
        setLoading: (loading) => update(state => ({ ...state, loading })),
        setError: (error) => update(state => ({ ...state, error })),

        // Метод для загрузки всех менеджеров
        loadManagers: async () => {
            update(state => ({ ...state, loading: true, error: null }));

            try {
                const { data, error } = await supabase
                    .from('managers')
                    .select('*') // Выбираем все поля
                    

                if (error) throw error;

                // Обновляем состояние store
                update(state => ({
                    ...state,
                    managers: data,
                    loading: false,
                    error: null,
                }));

                return data; // Возвращаем данные для дальнейшего использования
            } catch (error) {
                console.error('Error loading managers:', error);
                update(state => ({
                    ...state,
                    error: error.message,
                    loading: false,
                }));
                throw error;
            }
        },
    };
}

export const managerStore = createManagerStore();