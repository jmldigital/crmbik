<script>
    import { DataTable,Button } from 'carbon-components-svelte';
    import { createEventDispatcher } from 'svelte';
    export let filteredEvents = [];
    export let clientId;
    // import { eventStore } from '../Stores/eventStore';
    import Edit16 from 'carbon-icons-svelte/lib/Edit.svelte';
    const dispatch = createEventDispatcher();

       // Подписываемся на изменения store
    //    $: events = $eventStore.events;

    const headers = [
        { key: 'created_at', value: 'Дата' },
        { key: 'status', value: 'Статус' },
        { key: 'description', value: 'Описание' },
        { key: 'actions', value: 'Действия' }
    ];
</script>


<!-- {#if $eventStore.loading}
    <div>Загрузка событий</div>
{:else if $eventStore.error}
    <div>Ошибка: {$eventStore.error}</div>
{:else} -->

<DataTable 
class="events-section"
{headers} 
rows={filteredEvents}
stickyHeader
>
    <svelte:fragment slot="cell" let:row let:cell>
        {#if cell.key === 'actions'}
        <button on:click={() => dispatch('edit', row)}>
            <Edit16 />
        </button>
            
        {:else}
            {row[cell.key]}
        {/if}
    </svelte:fragment>
</DataTable>

<!-- {/if}  -->

<style>
.events-section .bx--data-table-container {

    background-color:red!important;

  }
  
  </style>

