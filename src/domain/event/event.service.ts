import type { IEventRepository } from '../ports/IEventRepository';
import type { IEventDto, IPaginatedEventsResponse, IEventFilter } from './event.interface';

// Servicio de dominio para la lógica de negocio de eventos
// Depende de la abstracción IEventRepository en lugar de detalles de infraestructura
class EventService {
	constructor(private eventRepository: IEventRepository) {}

	// Función para obtener todos los eventos desde el repositorio
	async getAllEvents(page: number = 1, size: number = 6): Promise<IPaginatedEventsResponse> {
		try {
			const result = await this.eventRepository.getAllEvents(page, size);
			console.log('✅ Eventos cargados exitosamente:', result);
			return result;
		} catch (error) {
			console.error('❌ Error al cargar eventos:', error);
			throw error;
		}
	}

	// Función para obtener un evento específico por ID
	async getEventById(id: number): Promise<IEventDto> {
		console.log('🔍 Intentando cargar evento con ID:', id);

		try {
			const result = await this.eventRepository.getEventById(id);
			console.log('✅ Evento cargado exitosamente:', result);
			return result;
		} catch (error) {
			console.error('❌ Error al cargar evento:', error);
			throw error;
		}
	}

	// Función para buscar eventos con filtros
	async getEventSearch(filter: IEventFilter, page: number = 1, size: number = 6): Promise<IPaginatedEventsResponse> {
		try {
			const result = await this.eventRepository.getEventsWithFilters(page, size, filter);
			console.log('✅ Eventos filtrados cargados exitosamente:', result);
			return result;
		} catch (error) {
			console.error('❌ Error al cargar eventos filtrados:', error);
			throw error;
		}
	}

	// Función para crear un nuevo evento
	async createEvent(eventData: Omit<IEventDto, 'id' | 'created_at' | 'registered_attendees'>): Promise<IEventDto> {
		try {
			const result = await this.eventRepository.createEvent(eventData);
			console.log('✅ Evento creado exitosamente:', result);
			return result;
		} catch (error) {
			console.error('❌ Error al crear evento:', error);
			throw error;
		}
	}

	// Función para eliminar un evento
	async deleteEvent(id: number): Promise<void> {
		try {
			await this.eventRepository.deleteEvent(id);
			console.log('✅ Evento eliminado exitosamente');
		} catch (error) {
			console.error('❌ Error al eliminar evento:', error);
			throw error;
		}
	}

	// Función para actualizar un evento
	async updateEvent(id: number, eventData: Partial<IEventDto>): Promise<IEventDto> {
		try {
			const result = await this.eventRepository.updateEvent(id, eventData);
			console.log('✅ Evento actualizado exitosamente:', result);
			return result;
		} catch (error) {
			console.error('❌ Error al actualizar evento:', error);
			throw error;
		}
	}

	// Función para registrar a un evento
	async registerToEvent(eventId: number, registrationData: {
		attendee_name: string;
		attendee_email: string;
		attendee_phone: string;
		dietary_restrictions?: string;
		special_requirements?: string;
	}): Promise<any> {
		try {
			const result = await this.eventRepository.registerToEvent(eventId, registrationData);
			console.log('✅ Registro a evento exitoso:', result);
			return result;
		} catch (error) {
			console.error('❌ Error al registrar a evento:', error);
			throw error;
		}
	}

	// Función para obtener registros de un evento
	async getEventRegistrations(eventId: number): Promise<any[]> {
		try {
			const result = await this.eventRepository.getEventRegistrations(eventId);
			console.log('✅ Registros de evento obtenidos:', result);
			return result;
		} catch (error) {
			console.error('❌ Error al obtener registros de evento:', error);
			throw error;
		}
	}
}

// Factory function para crear instancia del servicio con dependencias
const createEventService = (eventRepository: IEventRepository): EventService => {
	return new EventService(eventRepository);
};

// Funciones de compatibilidad para mantener la API existente durante la migración
let _eventService: EventService | null = null;

const initializeEventService = (eventRepository: IEventRepository) => {
	_eventService = createEventService(eventRepository);
};

const getAllEvents = async (page: number = 1, size: number = 6): Promise<IPaginatedEventsResponse> => {
	if (!_eventService) throw new Error('EventService not initialized');
	return _eventService.getAllEvents(page, size);
};

const getEventById = async (id: number): Promise<IEventDto> => {
	if (!_eventService) throw new Error('EventService not initialized');
	return _eventService.getEventById(id);
};

const getEventSearch = async (filter: IEventFilter, page: number = 1, size: number = 6): Promise<IPaginatedEventsResponse> => {
	if (!_eventService) throw new Error('EventService not initialized');
	return _eventService.getEventSearch(filter, page, size);
};

const createEvent = async (eventData: Omit<IEventDto, 'id' | 'created_at' | 'registered_attendees'>): Promise<IEventDto> => {
	if (!_eventService) throw new Error('EventService not initialized');
	return _eventService.createEvent(eventData);
};

const deleteEvent = async (id: number): Promise<void> => {
	if (!_eventService) throw new Error('EventService not initialized');
	return _eventService.deleteEvent(id);
};

const updateEvent = async (id: number, eventData: Partial<IEventDto>): Promise<IEventDto> => {
	if (!_eventService) throw new Error('EventService not initialized');
	return _eventService.updateEvent(id, eventData);
};

const registerToEvent = async (eventId: number, registrationData: {
	attendee_name: string;
	attendee_email: string;
	attendee_phone: string;
	dietary_restrictions?: string;
	special_requirements?: string;
}): Promise<any> => {
	if (!_eventService) throw new Error('EventService not initialized');
	return _eventService.registerToEvent(eventId, registrationData);
};

const getEventRegistrations = async (eventId: number): Promise<any[]> => {
	if (!_eventService) throw new Error('EventService not initialized');
	return _eventService.getEventRegistrations(eventId);
};

// Objeto que exporta todos los servicios del módulo para compatibilidad
const eventServices = {
	getAllEvents,
	getEventById,
	getEventSearch,
	createEvent,
	deleteEvent,
	updateEvent,
	registerToEvent,
	getEventRegistrations,
};

export { EventService, createEventService, initializeEventService, eventServices };
