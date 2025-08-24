import axios from 'axios';
import useStore from '@store/store';
import { ErrorService } from './error.service';

// Configuración de axios con interceptores
// Maneja automáticamente la renovación de tokens y errores de autenticación

// Crear instancia de axios
const axiosInstance = axios.create({
	timeout: 10000, // 10 segundos
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
	},
});

// Interceptor para agregar token a todas las peticiones
axiosInstance.interceptors.request.use(
	(config) => {
		const token = useStore.getState().token;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Interceptor para manejar respuestas y renovación de tokens
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		// Si el error es 401 (no autorizado) y no hemos intentado renovar el token
		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				// Intentar renovar el token
				const success = await useStore.getState().refreshTokenAction();
				
				if (success) {
					// Obtener el nuevo token
					const newToken = useStore.getState().token;
					if (newToken) {
						// Actualizar el header de autorización
						originalRequest.headers.Authorization = `Bearer ${newToken}`;
						// Reintentar la petición original
						return axiosInstance(originalRequest);
					}
				}
			} catch {
				// Si falla la renovación, hacer logout
				useStore.getState().logout();
				// Redirigir al login (esto se maneja en el componente ProtectedRoute)
			}
		}

		// Procesar el error con el servicio de errores
		const processedError = ErrorService.processAxiosError(error);
		ErrorService.logError(processedError, 'Axios Interceptor');
		
		return Promise.reject(processedError);
	}
);

export default axiosInstance;
