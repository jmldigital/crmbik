<script>
  import { Router, Link, Route } from "svelte-routing";
  import Register from "./routes/Register.svelte";
  import Clients from "./routes/Clients.svelte";
  import '../src/carbon.scss';
  import Login from "./routes/Login.svelte";

  console.log('App.svelte: Component initialized');
  
  let url = window.location.pathname;
  console.log('App.svelte: Current URL:', url);
</script>

<Router {url}>
  <main>
    <Route path="/" component={Login} />
    <Route path="/clients" component={Clients} />
    <Route path="/register" component={Register} />
    <Route path="/login" component={Login} />
  </main>
</Router>