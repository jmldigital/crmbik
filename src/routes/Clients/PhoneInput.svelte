<script lang="ts">
    import { onMount } from 'svelte';
    import Inputmask from 'inputmask';
  
    export let value: string = ''; // Текущее значение номера
    export let countryCodes: { code: string; name: string }[] = [
      { code: '+7', name: 'Россия' },
      { code: '+375', name: 'Белоруссия' },
    ]; // Список кодов стран
  
    export let onInputChange: (newValue: string) => void = () => {}; // Callback для обработки изменений
  
    export let phoneNumber: string = value || ''; // Инициализация переменной
    let selectedCountryCode: string = getCountryCodeFromValue(phoneNumber) || '+7'; // По умолчанию Россия
    let inputElement: HTMLInputElement | undefined;
  
    // Реактивное отслеживание изменения phoneNumber
    $: {
      if (phoneNumber) {
        const newCountryCode = getCountryCodeFromValue(phoneNumber);
        if (newCountryCode) {
          selectedCountryCode = newCountryCode; // Обновляем код страны
        }
        applyMask(); // Применяем новую маску
      }
    }
  
    function getCountryCodeFromValue(val: string): string | null {
      if (!val) return null;
      const match = val.match(/^\+(\d+)/);
      return match ? match[0] : null;
    }
  
    function selectCountry(code: string): void {
      selectedCountryCode = code;
      phoneNumber = `${code} `;
      applyMask(); // Применяем новую маску при смене страны
      onInputChange(phoneNumber); // Обновляем значение при смене страны
    }
  
    function applyMask(): void {
      if (inputElement) {
        const maskOptions = {
          mask: selectedCountryCode === '+7'
            ? '+7 (999) 999-99-99' // Маска для России
            : '+375 (99) 999-99-99', // Маска для Белоруссии
          placeholder: '',
          clearIncomplete: true, // Очищать неполные вводы
          onBeforePaste: (pastedValue: string) => pastedValue.replace(/\D/g, ''), // Удалять буквы при вставке
        };
  
        // Применяем маску к элементу
        Inputmask(maskOptions).mask(inputElement);
  
        // Устанавливаем начальное значение в поле ввода
        if (phoneNumber) {
          inputElement.value = phoneNumber;
        }
      }
    }
  
    function handleInputChange(event: Event): void {
      const target = event.target as HTMLInputElement;
      phoneNumber = target.value; // Обновляем значение
      onInputChange(phoneNumber); // Передаем значение родителю
    }
  
    onMount(() => {
      // Применяем маску при монтировании компонента
      applyMask();
    });
  </script>
  
  <div style="display:flex;">
   
    <select
      id="country"
      bind:value={selectedCountryCode} 
      on:change={(e) => selectCountry(e.target.value)}
    >
      {#each countryCodes as { code, name }}
        <option value={code} selected={code === selectedCountryCode}>
          {name} ({code})
        </option>
      {/each}
    </select>
  
    <br /><br />
  
    <input
      type="text"
      bind:this={inputElement}
      bind:value={phoneNumber} 
      placeholder="Введите номер телефона"
      on:input={handleInputChange}
      required
    />
  </div>
  
  <style>
    input {
      width: 100%;
      padding: 8px;
      font-size: 16px;
    }
    select {
      
      padding: 8px;
      font-size: 16px;
    }
    
  </style>