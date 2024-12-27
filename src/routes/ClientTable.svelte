<script>
  import { DataTable, Button, Tag } from 'carbon-components-svelte';
  import Edit16 from 'carbon-icons-svelte/lib/Edit.svelte';

  export let clients = [];
  export let startEdit;
  export let Admin = false


  $: headers = Admin 
    ? [
        { key: 'Manager', value: 'Менеджер' },
        { key: 'first_name', value: 'Имя' },
        { key: 'last_name', value: 'Фамилия' },
        { key: 'object', value: 'Объект' },
        { key: 'phone', value: 'Телефон' },
        { key: 'source', value: 'Источник' },
        { key: 'email', value: 'Email' },
        { key: 'status', value: 'Статус' },
        { key: 'actions', value: 'Действия' },
      ]
    : [
        { key: 'first_name', value: 'Имя' },
        { key: 'last_name', value: 'Фамилия' },
        { key: 'object', value: 'Объект' },
        { key: 'phone', value: 'Телефон' },
        { key: 'source', value: 'Источник' },
        { key: 'email', value: 'Email' },
        { key: 'status', value: 'Статус' },
        { key: 'actions', value: 'Действия' },
      ];

  function getTagType(status) {
    switch (status) {
      case 'Новый':
        return 'green';
      case 'В работе':
        return 'blue';
      case 'Завершен':
        return 'red';
      default:
        return 'gray';
    }
  }
</script>

<DataTable
  {headers}
  rows={clients}
>


  <svelte:fragment slot="cell" let:row let:cell>
    {#if cell.key === 'actions'}
      <Button
        kind="ghost"
        icon={Edit16}
        on:click={() => startEdit(row)}
      >
        Редактировать
      </Button>
    {:else if cell.key === 'status'}
      <Tag type={getTagType(cell.value)}>{cell.value}</Tag>
    {:else}
      {cell.value}
    {/if}
  </svelte:fragment>
</DataTable>