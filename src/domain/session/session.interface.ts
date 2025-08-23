export interface ISessionDto {
    id: number;
    title: string;
    description: string | null;
    start_time: string;
    end_time: string;
    capacity: number | null;
    event_id: number;
    speaker_id: number | null;
    is_active: boolean;
    created_at: string;
    updated_at: string | null;
    speaker?: {
        id: number;
        name: string;
        email: string;
        bio: string;
        expertise: string[];
    };
    event?: {
        id: number;
        title: string;
        start_date: string;
        end_date: string;
    };
}

export interface ISessionCreateDto {
    title: string;
    description?: string;
    event_id: number;
    speaker_id?: number;
    start_time: string;
    end_time: string;
    capacity?: number;
}

export interface ISessionUpdateDto {
    title?: string;
    description?: string;
    speaker_id?: number;
    start_time?: string;
    end_time?: string;
    capacity?: number;
}

export interface IPaginatedSessionsResponse {
    items: ISessionDto[];
    page: number;
    size: number;
    total_items: number;
    total_pages: number;
}
