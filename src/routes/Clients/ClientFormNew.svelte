<script>
    import { 
        Select, 
        SelectItem, 
        TextInput, 
        Form, 
        Button 
    } from "carbon-components-svelte";
    import { createEventDispatcher } from 'svelte';
    import { onMount } from 'svelte';

    import { referenceStore } from '../Stores/referenceStore';

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
        status: statuses[0]?.value || ""  // Значение по умолчанию - первый элемент
    };


    export let isEditing = false;

    // Инициализируем выбранные значения
    let SelectedStatus = client.status;
    let SelectedSource = client.source;

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
    });

    console.log('SelectedSource в форме на данный момент',SelectedSource);
  
    
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
    {#each sources as source}
    <SelectItem value={source.value} text={source.text} />
      {/each}
    </Select>

    <Select 
        labelText="Объект"
        bind:selected={client.object}
    >
    {#each objects as object}
    <SelectItem value={object.value} text={object.text} />
{/each}
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
    {#each statuses as status}
    <SelectItem value={status.value} text={status.text} />
{/each}
    </Select>

    <Button type="submit">Сохранить</Button>
</form>