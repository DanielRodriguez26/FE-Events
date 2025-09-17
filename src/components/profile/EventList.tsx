import { useNavigate } from 'react-router-dom';
import type { IEventRegistrationDto } from '@/domain/event-registration/event-registration.interface';
import EventListItem from './EventListItem';

interface EventListProps {
	events: IEventRegistrationDto[];
}

const EventList: React.FC<EventListProps> = ({ events }) => {
	const navigate = useNavigate();

	if (events.length === 0) {
		return (
			<div className='p-6 text-center'>
				<svg className='w-12 h-12 text-gray-400 mx-auto mb-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
					/>
				</svg>
				<p className='text-gray-500'>No tienes eventos registrados</p>
				<button
					onClick={() => navigate('/events')}
					className='mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors'>
					Explorar Eventos
				</button>
			</div>
		);
	}

	return (
		<div className='divide-y divide-gray-200'>
			{events.map(event => (
				<EventListItem key={event.id} event={event} />
			))}
		</div>
	);
};

export default EventList;
