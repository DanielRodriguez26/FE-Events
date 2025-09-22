import type { IEventDto, IPaginatedEventsResponse, IEventFilter } from '../event/event.interface';

// Puerto para el repositorio de eventos
// Define el contrato que debe implementar cualquier adaptador de persistencia de eventos
export interface IEventRepository {
	// Obtener todos los eventos con paginación
	getAllEvents(page?: number, size?: number): Promise<IPaginatedEventsResponse>;

	// Obtener eventos con filtros avanzados
	getEventsWithFilters(page?: number, size?: number, filters?: IEventFilter): Promise<IPaginatedEventsResponse>;

	// Obtener un evento por ID
	getEventById(id: number): Promise<IEventDto>;

	// Crear un nuevo evento
	createEvent(eventData: Omit<IEventDto, 'id' | 'created_at' | 'registered_attendees'>): Promise<IEventDto>;

	// Actualizar un evento existente
	updateEvent(id: number, eventData: Partial<IEventDto>): Promise<IEventDto>;

	// Eliminar un evento
	deleteEvent(id: number): Promise<void>;

	// Registrar un usuario a un evento
	registerToEvent(eventId: number, registrationData: {
		attendee_name: string;
		attendee_email: string;
		attendee_phone: string;
		dietary_restrictions?: string;
		special_requirements?: string;
	}): Promise<any>;

	// Obtener registros de un evento
	getEventRegistrations(eventId: number): Promise<any[]>;
}