<script>
    import { Select, SelectItem, TextInput, Button, Modal, Form, TextArea } from "carbon-components-svelte";
    import { supabase } from '../lib/supabase'
  

    let SelecedObject = 'БИК TOWER'
    let SelecedTarget = 'VK'

    export let client = {
    };

    // События
    // export let saveForm;

    export let ShowButton = true;
    export let ShowOtherSource = false;
    export let AnotherSourse = 'Другой источник';

  
    
    export let handleSelectChange;

    export let handleSelectSource;

    export let selectedObject = client.object;
    export let selectedSource = client.source;


// Состояние валидации
let formErrors = {};
let isFormValid = false;

  // Функция валидации
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

        if (selectedSource === 'Другой источник' && !AnotherSourse?.trim()) {
            formErrors.source = 'Укажите источник';
        }
        
        isFormValid = Object.keys(formErrors).length === 0;

        if (!isFormValid) {
            const errorMessages = Object.values(formErrors).join('\n');
            alert('Пожалуйста, заполните обязательные поля:\n' + errorMessages);
        }

        return isFormValid;
    }

  </script>
  

    <!-- Форма добавления нового клиента -->
    <Form id='my-form' 
    >
      <TextInput
        type="text"
        placeholder="Имя"
        bind:value={client.first_name}
        required
      />
      <TextInput
        type="text"
        placeholder="Фамилия"
        bind:value={client.last_name}
      />


      <Select on:change={handleSelectSource}
      bind:selected={selectedSource}
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
      />
      {/if}
      

      <Select 
      on:change={handleSelectChange}
      bind:selected={selectedObject}
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
      />

      <TextInput
        type="email"
        placeholder="Email"
        bind:value={client.email}
      />

      <Select
        bind:selected={client.status}
      >
        <SelectItem value="Новый" text="Новый" />
        <SelectItem value="В работе" text="В работе" />
        <SelectItem value="Завершен" text="Завершен" />
      </Select>
 {#if  ShowButton}
      <Button type="submit">Добавить клиента</Button>
  {/if}
    </Form>

  