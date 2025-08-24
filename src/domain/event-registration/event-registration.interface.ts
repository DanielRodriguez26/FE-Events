export interface IEventRegistrationDto {
    id: number;
    event_id: number;
    user_id: number;
    number_of_participants: number;
    created_at: string;
    updated_at: string | null;
    title: string;
    date: string;
    location: string;
    status: string;
}

export interface IRegisterEventPayload {
    event_id: number;
    number_of_participants: number;
}

export interface IPaginatedEventRegistrationDto {
    items: IEventRegistrationDto[];
    page: number;
    size: number;
    total_items: number;
    total_pages: number;
}

export interface IRegistrationResponse {
    id: number;
    event_id: number;
    user_id: number;
    number_of_participants: number;
    created_at: string;
    title: string;
    date: string;
    location: string;
}	
