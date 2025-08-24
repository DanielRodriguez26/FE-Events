import React from 'react';
import Layout from "@/application/layout/Layout";
import { useRegisterForm } from "@/application/hooks";
import Loading from "@/components/ui/Loading";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useLocation } from "react-router-dom";

const RegisterEvent: React.FC = () => {
    const location = useLocation();
    const {
        event,
        isRegistered,
        currentRegistration,
        isLoading,
        error,
        formData,
        validationErrors,
        handleInputChange,
        handleSubmit,
        handleCancelRegistration,
        clearError,
        getAvailableSpots,
        isEventFull,
        isEventPast,
        canRegister,
        canCancel
    } = useRegisterForm();

    // Mostrar mensaje de éxito si viene de una redirección
    const successMessage = location.state?.message;
    console.log('successMessage', event);

    if (isLoading && !event) {
        return (
            <Layout>
                <Loading />
            </Layout>
        );
    }

    if (error && !event) {
        return (
            <Layout>
                <ErrorMessage error={error} />
            </Layout>
        );
    }

    if (!event) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Evento no encontrado</h1>
                        <p className="text-gray-600">El evento que buscas no existe o ha sido eliminado.</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Mensaje de éxito */}
                {successMessage && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-green-800">{successMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header del evento */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                        <h1 className="text-3xl font-bold text-white mb-2">{event.title}</h1>
                        <p className="text-blue-100">{event.description}</p>
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Fecha</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(event.start_date).toLocaleDateString('es-ES', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Ubicación</p>
                                    <p className="text-sm text-gray-600">{event.location}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Capacidad</p>
                                    <p className="text-sm text-gray-600">
                                        {event.registered_attendees || 0} / {event.capacity} asistentes
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Estado del registro */}
                {isRegistered && currentRegistration && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3 flex-1">
                                <h3 className="text-lg font-medium text-blue-800">Ya estás registrado</h3>
                                <p className="text-blue-700">
                                    Te registraste con {currentRegistration.number_of_participants} participante(s) 
                                    el {new Date(currentRegistration.created_at).toLocaleDateString()}
                                </p>
                            </div>
                            {canCancel && (
                                <button
                                    onClick={handleCancelRegistration}
                                    disabled={isLoading}
                                    className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isLoading ? 'Cancelando...' : 'Cancelar Registro'}
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Formulario de registro */}
                {canRegister && (
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-900">Registrarse al Evento</h2>
                            <p className="text-gray-600 mt-1">
                                Completa la información para registrarte al evento
                            </p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Información de capacidad */}
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Cupos disponibles:</span>
                                    <span className={`text-sm font-semibold ${getAvailableSpots() > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {getAvailableSpots()} cupos
                                    </span>
                                </div>
                                {isEventFull() && (
                                    <p className="text-sm text-red-600 mt-2">
                                        Este evento está completamente lleno
                                    </p>
                                )}
                            </div>

                            {/* Número de participantes */}
                            <div className="mb-6">
                                <label htmlFor="number_of_participants" className="block text-sm font-medium text-gray-700 mb-2">
                                    Número de participantes *
                                </label>
                                <input
                                    type="number"
                                    id="number_of_participants"
                                    name="number_of_participants"
                                    value={formData.number_of_participants}
                                    onChange={handleInputChange}
                                    min="1"
                                    max={getAvailableSpots()}
                                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                                        validationErrors.number_of_participants ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    disabled={isLoading || isEventFull()}
                                />
                                {validationErrors.number_of_participants && (
                                    <p className="mt-1 text-sm text-red-600">{validationErrors.number_of_participants}</p>
                                )}
                                <p className="mt-1 text-sm text-gray-500">
                                    Máximo {getAvailableSpots()} participante(s) disponible(s)
                                </p>
                            </div>

                            {/* Mensaje de error */}
                            {error && (
                                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-red-800">{error}</p>
                                        </div>
                                        <div className="ml-auto pl-3">
                                            <button
                                                onClick={clearError}
                                                className="text-red-400 hover:text-red-600"
                                            >
                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Botones de acción */}
                            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || isEventFull()}
                                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                                >
                                    {isLoading ? 'Registrando...' : 'Confirmar Registro'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Mensaje si el evento ya pasó */}
                {isEventPast() && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-lg font-medium text-yellow-800">Evento finalizado</h3>
                                <p className="text-yellow-700">
                                    Este evento ya ha finalizado y no se pueden realizar más registros.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default RegisterEvent;