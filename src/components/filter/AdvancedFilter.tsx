import React, { useState } from 'react';
import type { IEventFilter } from '@/domain/event/event.interface';

interface AdvancedFilterProps {
    onFilterChange: (filters: IEventFilter) => void;
    onClearFilters: () => void;
    isLoading?: boolean;
}

const AdvancedFilter: React.FC<AdvancedFilterProps> = ({
    onFilterChange,
    onClearFilters,
    isLoading = false
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [filters, setFilters] = useState<IEventFilter>({
        title: '',
        location: '',
        is_active: true,
        date_from: '',
        date_to: ''
    });

    const handleInputChange = (field: keyof IEventFilter, value: string | boolean) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleClearFilters = () => {
        const clearedFilters: IEventFilter = {
            title: '',
            location: '',
            is_active: true,
            date_from: '',
            date_to: ''
        };
        setFilters(clearedFilters);
        onClearFilters();
    };

    const hasActiveFilters = filters.title || filters.location || filters.date_from || filters.date_to;

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Header del filtro */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filtros Avanzados</h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                >
                    <span className="mr-2">{isExpanded ? 'Ocultar' : 'Mostrar'}</span>
                    <svg
                        className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
            </div>

            {/* Filtros básicos siempre visibles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Buscar por nombre
                    </label>
                    <input
                        type="text"
                        value={filters.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Nombre del evento..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ubicación
                    </label>
                    <input
                        type="text"
                        value={filters.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Ciudad, lugar..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estado
                    </label>
                    <select
                        value={filters.is_active ? 'active' : 'inactive'}
                        onChange={(e) => handleInputChange('is_active', e.target.value === 'active')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        disabled={isLoading}
                    >
                        <option value="active">Activos</option>
                        <option value="inactive">Todos</option>
                    </select>
                </div>
            </div>

            {/* Filtros avanzados */}
            {isExpanded && (
                <div className="border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha desde
                            </label>
                            <input
                                type="date"
                                value={filters.date_from}
                                onChange={(e) => handleInputChange('date_from', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha hasta
                            </label>
                            <input
                                type="date"
                                value={filters.date_to}
                                onChange={(e) => handleInputChange('date_to', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Filtros adicionales */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rango de precio
                            </label>
                            <div className="flex space-x-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isLoading}
                                />
                                <span className="self-center text-gray-500">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Capacidad mínima
                            </label>
                            <input
                                type="number"
                                placeholder="Ej: 50"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Organizador
                            </label>
                            <input
                                type="text"
                                placeholder="Nombre del organizador"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Botones de acción */}
            <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                    {hasActiveFilters && (
                        <span className="text-sm text-gray-600">
                            Filtros activos
                        </span>
                    )}
                    {isLoading && (
                        <div className="flex items-center text-sm text-gray-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                            Aplicando filtros...
                        </div>
                    )}
                </div>

                <div className="flex space-x-3">
                    {hasActiveFilters && (
                        <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors"
                            disabled={isLoading}
                        >
                            Limpiar Filtros
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdvancedFilter;
