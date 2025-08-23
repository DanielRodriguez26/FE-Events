import useStore from "@/store/store";
import { useState } from "react";

const initialFormData = {
    title: '',
    location: '',
    is_active: false,
    date_from: '',
    date_to: '',
}

export const useFilter = () => {
    const { setEventSearch } = useStore();
    const [formData, setFormData] = useState(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentFilters, setCurrentFilters] = useState(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setCurrentFilters(initialFormData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await setEventSearch(formData);
            setCurrentFilters(formData); // Guardar los filtros actuales
            console.log('✅ Filtro aplicado exitosamente');
        } catch (error) {
            console.error('❌ Error al aplicar filtro:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return { 
        formData, 
        handleChange, 
        resetForm, 
        handleSubmit, 
        isSubmitting,
        currentFilters 
    };
}