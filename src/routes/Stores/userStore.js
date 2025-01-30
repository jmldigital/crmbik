// stores/userStore.js
import { writable } from 'svelte/store';
import { supabase } from '../supabase';

function createUserStore() {
    const { subscribe, set, update } = writable({
        user: null,
        isLoading: true,
        error: null
    });

    // Новая функция для проверки и установки текущего пользователя
    async function checkAndSetUser() {
        try {
            const { data: { session }, error } = await supabase.auth.getSession();
            
            if (error) throw error;
            
            if (session?.user) {
                set({ user: session.user, isLoading: false, error: null });
                return session.user;
            } else {
                set({ user: null, isLoading: false, error: null });
                return null;
            }
        } catch (error) {
            console.error("Error checking user session:", error);
            set({ user: null, isLoading: false, error });
            return null;
        }
    }

    // Подписка на изменения авторизации
    supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_IN' && session) {
            set({ user: session.user, isLoading: false, error: null });
        } else if (event === 'SIGNED_OUT') {
            set({ user: null, isLoading: false, error: null });
        }
    });

    return {
        subscribe,
        setUser: (userData) => set({ user: userData, isLoading: false, error: null }),
        clearUser: () => set({ user: null, isLoading: false, error: null }),
        setError: (error) => set({ user: null, isLoading: false, error }),
        setLoading: (loading) => update(state => ({ ...state, isLoading: loading })),
        checkAndSetUser // Экспортируем новую функцию
    };
}

export const userStore = createUserStore();