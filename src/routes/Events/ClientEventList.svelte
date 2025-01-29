<script>
    import { DataTable } from 'carbon-components-svelte';
    import { createEventDispatcher } from 'svelte';
    export let events = [];
    export let clientId;
    import { eventStore } from './eventStore';

    const dispatch = createEventDispatcher();

       // Подписываемся на изменения store
       $: events = $eventStore.events;

    const headers = [
        { key: 'created_at', value: 'Дата' },
        { key: 'status', value: 'Статус' },
        { key: 'description', value: 'Описание' },
        { key: 'actions', value: 'Действия' }
    ];
</script>

{#if $eventStore.loading}
    <div>Загрузка событий</div>
{:else if $eventStore.error}
    <div>Ошибка: {$eventStore.error}</div>
{:else}

<DataTable {headers} rows={events}>
    <svelte:fragment slot="cell" let:row let:cell>
        {#if cell.key === 'actions'}
            <button on:click={() => dispatch('edit', row)}>
                Редактировать
            </button>
        {:else}
            {row[cell.key]}
        {/if}
    </svelte:fragment>
</DataTable>

{/if} 