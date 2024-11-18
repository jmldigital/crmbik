<script>
  import { Router, Link, Route } from "svelte-routing";
  import Login from "./routes/Login.svelte";
  import Clients from "./routes/Clients.svelte";
  
  console.log('App.svelte: Component initialized');
  
  let url = window.location.pathname;
  console.log('App.svelte: Current URL:', url);
</script>

<Router {url}>
  <main>
    <Route path="/" component={Login} />
    <Route path="/clients" component={Clients} />
  </main>
</Router>