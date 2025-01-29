// stores/clientStore.js
import { writable } from 'svelte/store';

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
    setError: (error) => update(state => ({ ...state, error }))
  };
}

export const clientStore = createClientStore();