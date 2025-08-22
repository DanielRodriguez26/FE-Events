import type { ISettingsService } from './http.interface';
import { ENDPOINT } from './envairoment';
import axios from 'axios';
import useStore from '@store/store';

// Servicio HTTP centralizado para manejar todas las peticiones a la API
// Proporciona métodos para GET, POST, PUT y DELETE con manejo de errores

// Función para realizar peticiones GET
// Obtiene datos del servidor sin enviar información en el cuerpo
const get = async <T>({ url, payload, baseURL = ENDPOINT, options }: ISettingsService): Promise<T> => {
	// Obtener el token del store
	const token = useStore.getState().token;
	
	// Configurar headers con autorización si hay token
	const headers = {
		...options?.headers,
		...(token && { Authorization: `Bearer ${token}` }),
	};
	
	// Realiza la petición GET usando axios
	// payload se usa como parámetros de consulta (query parameters)
	const res = await axios.get(baseURL + url, { 
		params: payload,
		headers,
		...options,
	});
	
	// Verifica si la petición fue exitosa (código 200)
	if (res.status === 200) {
		return res.data; // Retorna los datos de la respuesta
	} else {
		throw new Error('Error'); // Lanza error si no fue exitosa
	}
};

// Función para realizar peticiones POST
// Envía datos al servidor para crear nuevos recursos
const post = async <T>({ url, payload, baseURL = ENDPOINT, options }: ISettingsService): Promise<T> => {
	// Obtener el token del store
	const token = useStore.getState().token;
	
	// Configurar headers con autorización si hay token
	const headers = {
		...options?.headers,
		...(token && { Authorization: `Bearer ${token}` }),
	};
	
	// Realiza la petición POST usando axios
	// payload se envía en el cuerpo de la petición
	const res = await axios.post(baseURL + url, payload, {
		headers,
		...options,
	});
	
	// Verifica si la petición fue exitosa
	if (res.status === 200) {
		return res.data; // Retorna la respuesta del servidor
	} else {
		throw new Error('Error'); // Lanza error si falló
	}
};

// Función para realizar peticiones PUT
// Actualiza recursos existentes en el servidor
const put = async <T>({ url, payload, baseURL = ENDPOINT, options }: ISettingsService): Promise<T> => {
	// Obtener el token del store
	const token = useStore.getState().token;
	
	// Configurar headers con autorización si hay token
	const headers = {
		...options?.headers,
		...(token && { Authorization: `Bearer ${token}` }),
	};
	
	// Realiza la petición PUT usando axios
	// payload contiene los datos a actualizar
	const res = await axios.put(baseURL + url, payload, {
		headers,
		...options,
	});
	
	// Verifica si la actualización fue exitosa
	if (res.status === 200) {
		return res.data; // Retorna la respuesta actualizada
	} else {
		throw new Error('Error'); // Lanza error si falló
	}
};

// Función para realizar peticiones DELETE
// Elimina recursos del servidor
const remove = async <T>({ url, payload, baseURL = ENDPOINT, options }: ISettingsService): Promise<T> => {
	// Obtener el token del store
	const token = useStore.getState().token;
	
	// Configurar headers con autorización si hay token
	const headers = {
		...options?.headers,
		...(token && { Authorization: `Bearer ${token}` }),
	};
	
	// Realiza la petición DELETE usando axios
	// payload puede contener datos adicionales para la eliminación
	const res = await axios.delete(baseURL + url, {
		data: payload,
		headers,
		...options,
	});
	
	// Verifica si la eliminación fue exitosa
	if (res.status === 200) {
		return res.data; // Retorna confirmación de eliminación
	} else {
		throw new Error('Error'); // Lanza error si falló
	}
};

// Exportación de todas las funciones HTTP
// Permite usar estos métodos en otros módulos de la aplicación
export { get, post, put, remove };
