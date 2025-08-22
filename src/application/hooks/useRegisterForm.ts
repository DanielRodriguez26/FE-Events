// src/features/auth/hooks/useRegisterForm.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@application/hooks';

// Define el tipo para los datos del formulario para mayor seguridad
type FormData = {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
};

const initialFormData: FormData = {
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
};

export const useRegisterForm = () => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, error, clearError } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const passwordsMatch = formData.password === formData.confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordsMatch) return;

        setIsSubmitting(true);
        clearError();

        try {
            const success = await register({
                first_name: formData.first_name,
                last_name: formData.last_name,
                username: formData.username,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                confirm_password: formData.confirmPassword,
                is_active: true,
                role_id: 13,
            });

            if (success) {
                navigate('/', { replace: true });
            }
        } catch (err) {
            console.error('Error en registro:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        formData,
        isSubmitting,
        error,
        handleChange,
        handleSubmit,
        passwordsMatch,
        navigate, // Lo devolvemos por si el componente de UI lo necesita
    };
};