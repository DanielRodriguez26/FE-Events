import { get, post, remove, put } from '../settings/http.service';
import { MICROSERVICES } from '../settings/envairoment';
import type { IEventDto, IPaginatedEventsResponse, IEventFilter } from './event.interface';

// Extracción de la URL del microservicio de eventos desde la configuración
const { event: _event } = MICROSERVICES;
const event = `${_event}`;

// Función para obtener todos los eventos desde la API
// Retorna una promesa con la respuesta paginada de eventos
const getAllEvents = async (page: number = 1, size: number = 6): Promise<IPaginatedEventsResponse> => {
	try {
		// Realiza la petición GET al endpoint de eventos con parámetros de paginación
		const res = get<IPaginatedEventsResponse>({
			url: `?page=${page}&size=${size}`, // Agregar parámetros de paginación
			baseURL: event, // Usamos la URL completa del backend
		});

		// Espera la respuesta
		const json = await res;
		console.log('✅ Eventos cargados exitosamente:', json);
		return json;
	} catch (error) {
		console.error('❌ Error al cargar eventos:', error);
		throw error;
	}
};

// Función para obtener un evento específico por ID
const getEventById = async (id: number): Promise<IEventDto> => {
	console.log('🔍 Intentando cargar evento con ID:', id);

	try {
		// Realiza la petición GET al endpoint específico del evento
		const res = get<IEventDto>({
			url: `${id}`, // Endpoint específico para un evento
			baseURL: event, // Usamos la URL completa del backend
		});

		// Espera la respuesta
		const json = await res;
		console.log('✅ Evento cargado exitosamente:', json);
		return json;
	} catch (error) {
		console.error('❌ Error al cargar evento:', error);
		throw error;
	}
};

const getEventSearch = async (filter: IEventFilter, page: number = 1, size: number = 6): Promise<IPaginatedEventsResponse> => {
	try {
		const params = new URLSearchParams();
		params.append('title', filter.title);
		params.append('location', filter.location);
		params.append('is_active', filter.is_active.toString());
		params.append('date_from', filter.date_from);
		params.append('date_to', filter.date_to);
		params.append('page', page.toString());
		params.append('size', size.toString());
		const res = get<IPaginatedEventsResponse>({
			url: `search/?${params.toString()}`, // Agregar parámetros de paginación
			baseURL: event, // Usamos la URL completa del backend
		});

		const json = await res;
		console.log('✅ Eventos cargados exitosamente:', json);
		return json;
	} catch (error) {
		console.error('❌ Error al cargar eventos:', error);
		throw error;
	}
};

const createEvent = async (eventData: IEventDto): Promise<IEventDto> => {
	try {
		const res = post<IEventDto>({
			url: '',
			payload: eventData,
			baseURL: event,
		});

		const json = await res;
		console.log('✅ Evento creado exitosamente:', json);
		return json;
	} catch (error) {
		console.error('❌ Error al crear evento:', error);
		throw error;
	}
};

const deleteEvent = async (id: number): Promise<IEventDto> => {
	try {
		const res = remove<IEventDto>({
			url: `${id}`,
			baseURL: event,
		});
		const json = await res;
		console.log('✅ Evento eliminado exitosamente:', json);
		return json;
	} catch (error) {
		console.error('❌ Error al eliminar evento:', error);
		throw error;
	}
};

const updateEvent = async (id: number, eventData: IEventDto): Promise<IEventDto> => {
	try {
		const res = put<IEventDto>({
			url: `${id}`,
			payload: eventData,
			baseURL: event,
		});

		const json = await res;
		console.log('✅ Evento actualizado exitosamente:', json);
		return json;
	} catch (error) {
		console.error('❌ Error al actualizar evento:', error);
		throw error;
	}
};

// Objeto que exporta todos los servicios del módulo home
// Centraliza todas las funciones de comunicación con la API
const eventServices = {
	getAllEvents, // Función para obtener todos los eventos
	getEventById, // Función para obtener evento por ID
	getEventSearch, // Función para obtener evento por busqueda
	createEvent, // Función para crear evento
	deleteEvent, // Función para eliminar evento
	updateEvent, // Función para actualizar evento
};

export { eventServices };
