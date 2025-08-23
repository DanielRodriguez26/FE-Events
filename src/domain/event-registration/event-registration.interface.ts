export interface IEventRegistrationDto {
    id: number;
    event_id: number;
    user_id: number;
    number_of_participants: number;
    created_at: string;
    updated_at: string | null;
    event_title: string;
    event_date: string;
    event_location: string;
}

export interface IRegisterEventPayload {
    event_id: number;
    number_of_participants: number;
}

export interface IRegistrationResponse {
    id: number;
    event_id: number;
    user_id: number;
    number_of_participants: number;
    created_at: string;
    event_title: string;
    event_date: string;
    event_location: string;
}	
