import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useStore from '@/store/store';
import type { IEventDto } from '@/domain/event/event.interface';

// Helper function para el formato de fecha (puede ser una utilidad compartida)
const formatDateForInput = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const useEventForm = () => {
    const { setCreateEvent, setUpdateEvent, setEventById, eventById } = useStore();
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        start_date: '',
        end_date: '',
        capacity: '',
        speaker: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isEditing && id) {
            const loadEventData = async () => {
                setLoading(true);
                try {
                    await setEventById(parseInt(id));
                } catch (error) {
                    console.error('Error al cargar el evento:', error);
                    navigate('/events');
                } finally {
                    setLoading(false);
                }
            };
            loadEventData();
        }
    }, [id, isEditing, setEventById, navigate]);

    useEffect(() => {
        if (eventById && isEditing) {
            setFormData({
                title: eventById.title || '',
                description: eventById.description || '',
                location: eventById.location || '',
                start_date: formatDateForInput(eventById.start_date),
                end_date: formatDateForInput(eventById.end_date),
                capacity: eventById.capacity?.toString() || '',
                speaker: '',
            });
        }
    }, [eventById, isEditing]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const startDate = new Date(formData.start_date);
        const endDate = new Date(formData.end_date);
        
        if (endDate <= startDate) {
            alert('La fecha de fin debe ser posterior a la fecha de inicio');
            setLoading(false);
            return;
        }

        const eventData: IEventDto = {
            id: isEditing ? parseInt(id!) : 0,
            title: formData.title,
            description: formData.description,
            start_date: formData.start_date,
            end_date: formData.end_date,
            location: formData.location,
            organizer: 'Current User', // Esto debería venir del store de usuario
            capacity: parseInt(formData.capacity),
            price: 0,
        };
        
        try {
            if (isEditing) {
                await setUpdateEvent(parseInt(id!), eventData);
            } else {
                await setCreateEvent(eventData);
            }
            navigate('/events');
        } catch (error) {
            console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} el evento:`, error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/events');
    };

    return {
        formData,
        loading,
        isEditing,
        handleInputChange,
        handleSubmit,
        handleCancel,
    };
};