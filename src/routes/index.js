import { wrap } from 'svelte-spa-router/wrap'
import Register from './Register.svelte'
import Login from './Login.svelte'
import Clients from './Clients.svelte'

export const routes = {
  '/': Register,
  '/login': Login,
  '/clients': Clients
}