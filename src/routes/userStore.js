// stores/userStore.js
import { writable } from 'svelte/store';
import { supabase } from '../lib/supabase';

function createUserStore() {
    const { subscribe, set, update } = writable({
        user: null,
        isLoading: true,
        error: null
    });

    return {
        subscribe,
        setUser: (userData) => set({ user: userData, isLoading: false, error: null }),
        clearUser: () => set({ user: null, isLoading: false, error: null }),
        setError: (error) => set({ user: null, isLoading: false, error }),
        setLoading: (loading) => update(state => ({ ...state, isLoading: loading }))
    };
}

export const userStore = createUserStore();