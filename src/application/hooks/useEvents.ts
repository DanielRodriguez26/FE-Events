import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '@store/store';
import type { IEventDto, IEventFilter } from '@domain/event/event.interface';

// Hook personalizado para manejar la lógica de eventos
// Sigue el principio de Single Responsibility (S de SOLID)
export const useEvents = (initialPageSize: number = 20) => {
	const { allevents, setAllevents, setEventSearch, eventById, setEventById, setDeleteEvent } = useStore();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageSize, setPageSize] = useState(initialPageSize);
	const [activeFilters, setActiveFilters] = useState<IEventFilter | null>(null);

	// Función para cargar eventos normales
	const loadEvents = async (page: number = 1, size: number = pageSize) => {
		try {
			setLoading(true);
			setError(null);
			await setAllevents(page, size);
			setCurrentPage(page);
			setPageSize(size);
		} catch {
			setError('Error al cargar los eventos');
		} finally {
			setLoading(false);
		}
	};

	// Función para cargar eventos filtrados
	const loadFilteredEvents = async (filters: IEventFilter, page: number = 1, size: number = pageSize) => {
		try {
			setLoading(true);
			setError(null);
			await setEventSearch(filters, page, size);
			setCurrentPage(page);
		} catch {
			setError('Error al cargar los eventos filtrados');
		} finally {
			setLoading(false);
		}
	};

	// Función para manejar el cambio de filtros
	const handleFilterChange = async (newFilters: IEventFilter) => {
		// Filtrar campos vacíos o nulos
		const cleanFilters: IEventFilter = {
			title: newFilters.title?.trim() || '',
			location: newFilters.location?.trim() || '',
			is_active: newFilters.is_active,
			date_from: newFilters.date_from || '',
			date_to: newFilters.date_to || '',
		};

		// Verificar si hay filtros activos
		const hasActiveFilters = cleanFilters.title || cleanFilters.location || cleanFilters.date_from || cleanFilters.date_to;

		if (hasActiveFilters) {
			setActiveFilters(cleanFilters);
			await loadFilteredEvents(cleanFilters, 1, pageSize);
		} else {
			// Si no hay filtros, cargar eventos normales
			setActiveFilters(null);
			await loadEvents(1, pageSize);
		}
	};

	// Función para limpiar filtros
	const handleClearFilters = async () => {
		setActiveFilters(null);
		await loadEvents(1, pageSize);
	};

	// Función para manejar el cambio de página
	const handlePageChange = async (page: number) => {
		// Si hay resultados filtrados, usar la paginación de filtros
		if (activeFilters) {
			await loadFilteredEvents(activeFilters, page, pageSize);
		} else {
			// Si no hay filtros, usar la paginación normal
			await loadEvents(page, pageSize);
		}
	};

	// Función para manejar el clic en un evento
	const handleEventClick = async (event: IEventDto) => {
		await setEventById(event.id);
		// Navegar al detalle del evento
        navigate(`/event/${event.id}`);
	};
    
	// Función para manejar el clic en eliminar
	const handleDeleteClick = async (event: IEventDto) => {
        
		await setDeleteEvent(event.id);
        //quiero que se actualice la lista de eventos
        loadEvents(currentPage, pageSize);

		// Aquí se puede implementar la lógica de favoritos
	};

	// Función para manejar el clic en editar
	const handleEditClick = (event: IEventDto) => {
		// Navegar a la página de edición
		navigate(`/event/edit/${event.id}`);
	};

	// Cargar eventos al montar el componente
	useEffect(() => {
		loadEvents(currentPage, pageSize);
	}, [pageSize]);

	// Extraer los eventos del objeto paginado (priorizar resultados filtrados)
	const events = allevents?.items || null;

	// Verificar si los eventos están realmente vacíos (comentado por ahora)
	// const hasValidEvents = events && Array.isArray(events) && events.length > 0;
	const currentEvent = eventById || null;
	const pagination = allevents
		? {
				page: allevents.page,
				size: allevents.size,
				total_items: allevents.total_items,
				total_pages: allevents.total_pages,
		  }
		: null;

	// Debug: Estado de los datos disponible

	return {
		events,
		pagination,
		loading,
		error,
		currentPage,
		pageSize,
		eventById: currentEvent,
		activeFilters,
		handleEventClick,
		handleDeleteClick,
		handleEditClick,
		handlePageChange,
		handleFilterChange,
		handleClearFilters,
		reloadEvents: () => loadEvents(currentPage, pageSize),
	};
};
