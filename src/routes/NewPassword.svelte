<script>
  import { supabase } from "./supabase";
  import {
    Form,
    PasswordInput,
    Button,
    ToastNotification,
  } from "carbon-components-svelte";

  let newPassword = "";
  let confirmPassword = "";
  let showToast = false;
  let toastKind ="info";
  let toastTitle = "";
  let toastSubtitle = "";

  // Получаем параметры из URL
  // const urlParams = new URLSearchParams(window.location.search);
  // const resetToken = urlParams.get("token");
  // const email = urlParams.get("email");

  async function handleChangePassword(event) {
    event.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      toastKind = "warning";
      toastTitle = "Предупреждение";
      toastSubtitle = "Пароли не совпадают. Пожалуйста, проверьте их.";
      showToast = true;

      setTimeout(() => {
        showToast = false;
      }, 3000);

      return;
    }

    try {
      // Используем updateUser вместо verifyOtp
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      toastKind = "success";
      toastTitle = "Пароль успешно изменен";
      toastSubtitle = "Ваш пароль был успешно обновлен.";
      showToast = true;

      setTimeout(() => {
        showToast = false;
        // Перенаправляем пользователя на страницу входа
        window.location.href = "/login";
      }, 5000);
    } catch (err) {
      console.error("Ошибка при изменении пароля:", err.message);

      toastKind = "error";
      toastTitle = "Ошибка";
      toastSubtitle = "Не удалось изменить пароль. Пожалуйста, попробуйте снова.";
      showToast = true;

      setTimeout(() => {
        showToast = false;
      }, 5000);
    }
  }
</script>

{#if showToast}
  <ToastNotification
    kind={toastKind}
    title={toastTitle}
    subtitle={toastSubtitle}
    timeout={5000}
    lowContrast
  />
{/if}

<Form on:submit={handleChangePassword}>
  <PasswordInput
    labelText="Новый пароль"
    placeholder="Введите новый пароль"
    type="password"
    bind:value={newPassword}
    required
  />
  <PasswordInput
    labelText="Подтвердите пароль"
    placeholder="Подтвердите новый пароль"
    type="password"
    bind:value={confirmPassword}
    required
  />
  <div class="space"></div>
  <Button type="submit" kind="primary">Изменить пароль</Button>
</Form>