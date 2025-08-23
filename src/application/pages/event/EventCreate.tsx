import Layout from '@/application/layout/Layout';
import EventFormUI from '@/components/event/EventFormUI';
import { useEventForm } from '@/application/hooks/useEventForm';

const EventForm = () => {
    // 1. Usar el hook para obtener toda la lógica y el estado
    const { 
        formData, 
        loading, 
        isEditing, 
        handleInputChange, 
        handleSubmit, 
        handleCancel 
    } = useEventForm();

    // 2. Manejar la carga inicial
    if (loading && isEditing) {
        return (
            <Layout>
                <div className='min-h-screen bg-gray-50 py-8 flex items-center justify-center'>
                    <div className='text-center'>
                        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
                        <p className='mt-4 text-gray-600'>Cargando evento...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    // 3. Renderizar el componente de UI y pasarle los props
    return (
        <Layout>
            <div className='min-h-screen bg-gray-50 py-8'>
                <EventFormUI
                    formData={formData}
                    loading={loading}
                    isEditing={isEditing}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    handleCancel={handleCancel}
                />
            </div>
        </Layout>
    );
};

export default EventForm;