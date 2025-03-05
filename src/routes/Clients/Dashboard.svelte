<script>
  import {
    HeaderNav,
    HeaderNavItem,
    HeaderNavMenu,
    SkipToContent,
    Content,
    Grid,
    Row,
    Column,
    HeaderUtilities,
    HeaderGlobalAction,
    SideNav,
    SideNavItems,
    SideNavMenu,
    SideNavMenuItem,
    SideNavLink,
  } from "carbon-components-svelte";

  import { onMount } from "svelte";
  import Header from "../Header.svelte";
  import { userStore } from "../Stores/userStore";
  import { clientStore } from "../Stores/clientStore";
  import { managerStore } from "../Stores/managerStore";
  import { chart } from "svelte-apexcharts";
  import { eventStore } from "../Stores/eventStore";

  $: user = $userStore.user;
  $: clients = $clientStore.clients || []; // Обеспечиваем fallback на пустой массив
  $: events = $eventStore.events || [];
  $: managers = $managerStore.managers || []; // Обеспечиваем fallback на пустой массив
  $: loading = $clientStore.loading;
  $: error = $clientStore.error;

  // Проверяем, загружены ли данные
  $: areDataReady =
    Array.isArray(clients) &&
    clients.length > 0 &&
    Array.isArray(managers) &&
    managers.length > 0;
  Array.isArray(events) && events.length > 0;

  onMount(async () => {
    try {
      await clientStore.loadClients();
      await managerStore.loadManagers();
      await eventStore.loadEvents();
      console.log("Clients after load:", clients); // Отладка
      console.log("Managers after load:", managers); // Отладка
      console.log("События after load:", events); // Отладка
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    }
  });

  // Группировка клиентов по manager_id и подсчет их количества
  let groupedClients = [];
  let chartOptions = {};

  $: if (areDataReady) {
    groupedClients =
      Array.isArray(clients) && clients.length > 0
        ? Object.values(
            clients.reduce((acc, client) => {
              if (!client.manager_id) return acc; // Пропускаем клиентов без manager_id
              if (!acc[client.manager_id]) {
                acc[client.manager_id] = {
                  manager_id: client.manager_id || "Неизвестный менеджер",
                  count: 0,
                };
              }
              acc[client.manager_id].count += 1;
              return acc;
            }, {})
          )
        : [];

    chartOptions = {
      chart: {
        type: "donut",
      },

      dataLabels: {
        enabled: true,
        enabledOnSeries: undefined,
        formatter: function (val, opts) {
          const total = opts.w.globals.seriesTotals.reduce((a, b) => a + b, 0); // Сумма всех значений
          const absoluteValue = (val / 100) * total; // Пересчитываем проценты в абсолютное значение
          return Math.round(absoluteValue); // Округляем до ближайшего целого
        },
        style: {
          fontSize: "20px",
        },
      },

      plotOptions: {
        pie: {
          customScale: 1,
          donut: {
            labels: {
              show: true,
              //   name: {
              //     lg: "333",
              //   },
              //   value: {
              //     lg: "333",
              //   },

              total: {
                show: true,
                showAlways: true,
                label: "Всего",
                fontSize: "22px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 600,
                color: "#373d3f",
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },

      title: {
        text: "Распределение клиентов по менеджерам",
        align: "left",
        margin: 10,
        offsetX: 10,
        offsetY: 30,
        floating: false,
        style: {
          fontSize: "1.5rem",
          fontWeight: "regular",
          fontFamily: undefined,
          color: "black",
        },
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            plotOptions: {
              pie: {
                customScale: 1.1,
              },
            },
            title: {
              offsetY: 0,
              style: {
                fontSize: "12px",
              },
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      series:
        groupedClients && groupedClients.length > 0
          ? groupedClients.map((group) => group.count || 0)
          : [0],
      labels:
        groupedClients && groupedClients.length > 0
          ? groupedClients.map((group) => getManagerName(group.manager_id))
          : ["Нет данных"],
    };
  }

  let groupedEvents = [];
  let chartOptionsEvents = {};

  // $: if (areDataReady) {
  //   // Группировка событий по manager_id
  //   groupedEvents =
  //     Array.isArray(events) && events.length > 0
  //       ? Object.values(
  //           events.reduce((acc, event) => {
  //             if (!event.manager_id) return acc; // Пропускаем события без manager_id
  //             if (!acc[event.manager_id]) {
  //               acc[event.manager_id] = {
  //                 manager_id: event.manager_id || "Неизвестный менеджер",
  //                 count: 0,
  //               };
  //             }
  //             acc[event.manager_id].count += 1;
  //             return acc;
  //           }, {})
  //         )
  //       : [];

  //   // Настройки для второго графика
  //   chartOptionsEvents = {
  //     chart: {
  //       type: "donut",
  //     },
  //     plotOptions: {
  //       pie: {
  //         customScale: 0.8,
  //       },
  //     },
  //     title: {
  //       text: 'Распределение событий по менеджерам',
  //       align: 'left',
  //       margin: 10,
  //       offsetX: 10,
  //       offsetY: 30,
  //       floating: false,
  //       style: {
  //         fontSize: '1.5rem',
  //         fontWeight: 'regular',
  //         fontFamily: undefined,
  //         color: 'black'
  //       },
  //     },
  //     responsive: [
  //       {
  //         breakpoint: 1000,
  //         options: {
  //           plotOptions: {
  //             pie: {
  //               customScale: 1.1,
  //             }
  //           },
  //           title: {
  //             offsetY: 0,
  //             style: {
  //               fontSize: '12px'
  //             }
  //           },
  //           legend: {
  //             position: "bottom"
  //           }
  //         }
  //       }
  //     ],
  //     series:
  //       groupedEvents && groupedEvents.length > 0
  //         ? groupedEvents.map((group) => group.count || 0)
  //         : [0],
  //     labels:
  //       groupedEvents && groupedEvents.length > 0
  //         ? groupedEvents.map((group) => getManagerName(group.manager_id))
  //         : ["Нет данных"],
  //   };
  // }

  let groupedClientsByStatus = [];
  let chartOptionsStatus = {};

  let groupedClientsByObject = [];
  let chartOptionsObject = {};

  $: if (areDataReady) {
    // Группировка клиентов по статусу
    groupedClientsByStatus =
      Array.isArray(clients) && clients.length > 0
        ? Object.values(
            clients.reduce((acc, client) => {
              if (!client.status) return acc; // Пропускаем клиентов без статуса
              if (!acc[client.status]) {
                acc[client.status] = {
                  status: client.status || "Неизвестный статус",
                  count: 0,
                };
              }
              acc[client.status].count += 1;
              return acc;
            }, {})
          )
        : [];

    // Настройки для графика по статусам
    chartOptionsStatus = {
      chart: {
        type: "donut",
      },

      dataLabels: {
        enabled: true,
        enabledOnSeries: undefined,
        formatter: function (val, opts) {
          const total = opts.w.globals.seriesTotals.reduce((a, b) => a + b, 0); // Сумма всех значений
          const absoluteValue = (val / 100) * total; // Пересчитываем проценты в абсолютное значение
          return Math.round(absoluteValue); // Округляем до ближайшего целого
        },
        style: {
          fontSize: "20px",
        },
      },



      plotOptions: {


        
        pie: {
          customScale: 1,
          donut: {
            labels: {
              show: true,
              //   name: {
              //     lg: "333",
              //   },
              //   value: {
              //     lg: "333",
              //   },

              total: {
                show: true,
                showAlways: true,
                label: "Всего",
                fontSize: "22px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 600,
                color: "#373d3f",
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
      fill: {
        colors: ["#00d555", "#204ffe", "#fe2020"],
      },
      title: {
        text: "Распределение клиентов по статусам",
        align: "left",
        margin: 10,
        offsetX: 10,
        offsetY: 30,
        floating: false,
        style: {
          fontSize: "1.5rem",
          fontWeight: "regular",
          fontFamily: undefined,
          color: "black",
        },
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            plotOptions: {
              pie: {
                customScale: 1,
              },
            },
            title: {
              offsetY: 0,
              style: {
                fontSize: "12px",
              },
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      series:
        groupedClientsByStatus && groupedClientsByStatus.length > 0
          ? groupedClientsByStatus.map((group) => group.count || 0)
          : [0],
      labels:
        groupedClientsByStatus && groupedClientsByStatus.length > 0
          ? groupedClientsByStatus.map((group) => group.status)
          : ["Нет данных"],
    };

    // Группировка клиентов по объекту
    groupedClientsByObject =
      Array.isArray(clients) && clients.length > 0
        ? Object.values(
            clients.reduce((acc, client) => {
              if (!client.object) return acc; // Пропускаем клиентов без объекта
              if (!acc[client.object]) {
                acc[client.object] = {
                  object: client.object || "Неизвестный объект",
                  count: 0,
                };
              }
              acc[client.object].count += 1;
              return acc;
            }, {})
          )
        : [];

    // Настройки для графика по объектам
    chartOptionsObject = {
      chart: {
        type: "donut",
      },

      dataLabels: {
        enabled: true,
        enabledOnSeries: undefined,
        formatter: function (val, opts) {
          const total = opts.w.globals.seriesTotals.reduce((a, b) => a + b, 0); // Сумма всех значений
          const absoluteValue = (val / 100) * total; // Пересчитываем проценты в абсолютное значение
          return Math.round(absoluteValue); // Округляем до ближайшего целого
        },
        style: {
          fontSize: "20px",
        },
      },

      plotOptions: {
        pie: {
          customScale: 1,
          donut: {
            labels: {
              show: true,
              //   name: {
              //     lg: "333",
              //   },
              //   value: {
              //     lg: "333",
              //   },

              total: {
                show: true,
                showAlways: true,
                label: "Всего",
                fontSize: "22px",
                fontFamily: "Helvetica, Arial, sans-serif",
                fontWeight: 600,
                color: "#373d3f",
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b;
                  }, 0);
                },
              },
            },
          },
        },
      },
      title: {
        text: "Распределение клиентов по объектам",
        align: "left",
        margin: 10,
        offsetX: 10,
        offsetY: 30,
        floating: false,
        style: {
          fontSize: "1.5rem",
          fontWeight: "regular",
          fontFamily: undefined,
          color: "black",
        },
      },
      responsive: [
        {
          breakpoint: 1000,
          options: {
            plotOptions: {
              pie: {
                customScale: 1.1,
              },
            },
            title: {
              offsetY: 0,
              style: {
                fontSize: "12px",
              },
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
      series:
        groupedClientsByObject && groupedClientsByObject.length > 0
          ? groupedClientsByObject.map((group) => group.count || 0)
          : [0],
      labels:
        groupedClientsByObject && groupedClientsByObject.length > 0
          ? groupedClientsByObject.map((group) => group.object)
          : ["Нет данных"],
    };
  }

  // Функция для получения имени менеджера по manager_id
  function getManagerName(manager_id) {
    const manager = managers.find((manager) => manager.id === manager_id);
    if (!manager) {
      console.warn(`Менеджер с id ${manager_id} не найден.`);
      return "Неизвестный менеджер";
    }
    return (
      `${manager.manager_first_name || ""} ${manager.manager_last_name || ""}`.trim() ||
      "Неизвестный менеджер"
    );
  }

  console.log("clients", clients);
  console.log("groupedClients", groupedClients);

  let sm = 6;
  let md = 4;
  let lg = 8;
</script>

<Header UserStatus={user}></Header>

<Content class="mains">
  <Grid padding>
    <Row>
      <Column {sm} {md} {lg}>
        {#if loading}
          <p>Загрузка данных...</p>
        {:else if error}
          <p>Ошибка: {error}</p>
        {:else if areDataReady && groupedClients && groupedClients.length > 0}
          <div use:chart={chartOptions} class="client-canvas" />
        {:else if clients && Array.isArray(clients) && clients.length === 0}
          <p>Нет клиентов для отображения.</p>
        {:else if !areDataReady}
          <p>Данные о менеджерах или клиентах еще загружаются...</p>
        {:else}
          <p>Произошла ошибка с данными.</p>
        {/if}
      </Column>
      <Column {sm} {md} {lg}>
        {#if loading}
          <p>Загрузка данных...</p>
        {:else if error}
          <p>Ошибка: {error}</p>
        {:else if areDataReady && groupedClientsByStatus && groupedClientsByStatus.length > 0}
          <div use:chart={chartOptionsStatus} class="client-canvas" />
        {:else if clients && Array.isArray(clients) && clients.length === 0}
          <p>Нет клиентов для отображения.</p>
        {:else if !areDataReady}
          <p>Данные о статусах клиентов еще загружаются...</p>
        {:else}
          <p>Произошла ошибка с данными.</p>
        {/if}
      </Column>
    </Row>

    <Row>
      <Column {sm} {md} {lg}>
        {#if loading}
          <p>Загрузка данных...</p>
        {:else if error}
          <p>Ошибка: {error}</p>
        {:else if areDataReady && groupedClientsByObject && groupedClientsByObject.length > 0}
          <div use:chart={chartOptionsObject} class="client-canvas" />
        {:else if clients && Array.isArray(clients) && clients.length === 0}
          <p>Нет клиентов для отображения.</p>
        {:else if !areDataReady}
          <p>Данные об объектах клиентов еще загружаются...</p>
        {:else}
          <p>Произошла ошибка с данными.</p>
        {/if}
      </Column>
      <Column {sm} {md} {lg}></Column>
    </Row>
  </Grid>
</Content>

<style>
  .client-canvas {
    background-color: rgb(238, 238, 238) !important;
    border-radius: 15px;
    -webkit-box-shadow: 4px 4px 19px 0px rgba(34, 60, 80, 0.09);
    -moz-box-shadow: 4px 4px 19px 0px rgba(34, 60, 80, 0.09);
    box-shadow: 4px 4px 19px 0px rgba(34, 60, 80, 0.09);
  }
</style>
