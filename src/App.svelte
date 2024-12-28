<script>
  import { Router, Link, Route } from "svelte-routing";
  import Register from "./routes/Register.svelte";
  import Clients from "./routes/Clients.svelte";
  import '../src/carbon.scss';
  import Login from "./routes/Login.svelte";

  console.log('App.svelte: Component initialized');
  
  // Для GitHub Pages
  let url = window.location.pathname;
  const base = "/crmbik";
  
  console.log('App.svelte: Current URL:', url);
  console.log('App.svelte: Base path:', base);
</script>

<Router {url} {base}>
  <main>
    <Route path="" component={Login} /> <!-- Изменено с "/" на "" -->
    <Route path="clients" component={Clients} /> <!-- Убран начальный слеш -->
    <Route path="register" component={Register} /> <!-- Убран начальный слеш -->
    <Route path="login" component={Login} /> <!-- Убран начальный слеш -->
  </main>
</Router>