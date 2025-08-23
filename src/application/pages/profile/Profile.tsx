import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/application/layout/Layout';
import useStore from '@store/store';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';

interface UserEvent {
    id: number;
    title: string;
    start_date: string;
    location: string;
    status: 'registered' | 'attended' | 'cancelled';
}

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { user, token, isAuthenticated } = useStore();
    const [userEvents, setUserEvents] = useState<UserEvent[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !token) {
            navigate('/login');
            return;
        }

        // Simular carga de eventos del usuario
        loadUserEvents();
    }, [isAuthenticated, token, navigate]);

    const loadUserEvents = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Datos simulados de eventos del usuario
            const mockUserEvents: UserEvent[] = [
                {
                    id: 1,
                    title: "Conferencia de Tecnología 2024",
                    start_date: "2024-03-15T10:00:00",
                    location: "Centro de Convenciones",
                    status: 'registered'
                },
                {
                    id: 2,
                    title: "Workshop de React",
                    start_date: "2024-03-20T14:00:00",
                    location: "Universidad Nacional",
                    status: 'attended'
                },
                {
                    id: 3,
                    title: "Meetup de Desarrollo Web",
                    start_date: "2024-04-05T18:00:00",
                    location: "Coworking Space",
                    status: 'registered'
                }
            ];
            
            setUserEvents(mockUserEvents);
        } catch (err) {
            setError('Error al cargar los eventos del usuario');
            console.error('Error loading user events:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        // Implementar logout
        navigate('/login');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'registered':
                return 'bg-blue-100 text-blue-800';
            case 'attended':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'registered':
                return 'Inscrito';
            case 'attended':
                return 'Asistió';
            case 'cancelled':
                return 'Cancelado';
            default:
                return 'Desconocido';
        }
    };

    if (loading) {
        return (
            <Layout>
                <Loading />
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <ErrorMessage message={error} />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header del perfil */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-8 text-white">
                        <div className="flex items-center">
                            <div className="bg-white bg-opacity-20 rounded-full p-3 mr-4">
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">{user?.name || 'Usuario'}</h1>
                                <p className="text-purple-100">{user?.email || 'usuario@ejemplo.com'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-gray-900">{userEvents.length}</div>
                                <div className="text-sm text-gray-600">Eventos Registrados</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {userEvents.filter(e => e.status === 'attended').length}
                                </div>
                                <div className="text-sm text-gray-600">Eventos Asistidos</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {userEvents.filter(e => e.status === 'registered').length}
                                </div>
                                <div className="text-sm text-gray-600">Próximos Eventos</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información del usuario */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Personal</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <p className="mt-1 text-sm text-gray-900">{user?.name || 'No especificado'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <p className="mt-1 text-sm text-gray-900">{user?.email || 'No especificado'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <p className="mt-1 text-sm text-gray-900">{user?.phone || 'No especificado'}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Fecha de registro</label>
                            <p className="mt-1 text-sm text-gray-900">
                                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'No especificado'}
                            </p>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex gap-4">
                        <button 
                            onClick={() => navigate('/profile/edit')}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Editar Perfil
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* Eventos del usuario */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">Mis Eventos</h2>
                    </div>
                    
                    {userEvents.length === 0 ? (
                        <div className="p-6 text-center">
                            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-gray-500">No tienes eventos registrados</p>
                            <button 
                                onClick={() => navigate('/events')}
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Explorar Eventos
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {userEvents.map((event) => (
                                <div key={event.id} className="p-6 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(event.start_date).toLocaleDateString()} - {new Date(event.start_date).toLocaleTimeString()}
                                            </div>
                                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {event.location}
                                            </div>
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
                                        {event.status === 'registered' && (
                                            <button 
                                                onClick={() => navigate(`/events/register/${event.id}`)}
                                                className="text-green-600 hover:text-green-800 text-sm font-medium"
                                            >
                                                Gestionar Inscripción
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
