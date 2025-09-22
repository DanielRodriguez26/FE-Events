import type {
	ISessionDto,
	ISessionCreateDto,
	ISessionUpdateDto,
} from '../session/session.interface';

// Puerto para el repositorio de sesiones
// Define el contrato que debe implementar cualquier adaptador de persistencia de sesiones
export interface ISessionRepository {
	// Obtener todas las sesiones de un evento
	getSessionsByEvent(eventId: number): Promise<ISessionDto[]>;

	// Obtener una sesión por ID
	getSessionById(sessionId: number): Promise<ISessionDto>;

	// Crear una nueva sesión
	createSession(sessionData: ISessionCreateDto): Promise<ISessionDto>;

	// Actualizar una sesión existente
	updateSession(sessionId: number, sessionData: ISessionUpdateDto): Promise<ISessionDto>;

	// Eliminar una sesión
	deleteSession(sessionId: number): Promise<void>;
}