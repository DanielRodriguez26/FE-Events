import { useEvents } from "@/application/hooks";
import Layout from "@/application/layout/Layout";
import Table from "@/components/table";

const Event = () => {
    // Uso del hook personalizado para manejar la lógica de eventos
    const { events, pagination, loading, error, handleEventClick, handlePageChange, handleDeleteClick } = useEvents(10);
    // Remover la navegación automática para evitar loops infinitos
    // La navegación se manejará desde el componente Table
    // Renderizado principal: Lista de eventos
    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Eventos</h1>
                    <p className="text-gray-600 dark:text-gray-400">Descubre los mejores eventos cerca de ti</p>
                </div>

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


export default Event