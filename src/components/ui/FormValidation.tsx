import React from 'react';

export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => boolean;
    message?: string;
}

export interface ValidationErrors {
    [key: string]: string[];
}

export interface FormField {
    name: string;
    label: string;
    type: 'text' | 'email' | 'password' | 'number' | 'date' | 'textarea' | 'select';
    placeholder?: string;
    options?: { value: string; label: string }[];
    validation?: ValidationRule;
    value: any;
    onChange: (value: any) => void;
    disabled?: boolean;
}

interface FormValidationProps {
    fields: FormField[];
    errors: ValidationErrors;
    onSubmit: () => void;
    submitLabel?: string;
    isLoading?: boolean;
    showErrors?: boolean;
}

const FormValidation: React.FC<FormValidationProps> = ({
    fields,
    errors,
    onSubmit,
    submitLabel = 'Guardar',
    isLoading = false,
    showErrors = true
}) => {
    const getFieldError = (fieldName: string): string | null => {
        return errors[fieldName]?.[0] || null;
    };

    const renderField = (field: FormField) => {
        const error = getFieldError(field.name);
        const baseClasses = "w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed";
        const errorClasses = error ? "border-red-300" : "border-gray-300";

        switch (field.type) {
            case 'textarea':
                return (
                    <textarea
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        rows={4}
                        className={`${baseClasses} ${errorClasses}`}
                    />
                );

            case 'select':
                return (
                    <select
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={field.disabled}
                        className={`${baseClasses} ${errorClasses}`}
                    >
                        <option value="">{field.placeholder || 'Seleccionar...'}</option>
                        {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                );

            case 'date':
                return (
                    <input
                        type="date"
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        disabled={field.disabled}
                        className={`${baseClasses} ${errorClasses}`}
                    />
                );

            default:
                return (
                    <input
                        type={field.type}
                        value={field.value || ''}
                        onChange={(e) => field.onChange(e.target.value)}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        className={`${baseClasses} ${errorClasses}`}
                    />
                );
        }
    };

    return (
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
            {fields.map((field) => (
                <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                        {field.validation?.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {renderField(field)}
                    
                    {showErrors && getFieldError(field.name) && (
                        <p className="mt-1 text-sm text-red-600">
                            {getFieldError(field.name)}
                        </p>
                    )}
                </div>
            ))}

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isLoading ? (
                        <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Guardando...
                        </div>
                    ) : (
                        submitLabel
                    )}
                </button>
            </div>
        </form>
    );
};

// Utilidades de validación
export const validationRules = {
    required: (message = 'Este campo es requerido'): ValidationRule => ({
        required: true,
        message
    }),

    email: (message = 'Ingrese un email válido'): ValidationRule => ({
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message
    }),

    phone: (message = 'Ingrese un teléfono válido'): ValidationRule => ({
        pattern: /^[\+]?[1-9][\d]{0,15}$/,
        message
    }),

    minLength: (length: number, message?: string): ValidationRule => ({
        minLength: length,
        message: message || `Mínimo ${length} caracteres`
    }),

    maxLength: (length: number, message?: string): ValidationRule => ({
        maxLength: length,
        message: message || `Máximo ${length} caracteres`
    }),

    // Validaciones específicas para eventos
    eventTitle: (): ValidationRule => ({
        required: true,
        minLength: 3,
        maxLength: 100,
        message: 'El título debe tener entre 3 y 100 caracteres'
    }),

    eventDescription: (): ValidationRule => ({
        required: true,
        minLength: 10,
        maxLength: 1000,
        message: 'La descripción debe tener entre 10 y 1000 caracteres'
    }),

    eventCapacity: (): ValidationRule => ({
        required: true,
        custom: (value) => value > 0 && value <= 10000,
        message: 'La capacidad debe estar entre 1 y 10,000 personas'
    }),

    eventPrice: (): ValidationRule => ({
        custom: (value) => value >= 0,
        message: 'El precio no puede ser negativo'
    }),

    eventDate: (): ValidationRule => ({
        required: true,
        custom: (value) => {
            const selectedDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selectedDate >= today;
        },
        message: 'La fecha del evento debe ser futura'
    }),

    eventEndDate: (startDate: string): ValidationRule => ({
        required: true,
        custom: (value) => {
            const endDate = new Date(value);
            const start = new Date(startDate);
            return endDate > start;
        },
        message: 'La fecha de finalización debe ser posterior a la fecha de inicio'
    })
};

// Función para validar un formulario
export const validateForm = (fields: FormField[]): ValidationErrors => {
    const errors: ValidationErrors = {};

    fields.forEach((field) => {
        const fieldErrors: string[] = [];
        const value = field.value;
        const rules = field.validation;

        if (!rules) return;

        // Validación requerida
        if (rules.required && (!value || value.toString().trim() === '')) {
            fieldErrors.push(rules.message || 'Este campo es requerido');
        }

        // Validación de longitud mínima
        if (rules.minLength && value && value.toString().length < rules.minLength) {
            fieldErrors.push(rules.message || `Mínimo ${rules.minLength} caracteres`);
        }

        // Validación de longitud máxima
        if (rules.maxLength && value && value.toString().length > rules.maxLength) {
            fieldErrors.push(rules.message || `Máximo ${rules.maxLength} caracteres`);
        }

        // Validación de patrón
        if (rules.pattern && value && !rules.pattern.test(value.toString())) {
            fieldErrors.push(rules.message || 'Formato inválido');
        }

        // Validación personalizada
        if (rules.custom && value && !rules.custom(value)) {
            fieldErrors.push(rules.message || 'Valor inválido');
        }

        if (fieldErrors.length > 0) {
            errors[field.name] = fieldErrors;
        }
    });

    return errors;
};

export default FormValidation;
