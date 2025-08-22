// Interfaces para el sistema de autenticación
// Define las estructuras de datos para login, registro y gestión de tokens

// Interfaz para las credenciales de login
export interface ILoginCredentials {
	username: string;
	password: string;
}

// Interfaz para el registro de usuario
export interface IRegisterCredentials {
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	phone: string;
	password: string;
	confirm_password: string;
	is_active: boolean;
	role_id: number;
}

// Interfaz para la respuesta de autenticación
export interface IAuthResponse {
	token: string;
	refreshToken?: string;
	user: {
		id: string;
		email: string;
		name: string;
		role?: string;
	};
	expiresIn?: number;
}

// Interfaz para el usuario autenticado
export interface IUser {
	id: string;
	email: string;
	name: string;
	role?: string;
}

// Interfaz para el estado de autenticación
export interface IAuthState {
	user: IUser | null;
	token: string | null;
	refreshToken: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
}

// Interfaz para las acciones de autenticación
export interface IAuthActions {
	login: (credentials: ILoginCredentials) => Promise<boolean>;
	register: (credentials: IRegisterCredentials) => Promise<boolean>;
	logout: () => void;
	refreshTokenAction: () => Promise<boolean>;
	clearError: () => void;
	setLoading: (loading: boolean) => void;
}

// Interfaz completa del store de autenticación
export interface IAuthStore extends IAuthState, IAuthActions {}
