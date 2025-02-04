// eventStore.js
import { writable, get } from 'svelte/store';
import { supabase } from '../supabase';
import { adminStore } from './adminStore';
import { clientStore } from './clientStore';

function createEventStore() {
    const { subscribe, set, update } = writable({
        events: [],
        loading: false,
        error: null
    });

    // Загрузка событий
    async function loadEvents() {
        update(state => ({ ...state, loading: true, error: null }));

        try {
            const { isAdmin } = get(adminStore);

            let query = supabase
                .from("client_events")
                .select("*")
                .order('created_at', { ascending: false });

            // Если пользователь не админ, фильтруем события по клиентам менеджера
            if (!isAdmin) {
                // Получаем клиентов менеджера из clientStore
                const clients = get(clientStore).clients;
                const clientIds = clients.map(client => client.id);

                // Фильтруем события по ID клиентов менеджера
                query = query.in('client_id', clientIds);
            }

            const { data: eventsData, error: eventsError } = await query;
            if (eventsError) throw eventsError;

            update(state => ({
                ...state,
                events: eventsData,
                loading: false,
                error: null
            }));

            return eventsData;

        } catch (error) {
            console.error("Error loading events:", error);
            update(state => ({
                ...state,
                error: error.message,
                loading: false
            }));
            throw error;
        }
    }

    return {
        subscribe,
        setEvents: (events) => update(state => ({ ...state, events })),
        setLoading: (loading) => update(state => ({ ...state, loading })),
        setError: (error) => update(state => ({ ...state, error })),
        clearError: () => update(state => ({ ...state, error: null })),
        loadEvents, // Основная функция для загрузки событий
        clearEvents: () => update(state => ({ ...state, events: [] }))
    };
}

export const eventStore = createEventStore();