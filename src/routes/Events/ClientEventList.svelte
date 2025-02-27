<script>
  import { DataTable, Button, Link, OverflowMenu, OverflowMenuItem } from 'carbon-components-svelte';
  import { createEventDispatcher, onMount } from 'svelte';
  export let filteredEvents = [];
  export let clientId;
  const dispatch = createEventDispatcher();
  import Edit from "carbon-icons-svelte/lib/Edit.svelte";


  const headers = [
      { key: 'created_at', value: 'Дата' },
      { key: 'status', value: 'Статус' },
      { key: 'description', value: 'Описание' },
      { key: 'actions', value: '', width: '50px' }
  ];


</script>

<DataTable
  class="events-section"
  {headers}
  rows={filteredEvents}
  stickyHeader
>
  <svelte:fragment slot="cell" let:row let:cell>
      {#if cell.key === 'actions'}
      <div class="overflow-cell">
          <!-- <OverflowMenu flipped>
              <OverflowMenuItem text="Реадактировать">
                  <Link on:click={() => dispatch("edit", row)}>
                      Реадактировать
                  </Link>
              </OverflowMenuItem>
          </OverflowMenu> -->

          <Button size="small" icon = {Edit} on:click={() => dispatch("edit", row)}/>

      </div>
      {:else}
      {row[cell.key]}
      {/if}
  </svelte:fragment>
</DataTable>

<style>
.events-section tr td {
  background-color: red !important;
}
</style>
