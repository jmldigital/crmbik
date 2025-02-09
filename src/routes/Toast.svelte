<!-- Toast.svelte -->
<script>
    import { ToastNotification } from "carbon-components-svelte";
  
    export let toast = {
      show: false,
      kind: "success",
      title: "",
      subtitle: "",
      timeout: 3000,
      lowContrast: true,
    };
  
    // Закрытие уведомления
    function closeToast() {
      toast.show = false;
    }
  </script>
  
  {#if toast.show}
    <ToastNotification
      kind={toast.kind}
      title={toast.title}
      subtitle={toast.subtitle}
      timeout={toast.timeout}
      lowContrast={toast.lowContrast}
      on:close={closeToast}
    />
  {/if}