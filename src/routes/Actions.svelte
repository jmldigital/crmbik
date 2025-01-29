<!-- components/ClientActions.svelte -->
<script>
    import { Button } from 'carbon-components-svelte';
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
  </script>
  


  
  <div class="actions">
    <Button on:click={() => dispatch('add')}>
      Добавить клиентааааа
    </Button>
  </div>
  
  <style>
    .actions {
      margin-bottom: 20px;
    }
  </style>