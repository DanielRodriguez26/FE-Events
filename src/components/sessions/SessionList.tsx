import React from 'react';
import type { ISessionDto } from '@/domain/session/session.interface';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface SessionListProps {
	sessions: ISessionDto[];
	isOrganizer?: boolean;
	onEdit: (session: ISessionDto) => void;
	onDelete: (sessionId: number) => Promise<void>;
}

const SessionList: React.FC<SessionListProps> = ({ sessions, onEdit, onDelete }) => {
	return (
		<div className='space-y-4'>
			{sessions.length > 0 ? (
				sessions.map(session => (
					<div key={session.id} className='bg-white rounded-lg shadow-sm border p-6'>
						<div className='flex items-start justify-between'>
							<div className='flex-1'>
								<h4 className='text-lg font-medium text-gray-900'>{session.title}</h4>
								{/* Detalles de la sesión y disponibilidad */}
							</div>

							<div className='flex space-x-2 ml-4'>
								<button
									onClick={() => onEdit(session)}
									className='p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors'>
									{/* Icono de editar */} <FaEdit />
								</button>
								<button
									onClick={() => onDelete(session.id)}
									className='p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors'>
									{/* Icono de eliminar */} <FaTrash />
								</button>
							</div>
						</div>
					</div>
				))
			) : (
				<div className='text-center py-8'>{/* Mensaje de no hay sesiones */}</div>
			)}
		</div>
	);
};

export default SessionList;
