import React, { useState } from 'react';

interface Attendee {
	id: number;
	name: string;
	email: string;
	phone: string;
	registration_date: string;
	status: 'registered' | 'confirmed' | 'cancelled' | 'attended';
	dietary_restrictions?: string;
	special_requirements?: string;
}

interface AttendeesListProps {
	attendees: Attendee[];
	totalCapacity: number;
	isOrganizer?: boolean;
	onStatusChange?: (attendeeId: number, newStatus: Attendee['status']) => void;
	onExport?: () => void;
	isLoading?: boolean;
}

const AttendeesList: React.FC<AttendeesListProps> = ({
	attendees,
	totalCapacity,
	isOrganizer = false,
	onStatusChange,
	onExport,
	isLoading = false,
}) => {
	const [selectedStatus, setSelectedStatus] = useState<string>('all');
	const [searchTerm, setSearchTerm] = useState('');

	const filteredAttendees = attendees.filter(attendee => {
		const matchesStatus = selectedStatus === 'all' || attendee.status === selectedStatus;
		const matchesSearch =
			attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
			attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
		return matchesStatus && matchesSearch;
	});

	const getStatusColor = (status: Attendee['status']) => {
		switch (status) {
			case 'registered':
				return 'bg-blue-100 text-blue-800';
			case 'confirmed':
				return 'bg-green-100 text-green-800';
			case 'cancelled':
				return 'bg-red-100 text-red-800';
			case 'attended':
				return 'bg-purple-100 text-purple-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getStatusText = (status: Attendee['status']) => {
		switch (status) {
			case 'registered':
				return 'Inscrito';
			case 'confirmed':
				return 'Confirmado';
			case 'cancelled':
				return 'Cancelado';
			case 'attended':
				return 'Asistió';
			default:
				return 'Desconocido';
		}
	};

	const getAttendancePercentage = () => {
		return Math.round((attendees.length / totalCapacity) * 100);
	};

	const getAttendanceColor = () => {
		const percentage = getAttendancePercentage();
		if (percentage >= 90) return 'text-red-600';
		if (percentage >= 75) return 'text-yellow-600';
		return 'text-green-600';
	};

	return (
		<div className='bg-white rounded-lg shadow-sm'>
			{/* Header */}
			<div className='px-6 py-4 border-b border-gray-200'>
				<div className='flex items-center justify-between'>
					<div>
						<h3 className='text-lg font-semibold text-gray-900'>Asistentes</h3>
						<p className='text-sm text-gray-600'>
							{attendees.length} de {totalCapacity} cupos ocupados
							<span className={`ml-2 font-medium ${getAttendanceColor()}`}>({getAttendancePercentage()}%)</span>
						</p>
					</div>
					<button
						onClick={onExport}
						disabled={isLoading}
						className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50'>
						Exportar Lista
					</button>
				</div>
			</div>

			{/* Filtros */}
			<div className='px-6 py-4 border-b border-gray-200 bg-gray-50'>
				<div className='flex flex-col md:flex-row gap-4'>
					<div className='flex-1'>
						<input
							type='text'
							placeholder='Buscar por nombre o email...'
							value={searchTerm}
							onChange={e => setSearchTerm(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</div>
					<div className='md:w-48'>
						<select
							value={selectedStatus}
							onChange={e => setSelectedStatus(e.target.value)}
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
							<option value='all'>Todos los estados</option>
							<option value='registered'>Inscritos</option>
							<option value='confirmed'>Confirmados</option>
							<option value='cancelled'>Cancelados</option>
							<option value='attended'>Asistieron</option>
						</select>
					</div>
				</div>
			</div>

			{/* Lista de asistentes */}
			<div className='overflow-x-auto'>
				<table className='min-w-full divide-y divide-gray-200'>
					<thead className='bg-gray-50'>
						<tr>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Asistente
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Contacto
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Fecha de Registro
							</th>
							<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
								Estado
							</th>
							{isOrganizer && (
								<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
									Acciones
								</th>
							)}
						</tr>
					</thead>
					<tbody className='bg-white divide-y divide-gray-200'>
						{filteredAttendees.length === 0 ? (
							<tr>
								<td colSpan={isOrganizer ? 5 : 4} className='px-6 py-4 text-center text-gray-500'>
									{searchTerm || selectedStatus !== 'all'
										? 'No se encontraron asistentes con los filtros aplicados'
										: 'No hay asistentes registrados aún'}
								</td>
							</tr>
						) : (
							filteredAttendees.map(attendee => (
								<tr key={attendee.id} className='hover:bg-gray-50'>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div>
											<div className='text-sm font-medium text-gray-900'>{attendee.name}</div>
											{(attendee.dietary_restrictions || attendee.special_requirements) && (
												<div className='text-xs text-gray-500 mt-1'>
													{attendee.dietary_restrictions && (
														<span className='inline-block bg-yellow-100 text-yellow-800 px-2 py-1 rounded mr-1'>
															{attendee.dietary_restrictions}
														</span>
													)}
													{attendee.special_requirements && (
														<span className='inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded'>
															Requerimientos especiales
														</span>
													)}
												</div>
											)}
										</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<div className='text-sm text-gray-900'>{attendee.email}</div>
										<div className='text-sm text-gray-500'>{attendee.phone}</div>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
										{new Date(attendee.registration_date).toLocaleDateString()}
									</td>
									<td className='px-6 py-4 whitespace-nowrap'>
										<span
											className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
												attendee.status
											)}`}>
											{getStatusText(attendee.status)}
										</span>
									</td>
									<td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
										<select
											value={attendee.status}
											onChange={e => onStatusChange?.(attendee.id, e.target.value as Attendee['status'])}
											disabled={isLoading}
											className='text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'>
											<option value='registered'>Inscrito</option>
											<option value='confirmed'>Confirmado</option>
											<option value='cancelled'>Cancelado</option>
											<option value='attended'>Asistió</option>
										</select>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Footer con estadísticas */}
			<div className='px-6 py-4 border-t border-gray-200 bg-gray-50'>
				<div className='flex justify-between items-center text-sm text-gray-600'>
					<span>
						Mostrando {filteredAttendees.length} de {attendees.length} asistentes
					</span>
					<div className='flex space-x-4'>
						<span>Inscritos: {attendees.filter(a => a.status === 'registered').length}</span>
						<span>Confirmados: {attendees.filter(a => a.status === 'confirmed').length}</span>
						<span>Asistieron: {attendees.filter(a => a.status === 'attended').length}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AttendeesList;
