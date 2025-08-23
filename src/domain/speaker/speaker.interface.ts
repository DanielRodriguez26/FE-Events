// Interfaz para el DTO (Data Transfer Object) de eventos
// Define la estructura de datos que se recibe de la API
//id, name, email, phone, bio, company, 
type ISpeakerDto = {
	id: number; // Identificador único del evento
	name: string; // Nombre del evento
	email: string; // Fecha del evento (formato string)
	phone: string; // Ubicación donde se realizará el evento
	bio: string; // Ubicación donde se realizará el evento
	company: string; // Ubicación donde se realizará el evento
	created_at: string; // Ubicación donde se realizará el evento
	updated_at: string; // Ubicación donde se realizará el evento
};

// Interfaz para la respuesta paginada de eventos
type IPaginatedSpeakersResponse = {
	items: ISpeakerDto[]; // Array de eventos
	page: number; // Página actual
	size: number; // Tamaño de la página
	total_items: number; // Total de elementos
	total_pages: number; // Total de páginas
};

export type { ISpeakerDto, IPaginatedSpeakersResponse };