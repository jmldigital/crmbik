<script>
  import { DataTable, Button, 
    Tag,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    ToolbarMenuItem,
  } from 'carbon-components-svelte';

  import Edit16 from 'carbon-icons-svelte/lib/Edit.svelte';

  export let clients = [];
  export let startEdit;
  export let Admin = false
  export let onButtonClick;

 // Добавляем состояние для фильтрации
 let searchTerm = "";
  let filteredClients = clients;


  // Реактивное выражение для фильтрации клиентов
  $: {
    filteredClients = clients.filter(client => {
      const searchFields = [
        client.first_name,
        client.last_name,
        client.object,
        client.phone,
        client.email,
        client.status,
        client.source,
        client.lastEventStatus,
        Admin ? client.Manager : '', // Включаем поле Manager только для админа
      ].filter(Boolean); // Удаляем пустые значения

      return searchFields
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    });
  }


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
        { key: 'Touches', value: 'Касания' },
        { key: 'lastEventStatus', value: 'Последнее' },
        { key: 'actions', value: 'Действия' }

      ]
    : [
        { key: 'first_name', value: 'Имя' },
        { key: 'last_name', value: 'Фамилия' },
        { key: 'object', value: 'Объект' },
        { key: 'phone', value: 'Телефон' },
        { key: 'source', value: 'Источник' },
        { key: 'email', value: 'Email' },
        { key: 'status', value: 'Статус' },

        { key: 'actions', value: 'Действия' }
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


  // Функция для обработки изменений в поисковой строке
  function handleSearch(event) {
    searchTerm = event.target.value;
  }
  // Функция для определения класса строки
  function getRowClass(row) {
    console.log('row.Touches',row.Touches)
    return row.Touches === 0 ? 'zero-touches' : '';
    console.log()
  }

  function getCellStyle(row) {
    return row.Touches === 0 ? 'color: red; font-weight:bold' : '';
  }
</script>

<DataTable
sortable
zebra
  {headers}
  rows={filteredClients}
 
>


<svelte:fragment slot="cell" let:row let:cell>
  <td style={getCellStyle(row)}>
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
  </td>
</svelte:fragment>






  <Toolbar>
    <ToolbarContent>
      <ToolbarSearch
      persistent
      placeholder="Поиск по всем полям..."
      bind:value={searchTerm}
      on:input={handleSearch}
    />
      
      <Button  on:click={onButtonClick} >Добавить клиента</Button>
    </ToolbarContent>
  </Toolbar>


</DataTable>






  
 
