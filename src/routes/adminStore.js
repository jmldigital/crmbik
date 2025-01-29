// stores/adminStore.js
import { writable } from 'svelte/store';
import { supabase } from '../lib/supabase';  // путь к вашему supabase клиенту

function createAdminStore() {
    const { subscribe, set } = writable({
        isAdmin: false,
        isLoading: true
    });

    // Функция проверки статуса админа через RPC
    async function checkAdminStatus() {
        try {
            const { data, error } = await supabase.rpc("is_admin");
            
            if (error) throw error;
            set({ isAdmin: data, isLoading: false });
        } catch (error) {
            console.error("Error checking admin role:", error);
            set({ isAdmin: false, isLoading: false });
        }
    }

    return {
        subscribe,
        checkAdminStatus,
        // Добавляем метод сброса если нужно
        // reset: () => set({ isAdmin: false, isLoading: false })
    };
}

export const adminStore = createAdminStore();