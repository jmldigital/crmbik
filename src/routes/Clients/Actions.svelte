<!-- components/ClientActions.svelte -->
<script>
    import { Button } from 'carbon-components-svelte';
    import { createEventDispatcher } from 'svelte';
    import Add from "carbon-icons-svelte/lib/Add.svelte";
    const dispatch = createEventDispatcher();
    import FaceActivatedAdd from "carbon-icons-svelte/lib/FaceActivatedAdd.svelte";

  </script>
  


  
  <div class="actions">

    <Button
    size="field"
    
    icon={FaceActivatedAdd}
    on:click={() => dispatch('add')}
  >
 
  Добавить клиента
  </Button>


  </div>
  
  <style>
    .actions {
      margin-bottom: 20px;
    }
  </style>