<script>
  import {
    Select,
    SelectItem,
    TextArea,
    Form,
    Button,
  } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";
  import { referenceStore } from "../Stores/referenceStore";
  import { onMount } from "svelte";
  import Save from "carbon-icons-svelte/lib/Save.svelte";


  $: ClientStatuses = $referenceStore.statuses;
  $: eventStatuses = $referenceStore.eventStatus;

  export let isEditing = false;
 // Используем spread оператор для объединения defaultEvent с переданным event
 export let event = null;
 export let clientStatus;


  const dispatch = createEventDispatcher();
  let errors = {};

  // Инициализируем выбранные значения
// let SelectedStatus;
let currentEvent ={};


// $: clientStatus = SelectedStatus; // Синхронизируем SelectedStatus с prop'ом

const defaultEvent = {
  status: 'Звонок',
  description: '',
};



onMount(() => {
    // Устанавливаем начальные значения при монтировании компонента
      // SelectedStatus = ClientStatuses[1]?.value || ''; // Устанавливается позже

    // clientStatus = SelectedStatus || ClientStatuses[1].value;
    //  console.log('clientStatus в форме при монтировании ', clientStatus)
    // phoneValue = client.phone;
  });

  
//   // Определяем значения по умолчанию
//   const defaultEvent = {
//   status: 'Звонок', // Или другое значение по умолчанию
//   description: '',
//   clientStatus: SelectedStatus
// };

  

 

  $: currentEvent = { ...defaultEvent, ...(event || {}) };

  // $: console.log("clientStatus в модалке при открытии ", clientStatus);

  function handleSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
    // Добавляем clientStatus в отправляемые данные
  
    const eventData = {
      status: currentEvent.status,
      description: currentEvent.description
    };
    console.log("форма валидна обновляем клиента", eventData);
    dispatch("submit", eventData);
    } else {
      console.log("форма не валидна",currentEvent);
    }
  }

  function validateForm() {
    errors = {};

    if (!currentEvent.description?.trim()) {
      errors.description = "описание обязательно";
    }
    return Object.keys(errors).length === 0;
  }
</script>

<form on:submit={handleSubmit}>

  <Select labelText="Тип события" bind:selected={currentEvent.status}>
    {#each eventStatuses as status}
      <SelectItem value={status.value} text={status.text} />
    {/each}
  </Select>


    <Select labelText="Статус клиента" bind:selected={clientStatus} >
    {#each ClientStatuses.slice(1) as status (status.value)}
    <SelectItem value={status.value} text={status.text} />
  {/each}
  
  </Select>

  <TextArea
    labelText="Описание"
    placeholder="Описание события"
    bind:value={currentEvent.description}
    rows={4}
    invalid={!!errors.description}
    invalidText={errors.description}
  />
  <div class="space"></div>
  <Button type="submit" icon={Save}>Сохранить</Button>
</form>