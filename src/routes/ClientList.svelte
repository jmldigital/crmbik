<!-- components/ClientList.svelte -->
<script>
    import { onMount } from "svelte";
    import { DataTable } from 'carbon-components-svelte';
    import { createEventDispatcher } from 'svelte';
    import { clientStore } from './Stores/clientStore'; // Исправлен путь импорта
    import { eventStore } from './Stores/eventStore'; // Исправлен путь импорта
    import ClientEventManager from './Events/ClientEventManager.svelte';

    import { adminStore } from './Stores/adminStore';
    
    let expandedClient = null;

    const dispatch = createEventDispatcher();
    
    // Удаляем export и прямое объявление clients,
    // так как мы используем store
    let clients = [];
    
    // Подписываемся на изменения store
    $: clients = $clientStore.clients;
    
    $: events = $eventStore.events;
    

    $: headers = $adminStore.isAdmin 
    ? [
        { key: 'Manager', value: 'Менеджер' },
        // { key: 'first_name', value: 'Имя' },
        { key: 'last_name', value: 'Фамилия' },
        { key: 'object', value: 'Объект' },
        { key: 'phone', value: 'Телефон' },
        { key: 'source', value: 'Источник' },
        // { key: 'email', value: 'Email' },
        { key: 'status', value: 'Статус' },
        { key: 'Touches', value: '', width: "40px" },
        { key: 'lastEventStatus', value: 'Последнее' },
        { key: 'actions', value: '' }

      ]
    : [
        { key: 'first_name', value: 'Имя' },
        { key: 'last_name', value: 'Фамилия' },
        { key: 'object', value: 'Объект' },
        { key: 'phone', value: 'Телефон' },
        { key: 'source', value: 'Источник' },
        // { key: 'email', value: 'Email' },
        { key: 'status', value: 'Статус' },

        { key: 'actions', value: '' }
      ];

</script>




<DataTable {headers} rows={clients}>
    <svelte:fragment slot="cell" let:row let:cell>
        {#if cell.key === 'actions'}
            <button on:click={() => dispatch('edit', row)}>
                Редактировать
            </button>
            <button on:click={
            () => expandedClient = expandedClient === row.id ? null : row.id
            }
            >
                {expandedClient === row.id ? 'Скрыть события' : 'Показать события'}
            </button>
        {:else}
            {row[cell.key]}
        {/if}
    </svelte:fragment>
</DataTable>

{#if expandedClient}
    <div class="events-section">
      
        <ClientEventManager clientId={expandedClient} />
    </div>
{/if}