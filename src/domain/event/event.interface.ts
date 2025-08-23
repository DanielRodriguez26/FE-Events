// Interfaz para el DTO (Data Transfer Object) de eventos
// Define la estructura de datos que se recibe de la API
type IEventDto = {
	id: number; // Identificador único del evento
	title: string; // Nombre del evento
	description: string; // Descripción detallada del evento
	start_date: string; // Fecha del evento (formato string)
	location: string; // Ubicación donde se realizará el evento
	organizer: string; // Organizador del evento
	capacity: number; // Capacidad del evento
	price: number; // Precio del evento
};


export type { IEventDto };