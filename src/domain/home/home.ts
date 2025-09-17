import type { SetState } from 'zustand';
import { homeServices } from '@domain/home/home.service';
import type { MyEvenState } from '@infrastructure/store/store';
import type { IPaginatedEventsResponse } from '@domain/home/home.interface';

// El estado inicial debe coincidir con la interfaz de la tienda/slice.
const createHomeInitialState = {
	createHome: {},
	allHomeEvents: null,
};

// La función que crea el "slice" de tu estado.
const createHomeState = (set: SetState<MyEvenState>): IHomeStore => ({
	// Propiedades del estado
	createHome: {},
	allHomeEvents: null,

	// Acciones para modificar el estado
	setAllevents: async (page: number = 1, size: number = 6) => {
		const events = await homeServices.getAllEvents(page, size);
		// Ahora events es un objeto paginado, no un array directo
		set({ allHomeEvents: events });
	},
});

// La interfaz debe coincidir con lo que retorna `createHomeState`.
interface IHomeStore {
	createHome: object;
	allHomeEvents: IPaginatedEventsResponse | null;
	// Función para cargar eventos con parámetros de paginación
	setAllevents: (page?: number, size?: number) => Promise<void>;
}

export { createHomeState, createHomeInitialState };
export type { IHomeStore };
