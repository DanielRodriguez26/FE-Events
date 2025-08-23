import type { SetState } from "zustand";
import { eventRegistrationServices } from "./event-registration.service";
import type { IEventRegistrationDto, IRegisterEventPayload, IRegistrationResponse } from "./event-registration.interface";

const createEventRegistration = (set: SetState<IEventRegistrationStore>) => ({
    // Estado
    myregistrations: null,
    currentRegistration: null,
    isRegistered: false,
    isLoading: false,
    error: null,

    // Acciones para modificar el estado
    setMyRegistrations: async () => {
        set({ isLoading: true, error: null });
        try {
            const registrations = await eventRegistrationServices.myRegistrations();
            set({ myregistrations: registrations as IEventRegistrationDto, isLoading: false });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al cargar registros';
            set({ error: errorMessage, isLoading: false });
        }
    },

    // Registrar a un evento
    registerToEvent: async (payload: IRegisterEventPayload) => {
        set({ isLoading: true, error: null });
        try {
            const registration = await eventRegistrationServices.registerToEvent(payload);
            set({ 
                currentRegistration: registration as IRegistrationResponse, 
                isRegistered: true, 
                isLoading: false 
            });
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al registrarse al evento';
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    // Cancelar registro
    cancelRegistration: async (registrationId: number) => {
        set({ isLoading: true, error: null });
        try {
            await eventRegistrationServices.cancelRegistration(registrationId);
            set({ 
                currentRegistration: null, 
                isRegistered: false, 
                isLoading: false 
            });
            return true;
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error al cancelar registro';
            set({ error: errorMessage, isLoading: false });
            return false;
        }
    },

    // Verificar si está registrado
    checkRegistration: async (eventId: number) => {
        set({ isLoading: true, error: null });
        try {
            const registration = await eventRegistrationServices.checkRegistration(eventId);
            set({ 
                currentRegistration: registration as IRegistrationResponse, 
                isRegistered: !!registration, 
                isLoading: false 
            });
            return registration as IRegistrationResponse;
        } catch {
            set({ isRegistered: false, isLoading: false });
            return null;
        }
    },

    // Limpiar error
    clearError: () => {
        set({ error: null });
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
    myregistrations: IEventRegistrationDto | null;
    currentRegistration: IRegistrationResponse | null;
    isRegistered: boolean;
    isLoading: boolean;
    error: string | null;
    setMyRegistrations: () => Promise<void>;
    registerToEvent: (payload: IRegisterEventPayload) => Promise<boolean>;
    cancelRegistration: (registrationId: number) => Promise<boolean>;
    checkRegistration: (eventId: number) => Promise<IRegistrationResponse | null>;
    clearError: () => void;
    clearRegistrationState: () => void;
}

export { createEventRegistration };
export type { IEventRegistrationStore };