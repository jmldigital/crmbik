import { wrap } from 'svelte-spa-router/wrap'
import Login from './Login.svelte'
import Clients from './Clients.svelte'

export const routes = {
  '/': Login,
  '/clients': Clients
}