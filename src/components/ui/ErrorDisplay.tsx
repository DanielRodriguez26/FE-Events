import React from 'react';
import type { IFrontendError } from '@domain/settings/error.interface';
import { ErrorService } from '@domain/settings/error.service';

interface ErrorDisplayProps {
    error: IFrontendError | null;
    onRetry?: () => void;
    onDismiss?: () => void;
    showDetails?: boolean;
    className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
    error,
    onRetry,
    onDismiss,
    showDetails = false,
    className = ''
}) => {
    if (!error) return null;

    const getErrorIcon = (type: string) => {
        switch (type) {
            case 'Validation Error':
                return '⚠️';
            case 'Authentication Error':
                return '🔐';
            case 'Authorization Error':
                return '🚫';
            case 'Not Found':
                return '🔍';
            case 'Network Error':
                return '🌐';
            case 'Internal Server Error':
            case 'Database Error':
                return '💥';
            default:
                return '❌';
        }
    };

    const getErrorColor = (type: string) => {
        switch (type) {
            case 'Validation Error':
                return 'border-yellow-500 bg-yellow-50 text-yellow-800';
            case 'Authentication Error':
                return 'border-red-500 bg-red-50 text-red-800';
            case 'Authorization Error':
                return 'border-orange-500 bg-orange-50 text-orange-800';
            case 'Not Found':
                return 'border-blue-500 bg-blue-50 text-blue-800';
            case 'Network Error':
                return 'border-purple-500 bg-purple-50 text-purple-800';
            case 'Internal Server Error':
            case 'Database Error':
                return 'border-red-600 bg-red-50 text-red-800';
            default:
                return 'border-gray-500 bg-gray-50 text-gray-800';
        }
    };

    return (
        <div className={`border-l-4 p-4 rounded-r-lg ${getErrorColor(error.type)} ${className}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0 mr-3">
                    <span className="text-xl">{getErrorIcon(error.type)}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium">
                            {error.type}
                        </h3>
                        
                        <div className="flex space-x-2">
                            {onRetry && (
                                <button
                                    onClick={onRetry}
                                    className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-colors"
                                >
                                    Reintentar
                                </button>
                            )}
                            
                            {onDismiss && (
                                <button
                                    onClick={onDismiss}
                                    className="text-xs px-2 py-1 bg-white bg-opacity-50 rounded hover:bg-opacity-75 transition-colors"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <p className="mt-1 text-sm">
                        {ErrorService.getUserFriendlyMessage(error)}
                    </p>
                    
                    {/* Mostrar mensaje específico si es diferente del mensaje principal */}
                    {error.originalError?.detail && error.originalError.detail !== ErrorService.getUserFriendlyMessage(error) && (
                        <p className="mt-2 text-xs opacity-90">
                            <strong>Detalle:</strong> {error.originalError.detail}
                        </p>
                    )}
                    
                    {showDetails && error.details && error.details.length > 0 && (
                        <div className="mt-3">
                            <h4 className="text-xs font-medium mb-2">Detalles del error:</h4>
                            <ul className="text-xs space-y-1">
                                {error.details.map((detail, index) => (
                                    <li key={index} className="flex items-start">
                                        {detail.field && (
                                            <span className="font-medium mr-2">
                                                {detail.field}:
                                            </span>
                                        )}
                                        <span>{detail.message}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {showDetails && (
                        <div className="mt-3 text-xs opacity-75">
                            <p>Código: {error.statusCode || 'N/A'}</p>
                            <p>Hora: {new Date(error.timestamp).toLocaleString()}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ErrorDisplay;
