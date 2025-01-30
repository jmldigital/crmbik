// stores/adminStore.js
import { writable } from 'svelte/store';
import { supabase } from '../supabase';

function createAdminStore() {
    const { subscribe, set } = writable({
        isAdmin: true,
        isLoading: true
    });

    async function checkAdminStatus() {
        try {
            const { data, error } = await supabase.rpc("is_admin");
            
            if (error) throw error;
            
            console.log('Admin check response:', data);
            set({ isAdmin: data, isLoading: false });
        } catch (error) {
            console.error("Error checking admin role:", error);
            set({ isAdmin: false, isLoading: false });
        }
    }

    // Добавляем только слушатель события загрузки страницы
    if (typeof window !== 'undefined') {
        window.addEventListener('load', () => {
            console.log('Page reloaded - checking admin status');
            checkAdminStatus();
        });
    }

    return {
        subscribe,
        checkAdminStatus,
        reset: () => set({ isAdmin: false, isLoading: true })
    };
}

export const adminStore = createAdminStore();