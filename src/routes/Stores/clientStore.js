import { writable, get } from 'svelte/store';
import { supabase } from '../supabase';
import { eventStore } from './eventStore';
import { adminStore } from './adminStore';
import { userStore } from './userStore';

function createClientStore() {
  const { subscribe, set, update } = writable({
    clients: [],
    loading: false,
    error: null
  });

  return {
    subscribe,
    setClients: (clients) => update(state => ({ ...state, clients })),
    setLoading: (loading) => update(state => ({ ...state, loading })),
    setError: (error) => update(state => ({ ...state, error })),

    loadClients: async () => {
      update(state => ({ ...state, loading: true, error: null }));

      try {
        const { isAdmin } = get(adminStore);
        let query = supabase
          .from("clients")
          .select("*")
          .order('created_at', { ascending: false });

        if (!isAdmin && userStore.user) {
          query = query.eq('manager_id', userStore.user.id);
        }

        const { data: clientsData, error: clientsError } = await query;
        if (clientsError) throw clientsError;

        // Для админа добавляем информацию о менеджерах и считаем события
        const processedClients = isAdmin
          ? clientsData.map(client => {
              return {
                ...client,
              };
            })
          : clientsData;

        update(state => ({
          ...state,
          clients: processedClients,
          loading: false,
          error: null
        }));

        return processedClients;

      } catch (error) {
        console.error("Error loading clients:", error);
        update(state => ({
          ...state,
          error: error.message,
          loading: false
        }));
        throw error;
      }
    }
  };
}

export const clientStore = createClientStore();
