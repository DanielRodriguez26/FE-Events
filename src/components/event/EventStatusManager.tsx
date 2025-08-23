import React, { useState } from 'react';

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'finished';

interface EventStatusManagerProps {
    currentStatus: EventStatus;
    onStatusChange: (newStatus: EventStatus) => void;
    isOrganizer?: boolean;
    isLoading?: boolean;
}

const EventStatusManager: React.FC<EventStatusManagerProps> = ({
    currentStatus,
    onStatusChange,
    isOrganizer = false,
    isLoading = false
}) => {
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<EventStatus | null>(null);

    const statusConfig = {
        draft: {
            label: 'Borrador',
            color: 'bg-gray-100 text-gray-800',
            icon: '📝',
            description: 'Evento en preparación'
        },
        published: {
            label: 'Publicado',
            color: 'bg-green-100 text-green-800',
            icon: '✅',
            description: 'Evento disponible para registro'
        },
        cancelled: {
            label: 'Cancelado',
            color: 'bg-red-100 text-red-800',
            icon: '❌',
            description: 'Evento cancelado'
        },
        finished: {
            label: 'Finalizado',
            color: 'bg-blue-100 text-blue-800',
            icon: '🏁',
            description: 'Evento completado'
        }
    };

    const getAvailableTransitions = (currentStatus: EventStatus): EventStatus[] => {
        const transitions: Record<EventStatus, EventStatus[]> = {
            draft: ['published'],
            published: ['cancelled', 'finished'],
            cancelled: ['published'], // Permitir reactivar
            finished: [] // No se puede cambiar desde finalizado
        };
        return transitions[currentStatus] || [];
    };

    const handleStatusChange = (newStatus: EventStatus) => {
        if (newStatus === 'cancelled') {
            setPendingStatus(newStatus);
            setShowConfirmDialog(true);
        } else {
            onStatusChange(newStatus);
        }
    };

    const confirmStatusChange = () => {
        if (pendingStatus) {
            onStatusChange(pendingStatus);
            setShowConfirmDialog(false);
            setPendingStatus(null);
        }
    };

    const cancelStatusChange = () => {
        setShowConfirmDialog(false);
        setPendingStatus(null);
    };

    const currentConfig = statusConfig[currentStatus];
    const availableTransitions = getAvailableTransitions(currentStatus);

    if (!isOrganizer) {
        return (
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                    <span className="text-2xl mr-3">{currentConfig.icon}</span>
                    <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentConfig.color}`}>
                            {currentConfig.label}
                        </span>
                        <p className="text-sm text-gray-600 mt-1">{currentConfig.description}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3">{currentConfig.icon}</span>
                        <div>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${currentConfig.color}`}>
                                {currentConfig.label}
                            </span>
                            <p className="text-sm text-gray-600 mt-1">{currentConfig.description}</p>
                        </div>
                    </div>
                </div>

                {availableTransitions.length > 0 && (
                    <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">Cambiar Estado</h4>
                        <div className="flex flex-wrap gap-2">
                            {availableTransitions.map((status) => {
                                const config = statusConfig[status];
                                return (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusChange(status)}
                                        disabled={isLoading}
                                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                            status === 'cancelled'
                                                ? 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                                                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        <span className="mr-2">{config.icon}</span>
                                        {config.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {currentStatus === 'finished' && (
                    <div className="border-t border-gray-200 pt-4">
                        <p className="text-sm text-gray-600">
                            Este evento ha finalizado y no se pueden realizar más cambios.
                        </p>
                    </div>
                )}
            </div>

            {/* Diálogo de confirmación */}
            {showConfirmDialog && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
                    <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                        <div className="mt-3 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mt-4">Confirmar Cancelación</h3>
                            <div className="mt-2 px-7 py-3">
                                <p className="text-sm text-gray-500">
                                    ¿Estás seguro de que quieres cancelar este evento? Esta acción no se puede deshacer y se notificará a todos los asistentes registrados.
                                </p>
                            </div>
                            <div className="flex justify-center space-x-4 mt-4">
                                <button
                                    onClick={cancelStatusChange}
                                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmStatusChange}
                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                                >
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default EventStatusManager;
