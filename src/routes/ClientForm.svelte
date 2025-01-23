<script>
    import { Select, SelectItem, TextInput, Button, Modal, Form, TextArea } from "carbon-components-svelte";
    import { supabase } from '../lib/supabase'
  

    let SelecedObject = 'БИК TOWER'
    let SelecedTarget = 'VK'

    export let newClient = {
    };

    let ShowOtherSource = false;
    let AnotherSourse = '';

  
    export let  handleSubmit;
    export let handleSelectChange;

    export let handleSelectSource;




  </script>
  


    <!-- Форма добавления нового клиента -->
    <Form id='my-form' on:submit={handleSubmit}>
      <TextInput
        type="text"
        placeholder="Имя"
        bind:value={newClient.first_name}
        required
      />
      <TextInput
        type="text"
        placeholder="Фамилия"
        bind:value={newClient.last_name}
      />


      <Select on:change={handleSelectSource}
      bind:selected={SelecedTarget}
      >
        <SelectItem value="Telegram" text="Telegram" />
        <SelectItem value="VK" text="VK" />
        <SelectItem value="Наружка" text="Наружка" />
        <SelectItem value="Шел мимо" text="Шел мимо" />
        <SelectItem value="Другой источник" text="Другой источник" />

      </Select>


      {#if ShowOtherSource}
      <TextArea
        light
        labelText="Иной источник"
        placeholder="Напишите какой источник привел клиента"
        bind:value={AnotherSourse}
      />
      {/if}
      

      <Select 
      on:change={handleSelectChange}
      bind:selected={SelecedObject}
      >
        <SelectItem value="ЮЗ-Б" text="ЮЗ-Б" />
        <SelectItem value="ЮЗ-А" text="ЮЗ-А" />
        <SelectItem value="БИК TOWER" text="БИК TOWER" />
      </Select>


      <TextInput
        type="tel"
        placeholder="Телефон"
        bind:value={newClient.phone}
        required
      />

      <TextInput
        type="email"
        placeholder="Email"
        bind:value={newClient.email}
      />

      <Select
        bind:selected={newClient.status}
      >
        <SelectItem value="Новый" text="Новый" />
        <SelectItem value="В работе" text="В работе" />
        <SelectItem value="Завершен" text="Завершен" />
      </Select>

      <Button type="submit">Добавить клиента</Button>
    </Form>

  