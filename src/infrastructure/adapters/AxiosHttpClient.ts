import { get, post, put, remove } from '../../domain/settings/http.service';
import type { IHttpClient } from './IHttpClient';

// Adaptador HTTP que implementa la interfaz IHttpClient
// Utiliza los servicios HTTP existentes del dominio
export class AxiosHttpClient implements IHttpClient {
	async get<T>(url: string, config?: { params?: any; headers?: Record<string, string> }): Promise<T> {
		return get<T>({
			url,
			payload: config?.params,
			options: {
				headers: config?.headers,
			},
		});
	}

	async post<T>(url: string, data?: any, config?: { headers?: Record<string, string> }): Promise<T> {
		return post<T>({
			url,
			payload: data,
			options: {
				headers: config?.headers,
			},
		});
	}

	async put<T>(url: string, data?: any, config?: { headers?: Record<string, string> }): Promise<T> {
		return put<T>({
			url,
			payload: data,
			options: {
				headers: config?.headers,
			},
		});
	}

	async delete<T>(url: string, config?: { headers?: Record<string, string>; data?: any }): Promise<T> {
		return remove<T>({
			url,
			payload: config?.data,
			options: {
				headers: config?.headers,
			},
		});
	}
}