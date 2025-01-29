// eventStore.js
import { writable } from 'svelte/store';

function createEventStore() {
    const { subscribe, set, update } = writable({
        events: [],
        loading: false,
        error: null
    });

    return {
        subscribe,
        setEvents: (events) => update(state => ({ ...state, events })),
        setLoading: (loading) => update(state => ({ ...state, loading })),
        setError: (error) => update(state => ({ ...state, error })),
        clearError: () => update(state => ({ ...state, error: null }))
    };
}

export const eventStore = createEventStore();