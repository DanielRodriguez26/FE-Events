import type { ISessionRepository } from '../ports/ISessionRepository';
import type {
    ISessionDto,
    ISessionCreateDto,
    ISessionUpdateDto,
} from './session.interface';

// Servicio de dominio para la lógica de negocio de sesiones
// Depende de la abstracción ISessionRepository en lugar de detalles de infraestructura
class SessionService {
	constructor(private sessionRepository: ISessionRepository) {}

	// Obtener todas las sesiones (este método podría no ser necesario si no se usa)
	// async getAllSessions(page: number = 1, size: number = 20): Promise<IPaginatedSessionsResponse> {
	// 	// Nota: Este método no está implementado en el repositorio actual
	// 	// Podría necesitar agregarse si es requerido
	// 	throw new Error('getAllSessions not implemented');
	// }

	// Obtener sesiones por evento
	async getSessionsByEvent(eventId: number): Promise<ISessionDto[]> {
		try {
			const result = await this.sessionRepository.getSessionsByEvent(eventId);
			console.log('✅ Sesiones del evento cargadas exitosamente:', result);
			return result;
		} catch (error) {
			console.error('❌ Error al cargar sesiones del evento:', error);
			throw error;
		}
	}

	// Obtener sesión por ID
	async getSessionById(sessionId: number): Promise<ISessionDto> {
		try {
			const result = await this.sessionRepository.getSessionById(sessionId);
			console.log('✅ Sesión cargada exitosamente:', result);
			return result;
		} catch (error) {
			console.error('❌ Error al cargar sesión:', error);
			throw error;
		}
	}

	// Crear nueva sesión
	async createSession(sessionData: ISessionCreateDto): Promise<ISessionDto> {
		try {
			const result = await this.sessionRepository.createSession(sessionData);
			console.log('✅ Sesión creada exitosamente:', result);
			return result;
		} catch (error) {
			console.error('❌ Error al crear sesión:', error);
			throw error;
		}
	}

	// Actualizar sesión
	async updateSession(sessionId: number, sessionData: ISessionUpdateDto): Promise<ISessionDto> {
		try {
			const result = await this.sessionRepository.updateSession(sessionId, sessionData);
			console.log('✅ Sesión actualizada exitosamente:', result);
			return result;
		} catch (error) {
			console.error('❌ Error al actualizar sesión:', error);
			throw error;
		}
	}

	// Eliminar sesión
	async deleteSession(sessionId: number): Promise<void> {
		try {
			await this.sessionRepository.deleteSession(sessionId);
			console.log('✅ Sesión eliminada exitosamente');
		} catch (error) {
			console.error('❌ Error al eliminar sesión:', error);
			throw error;
		}
	}

	// Crear sesión para un evento específico
	async createEventSession(sessionData: ISessionCreateDto): Promise<ISessionDto> {
		try {
			const result = await this.sessionRepository.createSession(sessionData);
			console.log('✅ Sesión para evento creada exitosamente:', result);
			return result;
		} catch (error) {
			console.error('❌ Error al crear sesión para el evento:', error);
			throw error;
		}
	}
}

// Factory function para crear instancia del servicio con dependencias
const createSessionService = (sessionRepository: ISessionRepository): SessionService => {
	return new SessionService(sessionRepository);
};

// Funciones de compatibilidad para mantener la API existente durante la migración
let _sessionService: SessionService | null = null;

const initializeSessionService = (sessionRepository: ISessionRepository) => {
	_sessionService = createSessionService(sessionRepository);
};

// const getAllSessions = async (page: number = 1, size: number = 20): Promise<IPaginatedSessionsResponse> => {
// 	if (!_sessionService) throw new Error('SessionService not initialized');
// 	return _sessionService.getAllSessions(page, size);
// };

const getSessionsByEvent = async (eventId: number): Promise<ISessionDto[]> => {
	if (!_sessionService) throw new Error('SessionService not initialized');
	return _sessionService.getSessionsByEvent(eventId);
};

const getSessionById = async (sessionId: number): Promise<ISessionDto> => {
	if (!_sessionService) throw new Error('SessionService not initialized');
	return _sessionService.getSessionById(sessionId);
};

const createSession = async (sessionData: ISessionCreateDto): Promise<ISessionDto> => {
	if (!_sessionService) throw new Error('SessionService not initialized');
	return _sessionService.createSession(sessionData);
};

const updateSession = async (sessionId: number, sessionData: ISessionUpdateDto): Promise<ISessionDto> => {
	if (!_sessionService) throw new Error('SessionService not initialized');
	return _sessionService.updateSession(sessionId, sessionData);
};

const deleteSession = async (sessionId: number): Promise<void> => {
	if (!_sessionService) throw new Error('SessionService not initialized');
	return _sessionService.deleteSession(sessionId);
};

const createEventSession = async (sessionData: ISessionCreateDto): Promise<ISessionDto> => {
	if (!_sessionService) throw new Error('SessionService not initialized');
	return _sessionService.createEventSession(sessionData);
};

const sessionServices = {
    getSessionsByEvent,
    getSessionById,
    createSession,
    updateSession,
    deleteSession,
    createEventSession,
};

export { SessionService, createSessionService, initializeSessionService, sessionServices };

