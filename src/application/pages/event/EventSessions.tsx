import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/application/layout/Layout';
import useStore from '@store/store';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';

interface Session {
	id: number;
	title: string;
	description: string;
	start_time: string;
	end_time: string;
	speaker: string;
	room: string;
	capacity: number;
	registered_attendees: number;
}

const EventSessions: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const { eventById, setEventById } = useStore();
	const [sessions, setSessions] = useState<Session[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (id) {
			setEventById(parseInt(id));
			loadSessions();
		}
	}, [id, setEventById]);

	const loadSessions = async () => {
		if (!id) return;
		
		setLoading(true);
		setError(null);

		try {
			// Llamada real a la API para obtener sesiones del evento
			const { setSessionsByEvent } = useStore.getState();
			await setSessionsByEvent(parseInt(id));
			
			// Obtener las sesiones del store
			const { sessionsByEvent } = useStore.getState();
			
			if (sessionsByEvent && sessionsByEvent.items) {
				// Convertir sesiones de la API al formato local
				const sessionsFromAPI: Session[] = sessionsByEvent.items.map((session: any) => ({
					id: session.id,
					title: session.title,
					description: session.description || 'Sin descripción',
					start_time: session.start_time,
					end_time: session.end_time,
					speaker: session.speaker?.name || 'Ponente por confirmar',
					room: session.room || 'Sala por asignar',
					capacity: session.capacity || 0,
					registered_attendees: session.registered_attendees || 0,
				}));
				
				setSessions(sessionsFromAPI);
			} else {
				setSessions([]);
			}
		} catch (err) {
			setError('Error al cargar las sesiones del evento');
			console.error('Error loading sessions:', err);
		} finally {
			setLoading(false);
		}
	};

	const handleSessionClick = (session: Session) => {
		navigate(`/events/session/${id}/detail/${session.id}`);
	};

	// const handleRegisterSession = (_session: Session) => {
	// 	// Implementar registro a sesión
	// };

	const getAvailabilityColor = (registered: number, capacity: number) => {
		const percentage = (registered / capacity) * 100;
		if (percentage >= 90) return 'text-red-600';
		if (percentage >= 75) return 'text-yellow-600';
		return 'text-green-600';
	};

	const getAvailabilityText = (registered: number, capacity: number) => {
		const percentage = (registered / capacity) * 100;
		if (percentage >= 90) return 'Casi lleno';
		if (percentage >= 75) return 'Pocos cupos';
		return 'Disponible';
	};

	if (loading) {
		return (
			<Layout>
				<Loading />
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout>
				<ErrorMessage error={error} />
			</Layout>
		);
	}

	return (
		<Layout>
			<div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				{/* Header */}
				<div className='mb-8'>
					<button
						onClick={() => navigate(`/event/${id}`)}
						className='mb-4 flex items-center text-blue-600 hover:text-blue-800 transition-colors'>
						<svg className='w-5 h-5 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
						</svg>
						Volver al evento
					</button>

					<div className='bg-white rounded-lg shadow-lg p-6'>
						<h1 className='text-3xl font-bold text-gray-900 mb-2'>Sesiones - {eventById?.title || 'Evento'}</h1>
						<p className='text-gray-600'>{eventById?.description || 'Descripción del evento'}</p>
						<div className='mt-4 flex items-center text-sm text-gray-500'>
							<svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
								/>
							</svg>
							{eventById?.start_date && new Date(eventById.start_date).toLocaleDateString()}
						</div>
					</div>
				</div>

				{/* Lista de sesiones */}
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
					{sessions.map(session => (
						<div
							key={session.id}
							className='bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow'>
							<div className='p-6'>
								<div className='flex justify-between items-start mb-4'>
									<h3 className='text-xl font-semibold text-gray-900'>{session.title}</h3>
									<span
										className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(
											session.registered_attendees,
											session.capacity
										)}`}>
										{getAvailabilityText(session.registered_attendees, session.capacity)}
									</span>
								</div>

								<p className='text-gray-600 mb-4'>{session.description}</p>

								<div className='space-y-3 mb-4'>
									<div className='flex items-center text-sm text-gray-500'>
										<svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
											/>
										</svg>
										{new Date(session.start_time).toLocaleTimeString()} -{' '}
										{new Date(session.end_time).toLocaleTimeString()}
									</div>

									<div className='flex items-center text-sm text-gray-500'>
										<svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
											/>
										</svg>
										{session.speaker}
									</div>

									<div className='flex items-center text-sm text-gray-500'>
										<svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4'
											/>
										</svg>
										{session.room}
									</div>

									<div className='flex items-center text-sm text-gray-500'>
										<svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
											/>
										</svg>
										{session.registered_attendees}/{session.capacity} asistentes
									</div>
								</div>

								<div className='flex gap-3'>
									<button
										onClick={() => handleSessionClick(session)}
										className='flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium'>
										Ver Detalles
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{sessions.length === 0 && (
					<div className='text-center py-12'>
						<svg
							className='w-16 h-16 text-gray-400 mx-auto mb-4'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
							/>
						</svg>
						<h3 className='text-lg font-medium text-gray-900 mb-2'>No hay sesiones disponibles</h3>
						<p className='text-gray-500'>Las sesiones para este evento aún no han sido programadas.</p>
					</div>
				)}
			</div>
		</Layout>
	);
};

export default EventSessions;
