
const LoadingError = ({ error }: { error: string }) => {
	return (
		<div className='flex items-center justify-center min-h-[400px]'>
			<div className='text-center'>
				<div className='w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4'>
					<svg className='w-8 h-8 text-red-600 dark:text-red-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
						/>
					</svg>
				</div>
				<h2 className='text-xl font-semibold text-red-600 dark:text-red-400 mb-2'>Error al cargar eventos</h2>
				<p className='text-gray-600 dark:text-gray-400'>{error}</p>
			</div>
		</div>
	);
};

export default LoadingError;
