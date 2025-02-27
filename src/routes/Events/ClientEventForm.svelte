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

  import Save from "carbon-icons-svelte/lib/Save.svelte";


  export let isEditing = false;
  const dispatch = createEventDispatcher();
  let errors = {};

  // Определяем значения по умолчанию
  const defaultEvent = {
    status: "Звонок",
    description: "",
  };

  $: eventStatuses = $referenceStore.eventStatus;

  // Используем spread оператор для объединения defaultEvent с переданным event
  export let event = null;
  $: currentEvent = { ...defaultEvent, ...(event || {}) };

  function handleSubmit(e) {
    e.preventDefault();

    if (validateForm()) {
      console.log("форма валидна обновляем клиента", currentEvent);
      dispatch("submit", currentEvent);
    } else {
      console.log("форма не валидна", currentEvent);
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
