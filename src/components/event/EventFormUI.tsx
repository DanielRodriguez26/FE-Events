interface EventFormUIProps {
	formData: {
		title: string;
		description: string;
		location: string;
		start_date: string;
		end_date: string;
		capacity: string;
		speaker: string;
	};
	loading: boolean;
	isEditing: boolean;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
	handleSubmit: (e: React.FormEvent) => void;
	handleCancel: () => void;
}

const EventFormUI: React.FC<EventFormUIProps> = ({
	formData,
	loading,
	isEditing,
	handleInputChange,
	handleSubmit,
	handleCancel,
}) => {
	return (
		<div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
			<div className='bg-white shadow-lg rounded-lg overflow-hidden'>
				<div className='bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4'>
					<h1 className='text-2xl font-bold text-white'>{isEditing ? 'Editar Evento' : 'Crear Nuevo Evento'}</h1>
					<p className='text-blue-100 mt-1'>
						{isEditing ? 'Modifica la información del evento' : 'Completa la información del evento'}
					</p>
				</div>

				<form onSubmit={handleSubmit} className='p-6 space-y-6'>
					{/* ... (todos los campos del formulario) ... */}
					<div>
						<label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-2'>
							Título del Evento *
						</label>
						<input
							type='text'
							id='title'
							name='title'
							value={formData.title}
							onChange={handleInputChange}
							required
							disabled={loading}
							className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed'
							placeholder='Ingresa el título del evento'
						/>
					</div>
					{/* ... (otros campos como description, location, dates, capacity) ... */}
					<div>
						<label htmlFor='description' className='block text-sm font-medium text-gray-700 mb-2'>
							Descripción *
						</label>
						<textarea
							id='description'
							name='description'
							value={formData.description}
							onChange={handleInputChange}
							required
							disabled={loading}
							rows={4}
							className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed'
							placeholder='Describe el evento...'
						/>
					</div>
					<div>
						<label htmlFor='location' className='block text-sm font-medium text-gray-700 mb-2'>
							Ubicación *
						</label>
						<input
							type='text'
							id='location'
							name='location'
							value={formData.location}
							onChange={handleInputChange}
							required
							disabled={loading}
							className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed'
							placeholder='Dirección o lugar del evento'
						/>
					</div>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label htmlFor='start_date' className='block text-sm font-medium text-gray-700 mb-2'>
								Fecha de Inicio *
							</label>
							<input
								type='datetime-local'
								id='start_date'
								name='start_date'
								value={formData.start_date}
								onChange={handleInputChange}
								required
								disabled={loading}
								className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed'
							/>
						</div>
						<div>
							<label htmlFor='end_date' className='block text-sm font-medium text-gray-700 mb-2'>
								Fecha de Fin *
							</label>
							<input
								type='datetime-local'
								id='end_date'
								name='end_date'
								value={formData.end_date}
								onChange={handleInputChange}
								required
								disabled={loading}
								min={formData.start_date || undefined}
								className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed'
							/>
						</div>
					</div>
					<div>
						<label htmlFor='capacity' className='block text-sm font-medium text-gray-700 mb-2'>
							Capacidad *
						</label>
						<input
							type='number'
							id='capacity'
							name='capacity'
							value={formData.capacity}
							onChange={handleInputChange}
							required
							disabled={loading}
							min='1'
							className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed'
							placeholder='Número máximo de participantes'
						/>
					</div>
					<div className='flex justify-end space-x-4 pt-6 border-t border-gray-200'>
						<button
							type='button'
							onClick={handleCancel}
							disabled={loading}
							className='px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed'>
							Cancelar
						</button>
						<button
							type='submit'
							disabled={loading}
							className='px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'>
							{loading ? (
								<span className='flex items-center'>
									<div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></div>
									{isEditing ? 'Actualizando...' : 'Creando...'}
								</span>
							) : isEditing ? (
								'Actualizar Evento'
							) : (
								'Crear Evento'
							)}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EventFormUI;
