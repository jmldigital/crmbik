<!-- ClientEventForm.svelte -->
<script>
    import { 
        Select, 
        SelectItem, 
        TextArea, 
        Form,
        Button 
    } from 'carbon-components-svelte';
    import { createEventDispatcher } from 'svelte';
    export let isEditing = false;
    const dispatch = createEventDispatcher();

    // Определяем значения по умолчанию
    const defaultEvent = {
        status: 'Новый',
        description: '',
        client_id: null,
        created_at: new Date().toISOString()
    };

    // Используем значения по умолчанию, если event не передан
    export let event = defaultEvent;

    // Создаем локальную копию данных
    let formData = { ...defaultEvent, ...event };

    function handleSubmit(e) {
        e.preventDefault();
        dispatch('submit', formData);
    }
</script>

<form on:submit={handleSubmit}>
    <Select 
        labelText="Статус события"
        bind:selected={formData.status}
    >
        <SelectItem value="Новый" text="Новый" />
        <SelectItem value="Звонок" text="Звонок" />
        <SelectItem value="Встреча" text="Встреча" />
        <SelectItem value="Просмотр" text="Просмотр" />
        <SelectItem value="Договор" text="Договор" />
    </Select>

    <TextArea
        labelText="Описание"
        placeholder="Описание события"
        bind:value={formData.description}
        rows={4}
    />

    <Button type="submit">Сохранить</Button>
</form>