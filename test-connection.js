// Script para probar la conexión con el backend
// Ejecutar con: node test-connection.js

import axios from 'axios';

const BACKEND_URL = 'http://127.0.0.1:8000/events/';

async function testBackendConnection() {
    console.log('🧪 Probando conexión con el backend...');
    console.log('📍 URL:', BACKEND_URL);
    
    try {
        const response = await axios.get(BACKEND_URL, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            timeout: 10000
        });
        
        console.log('✅ Conexión exitosa!');
        console.log('📊 Status:', response.status);
        console.log('📄 Headers:', response.headers);
        console.log('📦 Datos:', JSON.stringify(response.data, null, 2));
        
        return true;
    } catch (error) {
        console.error('❌ Error en la conexión:');
        
        if (error.code === 'ECONNREFUSED') {
            console.error('   - El backend no está corriendo en http://127.0.0.1:8000');
            console.error('   - Asegúrate de iniciar tu servidor backend');
        } else if (error.code === 'ENOTFOUND') {
            console.error('   - No se puede resolver la dirección del servidor');
        } else if (error.response) {
            console.error('   - Status:', error.response.status);
            console.error('   - Data:', error.response.data);
        } else if (error.request) {
            console.error('   - No se recibió respuesta del servidor');
        } else {
            console.error('   - Error:', error.message);
        }
        
        return false;
    }
}

// Ejecutar la prueba
testBackendConnection()
    .then(success => {
        if (success) {
            console.log('\n🎉 ¡El backend está funcionando correctamente!');
            console.log('   Tu frontend debería poder conectarse sin problemas.');
        } else {
            console.log('\n💡 Soluciones:');
            console.log('   1. Asegúrate de que el backend esté corriendo');
            console.log('   2. Verifica que el puerto 8000 esté disponible');
            console.log('   3. Comprueba que el endpoint /events/ exista');
        }
    })
    .catch(error => {
        console.error('Error inesperado:', error);
    });
