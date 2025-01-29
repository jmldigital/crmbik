// // stores/clientStore.js
// import { writable } from 'svelte/store';

// function createClientStore() {
//   const { subscribe, set, update } = writable({
//     clients: [],
//     loading: false,
//     error: null
//   });

//   return {
//     subscribe,
//     setClients: (clients) => update(state => ({ ...state, clients })),
//     setLoading: (loading) => update(state => ({ ...state, loading })),
//     setError: (error) => update(state => ({ ...state, error }))
//   };
// }

// export const clientStore = createClientStore();


// stores/clientStore.js
// stores/clientStore.js
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

  // Вспомогательная функция для получения email менеджера
    // Получаем имя и фамилию менеджера для клиента
    async function getManagerEmail(managerId) {
    const { data, error } = await supabase
      .from("managers")
      .select("manager_first_name, manager_last_name")
      .eq("id", managerId)
      .single();

    if (error) {
      console.error("Error fetching manager name:", error);
      return null;
    }

    // Объединяем имя и фамилию в одну строку
    return `${data.manager_first_name} ${data.manager_last_name}`;
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

        // Для админа добавляем информацию о менеджерах и считаем события
        const processedClients = isAdmin 
          ? await Promise.all(
              clientsData.map(async (client) => ({
                ...client,
                Manager: await getManagerEmail(client.manager_id),
                Touches: get(eventStore).events.filter(e => e.client_id === client.id).length,
                lastEventStatus: get(eventStore).events.find(e => e.client_id === client.id)?.status || 'Нет событий',
              }))
            )
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