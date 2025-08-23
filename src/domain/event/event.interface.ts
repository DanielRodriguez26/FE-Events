// Interfaz para el DTO (Data Transfer Object) de eventos
// Define la estructura de datos que se recibe de la API
type IEventDto = {
	id: number; // Identificador único del evento
	title: string; // Nombre del evento
	description: string; // Descripción detallada del evento
	start_date: string; // Fecha del evento (formato string)
	end_date: string; // Fecha de finalización del evento
	location: string; // Ubicación donde se realizará el evento
	organizer: string; // Organizador del evento
	capacity: number; // Capacidad del evento
	price: number; // Precio del evento
	registered_attendees?: number; // Número de asistentes registrados
};

// Interfaz para la respuesta paginada de eventos
type IPaginatedEventsResponse = {
	items: IEventDto[]; // Array de eventos
	page: number; // Página actual
	size: number; // Tamaño de la página
	total_items: number; // Total de elementos
	total_pages: number; // Total de páginas
};


type IEventFilter = {
	title: string;
	location: string;
	is_active: boolean;
	date_from: string;
	date_to: string;
};

export type { IEventDto, IPaginatedEventsResponse, IEventFilter };