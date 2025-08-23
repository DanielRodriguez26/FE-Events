import React from 'react';
import { TimeValidator } from '@/utils/timeValidation';

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

interface SessionScheduleProps {
    sessions: Session[];
    eventStartDate?: string;
    eventEndDate?: string;
}

const SessionSchedule: React.FC<SessionScheduleProps> = ({ 
    sessions, 
    eventStartDate, 
    eventEndDate 
}) => {
    // Agrupar sesiones por día
    const groupSessionsByDay = (sessions: Session[]) => {
        const grouped: { [key: string]: Session[] } = {};
        
        sessions.forEach(session => {
            const date = new Date(session.start_time).toDateString();
            if (!grouped[date]) {
                grouped[date] = [];
            }
            grouped[date].push(session);
        });
        
        // Ordenar sesiones por hora de inicio dentro de cada día
        Object.keys(grouped).forEach(date => {
            grouped[date].sort((a, b) => 
                new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
            );
        });
        
        return grouped;
    };

    const groupedSessions = groupSessionsByDay(sessions);
    const sortedDays = Object.keys(groupedSessions).sort((a, b) => 
        new Date(a).getTime() - new Date(b).getTime()
    );

    const getAvailabilityColor = (registered: number, capacity: number) => {
        const percentage = (registered / capacity) * 100;
        if (percentage >= 90) return 'bg-red-100 text-red-800';
        if (percentage >= 75) return 'bg-yellow-100 text-yellow-800';
        return 'bg-green-100 text-green-800';
    };

    const getAvailabilityText = (registered: number, capacity: number) => {
        const percentage = (registered / capacity) * 100;
        if (percentage >= 90) return 'Casi lleno';
        if (percentage >= 75) return 'Pocos cupos';
        return 'Disponible';
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getSessionDuration = (startTime: string, endTime: string) => {
        return TimeValidator.formatDuration(startTime, endTime);
    };

    if (sessions.length === 0) {
        return (
            <div className="text-center py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay sesiones programadas</h3>
                <p className="mt-1 text-sm text-gray-500">
                    Aún no se han programado sesiones para este evento.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Horario de Sesiones</h3>
                <div className="text-sm text-gray-600">
                    {sessions.length} sesión{sessions.length !== 1 ? 'es' : ''} programada{sessions.length !== 1 ? 's' : ''}
                </div>
            </div>

            <div className="space-y-6">
                {sortedDays.map(day => (
                    <div key={day} className="bg-white rounded-lg shadow-sm border">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h4 className="text-lg font-medium text-gray-900 capitalize">
                                {formatDate(day)}
                            </h4>
                        </div>
                        
                        <div className="divide-y divide-gray-200">
                            {groupedSessions[day].map((session, index) => (
                                <div key={session.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-start space-x-4">
                                        {/* Indicador de tiempo */}
                                        <div className="flex-shrink-0 w-20 text-center">
                                            <div className="text-sm font-medium text-gray-900">
                                                {formatTime(session.start_time)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {formatTime(session.end_time)}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-1">
                                                {getSessionDuration(session.start_time, session.end_time)}
                                            </div>
                                        </div>

                                        {/* Contenido de la sesión */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h5 className="text-lg font-medium text-gray-900 mb-1">
                                                        {session.title}
                                                    </h5>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        {session.description}
                                                    </p>
                                                    
                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        <div className="flex items-center text-gray-600">
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            {session.speaker}
                                                        </div>
                                                        
                                                        <div className="flex items-center text-gray-600">
                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {session.room}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Estado de disponibilidad */}
                                                <div className="flex-shrink-0 ml-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(session.registered_attendees, session.capacity)}`}>
                                                        {session.registered_attendees}/{session.capacity}
                                                    </span>
                                                    <div className="text-xs text-gray-500 mt-1 text-center">
                                                        {getAvailabilityText(session.registered_attendees, session.capacity)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Resumen del horario */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                        <h4 className="text-sm font-medium text-blue-900">Resumen del Horario</h4>
                        <p className="text-sm text-blue-700 mt-1">
                            El evento se desarrolla en {sortedDays.length} día{sortedDays.length !== 1 ? 's' : ''} con un total de {sessions.length} sesión{sessions.length !== 1 ? 'es' : ''}.
                            Las sesiones están programadas entre las 8:00 AM y las 10:00 PM con intervalos de 30 minutos.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SessionSchedule;
