import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/application/layout/Layout';
import useStore from '@store/store';

const EventDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { eventById, setEventById } = useStore();

    useEffect(() => {
        if (id) {
            setEventById(parseInt(id));
        }
    }, [id, setEventById]);

    if (!eventById) {
        return (
            <Layout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-700">Cargando evento...</h2>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Botón de regreso */}
                <button
                    onClick={() => navigate('/events')}
                    className="mb-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Volver a eventos
                </button>

                {/* Detalles del evento */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header del evento */}
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
                        <h1 className="text-3xl font-bold mb-2">{eventById.title}</h1>
                        <p className="text-blue-100 text-lg">{eventById.description}</p>
                    </div>

                    {/* Contenido del evento */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Información básica */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Información del Evento</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span className="text-gray-700">
                                                <strong>Fecha de inicio:</strong> {new Date(eventById.start_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-gray-700">
                                                <strong>Hora:</strong> {new Date(eventById.start_date).toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            <span className="text-gray-700">
                                                <strong>Ubicación:</strong> {eventById.location}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información adicional */}
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Detalles Adicionales</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span className="text-gray-700">
                                                <strong>Organizador:</strong> {eventById.organizer || 'No especificado'}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            <span className="text-gray-700">
                                                <strong>Capacidad:</strong> {eventById.capacity || 'No especificado'}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-gray-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                            </svg>
                                            <span className="text-gray-700">
                                                <strong>Precio:</strong> {eventById.price ? `$${eventById.price}` : 'Gratis'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Descripción completa */}
                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
                            <p className="text-gray-700 leading-relaxed">
                                {eventById.description || 'No hay descripción disponible para este evento.'}
                            </p>
                        </div>

                        {/* Botones de acción */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            <button onClick={() => navigate(`/events/register/${eventById.id}`)} className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                                Inscribirse al Evento
                            </button>
                            <button onClick={() => navigate(`/events/session/${eventById.id}`)} className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                                Ver Sesiones
                            </button>
                                <button onClick={() => navigate(`/events/session/${eventById.id}/manage`)} className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                                    Gestionar Sesiones
                                </button>
                        </div>
                        
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default EventDetail;
