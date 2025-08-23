import { useState, useEffect, useCallback } from 'react';
import { EventRegistrationService } from '@/infrastructure/services/event-registration.service';
import type { IEventRegistrationDto, IPaginatedEventRegistrationsResponse } from '@/domain/event-registration/event-registration.interface';
import useStore from '@store/store';

interface UseMyRegistrationsReturn {
	registrations: IEventRegistrationDto[] | null;
	pagination: {
		page: number;
		size: number;
		total_items: number;
		total_pages: number;
	} | null;
	loading: boolean;
	error: string | null;
	currentPage: number;
	registerForEvent: (eventId: number) => Promise<void>;
	cancelRegistration: (registrationId: number) => Promise<void>;
	loadRegistrations: (page?: number) => Promise<void>;
	reloadRegistrations: () => Promise<void>;
}

export const useMyRegistrations = (pageSize: number = 10): UseMyRegistrationsReturn => {
	const { token, isAuthenticated } = useStore();
	const [registrations, setRegistrations] = useState<IEventRegistrationDto[] | null>(null);
	const [pagination, setPagination] = useState<IPaginatedEventRegistrationsResponse['pagination'] | null>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [currentPage, setCurrentPage] = useState(1);

	// Función para cargar los registros
	const loadRegistrations = useCallback(async (page: number = 1) => {
		if (!isAuthenticated || !token) {
			setError('Usuario no autenticado');
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const response = await EventRegistrationService.getMyRegistrations(page, pageSize);
			setRegistrations(response.items);
			setPagination({
				page: response.page,
				size: response.size,
				total_items: response.total_items,
				total_pages: response.total_pages
			});
			setCurrentPage(page);
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || err.message || 'Error al cargar los registros';
			setError(errorMessage);
			setRegistrations(null);
			setPagination(null);
		} finally {
			setLoading(false);
		}
	}, [isAuthenticated, token, pageSize]);

	// Función para registrar en un evento
	const registerForEvent = useCallback(async (eventId: number) => {
		if (!isAuthenticated || !token) {
			throw new Error('Usuario no autenticado');
		}

		setLoading(true);
		setError(null);

		try {
			await EventRegistrationService.registerForEvent(eventId);
			// Recargar los registros después de registrar
			await loadRegistrations(currentPage);
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || err.message || 'Error al registrarse en el evento';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, [isAuthenticated, token, loadRegistrations, currentPage]);

	// Función para cancelar un registro
	const cancelRegistration = useCallback(async (registrationId: number) => {
		if (!isAuthenticated || !token) {
			throw new Error('Usuario no autenticado');
		}

		setLoading(true);
		setError(null);

		try {
			await EventRegistrationService.cancelRegistration(registrationId);
			// Recargar los registros después de cancelar
			await loadRegistrations(currentPage);
		} catch (err: any) {
			const errorMessage = err.response?.data?.message || err.message || 'Error al cancelar el registro';
			setError(errorMessage);
			throw err;
		} finally {
			setLoading(false);
		}
	}, [isAuthenticated, token, loadRegistrations, currentPage]);

	// Función para recargar los registros
	const reloadRegistrations = useCallback(async () => {
		await loadRegistrations(currentPage);
	}, [loadRegistrations, currentPage]);

	// Cargar registros al montar el componente
	useEffect(() => {
		if (isAuthenticated && token) {
			loadRegistrations(1);
		}
	}, [isAuthenticated, token, loadRegistrations]);

	return {
		registrations,
		pagination,
		loading,
		error,
		currentPage,
		registerForEvent,
		cancelRegistration,
		loadRegistrations,
		reloadRegistrations
	};
};
