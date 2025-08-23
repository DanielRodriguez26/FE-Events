import React, { useState, useEffect } from 'react';
import { useSessions } from '@/application/hooks/useSessions';
import { TimeValidator, type TimeValidationResult } from '@/utils/timeValidation';

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

interface Speaker {
    id: number;
    name: string;
    expertise: string[];
}

interface SessionManagerProps {
    sessions: Session[];
    speakers: Speaker[];
    eventId: number;
    onSessionCreate: (sessionData: any) => void;
    onSessionUpdate: (sessionId: number, sessionData: any) => void;
    onSessionDelete: (sessionId: number) => void;
    isOrganizer?: boolean;
    isLoading?: boolean;
}

const SessionManager: React.FC<SessionManagerProps> = ({
    sessions: propSessions,
    speakers,
    eventId,
    onSessionCreate,
    onSessionUpdate,
    onSessionDelete,
    isOrganizer = false,
    isLoading: propIsLoading = false
}) => {
    const {
        sessionsByEvent,
        loading: sessionsLoading,
        error: sessionsError,
        loadSessionsByEvent,
        createEventSession,
        updateSession: updateSessionAction,
        deleteSession: deleteSessionAction,
        clearError
    } = useSessions();

    // Usar sesiones del hook si están disponibles, sino usar las props
    const sessions = sessionsByEvent?.items || propSessions;
    const isLoading = sessionsLoading || propIsLoading;

    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingSession, setEditingSession] = useState<Session | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        start_time: '',
        end_time: '',
        speaker: '',
        room: '',
        capacity: 50
    });
    const [timeValidation, setTimeValidation] = useState<TimeValidationResult | null>(null);

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Validar horarios cuando se cambian las fechas
        if (field === 'start_time' || field === 'end_time') {
            if (formData.start_time && formData.end_time) {
                const validation = TimeValidator.validateSessionTimes({
                    start_time: formData.start_time,
                    end_time: formData.end_time
                }, sessions || []);
                setTimeValidation(validation);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            if (editingSession) {
                // Actualizar sesión existente
                const success = await updateSessionAction(editingSession.id, {
                    title: formData.title,
                    description: formData.description,
                    start_time: formData.start_time,
                    end_time: formData.end_time,
                    capacity: formData.capacity
                });
                
                if (success) {
                    setEditingSession(null);
                    // Recargar sesiones del evento
                    if (eventId) {
                        await loadSessionsByEvent(eventId);
                    }
                }
            } else {
                // Crear nueva sesión
                const success = await createEventSession(eventId, {
                    title: formData.title,
                    description: formData.description,
                    start_time: formData.start_time,
                    end_time: formData.end_time,
                    capacity: formData.capacity
                });
                
                if (success) {
                    // Recargar sesiones del evento
                    if (eventId) {
                        await loadSessionsByEvent(eventId);
                    }
                }
            }
            
            // Limpiar formulario
            setFormData({
                title: '',
                description: '',
                start_time: '',
                end_time: '',
                speaker: '',
                room: '',
                capacity: 50
            });
            setShowCreateForm(false);
            setTimeValidation(null);
        } catch (error) {
            console.error('Error handling session:', error);
        }
    };

    const handleEdit = (session: Session) => {
        setEditingSession(session);
        setFormData({
            title: session.title,
            description: session.description,
            start_time: session.start_time.slice(0, 16), // Format for datetime-local
            end_time: session.end_time.slice(0, 16),
            speaker: session.speaker,
            room: session.room,
            capacity: session.capacity
        });
        setShowCreateForm(true);
    };

    const handleCancel = () => {
        setShowCreateForm(false);
        setEditingSession(null);
        setFormData({
            title: '',
            description: '',
            start_time: '',
            end_time: '',
            speaker: '',
            room: '',
            capacity: 50
        });
        setTimeValidation(null);
    };

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

    // Cargar sesiones al montar el componente si hay eventId
    useEffect(() => {
        if (eventId) {
            loadSessionsByEvent(eventId);
        }
    }, [eventId, loadSessionsByEvent]);

    // Mostrar error si existe
    useEffect(() => {
        if (sessionsError) {
            console.error('Session error:', sessionsError);
        }
    }, [sessionsError]);

    return (
        <div className="space-y-6">
            {/* Mostrar error si existe */}
            {sessionsError && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">
                                Error al cargar sesiones
                            </h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{sessionsError}</p>
                            </div>
                            <div className="mt-4">
                                <button
                                    onClick={() => {
                                        clearError();
                                        if (eventId) {
                                            loadSessionsByEvent(eventId);
                                        }
                                    }}
                                    className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                                >
                                    Reintentar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Sesiones del Evento</h3>
                    <p className="text-sm text-gray-600">
                        {sessions?.length || 0} sesión{(sessions?.length || 0) !== 1 ? 'es' : ''} programada{(sessions?.length || 0) !== 1 ? 's' : ''}
                    </p>
                </div>
                {isOrganizer && (
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Agregar Sesión
                    </button>
                )}
            </div>

            {/* Formulario de creación/edición */}
            {showCreateForm && (
                <div className="bg-white rounded-lg shadow-sm p-6 border">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                        {editingSession ? 'Editar Sesión' : 'Nueva Sesión'}
                    </h4>
                    
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Título de la Sesión *
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => handleInputChange('title', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Sala *
                                </label>
                                <input
                                    type="text"
                                    value={formData.room}
                                    onChange={(e) => handleInputChange('room', e.target.value)}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                required
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hora de Inicio *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.start_time}
                                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        timeValidation?.errors.some(e => e.includes('inicio')) 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300'
                                    }`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hora de Fin *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.end_time}
                                    onChange={(e) => handleInputChange('end_time', e.target.value)}
                                    required
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                        timeValidation?.errors.some(e => e.includes('fin')) 
                                            ? 'border-red-500 focus:ring-red-500' 
                                            : 'border-gray-300'
                                    }`}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Capacidad
                                </label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* Mostrar errores y advertencias de validación de horarios */}
                        {timeValidation && (timeValidation.errors.length > 0 || timeValidation.warnings.length > 0) && (
                            <div className="mt-4">
                                {timeValidation.errors.length > 0 && (
                                    <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-3">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-red-800">
                                                    Errores de validación de horarios
                                                </h3>
                                                <div className="mt-2 text-sm text-red-700">
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {timeValidation.errors.map((error, index) => (
                                                            <li key={index}>{error}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {timeValidation.warnings.length > 0 && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-yellow-800">
                                                    Advertencias de horarios
                                                </h3>
                                                <div className="mt-2 text-sm text-yellow-700">
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {timeValidation.warnings.map((warning, index) => (
                                                            <li key={index}>{warning}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ponente *
                            </label>
                            <select
                                value={formData.speaker}
                                onChange={(e) => handleInputChange('speaker', e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Seleccionar ponente...</option>
                                {speakers.map((speaker) => (
                                    <option key={speaker.id} value={speaker.name}>
                                        {speaker.name} - {speaker.expertise.join(', ')}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || (timeValidation ? !timeValidation.isValid : false)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Guardando...' : editingSession ? 'Actualizar' : 'Crear'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de sesiones */}
            {isLoading ? (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : sessions && sessions.length > 0 ? (
                <div className="space-y-4">
                    {(sessions || []).map((session: Session) => (
                        <div key={session.id} className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h4 className="text-lg font-medium text-gray-900">{session.title}</h4>
                                    <p className="text-sm text-gray-600 mt-1">{session.description}</p>
                                    
                                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {new Date(session.start_time).toLocaleString()}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {session.room}
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {session.speaker}
                                        </div>
                                        <div className="flex items-center">
                                            <span className={`font-medium ${getAvailabilityColor(session.registered_attendees, session.capacity)}`}>
                                                {session.registered_attendees}/{session.capacity} - {getAvailabilityText(session.registered_attendees, session.capacity)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                {isOrganizer && (
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() => handleEdit(session)}
                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={async () => {
                                                const success = await deleteSessionAction(session.id);
                                                if (success && eventId) {
                                                    await loadSessionsByEvent(eventId);
                                                }
                                            }}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay sesiones</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {isOrganizer ? 'Comienza agregando la primera sesión del evento.' : 'Aún no se han programado sesiones para este evento.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default SessionManager;
