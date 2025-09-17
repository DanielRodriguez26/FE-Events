import { useNavigate } from 'react-router-dom';
import type { IEventRegistrationDto } from '@/domain/event-registration/event-registration.interface';

// Las funciones de utilidad pueden vivir aquí, ya que son específicas de este componente
const getStatusColor = (status: string) => {
	switch (status) {
		case 'registered':
			return 'bg-blue-100 text-blue-800';
		case 'attended':
			return 'bg-green-100 text-green-800';
		case 'cancelled':
			return 'bg-red-100 text-red-800';
		default:
			return 'bg-gray-100 text-gray-800';
	}
};

const getStatusText = (status: string) => {
	switch (status) {
		case 'registered':
			return 'Inscrito';
		case 'attended':
			return 'Asistió';
		case 'cancelled':
			return 'Cancelado';
		default:
			return 'Desconocido';
	}
};

interface EventListItemProps {
	event: IEventRegistrationDto;
}

const EventListItem: React.FC<EventListItemProps> = ({ event }) => {
	const navigate = useNavigate();

	return (
		<div key={event.id} className='p-6 hover:bg-gray-50 transition-colors'>
			<div className='flex items-center justify-between'>
				<div className='flex-1'>
					<h3 className='text-lg font-medium text-gray-900'>{event.title}</h3>
					<div className='mt-2 flex items-center text-sm text-gray-500'>
						<svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
							/>
						</svg>
						{new Date(event.start_date).toLocaleDateString()} - {new Date(event.start_date).toLocaleTimeString()}
					</div>
					<div className='mt-1 flex items-center text-sm text-gray-500'>
						<svg className='w-4 h-4 mr-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
							/>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
							/>
						</svg>
						{event.location}
					</div>
				</div>
				<div className='ml-4'>
					<span
						className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
							event.status
						)}`}>
						{getStatusText(event.status)}
					</span>
				</div>
			</div>
			<div className='mt-4 flex gap-2'>
				<button
					onClick={() => navigate(`/event/${event.id}`)}
					className='text-blue-600 hover:text-blue-800 text-sm font-medium'>
					Ver Detalles
				</button>
				{event.status === 'registered' && (
					<button
						onClick={() => navigate(`/events/register/${event.id}`)}
						className='text-green-600 hover:text-green-800 text-sm font-medium'>
						Gestionar Inscripción
					</button>
				)}
			</div>
		</div>
	);
};

export default EventListItem;
