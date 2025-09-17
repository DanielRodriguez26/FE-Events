import { useState, useEffect, useCallback } from 'react';
import useStore from '@infrastructure/store/store';
import { useSessions } from './useSessions';
import { useError } from './useError';
import { TimeValidator, type TimeValidationResult } from '@/utils/timeValidation';
import type { ISessionDto, ISessionCreateDto, ISessionUpdateDto } from '@/domain/session/session.interface';

export const useSessionManager = (eventId: number, propSessions: ISessionDto[] | undefined) => {
	const { speaker: storeSpeakers, setSpeaker } = useStore();
	const { error, clearError, handleError } = useError();
	const {
		sessionsByEvent,
		loading: sessionsLoading,
		loadSessionsByEvent,
		createEventSession,
		updateSession: updateSessionAction,
		deleteSession: deleteSessionAction,
	} = useSessions();

	// Local sessions state for optimistic updates
	const [localSessions, setLocalSessions] = useState<ISessionDto[]>([]);

	// Use local sessions if available, otherwise fall back to store sessions
	const sessions = localSessions.length > 0 ? localSessions : sessionsByEvent?.items || propSessions || [];
	const speakers = storeSpeakers;

	const [showCreateForm, setShowCreateForm] = useState(false);
	const [editingSession, setEditingSession] = useState<ISessionDto | null>(null);
	const [formData, setFormData] = useState({
		title: '',
		description: '',
		start_time: '',
		end_time: '',
		speaker: '',
		room: '',
		capacity: 50,
		event_id: eventId,
		speaker_id: 0,
	});
	const [timeValidation, setTimeValidation] = useState<TimeValidationResult | null>(null);

	// Memoize handlers to avoid re-creation
	const handleInputChange = useCallback(
		(field: string, value: string | number) => {
			setFormData(prev => ({ ...prev, [field]: value }));

			// Update validation logic to use the new state correctly
			if (field === 'start_time' || field === 'end_time') {
				const tempFormData = { ...formData, [field]: value };
				if (tempFormData.start_time && tempFormData.end_time) {
					const validation = TimeValidator.validateSessionTimes(
						{
							start_time: tempFormData.start_time,
							end_time: tempFormData.end_time,
						},
						sessions || []
					);
					setTimeValidation(validation);
				}
			}
		},
		[sessions, formData]
	);

	const handleSubmit = useCallback(
		async (e: React.FormEvent) => {
			e.preventDefault();
			try {
				const createData: ISessionCreateDto = {
					title: formData.title,
					description: formData.description || undefined,
					start_time: formData.start_time,
					end_time: formData.end_time,
					capacity: formData.capacity,
					speaker_id: formData.speaker_id,
					event_id: eventId,
				};

				let success = false;

				if (editingSession) {
					const updateData: ISessionUpdateDto = {
						title: formData.title,
						description: formData.description || undefined,
						start_time: formData.start_time,
						end_time: formData.end_time,
						capacity: formData.capacity,
					};
					success = await updateSessionAction(editingSession.id, updateData);
					if (success && success.statusCode !== 400) {
						// Update local session
						setLocalSessions(prev =>
							prev.map(session => (session.id === editingSession.id ? { ...session, ...updateData } : session))
						);
						setEditingSession(null);
						//que recargue la pagina
					} else {
						handleError(success, 'SessionManager - handleSubmit');
					}
				} else {
					success = await createEventSession(createData);
					console.log('success', success);
					if (success && success.statusCode !== 400) {
						// Create a temporary session object for optimistic update
						const tempSession: ISessionDto = {
							id: Date.now(), // Temporary ID
							title: formData.title,
							description: formData.description || null,
							start_time: formData.start_time,
							end_time: formData.end_time,
							capacity: formData.capacity,
							event_id: eventId,
							speaker_id: formData.speaker_id,
							is_active: true,
							created_at: new Date().toISOString(),
							updated_at: null,
							speaker: speakers?.find(s => s.id === formData.speaker_id)
								? {
										id: formData.speaker_id,
										name: speakers.find(s => s.id === formData.speaker_id)?.name || '',
										email: '',
										bio: '',
										expertise: [],
								  }
								: undefined,
						};

						// Add to local sessions immediately
						setLocalSessions(prev => [...prev, tempSession]);
					} else {
						handleError(success, 'SessionManager - handleSubmit');
					}
				}

				if (success) {
					setFormData({
						title: '',
						description: '',
						start_time: '',
						end_time: '',
						speaker: '',
						room: '',
						capacity: 50,
						event_id: eventId,
						speaker_id: 0,
					});
					setShowCreateForm(false);
					setTimeValidation(null);
				}
			} catch (error) {
				handleError(error, 'SessionManager - handleSubmit');
			}
		},
		[formData, editingSession, eventId, createEventSession, updateSessionAction, speakers]
	);

	const handleEdit = useCallback((session: ISessionDto) => {
		setEditingSession(session);
		setFormData({
			title: session.title,
			description: session.description || '',
			start_time: session.start_time.slice(0, 16),
			end_time: session.end_time.slice(0, 16),
			speaker: session.speaker?.name || '',
			room: '1',
			capacity: session.capacity || 50,
			event_id: eventId,
			speaker_id: session.speaker_id || 0,
		});
		setShowCreateForm(true);
	}, []);

	const handleCancel = useCallback(() => {
		setShowCreateForm(false);
		setEditingSession(null);
		setFormData({
			title: '',
			description: '',
			start_time: '',
			end_time: '',
			speaker: '',
			room: '',
			capacity: 50,
			event_id: eventId,
			speaker_id: 0,
		});
		setTimeValidation(null);
	}, []);

	const handleDelete = useCallback(
		async (sessionId: number) => {
			try {
				const success = await deleteSessionAction(sessionId);
				if (success && success.statusCode !== 400) {
					// Remove from local sessions immediately
					setLocalSessions(prev => prev.filter(session => session.id !== sessionId));
					//que recargue la pagina
					window.location.reload();
				} else {
					handleError(success, 'SessionManager - handleDelete');
				}
			} catch (error) {
				handleError(error, 'SessionManager - handleDelete');
			}
		},
		[deleteSessionAction, handleError]
	);

	useEffect(() => {
		if (eventId) {
			loadSessionsByEvent(eventId);
		}
	}, [eventId, loadSessionsByEvent]);

	// Initialize local sessions when sessionsByEvent changes
	useEffect(() => {
		if (sessionsByEvent?.items && sessionsByEvent.items.length > 0) {
			setLocalSessions(sessionsByEvent.items);
		}
	}, [sessionsByEvent]);

	useEffect(() => {
		// Cargar todos los ponentes al montar el hook
		setSpeaker();
	}, [setSpeaker]);

	// Expose all necessary state and handlers
	return {
		sessions,
		speakers,
		isLoading: sessionsLoading,
		error,
		clearError,
		showCreateForm,
		setShowCreateForm,
		editingSession,
		formData,
		timeValidation,
		handleInputChange,
		handleSubmit,
		handleEdit,
		handleCancel,
		handleDelete,
		deleteSessionAction,
		loadSessionsByEvent,
	};
};
