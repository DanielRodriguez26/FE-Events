// Exportar todos los adaptadores de infraestructura
export type { IHttpClient } from './IHttpClient';
export { AxiosHttpClient } from './AxiosHttpClient';
export type { IEventRepository } from '../../domain/ports/IEventRepository';
export { EventRepository } from './EventRepository';
export type { IAuthRepository } from '../../domain/ports/IAuthRepository';
export { AuthRepository } from './AuthRepository';
export type { ISessionRepository } from '../../domain/ports/ISessionRepository';
export { SessionRepository } from './SessionRepository';