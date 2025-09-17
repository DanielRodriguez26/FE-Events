import type { SetState } from 'zustand';
import { eventServices } from '@domain/event/event.service';
import type { MyEvenState } from '@infrastructure/store/store';
import type { IEventFilter, IPaginatedEventsResponse } from '@domain/event/event.interface';
import type { IEventDto } from '@domain/event/event.interface';

// El estado inicial debe coincidir con la interfaz de la tienda/slice.
const createEventInitialState = {
	createEvent: {},
	allevents: null,
	eventById: null,
	alleventssearch: null,
	currentFilters: null,
};

// La función que crea el "slice" de tu estado.
const createEventState = (set: SetState<MyEvenState>): IEventStore => ({
	// Propiedades del estado
	createEvent: {},
	allevents: null,
	eventById: null,
	currentFilters: null,
	deleteEvent: null,

	// Acciones para modificar el estado
	setAllevents: async (page: number = 1, size: number = 6) => {
		const events = await eventServices.getAllEvents(page, size);
		// Ahora events es un objeto paginado, no un array directo
		set({ allevents: events });
	},

	// Acción para obtener evento por ID
	setEventById: async (id: number) => {
		const event = await eventServices.getEventById(id);
		set({ eventById: event });
	},

	// Acción para obtener evento por ID
	setEventSearch: async (filter: IEventFilter, page: number = 1, size: number = 10) => {
		const event = await eventServices.getEventSearch(filter, page, size);
		console.log('✅ Eventos cargados exitosamente: search', event);
		set({ allevents: event, currentFilters: filter });
	},

	setCreateEvent: async (event: IEventDto) => {
		const newEvent = await eventServices.createEvent(event);
		set({ createEvent: newEvent });
	},

	setDeleteEvent: async (id: number) => {
		const deletedEvent = await eventServices.deleteEvent(id);
		set({ deleteEvent: deletedEvent });
	},

	setUpdateEvent: async (id: number, event: IEventDto) => {
		const updatedEvent = await eventServices.updateEvent(id, event);
		set({ eventById: updatedEvent });
	},
});

// La interfaz debe coincidir con lo que retorna `createHomeState`.
interface IEventStore {
	createEvent: object;
	allevents: IPaginatedEventsResponse | null;
	eventById: IEventDto | null;
	deleteEvent: IEventDto | null;
	currentFilters: IEventFilter | null;
	// Función para cargar eventos con parámetros de paginación
	setAllevents: (page?: number, size?: number) => Promise<void>;
	// Función para obtener evento por ID
	setEventById: (id: number) => Promise<void>;
	// Función para obtener evento por ID
	setEventSearch: (filter: IEventFilter, page?: number, size?: number) => Promise<void>;
	// Función para crear evento
	setCreateEvent: (event: IEventDto) => Promise<void>;
	// Función para eliminar evento
	setDeleteEvent: (id: number) => Promise<void>;
	// Función para actualizar evento
	setUpdateEvent: (id: number, event: IEventDto) => Promise<void>;
}

export { createEventState, createEventInitialState };
export type { IEventStore };
