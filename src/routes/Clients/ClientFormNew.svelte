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
    email: "",
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

  let phoneValue = "";

  // Реагируем на изменения client
  $: {
    if (client) {
      SelectedStatus = client.status || "Новый";
      SelectedSource = client.source || "Telegram";
    }
  }

  onMount(() => {
    // Устанавливаем начальные значения при монтировании компонента
    SelectedStatus = client.status || "Новый";
    SelectedSource = client.source || "Telegram";
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

    if (!client.email?.trim()) {
      errors.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
      errors.email = "Неверный формат email";
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
    // console.log("Новый номер:", client.phone); // Выводим новое значение в консоль
  }

  // Реактивное отслеживание изменений client.phone
  // $: {
  //     if (client.phone) {

  //          phoneValue = client.phone;
  //        console.log("Новый номер реактивный :", phoneValue); // Реактивный вывод нового значения
  // }
  //   }
</script>

<!-- <p>Введенный номер: {client.phone}</p> -->

<Form on:submit={handleSubmit}>
  <TextInput
    type="text"
    placeholder="Имя"
    bind:value={client.first_name}
    required
    invalid={!!errors.first_name}
    invalidText={errors.first_name}
  />

  <TextInput type="text" placeholder="Фамилия" bind:value={client.last_name} />

  <Select labelText="Источник" bind:selected={SelectedSource}>
    {#each sources as source}
      <SelectItem value={source.value} text={source.text} />
    {/each}
  </Select>

  <Select labelText="Объект" bind:selected={client.object}>
    {#each objects as object}
      <SelectItem value={object.value} text={object.text} />
    {/each}
  </Select>

  <PhoneInput
    phoneNumber={client.phone}
    onInputChange={handlePhoneChange}
    countryCodes={[
      { code: "+7", name: "РФ" },
      { code: "+375", name: "Бел" },
    ]}
  />

  {#if showToast}
    <ToastNotification
      kind={toastKind}
      title={toastTitle}
      subtitle={toastSubtitle}
      timeout={3000}
      lowContrast
    />
  {/if}

  <!-- <TextInput
type="tel"
placeholder="Телефон"
bind:value={phoneValue}
required
invalid={!!errors.phone}
invalidText={errors.phone}
/> -->

  <TextInput
    type="email"
    placeholder="Email"
    bind:value={client.email}
    invalid={!!errors.email}
    invalidText={errors.email}
  />

  <Select labelText="Статус" bind:selected={SelectedStatus}>
    {#each statuses as status}
      <SelectItem value={status.value} text={status.text} />
    {/each}
  </Select>

  <Button type="submit">Сохранить</Button>
</Form>
