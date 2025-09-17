// src/features/auth/hooks/useRegisterForm.ts
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStore from '@infrastructure/store/store';
import type { IRegisterEventPayload } from '@domain/event-registration/event-registration.interface';

export const useRegisterForm = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const {
		eventById,
		setEventById,
		registerToEvent,
		checkRegistration,
		isRegistered,
		currentRegistration,
		isLoading,
		error,
		clearError,
		clearRegistrationState,
	} = useStore();

	const [formData, setFormData] = useState({
		number_of_participants: 1,
	});

	const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

	// Cargar información del evento y verificar registro

	// Validar formulario
	const validateForm = (): boolean => {
		const errors: Record<string, string> = {};

		if (!formData.number_of_participants || formData.number_of_participants < 1) {
			errors.number_of_participants = 'Debe registrar al menos 1 participante';
		}

		if (eventById && formData.number_of_participants > eventById.capacity) {
			errors.number_of_participants = `La capacidad máxima del evento es ${eventById.capacity} participantes`;
		}

		setValidationErrors(errors);
		return Object.keys(errors).length === 0;
	};

	// Manejar cambios en el formulario
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const numValue = parseInt(value) || 0;

		setFormData(prev => ({
			...prev,
			[name]: numValue,
		}));

		// Limpiar error de validación si existe
		if (validationErrors[name]) {
			setValidationErrors(prev => ({
				...prev,
				[name]: '',
			}));
		}
	};

	// Manejar envío del formulario
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm() || !id) {
			return;
		}

		const payload: IRegisterEventPayload = {
			event_id: parseInt(id),
			number_of_participants: formData.number_of_participants,
		};

		const success = await registerToEvent(payload);

		if (success) {
			// Redirigir al detalle del evento o mostrar mensaje de éxito
			navigate(`/event/${id}`, {
				state: {
					message: '¡Te has registrado exitosamente al evento!',
				},
			});
		}
	};

	// Cancelar registro
	const handleCancelRegistration = async () => {
		if (currentRegistration?.id) {
			const success = await useStore.getState().cancelRegistration(parseInt(id));
			if (success) {
				navigate(`/event/${id}`, {
					state: {
						message: 'Registro cancelado exitosamente',
					},
				});
			}
		}
	};

	// Calcular cupos disponibles
	const getAvailableSpots = () => {
		if (!eventById) return 0;
		return Math.max(0, eventById.capacity - (eventById.registered_attendees || 0));
	};

	// Verificar si el evento está lleno
	const isEventFull = () => {
		return getAvailableSpots() === 0;
	};

	// Verificar si el evento ya pasó
	const isEventPast = () => {
		if (!eventById?.start_date) return false;
		return new Date(eventById.start_date) < new Date();
	};

	useEffect(() => {
		if (id) {
			setEventById(parseInt(id));
			checkRegistration(parseInt(id));
		}
	}, [id, setEventById, checkRegistration]);

	return {
		// Estado
		event: eventById,
		isRegistered,
		currentRegistration,
		isLoading,
		error,
		formData,
		validationErrors,

		// Acciones
		handleInputChange,
		handleSubmit,
		handleCancelRegistration,
		clearError,

		// Utilidades
		getAvailableSpots,
		isEventFull,
		isEventPast,

		// Validaciones
		canRegister: !isEventFull() && !isEventPast() && !isRegistered,
		canCancel: isRegistered && !isEventPast(),
	};
};
