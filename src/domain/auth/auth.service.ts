import { post } from '../settings/http.service';
import { BACKEND_ENDPOINTS } from '../settings/backend.config';
import type { ILoginCredentials, IRegisterCredentials, IAuthResponse, IBackendAuthResponse } from './auth.interface';

// Endpoints de autenticación


// Servicio de autenticación
// Maneja todas las peticiones relacionadas con autenticación

// Función para iniciar sesión
export const loginUser = async (credentials: ILoginCredentials): Promise<IAuthResponse> => {
	try {

		const response = await post<IBackendAuthResponse>({
			url: '',
			baseURL: BACKEND_ENDPOINTS.login,
			payload: credentials,
		});

		// Normalizar la respuesta para asegurar que tenga la estructura correcta
		const token = response.token || response.access_token || response.access;
		
		if (!token) {
			throw new Error('Token no encontrado en la respuesta');
		}
		
		// El backend devuelve directamente el objeto usuario
		const userData = response.user || response;
		
		if (!userData || !userData.id) {
			throw new Error('Datos de usuario no encontrados en la respuesta');
		}
		
		const normalizedResponse: IAuthResponse = {
			token,
			refreshToken: response.refreshToken || response.refresh_token || response.refresh,
			user: {
				id: userData.id,
				email: userData.email,
				first_name: userData.first_name,
				last_name: userData.last_name,
				username: userData.username,
				phone: userData.phone,
				role_id: userData.role_id,
				is_active: userData.is_active,
				created_at: userData.created_at,
				updated_at: userData.updated_at
			},
			expiresIn: response.expiresIn || response.expires_in || response.expires
		};

		return normalizedResponse;
	} catch (error) {
		console.error('❌ Error en login:', error);
		throw new Error('Credenciales inválidas');
	}
};

// Función para registrar usuario
export const registerUser = async (credentials: IRegisterCredentials): Promise<IAuthResponse> => {
	try {
		const response = await post<IBackendAuthResponse>({
			url: '',
			baseURL: BACKEND_ENDPOINTS.register,
			payload: credentials,
		});
		
		// Normalizar la respuesta para asegurar que tenga la estructura correcta
		const token = response.token || response.access_token || response.access;
		
		if (!token) {
			throw new Error('Token no encontrado en la respuesta');
		}
		
		// El backend devuelve directamente el objeto usuario
		const userData = response.user || response;
		
		if (!userData || !userData.id) {
			throw new Error('Datos de usuario no encontrados en la respuesta');
		}
		
		const normalizedResponse: IAuthResponse = {
			token,
			refreshToken: response.refreshToken || response.refresh_token || response.refresh,
			user: {
				id: userData.id,
				email: userData.email,
				first_name: userData.first_name,
				last_name: userData.last_name,
				username: userData.username,
				phone: userData.phone,
				role_id: userData.role_id,
				is_active: userData.is_active,
				created_at: userData.created_at,
				updated_at: userData.updated_at
			},
			expiresIn: response.expiresIn || response.expires_in || response.expires
		};
		

		return normalizedResponse;
	} catch (error) {
		console.error('❌ Error en registro:', error);
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
