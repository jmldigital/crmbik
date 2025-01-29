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
    let errors = {};

    // Определяем значения по умолчанию
    const defaultEvent = {
        status: 'Звонок',
        description: '',
    };

    // Используем spread оператор для объединения defaultEvent с переданным event
    export let event = null;
    $: currentEvent = { ...defaultEvent, ...(event || {}) };

    function handleSubmit(e) {
        e.preventDefault();

     if (validateForm()) {
            console.log('форма валидна обновляем клиента',currentEvent);
            dispatch('submit', currentEvent);
            }
            else {
            console.log('форма не валидна',currentEvent);
            }
    }

    function validateForm() {
        errors = {};

        if (!currentEvent.description?.trim()) {
            errors.description = 'описание обязательно';
        }
        return Object.keys(errors).length === 0;
    }

    
</script>

<form on:submit={handleSubmit}>
    <Select 
        labelText="Статус события"
        bind:selected={currentEvent.status}
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
        bind:value={currentEvent.description}
        rows={4}
        invalid={!!errors.description}
        invalidText={errors.description}
    />

    <Button type="submit">Сохранить</Button>
</form>