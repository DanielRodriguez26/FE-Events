import React from 'react';
import type { UserEvent } from '@/application/hooks/useProfile'; // Importamos la interfaz del hook


interface ProfileHeaderProps {
    user: {
        first_name: string;
        email: string;
        phone: string;
        created_at: string;
    } | null;
    events: UserEvent[];
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, events }) => {
    const attendedEvents = events.filter(e => e.status === 'attended').length;
    const upcomingEvents = events.filter(e => e.status === 'registered').length;

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8 text-white">
                <div className="flex items-center">
                    <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{user?.first_name || 'Usuario'}</h1>
                        <p className="text-purple-100">{user?.email || 'usuario@ejemplo.com'}</p>
                    </div>
                </div>
            </div>
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{events.length}</div>
                        <div className="text-sm text-gray-600">Eventos Registrados</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{attendedEvents}</div>
                        <div className="text-sm text-gray-600">Eventos Asistidos</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{upcomingEvents}</div>
                        <div className="text-sm text-gray-600">Próximos Eventos</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;