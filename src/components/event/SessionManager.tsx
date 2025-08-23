import React, { useState } from 'react';

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
    email: string;
    bio: string;
    expertise: string[];
}

interface SessionManagerProps {
    sessions: Session[];
    speakers: Speaker[];
    eventId: number;
    onSessionCreate: (session: Omit<Session, 'id' | 'registered_attendees'>) => void;
    onSessionUpdate: (sessionId: number, session: Partial<Session>) => void;
    onSessionDelete: (sessionId: number) => void;
    isOrganizer?: boolean;
    isLoading?: boolean;
}

const SessionManager: React.FC<SessionManagerProps> = ({
    sessions,
    speakers,
    eventId,
    onSessionCreate,
    onSessionUpdate,
    onSessionDelete,
    isOrganizer = false,
    isLoading = false
}) => {
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

    const handleInputChange = (field: string, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingSession) {
            onSessionUpdate(editingSession.id, formData);
            setEditingSession(null);
        } else {
            onSessionCreate(formData);
        }
        
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
    };

    const validateTimeConflict = (startTime: string, endTime: string, excludeSessionId?: number): boolean => {
        const newStart = new Date(startTime);
        const newEnd = new Date(endTime);
        
        return sessions.every(session => {
            if (excludeSessionId && session.id === excludeSessionId) return true;
            
            const sessionStart = new Date(session.start_time);
            const sessionEnd = new Date(session.end_time);
            
            return newEnd <= sessionStart || newStart >= sessionEnd;
        });
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Sesiones del Evento</h3>
                    <p className="text-sm text-gray-600">
                        {sessions.length} sesión{sessions.length !== 1 ? 'es' : ''} programada{sessions.length !== 1 ? 's' : ''}
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Capacidad *
                                </label>
                                <input
                                    type="number"
                                    value={formData.capacity}
                                    onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                                    required
                                    min="1"
                                    max="1000"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

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

                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? 'Guardando...' : (editingSession ? 'Actualizar' : 'Crear')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de sesiones */}
            <div className="space-y-4">
                {sessions.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-500">No hay sesiones programadas</p>
                    </div>
                ) : (
                    sessions.map((session) => (
                        <div key={session.id} className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-lg font-medium text-gray-900">{session.title}</h4>
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(session.registered_attendees, session.capacity)}`}>
                                            {getAvailabilityText(session.registered_attendees, session.capacity)}
                                        </span>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-4">{session.description}</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                        <div className="flex items-center text-gray-500">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {new Date(session.start_time).toLocaleTimeString()} - {new Date(session.end_time).toLocaleTimeString()}
                                        </div>
                                        
                                        <div className="flex items-center text-gray-500">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            {session.speaker}
                                        </div>
                                        
                                        <div className="flex items-center text-gray-500">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                            {session.room}
                                        </div>
                                        
                                        <div className="flex items-center text-gray-500">
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            {session.registered_attendees}/{session.capacity}
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
                                            onClick={() => onSessionDelete(session.id)}
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
                    ))
                )}
            </div>
        </div>
    );
};

export default SessionManager;
