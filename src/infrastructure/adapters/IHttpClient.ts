// Interfaz para el cliente HTTP
// Define el contrato que debe implementar cualquier cliente HTTP
export interface IHttpClient {
	get<T>(url: string, config?: { params?: any; headers?: Record<string, string> }): Promise<T>;
	post<T>(url: string, data?: any, config?: { headers?: Record<string, string> }): Promise<T>;
	put<T>(url: string, data?: any, config?: { headers?: Record<string, string> }): Promise<T>;
	delete<T>(url: string, config?: { headers?: Record<string, string>; data?: any }): Promise<T>;
}