import Layout from '@/application/layout/Layout';
import useStore from '@/store/store';
import { useState } from 'react';

const EventCreate = () => {
	const { setCreateEvent  } = useStore();

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		location: '',
		start_date: '',
		end_date: '',
		capacity: '',
		speaker: '',
	});


	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const eventData = {
			id: 0,
			title: formData.title,
			description: formData.description,
			start_date: formData.start_date,
			end_date: formData.end_date,
			location: formData.location,
			organizer: 'Current User',
			capacity: parseInt(formData.capacity),
			price: 0,
		};
		setCreateEvent(eventData);
	};

	return (
		<Layout>
			<div className='min-h-screen bg-gray-50 py-8'>
				<div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='bg-white shadow-lg rounded-lg overflow-hidden'>
						{/* Header */}
						<div className='bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4'>
							<h1 className='text-2xl font-bold text-white'>Crear Nuevo Evento</h1>
							<p className='text-blue-100 mt-1'>Completa la información del evento</p>
						</div>

						{/* Form */}
						<form onSubmit={handleSubmit} className='p-6 space-y-6'>
							{/* Title */}
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
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
									placeholder='Ingresa el título del evento'
								/>
							</div>

							{/* Description */}
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
									rows={4}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none'
									placeholder='Describe el evento...'
								/>
							</div>
						
							{/* Location */}
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
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
									placeholder='Dirección o lugar del evento'
								/>
							</div>

							{/* Date Range */}
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
										className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
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
										className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
									/>
								</div>
							</div>

							{/* Capacity */}
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
									min='1'
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
									placeholder='Número máximo de participantes'
								/>
							</div>

							{/* Submit Button */}
							<div className='flex justify-end space-x-4 pt-6 border-t border-gray-200'>
								<button
									type='button'
									className='px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'>
									Cancelar
								</button>
								<button
									type='submit'
									className='px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-md hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105'>
									Crear Evento
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default EventCreate;
