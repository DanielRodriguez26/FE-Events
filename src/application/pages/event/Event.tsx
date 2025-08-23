import { useEvents } from "@/application/hooks";
import Layout from "@/application/layout/Layout";
import Table from "@/components/table";
import { AdvancedFilter } from "@/components/filter";
import type { IEventFilter } from "@/domain/event/event.interface";

const Event = () => {
    // Uso del hook personalizado para manejar la lógica de eventos
    const { 
        events, 
        pagination, 
        loading, 
        error, 
        handleEventClick, 
        handlePageChange, 
        handleDeleteClick
    } = useEvents(10);

    const handleFilterChange = (newFilters: IEventFilter) => {
        // TODO: Implementar filtros en el hook useEvents
        console.log('Filtros aplicados:', newFilters);
    };

    const handleClearFilters = () => {
        // TODO: Implementar limpieza de filtros en el hook useEvents
        console.log('Filtros limpiados');
    };

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Eventos</h1>
                    <p className="text-gray-600 dark:text-gray-400">Descubre los mejores eventos cerca de ti</p>
                </div>

                {/* Filtros avanzados */}
                <AdvancedFilter
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    isLoading={loading}
                />

                {/* Componente Table reutilizable */}
                <Table 
                    events={events}
                    isLoading={loading}
                    error={error}
                    onEventClick={handleEventClick}
                    onDeleteClick={handleDeleteClick}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                />
            </div>
        </Layout>
    );
}

export default Event;