import { post } from '../settings/http.service';
import { BACKEND_ENDPOINTS } from '../settings/backend.config';
import type { ILoginCredentials, IRegisterCredentials, IAuthResponse } from './auth.interface';

// Endpoints de autenticación


// Servicio de autenticación
// Maneja todas las peticiones relacionadas con autenticación

// Función para iniciar sesión
export const loginUser = async (credentials: ILoginCredentials): Promise<IAuthResponse> => {
	try {
		console.log('🔍 Intentando iniciar sesión con:', credentials);
		const response = await post<IAuthResponse>({
			url: '',
			baseURL: BACKEND_ENDPOINTS.login,
			payload: credentials,
		});
		return response;
	} catch (error) {
		console.error('Error en login:', error);
		throw new Error('Credenciales inválidas');
	}
};

// Función para registrar usuario
export const registerUser = async (credentials: IRegisterCredentials): Promise<IAuthResponse> => {
	try {
		console.log('🔍 Intentando iniciar sesión con:', credentials)
		const response = await post<IAuthResponse>({
			url: '',
			baseURL: BACKEND_ENDPOINTS.register,
			payload: credentials,
		});
		return response;
	} catch (error) {
		console.error('Error en registro:', error);
		throw new Error('Error al registrar usuario');
	}
};

// Función para refrescar token
export const refreshUserToken = async (refreshToken: string): Promise<IAuthResponse> => {
	try {
		const response = await post<IAuthResponse>({
			url: '',
			baseURL: BACKEND_ENDPOINTS.refresh,
			payload: { refreshToken },
		});
		return response;
	} catch (error) {
		console.error('Error al refrescar token:', error);
		throw new Error('Token de refresco inválido');
	}
};

// Función para cerrar sesión
export const logoutUser = async (token: string): Promise<void> => {
	try {
		await post({
			url: '',
			baseURL: BACKEND_ENDPOINTS.logout,
			payload: {},
			options: {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		});
	} catch (error) {
		console.error('Error en logout:', error);
		// No lanzamos error aquí porque queremos cerrar sesión localmente de todas formas
	}
};
