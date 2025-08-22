import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '@store/store';
import type { IEventDto } from '@domain/home/home.interface';

// Hook personalizado para manejar la lógica de eventos
// Sigue el principio de Single Responsibility (S de SOLID)
export const useEvents = (initialPageSize: number = 20) => {
    const { allevents, setAllevents, eventById, setEventById } = useStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(initialPageSize);

    // Función para cargar eventos
    const loadEvents = async (page: number = 1, size: number = pageSize) => {
        try {
            setLoading(true);
            setError(null);
            await setAllevents(page, size);
            setCurrentPage(page);
            setPageSize(size);
        } catch (err) {
            setError('Error al cargar los eventos');
            console.log('Error loading events:', err);
        } finally {
            setLoading(false);
        }
    };

    // Función para manejar el cambio de página
    const handlePageChange = async (page: number) => {
        await loadEvents(page, pageSize);
    };

    // Función para manejar el clic en un evento
    const handleEventClick = async (event: IEventDto) => {
        await setEventById(event.id);
        // Navegar al detalle del evento
        navigate(`/event/${event.id}`);
    };

    // Función para manejar el clic en favoritos
    const handleDeleteClick = (event: IEventDto) => {
        console.log('Agregar a favoritos:', event);

        // Aquí se puede implementar la lógica de favoritos
    };

    // Cargar eventos al montar el componente
    useEffect(() => {
        loadEvents(currentPage, pageSize);
    }, [pageSize]); 

    // Extraer los eventos del objeto paginado
    const events = allevents?.items || null;
    const currentEvent = eventById || null; 
    const pagination = allevents ? {
        page: allevents.page,
        size: allevents.size,
        total_items: allevents.total_items,
        total_pages: allevents.total_pages
    } : null;

    return {
        events,
        pagination,
        loading,
        error,      
        currentPage,
        pageSize,
        eventById: currentEvent,
        handleEventClick,
        handleDeleteClick,
        handlePageChange,
        reloadEvents: () => loadEvents(currentPage, pageSize)
    };
};
