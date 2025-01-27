<script>
    import { Select, SelectItem, TextInput, Button, Modal, Form, TextArea, InlineNotification, ToastNotification } from "carbon-components-svelte";
    import { supabase } from '../lib/supabase'
  
    export let client = {};
    export let ShowButton = true;
    export let SelectedObject = client.object;
    export let SelectedSource = client.source;
    export let AnotherSourse = '';
    export let isEditing = false;
  
    let ShowOtherSource = false;
  
    let formErrors = {};
    let isFormValid = false;
    let showNotification = false;
    let notificationMessage = '';
    let notificationType = 'error';


    const standardSources = ["Telegram", "VK", "Наружка", "Шел мимо"];

    $: {
        if (ShowOtherSource) {
            client.source = AnotherSourse;
        }
    }



    $: {
    if (isEditing) {
      if (standardSources.includes(client.source)) {
        ShowOtherSource = false;
        SelectedSource = client.source;
        AnotherSourse = "";
      } else {
        ShowOtherSource = true;
        SelectedSource = "Другой источник";
        AnotherSourse = client.source;
      }
    }
  }


  
    function showError(message) {
        notificationMessage = message;
        notificationType = 'error';
        showNotification = true;
        setTimeout(() => {
            showNotification = false;
        }, 5000);
    }
  
    export function validateForm(client) {
        formErrors = {};
        if (!client.first_name?.trim()) {
            formErrors.first_name = 'Имя обязательно';
        }
        if (!client.phone?.trim()) {
            formErrors.phone = 'Телефон обязателен';
        }
        if (client.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
            formErrors.email = 'Неверный формат email';
        }
        if (SelectedSource === 'Другой источник' && !AnotherSourse?.trim()) {
            formErrors.source = 'Укажите источник';
        }
        isFormValid = Object.keys(formErrors).length === 0;
        if (!isFormValid) {
            showError('Пожалуйста, заполните обязательные поля:\n' + Object.values(formErrors).join('\n'));
        }
        return isFormValid;
    }
  
    function handleSelectObject(event) {
        client.object = event.target.value;
    }
  
    function handleSelectSource(event) {
        if (event.target.value === 'Другой источник') {
            ShowOtherSource = true;
        } else {
            client.source = event.target.value;
            ShowOtherSource = false;
        }
    }
  
 
  </script>
  
  <Form id='my-form'>
    {#if showNotification}
        <InlineNotification
            title={notificationType === 'error' ? "Ошибка" : "Успешно"}
            subtitle={notificationMessage}
            hideCloseButton={false}
            on:close={() => showNotification = false}
        />
    {/if}
  
    <TextInput
        type="text"
        placeholder="Имя"
        bind:value={client.first_name}
        required
        invalid={!!formErrors.first_name}
        invalidText={formErrors.first_name}
    />
  
    <TextInput
        type="text"
        placeholder="Фамилия"
        bind:value={client.last_name}
    />
  
    <Select 
        on:change={handleSelectSource}
        bind:selected={SelectedSource}
        invalid={!!formErrors.source}
        invalidText={formErrors.source}
    >
        <SelectItem value="Telegram" text="Telegram" />
        <SelectItem value="VK" text="VK" />
        <SelectItem value="Наружка" text="Наружка" />
        <SelectItem value="Шел мимо" text="Шел мимо" />
        <SelectItem value='Другой источник' text='Другой источник'  />
    </Select>
  
    {#if ShowOtherSource}
        <TextArea
            light
            placeholder="Напишите какой источник привел клиента"
            bind:value={AnotherSourse}
            invalid={!!formErrors.source}
            invalidText={formErrors.source}
        />
    {/if}
  
    <Select 
        on:change={handleSelectObject}
        bind:selected={SelectedObject}
    >
        <SelectItem value="ЮЗ-Б" text="ЮЗ-Б" />
        <SelectItem value="ЮЗ-А" text="ЮЗ-А" />
        <SelectItem value="БИК TOWER" text="БИК TOWER" />
    </Select>
  
    <TextInput
        type="tel"
        placeholder="Телефон"
        bind:value={client.phone}
        required
        invalid={!!formErrors.phone}
        invalidText={formErrors.phone}
    />
  
    <TextInput
        type="email"
        placeholder="Email"
        bind:value={client.email}
        invalid={!!formErrors.email}
        invalidText={formErrors.email}
    />
  
    <Select
        bind:selected={client.status}
    >
        <SelectItem value="Новый" text="Новый" />
        <SelectItem value="В работе" text="В работе" />
        <SelectItem value="Завершен" text="Завершен" />
    </Select>
  
    {#if ShowButton}
        <Button type="submit">Добавить клиента</Button>
    {/if}
  </Form>