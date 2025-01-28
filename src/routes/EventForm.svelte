<script>
    import { 
        Select, 
        SelectItem, 
        TextInput, 
        Form, 
        InlineNotification 
    } from "carbon-components-svelte";
  
    export let client_events = {};
    export let SelectedStatus = client_events.status;
    export let SelectedDescription = client_events.description;
    export let isEditing = false;

    let formErrors = {};
    let isFormValid = false;
    let showNotification = false;
    let notificationMessage = '';
    let notificationType = 'error';
    let currentFormIsValid = false;

    // Функция обновления данных
    function updateFormData() {
        if (isEditing) {

            console.log('тут пишем чему равен SelectedStatus',SelectedStatus);

            client_events.status = SelectedStatus;
            client_events.description = SelectedDescription;
            currentFormIsValid = validateForm(client_events);
        }
    }

    // Отслеживаем только изменения в поле описания
    $: SelectedDescription && updateFormData();
    
  
    function showError(message) {
        notificationMessage = message;
        notificationType = 'error';
        showNotification = true;
        setTimeout(() => {
            showNotification = false;
        }, 5000);
    }
  
    export function isFormValidCheck() {
        return validateForm(client_events);
    }
    
    function validateForm(client_events) {
        formErrors = {};

        if (!client_events.status?.trim()) {
            formErrors.status = 'Тип события обязателен';
        }

        if (!client_events.description?.trim()) {
            formErrors.description = 'Описание события обязательно';
        }

        isFormValid = Object.keys(formErrors).length === 0;

        if (!isFormValid) {
            showError('Пожалуйста, заполните обязательные поля:\n' + Object.values(formErrors).join('\n'));
        }

        return isFormValid;
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
        placeholder="Описание события"
        bind:value={SelectedDescription}
        invalid={!!formErrors.description}
        invalidText={formErrors.description}
    />

    <Select 
        bind:selected={SelectedStatus}
        invalid={!!formErrors.status}
        invalidText={formErrors.status}
    >
        <SelectItem value="Телефон" text="Телефон" />
        <SelectItem value="Мессенджер" text="Мессенджер" />
        <SelectItem value="Личная встреча" text="Личная встреча" />
    </Select>
</Form>