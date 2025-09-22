import type { IAuthRepository } from '../ports/IAuthRepository';
import type { ILoginCredentials, IRegisterCredentials, IAuthResponse, IBackendAuthResponse } from './auth.interface';

// Servicio de dominio para la lógica de negocio de autenticación
// Depende de la abstracción IAuthRepository en lugar de detalles de infraestructura
class AuthService {
	constructor(private authRepository: IAuthRepository) {}

	// Función para iniciar sesión con normalización de respuesta
	async loginUser(credentials: ILoginCredentials): Promise<IAuthResponse> {
		try {
			// Utiliza el repositorio abstracto
			const response = await this.authRepository.login(credentials);

			// Aplicar lógica de negocio: normalizar respuesta del backend
			return this.normalizeAuthResponse(response);
		} catch (error) {
			console.error('❌ Error en login:', error);
			throw new Error('Credenciales inválidas');
		}
	}

	// Función para registrar usuario con normalización de respuesta
	async registerUser(credentials: IRegisterCredentials): Promise<IAuthResponse> {
		try {
			// Utiliza el repositorio abstracto
			const response = await this.authRepository.register(credentials);

			// Aplicar lógica de negocio: normalizar respuesta del backend
			return this.normalizeAuthResponse(response);
		} catch (error) {
			console.error('❌ Error en registro:', error);
			throw new Error('Error al registrar usuario');
		}
	}

	// Función para refrescar token
	async refreshUserToken(refreshToken: string): Promise<IAuthResponse> {
		try {
			return await this.authRepository.refreshToken(refreshToken);
		} catch (error) {
			console.error('Error al refrescar token:', error);
			throw new Error('Token de refresco inválido');
		}
	}

	// Función para cerrar sesión
	async logoutUser(token: string): Promise<void> {
		try {
			await this.authRepository.logout(token);
		} catch (error) {
			console.error('Error en logout:', error);
			// No lanzamos error aquí porque queremos cerrar sesión localmente de todas formas
		}
	}

	// Método privado para normalizar respuestas del backend
	private normalizeAuthResponse(response: IBackendAuthResponse): IAuthResponse {
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
	}
}

// Factory function para crear instancia del servicio con dependencias
const createAuthService = (authRepository: IAuthRepository): AuthService => {
	return new AuthService(authRepository);
};

// Funciones de compatibilidad para mantener la API existente durante la migración
let _authService: AuthService | null = null;

const initializeAuthService = (authRepository: IAuthRepository) => {
	_authService = createAuthService(authRepository);
};

const loginUser = async (credentials: ILoginCredentials): Promise<IAuthResponse> => {
	if (!_authService) throw new Error('AuthService not initialized');
	return _authService.loginUser(credentials);
};

const registerUser = async (credentials: IRegisterCredentials): Promise<IAuthResponse> => {
	if (!_authService) throw new Error('AuthService not initialized');
	return _authService.registerUser(credentials);
};

const refreshUserToken = async (refreshToken: string): Promise<IAuthResponse> => {
	if (!_authService) throw new Error('AuthService not initialized');
	return _authService.refreshUserToken(refreshToken);
};

const logoutUser = async (token: string): Promise<void> => {
	if (!_authService) throw new Error('AuthService not initialized');
	return _authService.logoutUser(token);
};

export { AuthService, createAuthService, initializeAuthService, loginUser, registerUser, refreshUserToken, logoutUser };
