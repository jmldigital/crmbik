<!-- components/ClientList.svelte -->
<script>
    import { onMount } from "svelte";
    import { DataTable } from 'carbon-components-svelte';
    import { createEventDispatcher } from 'svelte';
    import { clientStore } from './clientStore'; // Исправлен путь импорта
    import ClientEventManager from './Events/ClientEventManager.svelte';
    
    let expandedClient = null;

    const dispatch = createEventDispatcher();
    
    // Удаляем export и прямое объявление clients,
    // так как мы используем store
    let clients = [];
    
    // Подписываемся на изменения store
    $: clients = $clientStore.clients;
  
    const headers = [
        { key: 'first_name', value: 'Имя' },
        { key: 'last_name', value: 'Фамилия' },
        { key: 'object', value: 'Объект' },
        { key: 'phone', value: 'Телефон' },
        { key: 'source', value: 'Источник' },
        { key: 'status', value: 'Статус' },
        { key: 'actions', value: '' }
    ];

    // Для отладки
    // $: {
    //     console.log('clients updated:', clients);
    //     console.log('store state:', $clientStore);
    // }
</script>

<!-- {#if $clientStore.loading}
    <div>Загрузка...</div>
{:else if $clientStore.error}
    <div>Ошибка: {$clientStore.error}</div>
{:else} -->

    <!-- <DataTable
        {headers}
        rows={clients}
    >
        <svelte:fragment slot="cell" let:row let:cell>
            {#if cell.key === 'actions'}
                <button on:click={() => dispatch('edit', row)}>
                    Редактировать
                </button>
            {:else}
                {row[cell.key]}
            {/if}
        </svelte:fragment>
    </DataTable> -->
<!-- {/if} -->




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
       <p> "тут клиент" {expandedClient}</p>
        <ClientEventManager clientId={expandedClient} />
    </div>
{/if}