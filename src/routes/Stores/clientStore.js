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

  // Получаем всех менеджеров
  async function getAllManagers() {
    const { data, error } = await supabase
      .from("managers")
      .select("id, manager_first_name, manager_last_name");

    if (error) {
      console.error("Error fetching managers:", error);
      return [];
    }

    return data;
  }

  return {
    subscribe,
    setClients: (clients) => update(state => ({ ...state, clients })),
    setLoading: (loading) => update(state => ({ ...state, loading })),
    setError: (error) => update(state => ({ ...state, error })),

    loadClients: async () => {
      update(state => ({ ...state, loading: true, error: null }));

      try {
        const { isAdmin } = get(adminStore);
        // const { data: { user } } = await supabase.auth.getUser();

        if (isAdmin) {
          await eventStore.loadAllEvents();
        }

        let query = supabase
          .from("clients")
          .select("*")
          .order('created_at', { ascending: false });

        if (!isAdmin && userStore.user) {
          query = query.eq('manager_id', userStore.user.id);
        }

        const { data: clientsData, error: clientsError } = await query;
        if (clientsError) throw clientsError;

        // Загружаем всех менеджеров
        const managers = await getAllManagers();

        // Для админа добавляем информацию о менеджерах и считаем события
        const processedClients = isAdmin
          ? clientsData.map(client => {
              const manager = managers.find(m => m.id === client.manager_id);
              return {
                ...client,
                Manager: manager ? `${manager.manager_first_name} ${manager.manager_last_name}` : 'Нет менеджера',
                Touches: get(eventStore).events.filter(e => e.client_id === client.id).length,
                lastEventStatus: get(eventStore).events.find(e => e.client_id === client.id)?.status || 'Нет событий',
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
