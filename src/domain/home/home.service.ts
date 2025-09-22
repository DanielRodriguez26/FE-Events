import type { IEventRepository } from '../ports/IEventRepository';
import type { IPaginatedEventsResponse, IEventFilter } from '../event/event.interface';

// Servicio de dominio para la lógica de negocio de la página principal
// Depende de la abstracción IEventRepository en lugar de detalles de infraestructura
class HomeService {
	constructor(private eventRepository: IEventRepository) {}

	// Función para obtener todos los eventos desde el repositorio
	// Retorna una promesa con la respuesta paginada de eventos
	async getAllEvents(page: number = 1, size: number = 6, filters?: IEventFilter): Promise<IPaginatedEventsResponse> {
		console.log('🔍 Intentando cargar eventos desde repositorio - página:', page, 'tamaño:', size);

		try {
			// Utiliza el repositorio abstracto en lugar de llamadas HTTP directas
			const result = filters
				? await this.eventRepository.getEventsWithFilters(page, size, filters)
				: await this.eventRepository.getAllEvents(page, size);
			console.log('✅ Eventos cargados exitosamente:', result);
			return result;
		} catch (error) {
			console.error('❌ Error al cargar eventos:', error);
			throw error;
		}
	}
}

// Factory function para crear instancia del servicio con dependencias
const createHomeService = (eventRepository: IEventRepository): HomeService => {
	return new HomeService(eventRepository);
};

export { HomeService, createHomeService };
