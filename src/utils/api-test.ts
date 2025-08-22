// Utilidad para probar la conexión con el backend
// Permite verificar que la API esté funcionando correctamente

import { homeServices } from '@domain/home/home.service';

/**
 * Función para probar la conexión con el backend
 * @returns Promise<boolean> - true si la conexión es exitosa, false en caso contrario
 */
export const testBackendConnection = async (): Promise<boolean> => {
    try {
        console.log('🧪 Probando conexión con el backend...');
        
        // Intenta obtener los eventos del backend
        const events = await homeServices.getAllEvents();
        
        console.log('✅ Conexión exitosa! Eventos obtenidos:', events);
        return true;
    } catch (error) {
        console.error('❌ Error en la conexión con el backend:', error);
        return false;
    }
};

/**
 * Función para mostrar información de depuración de la conexión
 */
export const debugConnection = () => {
    console.log('🔍 Información de depuración:');
    console.log('- URL del backend: http://127.0.0.1:8000/events/');
    console.log('- Método: GET');
    console.log('- Headers: Content-Type: application/json');
    console.log('- Timeout: 10 segundos');
    
    // Verificar si el backend está corriendo
    fetch('http://127.0.0.1:8000/events/')
        .then(response => {
            console.log('✅ Backend responde correctamente');
            console.log('Status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('📊 Datos recibidos:', data);
        })
        .catch(error => {
            console.error('❌ No se puede conectar al backend:', error);
            console.log('💡 Asegúrate de que el backend esté corriendo en http://127.0.0.1:8000');
        });
};
