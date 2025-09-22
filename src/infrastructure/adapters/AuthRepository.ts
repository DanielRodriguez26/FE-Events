import type { IAuthRepository } from '../../domain/ports/IAuthRepository';
import type {
	ILoginCredentials,
	IRegisterCredentials,
	IAuthResponse,
	IUser
} from '../../domain/auth/auth.interface';
import type { IHttpClient } from './IHttpClient';

// Adaptador para el repositorio de autenticación
// Implementa la interfaz IAuthRepository usando un cliente HTTP
export class AuthRepository implements IAuthRepository {
	constructor(private httpClient: IHttpClient) {}

	async login(credentials: ILoginCredentials): Promise<IAuthResponse> {
		return this.httpClient.post<IAuthResponse>('/auth/login', credentials);
	}

	async register(credentials: IRegisterCredentials): Promise<IAuthResponse> {
		return this.httpClient.post<IAuthResponse>('/auth/register', credentials);
	}

	async refreshToken(refreshToken: string): Promise<IAuthResponse> {
		return this.httpClient.post<IAuthResponse>('/auth/refresh', { refresh_token: refreshToken });
	}

	async logout(token: string): Promise<void> {
		await this.httpClient.post('/auth/logout', {}, {
			headers: { Authorization: `Bearer ${token}` }
		});
	}

	async getProfile(): Promise<IUser> {
		return this.httpClient.get<IUser>('/users/profile');
	}

	async updateProfile(userData: Partial<IUser>): Promise<IUser> {
		return this.httpClient.put<IUser>('/users/profile', userData);
	}
}