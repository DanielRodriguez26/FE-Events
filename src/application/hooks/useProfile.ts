import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '@infrastructure/store/store';
import type { IEventRegistrationDto } from '@/domain/event-registration/event-registration.interface';

// Reutilizamos la interfaz que ya tenías definida
export interface UserEvent {
	id: number;
	title: string;
	start_date: string;
	location: string;
	status: 'registered' | 'attended' | 'cancelled';
	participants?: number;
	registration_date?: string;
}

export interface IRegistrationDto {
	id: number;
	event_id: number;
	event_title: string;
	event_date: string;
	event_location: string;
	number_of_participants: number;
	created_at: string;
	status: string;
}

export const useProfile = () => {
	const navigate = useNavigate();
	const { user, token, isAuthenticated, myregistrations, setMyRegistrations } = useStore();

	const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
	const [loading, setLoading] = useState(true); // Iniciar en true para la carga inicial
	const [error, setError] = useState<string | null>(null);

	const loadUserEvents = useCallback(async () => {
		// Verificar autenticación antes de cargar
		if (!isAuthenticated || !token) {
			navigate('/login');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			// La acción setMyRegistrations ya debería obtener y actualizar el store
			await setMyRegistrations();

			// Obtenemos los datos actualizados del store directamente después de la llamada
			const updatedRegistrations = useStore.getState().myregistrations;

			if (updatedRegistrations && Array.isArray(updatedRegistrations.items)) {
				const mappedEvents: UserEvent[] = updatedRegistrations.items.map((reg: IEventRegistrationDto) => ({
					id: reg.event_id,
					title: reg.title || 'Evento sin título',
					start_date: reg.date,
					location: reg.location || 'Ubicación no especificada',
					status: reg.status as 'registered' | 'attended' | 'cancelled', // Asumimos 'registered' por ahora
					participants: reg.number_of_participants,
					registration_date: reg.created_at,
				}));
				setUserEvents(mappedEvents);
			} else {
				setUserEvents([]);
			}
		} catch (err) {
			setError('Error al cargar los eventos del usuario');
			console.error('Error loading user events:', err);
		} finally {
			setLoading(false);
		}
	}, [isAuthenticated, token, navigate, setMyRegistrations]);

	useEffect(() => {
		// Cargar los eventos solo una vez al montar el componente
		loadUserEvents();
	}, []); // loadUserEvents está memoizada con useCallback

	return { user, userEvents, loading, error, myregistrations };
};
