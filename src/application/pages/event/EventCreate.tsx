import Layout from '@/application/layout/Layout';
import useStore from '@/store/store';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { IEventDto } from '@/domain/event/event.interface';

const EventForm = () => {
	const { setCreateEvent, setUpdateEvent, setEventById, eventById } = useStore();
	const navigate = useNavigate();
	const { id } = useParams<{ id: string }>();
	const isEditing = Boolean(id);

	const [formData, setFormData] = useState({
		title: '',
		description: '',
		location: '',
		start_date: '',
		end_date: '',
		capacity: '',
		speaker: '',
	});

	const [loading, setLoading] = useState(false);

	// Cargar datos del evento si estamos editando
	useEffect(() => {
		if (isEditing && id) {
			const loadEventData = async () => {
				try {
					setLoading(true);
					await setEventById(parseInt(id));
				} catch (error) {
					console.error('Error al cargar el evento:', error);
					navigate('/events');
				} finally {
					setLoading(false);
				}
			};
			loadEventData();
		}
	}, [id, isEditing, setEventById, navigate]);

	// Función para formatear fecha a formato datetime-local
	const formatDateForInput = (dateString: string): string => {
		if (!dateString) return '';
		
		const date = new Date(dateString);
		
		// Verificar si la fecha es válida
		if (isNaN(date.getTime())) return '';
		
		// Obtener año, mes, día, hora y minutos en la zona horaria local
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, '0');
		const day = String(date.getDate()).padStart(2, '0');
		const hours = String(date.getHours()).padStart(2, '0');
		const minutes = String(date.getMinutes()).padStart(2, '0');
		
		// Retornar en formato YYYY-MM-DDTHH:MM
		return `${year}-${month}-${day}T${hours}:${minutes}`;
	};

	// Actualizar formulario cuando se cargan los datos del evento
	useEffect(() => {
		if (eventById && isEditing) {
			setFormData({
				title: eventById.title || '',
				description: eventById.description || '',
				location: eventById.location || '',
				start_date: formatDateForInput(eventById.start_date),
				end_date: formatDateForInput(eventById.end_date),
				capacity: eventById.capacity?.toString() || '',
				speaker: '',
			});
		}
	}, [eventById, isEditing]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);

		// Validar que la fecha de fin sea posterior a la fecha de inicio
		const startDate = new Date(formData.start_date);
		const endDate = new Date(formData.end_date);
		
		if (endDate <= startDate) {
			alert('La fecha de fin debe ser posterior a la fecha de inicio');
			setLoading(false);
			return;
		}

		const eventData: IEventDto = {
			id: isEditing ? parseInt(id!) : 0,
			title: formData.title,
			description: formData.description,
			start_date: formData.start_date,
			end_date: formData.end_date,
			location: formData.location,
			organizer: 'Current User',
			capacity: parseInt(formData.capacity),
			price: 0,
		};
		
		try {
			if (isEditing) {
				await setUpdateEvent(parseInt(id!), eventData);
			} else {
				await setCreateEvent(eventData);
			}
			// Redirigir a la pantalla de eventos después de crear/editar exitosamente
			navigate('/events');
		} catch (error) {
			console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} el evento:`, error);
			// Aquí podrías mostrar un mensaje de error al usuario
		} finally {
			setLoading(false);
		}
	};

	const handleCancel = () => {
		navigate('/events');
	};

	if (loading && isEditing) {
		return (
			<Layout>
				<div className='min-h-screen bg-gray-50 py-8 flex items-center justify-center'>
					<div className='text-center'>
						<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
						<p className='mt-4 text-gray-600'>Cargando evento...</p>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout>
			<div className='min-h-screen bg-gray-50 py-8'>
				<div className='max-w-2xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='bg-white shadow-lg rounded-lg overflow-hidden'>
						{/* Header */}
						<div className='bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4'>
							<h1 className='text-2xl font-bold text-white'>
								{isEditing ? 'Editar Evento' : 'Crear Nuevo Evento'}
							</h1>
							<p className='text-blue-100 mt-1'>
								{isEditing ? 'Modifica la información del evento' : 'Completa la información del evento'}
							</p>
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
									disabled={loading}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed'
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
									disabled={loading}
									rows={4}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none disabled:bg-gray-100 disabled:cursor-not-allowed'
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
									disabled={loading}
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed'
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
									disabled={loading}
									min='1'
									className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed'
									placeholder='Número máximo de participantes'
								/>
							</div>

							{/* Submit Button */}
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
									) : (
										isEditing ? 'Actualizar Evento' : 'Crear Evento'
									)}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default EventForm;
