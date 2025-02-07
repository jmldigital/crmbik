import { writable } from 'svelte/store';
import { supabase } from '../supabase';

function createAdminStore() {
    const { subscribe, set, update } = writable({
        isAdmin: false, // По умолчанию false
        isLoading: true
    });

    // Функция для проверки статуса администратора через Supabase RPC
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

    // Функция для ручной установки статуса isAdmin
    function setAdminStatus(isAdmin) {
        update(state => ({ ...state, isAdmin, isLoading: false }));
    }

    // Добавляем слушатель события загрузки страницы
    if (typeof window !== 'undefined') {
        window.addEventListener('load', () => {
            console.log('Page reloaded - checking admin status');
            checkAdminStatus();
        });
    }

    return {
        subscribe,
        checkAdminStatus,
        setAdminStatus, // Экспортируем метод для ручной установки статуса
        reset: () => set({ isAdmin: false, isLoading: true })
    };
}

export const adminStore = createAdminStore();