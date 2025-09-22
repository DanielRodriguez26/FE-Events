import type {
	ILoginCredentials,
	IRegisterCredentials,
	IAuthResponse,
	IBackendAuthResponse,
	IUser
} from '../auth/auth.interface';

// Puerto para el repositorio de autenticación
// Define el contrato que debe implementar cualquier adaptador de autenticación
export interface IAuthRepository {
	// Iniciar sesión de usuario
	login(credentials: ILoginCredentials): Promise<IAuthResponse>;

	// Registrar nuevo usuario
	register(credentials: IRegisterCredentials): Promise<IAuthResponse>;

	// Renovar token de acceso
	refreshToken(refreshToken: string): Promise<IAuthResponse>;

	// Cerrar sesión (invalidar token en el servidor)
	logout(token: string): Promise<void>;

	// Obtener perfil del usuario autenticado
	getProfile(): Promise<IUser>;

	// Actualizar perfil del usuario
	updateProfile(userData: Partial<IUser>): Promise<IUser>;
}