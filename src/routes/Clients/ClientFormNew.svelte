<script>
  import {
    Select,
    SelectItem,
    TextInput,
    Form,
    Button,
    ToastNotification,
  } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";
  import { onMount } from "svelte";

  import PhoneInput from "./PhoneInput.svelte";

  import Save from "carbon-icons-svelte/lib/Save.svelte";


  import { referenceStore } from "../Stores/referenceStore";

  const dispatch = createEventDispatcher();

  // Получаем данные из store
  $: sources = $referenceStore.sources;
  $: statuses = $referenceStore.statuses;
  $: objects = $referenceStore.objects;

  // Определяем props с значением по умолчанию

  export let client = {
    first_name: "",
    last_name: "",
    object: objects[0]?.value || "",
    phone: "",
    source: sources[0]?.value || "", // Значение по умолчанию - первый элемент
    description: "",
    status: statuses[0]?.value || "", // Значение по умолчанию - первый элемент
  };

  export let isEditing = false;

  // Ограничиваем toastKind только допустимыми значениями
  let toastKind = "info";
  let toastTitle = ""; // Заголовок уведомления
  let toastSubtitle = ""; // Подробное описание
  let showToast = false; // Флаг для управления видимостью уведомления

  // Инициализируем выбранные значения
  let SelectedStatus = client.status;
  let SelectedSource = client.source;


  // Реагируем на изменения client
  $: {
    if (client) {
        // console.log('statuses[0].value',statuses[1].value);
      SelectedStatus = client.status ||  statuses[0].value;
      SelectedSource = client.source ||  sources[0].value;
    }
  }
  

  onMount(() => {
    // Устанавливаем начальные значения при монтировании компонента
    SelectedStatus = client.status || statuses[0].value;
    SelectedSource = client.source || sources[0].value;
    // phoneValue = client.phone;
  });

  console.log("SelectedSource в форме на данный момент", SelectedSource);

  let errors = {};

  function validateForm() {
    errors = {};

    if (!client.first_name?.trim()) {
      errors.first_name = "Имя обязательно";
    }

  // Проверка телефона
  if (!client.phone?.trim()) {
      errors.phone = "Телефон обязателен";
    } else if (
      !/^(\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}|\+375 \(\d{2}\) \d{3}-\d{2}-\d{2})$/.test(client.phone)
    ) {
      errors.phone = "Неверный формат телефона";
    }


    return Object.keys(errors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
      client.status = SelectedStatus;
      client.source = SelectedSource;
      console.log("форма валидна обновляем клиента", client);

      dispatch("submit", client);
    } else {
      // Отображение ошибки
      toastKind = "error"; // Допустимое значение
      toastTitle = "Ошибка";
      toastSubtitle =
        "Не удалось отправить письмо для сброса пароля. Пожалуйста, попробуйте снова.";
      showToast = true;

      console.log("форма не валидна", client);
    }
  }

  function handlePhoneChange(NewValue) {
    // phoneValue = NewValue;
    client.phone = NewValue;
    client.source = SelectedSource;
    client.status = SelectedStatus;
  
  }

</script>


<Form on:submit={handleSubmit}>

  <Select labelText="Объект" bind:selected={client.object}>
    {#each objects as object}
      <SelectItem value={object.value} text={object.text} />
    {/each}
  </Select>

  <TextInput type="text" placeholder="Квартира,этаж" bind:value={client.last_name} />

  <TextInput
    type="text"
    placeholder="ФИО"
    bind:value={client.first_name}
    required
    invalid={!!errors.first_name}
    invalidText={errors.first_name}
  />

 
  <PhoneInput
    phoneNumber={client.phone}
    onInputChange={handlePhoneChange}
    countryCodes={[
      { code: "+7", name: "РФ" },
      { code: "+375", name: "Бел" },
    ]}
  />

  <TextInput
  type="text"
  placeholder="Краткое описание"
  bind:value={client.description}
  invalid={!!errors.description}
  invalidText={errors.description}
/>
  
  <Select labelText="Источник" bind:selected={SelectedSource}>
    {#each sources as source}
      <SelectItem value={source.value} text={source.text} />
    {/each}
  </Select>

  {#if showToast}
  <ToastNotification
    kind={toastKind}
    title={toastTitle}
    subtitle={toastSubtitle}
    timeout={3000}
    lowContrast
  />
{/if}

 
 


  <Select labelText="Статус" bind:selected={SelectedStatus}>
    {#each statuses as status}
      <SelectItem value={status.value} text={status.text} />
    {/each}
  </Select>
  <div class="space"></div>
  <Button type="submit" icon={Save}>Сохранить</Button>
</Form>
