import { get, post } from '../settings/http.service';
import { BACKEND_ENDPOINTS } from '../settings/backend.config';

// Interfaz para el payload de registro
interface IRegisterEventPayload {
    event_id: number;
    number_of_participants: number;
}

const myRegistrations = async () => {
    const response = await get({ 
		url: 'user_registrations', 
		baseURL: BACKEND_ENDPOINTS.eventRegistration,
	});
    return response;
};

// Servicio para registrar a un evento
const registerToEvent = async (payload: IRegisterEventPayload) => {
    const response = await post({
        url: 'register',
        baseURL: BACKEND_ENDPOINTS.eventRegistration,
        payload,
    });
    return response;
};

// Servicio para cancelar registro a un evento
const cancelRegistration = async (registrationId: number) => {
    const response = await post({
        url: `cancel/${registrationId}`,
        baseURL: BACKEND_ENDPOINTS.eventRegistration,
    });
    return response;
};

// Servicio para verificar si el usuario ya está registrado
const checkRegistration = async (eventId: number) => {
    const response = await get({
        url: `check-registration/${eventId}`,
        baseURL: BACKEND_ENDPOINTS.eventRegistration,
    });
    return response;
};

const eventRegistrationServices = {
    myRegistrations,
    registerToEvent,
    cancelRegistration,
    checkRegistration,
};

export { eventRegistrationServices };
export type { IRegisterEventPayload };