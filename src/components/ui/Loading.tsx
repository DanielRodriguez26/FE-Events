const Loading = () => {
	return (
		<div className='flex items-center justify-center min-h-[400px]'>
			<div className='text-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4'></div>
				<h2 className='text-xl font-semibold text-gray-700 dark:text-gray-300'>Cargando eventos...</h2>
				<p className='text-gray-500 dark:text-gray-400 mt-2'>Por favor espera un momento</p>
			</div>
		</div>
	);
};

export default Loading;
