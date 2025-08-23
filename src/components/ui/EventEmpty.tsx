const EventEmpty = () => {
	return (
		<div className='text-center py-12'>
			<div className='w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6'>
				<svg className='w-12 h-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
					/>
				</svg>
			</div>
			<h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>No hay eventos disponibles</h3>
			<p className='text-gray-500 dark:text-gray-400'>
				No se encontraron eventos con los criterios especificados. 
				Intenta ajustar los filtros o vuelve más tarde.
			</p>
		</div>
	);
};

export default EventEmpty;
