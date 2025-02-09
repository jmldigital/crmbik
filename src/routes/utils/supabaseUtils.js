import { supabase } from '../supabase';

// Функция для получения имени менеджера по номеру телефона клиента
export async function getManagerNameByPhone(phone) {
  try {
    console.log('Phone:', phone); // Логируем переданный номер телефона

    // Вызываем SQL-функцию get_manager_by_phone
    const { data: managerData, error: managerError } = await supabase.rpc('get_manager_by_phone', {
      phone_param: phone, // Передаём номер телефона как есть
    });

    if (managerError) {
      console.error('Ошибка при поиске менеджера:', managerError);
      return null;
    }

    // Если данные отсутствуют, возвращаем null
    if (!managerData || managerData.length === 0) {
      console.warn('Клиент не найден или у него нет менеджера');
      return null;
    }

    // Возвращаем имя и фамилию менеджера
    console.log('Manager Name:', managerData[0].manager_first_name, managerData[0].manager_last_name);
    return {
      first_name: managerData[0].manager_first_name,
      last_name: managerData[0].manager_last_name,
    };
  } catch (error) {
    console.error('Ошибка при получении имени менеджера:', error.message);
    return null;
  }
}