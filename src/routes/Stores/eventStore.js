// eventStore.js
import { writable } from 'svelte/store';
import { supabase } from '../supabase';

function createEventStore() {
    const { subscribe, set, update } = writable({
        events: [],
        loading: false,
        error: null
    });

    // Загрузка всех событий для админа
    async function loadAllEvents() {
        update(state => ({ ...state, loading: true, error: null }));
        try {
            const { data, error } = await supabase
                .from("client_events")
                .select("*")
                .order('created_at', { ascending: false });

            if (error) throw error;

            update(state => ({ 
                ...state, 
                events: data,
                loading: false 
            }));

            return data;

        } catch (error) {
            update(state => ({ 
                ...state, 
                error: error.message,
                loading: false 
            }));
            console.error("Error loading all events:", error);
            return [];
        }
    }

    return {
        subscribe,
        setEvents: (events) => update(state => ({ ...state, events })),
        setLoading: (loading) => update(state => ({ ...state, loading })),
        setError: (error) => update(state => ({ ...state, error })),
        clearError: () => update(state => ({ ...state, error: null })),
        loadAllEvents, // Добавляем новую функцию в возвращаемый объект
        // Очистка событий (может пригодиться при выходе из системы)
        clearEvents: () => update(state => ({ ...state, events: [] }))
    };
}

export const eventStore = createEventStore();