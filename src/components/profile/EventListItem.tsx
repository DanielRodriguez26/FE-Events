import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserEvent } from '@/application/hooks/useProfile';

// Las funciones de utilidad pueden vivir aquí, ya que son específicas de este componente
const getStatusColor = (status: string) => {
    switch (status) {
        case 'registered': return 'bg-blue-100 text-blue-800';
        case 'attended': return 'bg-green-100 text-green-800';
        case 'cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case 'registered': return 'Inscrito';
        case 'attended': return 'Asistió';
        case 'cancelled': return 'Cancelado';
        default: return 'Desconocido';
    }
};

interface EventListItemProps {
    event: UserEvent;
}

const EventListItem: React.FC<EventListItemProps> = ({ event }) => {
    const navigate = useNavigate();

    return (
        <div className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                    {/* ... (resto de los detalles del evento) ... */}
                </div>
                <div className="ml-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                    </span>
                </div>
            </div>
            <div className="mt-4 flex gap-2">
                <button 
                    onClick={() => navigate(`/event/${event.id}`)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    Ver Detalles
                </button>
            </div>
        </div>
    );
};

export default EventListItem;