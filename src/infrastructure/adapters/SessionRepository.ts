import type { ISessionRepository } from '../../domain/ports/ISessionRepository';
import type {
	ISessionDto,
	ISessionCreateDto,
	ISessionUpdateDto
} from '../../domain/session/session.interface';
import type { IHttpClient } from './IHttpClient';

// Adaptador para el repositorio de sesiones
// Implementa la interfaz ISessionRepository usando un cliente HTTP
export class SessionRepository implements ISessionRepository {
	constructor(private httpClient: IHttpClient) {}

	async getSessionsByEvent(eventId: number): Promise<ISessionDto[]> {
		const response = await this.httpClient.get<{ sessions: ISessionDto[] }>(`/events/${eventId}/sessions`);
		return response.sessions || [];
	}

	async getSessionById(sessionId: number): Promise<ISessionDto> {
		return this.httpClient.get<ISessionDto>(`/sessions/${sessionId}`);
	}

	async createSession(sessionData: ISessionCreateDto): Promise<ISessionDto> {
		return this.httpClient.post<ISessionDto>(`/events/${sessionData.event_id}/sessions`, sessionData);
	}

	async updateSession(sessionId: number, sessionData: ISessionUpdateDto): Promise<ISessionDto> {
		return this.httpClient.put<ISessionDto>(`/sessions/${sessionId}`, sessionData);
	}

	async deleteSession(sessionId: number): Promise<void> {
		await this.httpClient.delete(`/sessions/${sessionId}`);
	}
}