import type { SetState } from "zustand";
import { speakerServices } from "./speaker.service";
import type { ISpeakerDto } from "./speaker.interface";


const createSpeakerState = (set: SetState<ISpeakerStore>): ISpeakerStore => ({
    speaker: null,
    setSpeaker: async () => {
        const speakers = await speakerServices.getAllSpeakers();
        set({ speaker: speakers });
    },

});

interface ISpeakerStore {
    speaker: ISpeakerDto[] | null;
    setSpeaker: () => Promise<void>;
}


export { createSpeakerState, type ISpeakerStore };