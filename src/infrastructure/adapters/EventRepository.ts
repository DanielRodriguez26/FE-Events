import type { IEventRepository } from '../../domain/ports/IEventRepository';
import type { IEventDto, IPaginatedEventsResponse, IEventFilter } from '../../domain/event/event.interface';
import type { IHttpClient } from './IHttpClient';

// Adaptador para el repositorio de eventos
// Implementa la interfaz IEventRepository usando un cliente HTTP
export class EventRepository implements IEventRepository {
	constructor(private httpClient: IHttpClient) {}

	async getAllEvents(page: number = 1, size: number = 6): Promise<IPaginatedEventsResponse> {
		const params: any = { page, size };
		return this.httpClient.get<IPaginatedEventsResponse>('', { params });
	}

	async getEventsWithFilters(page: number = 1, size: number = 6, filters?: IEventFilter): Promise<IPaginatedEventsResponse> {
		const params: any = { page, size };

		if (filters) {
			if (filters.title) params.title = filters.title;
			if (filters.location) params.location = filters.location;
			if (filters.is_active !== undefined) params.is_active = filters.is_active;
			if (filters.date_from) params.date_from = filters.date_from;
			if (filters.date_to) params.date_to = filters.date_to;
		}

		return this.httpClient.get<IPaginatedEventsResponse>('', { params });
	}

	async getEventById(id: number): Promise<IEventDto> {
		return this.httpClient.get<IEventDto>(`/${id}`);
	}

	async createEvent(eventData: Omit<IEventDto, 'id' | 'created_at' | 'registered_attendees'>): Promise<IEventDto> {
		return this.httpClient.post<IEventDto>('', eventData);
	}

	async updateEvent(id: number, eventData: Partial<IEventDto>): Promise<IEventDto> {
		return this.httpClient.put<IEventDto>(`/${id}`, eventData);
	}

	async deleteEvent(id: number): Promise<void> {
		await this.httpClient.delete(`/${id}`);
	}

	async registerToEvent(eventId: number, registrationData: {
		attendee_name: string;
		attendee_email: string;
		attendee_phone: string;
		dietary_restrictions?: string;
		special_requirements?: string;
	}): Promise<any> {
		return this.httpClient.post(`/${eventId}/register`, registrationData);
	}

	async getEventRegistrations(eventId: number): Promise<any[]> {
		return this.httpClient.get<any[]>(`/${eventId}/registrations`);
	}
}