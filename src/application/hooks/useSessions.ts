import { useState, useCallback } from 'react';
import useStore from '@infrastructure/store/store';
import type {
	ISessionDto,
	ISessionCreateDto,
	ISessionUpdateDto,
	IPaginatedSessionsResponse,
} from '@/domain/session/session.interface';

interface UseSessionsReturn {
	sessions: ISessionDto[] | null;
	currentSession: ISessionDto | null;
	sessionsByEvent: IPaginatedSessionsResponse | null;
	loading: boolean;
	error: string | null;
	loadSessions: (page?: number, size?: number) => Promise<void>;
	loadSessionsByEvent: (eventId: number, page?: number, size?: number) => Promise<void>;
	loadSessionById: (sessionId: number) => Promise<void>;
	createSession: (sessionData: ISessionCreateDto) => Promise<boolean>;
	updateSession: (sessionId: number, sessionData: ISessionUpdateDto) => Promise<boolean>;
	deleteSession: (sessionId: number) => Promise<boolean>;
	createEventSession: (sessionData: Omit<ISessionCreateDto, 'event_id'>) => Promise<boolean>;
	clearError: () => void;
}

export const useSessions = (): UseSessionsReturn => {
	const {
		sessions,
		currentSession,
		sessionsByEvent,
		isLoading,
		error,
		setSessions,
		setSessionsByEvent,
		setSessionById,
		createSession: createSessionAction,
		updateSession: updateSessionAction,
		deleteSession: deleteSessionAction,
		createEventSession: createEventSessionAction,
		clearError,
	} = useStore();

	const [localLoading, setLocalLoading] = useState(false);

	const loadSessions = useCallback(
		async (page: number = 1, size: number = 20) => {
			setLocalLoading(true);
			try {
				await setSessions(page, size);
			} catch (err) {
				console.error('Error loading sessions:', err);
			} finally {
				setLocalLoading(false);
			}
		},
		[setSessions]
	);

	const loadSessionsByEvent = useCallback(
		async (eventId: number, page: number = 1, size: number = 20) => {
			setLocalLoading(true);
			try {
				await setSessionsByEvent(eventId, page, size);
			} catch (err) {
				console.error('Error loading sessions by event:', err);
			} finally {
				setLocalLoading(false);
			}
		},
		[setSessionsByEvent]
	);

	const loadSessionById = useCallback(
		async (sessionId: number) => {
			setLocalLoading(true);
			try {
				await setSessionById(sessionId);
			} catch (err) {
				console.error('Error loading session by ID:', err);
			} finally {
				setLocalLoading(false);
			}
		},
		[setSessionById]
	);

	const createSession = useCallback(
		async (sessionData: ISessionCreateDto) => {
			setLocalLoading(true);
			try {
				const success = await createSessionAction(sessionData);
				return success;
			} catch (err) {
				console.error('Error creating session:', err);
				return false;
			} finally {
				setLocalLoading(false);
			}
		},
		[createSessionAction]
	);

	const updateSession = useCallback(
		async (sessionId: number, sessionData: ISessionUpdateDto) => {
			setLocalLoading(true);
			try {
				const success = await updateSessionAction(sessionId, sessionData);
				return success;
			} catch (err) {
				console.error('Error updating session:', err);
				return err;
			} finally {
				setLocalLoading(false);
			}
		},
		[updateSessionAction]
	);

	const deleteSession = useCallback(
		async (sessionId: number) => {
			setLocalLoading(true);
			try {
				const success = await deleteSessionAction(sessionId);
				return success;
			} catch (err) {
				console.error('Error deleting session:', err);
				return err;
			} finally {
				setLocalLoading(false);
			}
		},
		[deleteSessionAction]
	);

	const createEventSession = useCallback(
		async (eventId: number, sessionData: Omit<ISessionCreateDto, 'event_id'>) => {
			setLocalLoading(true);
			try {
				const success = await createEventSessionAction(eventId, sessionData);
				return success;
			} catch (err) {
				console.log('Error creating event session:', err.originalError.detail);
				return err;
			} finally {
				setLocalLoading(false);
			}
		},
		[createEventSessionAction]
	);

	return {
		sessions,
		currentSession,
		sessionsByEvent,
		loading: isLoading || localLoading,
		error,
		loadSessions,
		loadSessionsByEvent,
		loadSessionById,
		createSession,
		updateSession,
		deleteSession,
		createEventSession,
		clearError,
	};
};
