import type { SetState } from "zustand";
import { eventRegistrationServices } from "./event-registration.service";
import type { IEventRegistrationDto } from "./event-registration.interface";




const createEventRegistration = (set: SetState<IEventRegistrationStore>) => ({
    // Acciones para modificar el estado
    myregistrations: null,

    setMyRegistrations: async () => {
        const registrations = await eventRegistrationServices.myRegistrations();
        set({ myregistrations: registrations as IEventRegistrationDto });
    },
});

interface IEventRegistrationStore {
    myregistrations: IEventRegistrationDto | null;
    setMyRegistrations: () => Promise<void>;
}

export { createEventRegistration };
export type { IEventRegistrationStore };