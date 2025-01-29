<script>
    import { 
        Select, 
        SelectItem, 
        TextInput, 
        Form, 
        Button 
    } from "carbon-components-svelte";
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    


    //  client.status = SelectedStatus;
    //  client.source = SelectedSource;

    // Определяем props с значением по умолчанию
    export let client = {
        first_name: "",
        last_name: "",
        object: "",
        phone: "",
        source: '',
        email: "",
        status: ''
    };
    export let isEditing = false;


    let SelectedStatus;
    let SelectedSource;

    $: {
     SelectedStatus =client.status;
     SelectedSource = client.source;
    }

    // Инициализируем formData сразу, используя client
    // let formData = { ...client };
    
    let errors = {};

    function validateForm() {
        errors = {};

        if (!client.first_name?.trim()) {
            errors.first_name = 'Имя обязательно';
        }

        if (!client.phone?.trim()) {
            errors.phone = 'Телефон обязателен';
        } else if (!/^\d{11}$/.test(client.phone)) {
            errors.phone = 'Телефон должен содержать 11 цифр';
        }

        if (!client.email?.trim()) {
            errors.email = 'Email обязателен';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
            errors.email = 'Неверный формат email';
        }

        return Object.keys(errors).length === 0;
    }
    
    function handleSubmit(e) {
        e.preventDefault();
        
        if (validateForm()) {

            client.status = SelectedStatus;
            client.source = SelectedSource;

        console.log('форма валидна обновляем клиента',client);


            dispatch('submit', client);


        //     if (!isEditing) {
        //     client = {
        //         first_name: "",
        //         last_name: "",
        //         object: "",
        //         phone: "",
        //         source: "",
        //         email: "",
        //         status: "Новый"
        //     };
        // }

            

        }
        else {
            console.log('форма не валидна',client);
        }
    }
</script>

<form on:submit={handleSubmit}>
    <TextInput
        type="text"
        placeholder="Имя"
        bind:value={client.first_name}
        required
        invalid={!!errors.first_name}
        invalidText={errors.first_name}
    />

    <TextInput
        type="text"
        placeholder="Фамилия"
        bind:value={client.last_name}
    />

    <Select 
        labelText="Источник"
        bind:selected={SelectedSource}
    >
        <SelectItem value="Telegram" text="Telegram" />
        <SelectItem value="VK" text="VK" />
        <SelectItem value="Наружка" text="Наружка" />
        <SelectItem value="Шел мимо" text="Шел мимо" />
        <SelectItem value='Другой источник' text='Другой источник' />
    </Select>

    <Select 
        labelText="Объект"
        bind:selected={client.object}
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
        invalid={!!errors.phone}
        invalidText={errors.phone}
    />

    <TextInput
        type="email"
        placeholder="Email"
        bind:value={client.email}
        invalid={!!errors.email}
        invalidText={errors.email}
    />

    <Select
        labelText="Статус"
        bind:selected={SelectedStatus}
        
    >
        <SelectItem value="Новый" text="Новый" />
        <SelectItem value="В работе" text="В работе" />
        <SelectItem value="Завершен" text="Завершен" />
    </Select>

    <Button type="submit">Сохранить</Button>
</form>