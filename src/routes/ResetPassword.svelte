<script>
    import { supabase } from "./supabase";
    import { navigate } from "svelte-routing";
    import {
      Form,
      TextInput,
      Button,
      ToastNotification,
      Grid,
      Row,
      Column,
    } from "carbon-components-svelte";
  
    let email = "";
    let showToast = false; // Флаг для управления видимостью уведомления
  
    // Ограничиваем toastKind только допустимыми значениями
    let toastKind = "info";
    let toastTitle = ""; // Заголовок уведомления
    let toastSubtitle = ""; // Подробное описание
  
    async function sendPasswordResetEmail(email) {
  try {
    // Явно указываем абсолютный URL для перенаправления
    const redirectTo = 'http://crmbik.ru/NewPassword'; // Ваш реальный домен

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      throw error;
    }

    // Успешная отправка письма
    toastKind = "success";
    toastTitle = "Письмо для сброса пароля отправлено";
    toastSubtitle = "Проверьте вашу почту для завершения сброса пароля.";
    showToast = true;

    // Скрываем уведомление через 5 секунд
    setTimeout(() => {
      showToast = false;
    }, 5000);
  } catch (err) {
    console.error("Ошибка при отправке письма для сброса пароля:", err.message);

    // Отображение ошибки
    toastKind = "error";
    toastTitle = "Ошибка";
    toastSubtitle = "Не удалось отправить письмо для сброса пароля. Пожалуйста, попробуйте снова.";
    showToast = true;

    // Скрываем уведомление через 5 секунд
    setTimeout(() => {
      showToast = false;
    }, 5000);
  }
}
  
    async function handleResetPassword(event) {
        event.preventDefault();
      if (!email) {
        toastKind = "warning"; // Допустимое значение
        toastTitle = "Предупреждение";
        toastSubtitle = "Пожалуйста, введите ваш email.";
        showToast = true;
  
        // Скрываем уведомление через 3 секунды
        setTimeout(() => {
          showToast = false;
        }, 3000);
  
        return;
      }
  
      await sendPasswordResetEmail(email);
    }

    function goToLogin() {
    navigate("/login");
  }

  </script>
  
  <Grid>
    <Row>
      <Column >
        <!-- Форма для сброса пароля -->
        <Form on:submit={handleResetPassword}>
          <TextInput
            labelText="Email"
            placeholder="Введите ваш email"
            type="email"
            bind:value={email}
            required
          />
          <Button type="submit" kind="primary">Сбросить пароль</Button>
          
        </Form>
        <Button type="submit" kind="ghost" on:click={goToLogin} >Войти</Button>
  
        <!-- Уведомление -->
        {#if showToast}
          <ToastNotification
            kind={toastKind} 
            title={toastTitle}
            subtitle={toastSubtitle}
            timeout={5000} 
            lowContrast
          />
        {/if}
      </Column>
    </Row>
  </Grid>