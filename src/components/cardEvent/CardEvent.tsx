import type { IEventDto } from "@/domain/home/home.interface";
import Paginator from "../paginator";

interface CardEventProps {
	events: IEventDto[] | null;
	onEventClick?: (event: IEventDto) => void;
	onFavoriteClick?: (event: IEventDto) => void;
	isLoading?: boolean;
	error?: string | null;
	pagination?: {
		page: number;
		size: number;
		total_items: number;
		total_pages: number;
	} | null;
	onPageChange?: (page: number) => void;
}


const CardEvent: React.FC<CardEventProps> =  ({ 
	events, 
    pagination,
    onPageChange
}) => {

    pagination = {
        size: 6,
        total_items: 10,
        total_pages: 2,
        page: 1
    }

	return (
        <div className='flex flex-wrap gap-4 justify-center'>
            {events?.map(event => (
                <div className='relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-80' key={event.id}>
                    <div className='relative h-56 m-2.5 overflow-hidden text-white rounded-md'>
                        <img
                            src='https://images.unsplash.com/photo-1540553016722-983e48a2cd10?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80'
                            alt='card-image'
                        />
                    </div>
                    <div className='p-4'>
                        <h6 className='mb-2 text-slate-800 text-xl font-semibold'>{event.title}</h6>
                        <p className='text-slate-600 leading-normal font-light'>
                            {event.description}
                        </p>
                    </div>
                    <div className='px-4 pb-4 pt-0 mt-2'>
                        <button
                            className='rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
                            type='button'>
                            Read more
                        </button>
                    </div>
                </div>
            ))}
            {pagination && (
				<Paginator 
					pagination={pagination}
					onPageChange={onPageChange}
				/>
			)}
        </div>
	);
};

export default CardEvent;
