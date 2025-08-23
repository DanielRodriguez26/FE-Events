// Interfaz para el DTO de registros de eventos del usuario
type IEventRegistrationDto = {
	id: number;
	event_id: number;
	user_id: number;
	registration_date: string;
	status: 'registered' | 'confirmed' | 'cancelled' | 'attended';
	event: {
		id: number;
		title: string;
		description: string;
		start_date: string;
		location: string;
		organizer: string;
		capacity: number;
		price: number;
		image_url?: string;
	};
};

// Interfaz para la respuesta paginada de registros de eventos
type IPaginatedEventRegistrationsResponse = {
	items: IEventRegistrationDto[];
	page: number;
	size: number;
	total_items: number;
	total_pages: number;
};

// Interfaz para crear un nuevo registro de evento
type ICreateEventRegistrationDto = {
	event_id: number;
	user_id: number;
};

// Interfaz para actualizar el estado de un registro
type IUpdateEventRegistrationDto = {
	status: 'confirmed' | 'cancelled' | 'attended';
};

export type { 
	IEventRegistrationDto, 
	IPaginatedEventRegistrationsResponse, 
	ICreateEventRegistrationDto,
	IUpdateEventRegistrationDto 
};
