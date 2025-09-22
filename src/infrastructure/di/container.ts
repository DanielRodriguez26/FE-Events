import { AxiosHttpClient } from '../adapters/AxiosHttpClient';
import { EventRepository } from '../adapters/EventRepository';
import { AuthRepository } from '../adapters/AuthRepository';
import { SessionRepository } from '../adapters/SessionRepository';

// Contenedor de inyección de dependencias
// Centraliza la creación de instancias y dependencias
class DIContainer {
	private static instance: DIContainer;
	private httpClient = new AxiosHttpClient();

	// Repositories
	private _eventRepository?: EventRepository;
	private _authRepository?: AuthRepository;
	private _sessionRepository?: SessionRepository;

	static getInstance(): DIContainer {
		if (!DIContainer.instance) {
			DIContainer.instance = new DIContainer();
		}
		return DIContainer.instance;
	}

	// Getters para repositories
	get eventRepository(): EventRepository {
		if (!this._eventRepository) {
			this._eventRepository = new EventRepository(this.httpClient);
		}
		return this._eventRepository;
	}

	get authRepository(): AuthRepository {
		if (!this._authRepository) {
			this._authRepository = new AuthRepository(this.httpClient);
		}
		return this._authRepository;
	}

	get sessionRepository(): SessionRepository {
		if (!this._sessionRepository) {
			this._sessionRepository = new SessionRepository(this.httpClient);
		}
		return this._sessionRepository;
	}
}

// Instancia global del contenedor
const diContainer = DIContainer.getInstance();

export { diContainer };
export type { DIContainer };