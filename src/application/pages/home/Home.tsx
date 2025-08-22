import Layout from "@application/layout/Layout";
import { useEvents } from "@application/hooks";
import CardEvent from "@/components/cardEvent";

// Componente principal de la página Home
// Muestra la lista de eventos usando el hook personalizado
const Home = () => {
    // Uso del hook personalizado para manejar la lógica de eventos
    const { events, pagination, loading, error, handleEventClick, handleFavoriteClick, handlePageChange } = useEvents(6)
    // Renderizado principal: Lista de eventos
    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Eventos</h1>
                    <p className="text-gray-600 dark:text-gray-400">Descubre los mejores eventos cerca de ti</p>
                </div>

                {/* Componente Table reutilizable */}
                <CardEvent 
                    events={events}
                    isLoading={loading}
                    error={error}
                    onEventClick={handleEventClick}
                    onFavoriteClick={handleFavoriteClick}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                />
            </div>
        </Layout>
    );
};

export default Home;