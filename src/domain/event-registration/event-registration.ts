import type { SetState } from "zustand";
import { eventRegistrationServices } from "./event-registration.service";
import type { IPaginatedEventRegistrationDto, IRegisterEventPayload, IRegistrationResponse } from "./event-registration.interface";
import type { IFrontendError } from "../settings/error.interface";

const createEventRegistration = (set: SetState<IEventRegistrationStore>) => ({
    // Estado
    myregistrations: null,
    currentRegistration: null,
    isRegistered: false,
    isLoading: false,
    error: null as IFrontendError | null,

    // Acciones para modificar el estado
    setMyRegistrations: async () => {
        const registrations = await eventRegistrationServices.myRegistrations();
        set({ myregistrations: registrations as IPaginatedEventRegistrationDto, isLoading: false });        
    },

    // Registrar a un evento
    registerToEvent: async (payload: IRegisterEventPayload) => {
        const registration = await eventRegistrationServices.registerToEvent(payload);
        set({ 
            currentRegistration: registration as IRegistrationResponse, 
            isRegistered: true, 
            isLoading: false 
        });
    },

    // Cancelar registro
    cancelRegistration: async (eventId: number) => {
        try {
            await eventRegistrationServices.cancelRegistration(eventId);
            set({ 
                currentRegistration: null, 
                isRegistered: false, 
                isLoading: false,
                error: null
            });
            return true;
        } catch (error) {
            set({ 
                error: error as IFrontendError,
                isLoading: false 
            });
            return false;
        }
    },

    // Verificar si está registrado
    checkRegistration: async (eventId: number) => {
        const registration = await eventRegistrationServices.checkRegistration(eventId);
        set({ 
                currentRegistration: registration as IRegistrationResponse, 
                isRegistered: !!registration, 
            isLoading: false 
        });
        return registration as IRegistrationResponse;
    },

    // Limpiar error
    clearError: () => {
        set({ error: null });
    },

    // Establecer error
    setError: (error: IFrontendError | null) => {
        set({ error });
    },

    // Limpiar estado
    clearRegistrationState: () => {
        set({ 
            currentRegistration: null, 
            isRegistered: false, 
            error: null 
        });
    },
});

interface IEventRegistrationStore {
    myregistrations: IPaginatedEventRegistrationDto | null;
    currentRegistration: IRegistrationResponse | null;
    isRegistered: boolean;
    isLoading: boolean;
    error: IFrontendError | null;
    setMyRegistrations: () => Promise<void>;
    registerToEvent: (payload: IRegisterEventPayload) => Promise<boolean>;
    cancelRegistration: (registrationId: number) => Promise<boolean>;
    checkRegistration: (eventId: number) => Promise<IRegistrationResponse | null>;
    clearError: () => void;
    setError: (error: IFrontendError | null) => void;
    clearRegistrationState: () => void;
}

export { createEventRegistration };
export type { IEventRegistrationStore };