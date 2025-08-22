import React from 'react';
import type { IEventDto } from '@domain/home/home.interface';
import Paginator from '@/components/paginator';
import Loading from '../ui/Loading';
import EventEmpty from '../ui/EventEmpty';
import LoadingError from '../ui/LoadingError';
import { FaArrowRightToBracket, FaTrash } from 'react-icons/fa6';

// Interfaz para las propiedades del componente Table
// Sigue el principio de Interface Segregation (I de SOLID)
interface TableProps {
	events: IEventDto[] | null;
	onEventClick?: (event: IEventDto) => void;
	onDeleteClick?: (event: IEventDto) => void;
	isLoading?: boolean;
	error?: string | null;
	pagination?: {
		page: number;
		size: number;
		total_items: number;
		total_pages: number;
	} | null;
	onPageChange?: (page: number) => void;
}

// Componente Table - Responsable únicamente de mostrar datos en formato tabla
// Sigue el principio de Single Responsibility (S de SOLID)
const Table: React.FC<TableProps> = ({
	events,
	onEventClick,
	onDeleteClick,
	isLoading = false,
	error = null,
	pagination = null,
	onPageChange,
}) => {
	// Estados de carga y error
	if (isLoading) {
		return <Loading />;
	}

	if (error) {
		return <LoadingError error={error} />;
	}

	// Estado sin eventos
	if (!events || events.length === 0) {
		return <EventEmpty />;
	}

	// Renderizado de la tabla de eventos
	return (
		<div className='relative flex flex-col w-full h-full overflow-scroll text-gray-700 bg-white shadow-md rounded-lg bg-clip-border'>
			<table id='productTable' className='w-full text-left table-auto min-w-max'>
				<thead>
					<tr>
						<th className='p-4 border-b border-slate-300 bg-slate-50'>Nombre</th>
						<th className='p-4 border-b border-slate-300 bg-slate-50'>Fecha</th>
						<th className='p-4 border-b border-slate-300 bg-slate-50'>Ubicación</th>
						<th className='p-4 border-b border-slate-300 bg-slate-50'>Acciones</th>
					</tr>
				</thead>
				<tbody>
					{events.map(event => (
						<tr key={event.id} className='hover:bg-slate-50'>
							<td className='p-4 border-b border-slate-200'>{event.title}</td>
							{/* #darle formato a la fecha */}
							<td className='p-4 border-b border-slate-200'>{new Date(event.start_date).toLocaleDateString()}</td>
							<td className='p-4 border-b border-slate-200'>{event.location}</td>
							<td className='p-4 border-b border-slate-200'>
								<button
									className='rounded-md cursor-pointer bg-slate-800 py-1 px-2 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
									onClick={() => onEventClick?.(event)}>
									<FaArrowRightToBracket />
								
								</button>
								<button
									className='rounded-md cursor-pointer bg-red-600 py-1 px-2 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2'
									onClick={() => onDeleteClick?.(event)}>
										<FaTrash />
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{pagination && <Paginator pagination={pagination} onPageChange={onPageChange} />}
		</div>
	);
};

export default Table;
