import type { ISettingsService } from './http.interface';
import { ENDPOINT } from './envairoment';
import axiosInstance from './axios.config';

// Servicio HTTP centralizado para manejar todas las peticiones a la API
// Proporciona métodos para GET, POST, PUT y DELETE con manejo de errores

// Función para realizar peticiones GET
// Obtiene datos del servidor sin enviar información en el cuerpo
const get = async <T>({ url, payload, baseURL = ENDPOINT, options }: ISettingsService): Promise<T> => {
	// Realiza la petición GET usando la instancia de axios con interceptores
	const res = await axiosInstance.get(baseURL + url, {
		params: payload,
		headers: {
			...options?.headers,
		},
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
	// Realiza la petición POST usando la instancia de axios con interceptores
	const res = await axiosInstance.post(baseURL + url, payload, {
		headers: {
			...options?.headers,
		},
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
	// Realiza la petición PUT usando la instancia de axios con interceptores
	const res = await axiosInstance.put(baseURL + url, payload, {
		headers: {
			...options?.headers,
		},
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
	// Realiza la petición DELETE usando la instancia de axios con interceptores
	const res = await axiosInstance.delete(baseURL + url, {
		data: payload,
		headers: {
			...options?.headers,
		},
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
