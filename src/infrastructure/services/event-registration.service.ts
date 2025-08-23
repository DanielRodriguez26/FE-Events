import { apiClient } from '@/infrastructure/api/apiClient';
import type { 
	IEventRegistrationDto, 
	IPaginatedEventRegistrationsResponse,
	ICreateEventRegistrationDto,
	IUpdateEventRegistrationDto 
} from '@/domain/event-registration/event-registration.interface';

export class EventRegistrationService {
	/**
	 * Obtiene los eventos registrados del usuario autenticado
	 */
	static async getMyRegistrations(page: number = 1, size: number = 10): Promise<IPaginatedEventRegistrationsResponse> {
		try {
			const response = await apiClient.get('/api/v1/event-registrations/my-registrations', {
				params: { page, size }
			});
			return response.data;
		} catch (error) {
			console.error('Error fetching my registrations:', error);
			throw error;
		}
	}

	/**
	 * Registra al usuario en un evento
	 */
	static async registerForEvent(eventId: number): Promise<IEventRegistrationDto> {
		try {
			const response = await apiClient.post('/api/v1/event-registrations', {
				event_id: eventId
			});
			return response.data;
		} catch (error) {
			console.error('Error registering for event:', error);
			throw error;
		}
	}

	/**
	 * Cancela el registro de un evento
	 */
	static async cancelRegistration(registrationId: number): Promise<void> {
		try {
			await apiClient.patch(`/api/v1/event-registrations/${registrationId}`, {
				status: 'cancelled'
			});
		} catch (error) {
			console.error('Error cancelling registration:', error);
			throw error;
		}
	}

	/**
	 * Actualiza el estado de un registro (solo para organizadores)
	 */
	static async updateRegistrationStatus(
		registrationId: number, 
		status: IUpdateEventRegistrationDto['status']
	): Promise<IEventRegistrationDto> {
		try {
			const response = await apiClient.patch(`/api/v1/event-registrations/${registrationId}`, {
				status
			});
			return response.data;
		} catch (error) {
			console.error('Error updating registration status:', error);
			throw error;
		}
	}

	/**
	 * Verifica si el usuario está registrado en un evento específico
	 */
	static async checkRegistrationStatus(eventId: number): Promise<{ is_registered: boolean; registration?: IEventRegistrationDto }> {
		try {
			const response = await apiClient.get(`/api/v1/event-registrations/check/${eventId}`);
			return response.data;
		} catch (error) {
			console.error('Error checking registration status:', error);
			throw error;
		}
	}
}
