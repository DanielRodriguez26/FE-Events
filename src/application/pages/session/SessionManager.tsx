import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/application/layout/Layout';
import SessionManagerForm from '@/components/sessions/SessionManagerForm';
import Loading from '@/components/ui/Loading';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { useError } from '@/application/hooks';
import useStore from '@store/store';

// Usaremos el evento desde el store (eventById)

const SessionManager: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const eventId = id ? parseInt(id) : null;
    const { eventById, setEventById } = useStore();
    const { error, clearError, handleError } = useError();
    
    const [loading, setLoading] = useState(true);
    
    // Supongamos que este es un evento que el usuario organiza
    const isOrganizer = true; 

    useEffect(() => {
        if (!eventId) {
            handleError(new Error('ID de evento no válido.'), 'SessionManager');
            setLoading(false);
            return;
        }

        const loadData = async () => {
            try {
                await setEventById(eventId);
            } catch (err) {
                handleError(err, 'SessionManager - loadData');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [eventId, setEventById]);

    if (loading) {
        return <Layout><Loading /></Layout>;
    }

    if (error || !eventById) {
        return (
            <Layout>
                <ErrorDisplay 
                    error={error} 
                    onDismiss={clearError}
                    onRetry={() => window.location.reload()}
                />
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Información del evento (desde el store) */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{eventById.title}</h1>
                    <p className="text-gray-600 mb-4">{eventById.description}</p>
                    <p className="text-sm text-gray-500">📍 {eventById.location}</p>
                </div>

                {/* El componente refactorizado de SessionManager */}
                <SessionManagerForm 
                    sessions={[]} // Se deja vacío para que SessionManager cargue sus propias sesiones
                    eventId={eventById.id}
                    isOrganizer={isOrganizer}
                    isLoading={false} // Se maneja el estado de carga a nivel de la página
                />
            </div>
        </Layout>
    );
};

export default SessionManager;