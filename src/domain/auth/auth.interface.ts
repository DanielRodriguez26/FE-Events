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
		created_at?: string;
		email?: string;
		first_name?: string;
		id?: string;
		is_active?: boolean;
		last_name?: string;
		password?: string;
		phone?: string;
		role_id?: number;
		updated_at?: string;
		username?: string;
	};
	expiresIn?: number;
}

// Interfaz para respuestas flexibles del backend
export interface IBackendAuthResponse {
	token?: string;
	access_token?: string;
	access?: string;
	refreshToken?: string;
	refresh_token?: string;
	refresh?: string;
	user?: {
		created_at?: string;
		email?: string;
		first_name?: string;
		id?: string;
		is_active?: boolean;
		last_name?: string;
		password?: string;
		phone?: string;
		role_id?: number;
		updated_at?: string;
		username?: string;
	};
	user_data?: {
		id: string;
		email: string;
		name: string;
		role?: string;
	};
	// Campos directos del usuario (cuando no viene en objeto user)
	id?: string;
	user_id?: string;
	email?: string;
	user_email?: string;
	first_name?: string;
	last_name?: string;
	username?: string;
	user_name?: string;
	phone?: string;
	role_id?: number;
	is_active?: boolean;
	created_at?: string;
	updated_at?: string;
	name?: string;
	role?: string;
	user_role?: string;
	expiresIn?: number;
	expires_in?: number;
	expires?: number;
}

// Interfaz para el usuario autenticado
export interface IUser {
	id: string;
	email: string;
	first_name?: string;
	last_name?: string;
	username?: string;
	phone?: string;
	role_id?: number;
	is_active?: boolean;
	created_at?: string;
	updated_at?: string;
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
