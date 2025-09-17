import type { TimeValidationResult } from '@/utils/timeValidation';
import type { ISessionDto } from '@/domain/session/session.interface';
import type { ISpeakerDto } from '@/domain/speaker/speaker.interface';

interface SessionFormProps {
	formData: {
		title: string;
		description: string;
		start_time: string;
		end_time: string;
		speaker: string;
		room: string;
		capacity: number;
		event_id: number;
		speaker_id: number;
	};
	editingSession: ISessionDto | null;
	speakers: ISpeakerDto[] | null;
	isLoading: boolean;
	timeValidation: TimeValidationResult | null;
	handleInputChange: (field: string, value: string | number) => void;
	handleSubmit: (e: React.FormEvent) => void;
	handleCancel: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({
	formData,
	editingSession,
	speakers,
	isLoading,
	timeValidation,
	handleInputChange,
	handleSubmit,
	handleCancel,
}) => {
	return (
		<div className='bg-white rounded-lg shadow-sm p-6 border'>
			<h4 className='text-lg font-medium text-gray-900 mb-4'>{editingSession ? 'Editar Sesión' : 'Nueva Sesión'}</h4>
			<form onSubmit={handleSubmit} className='space-y-4'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>Título de la Sesión *</label>
						<input
							type='text'
							value={formData.title}
							onChange={e => handleInputChange('title', e.target.value)}
							required
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>Sala *</label>
						<input
							type='text'
							value={formData.room}
							onChange={e => handleInputChange('room', e.target.value)}
							required
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</div>
				</div>

				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>Descripción *</label>
					<textarea
						value={formData.description}
						onChange={e => handleInputChange('description', e.target.value)}
						required
						rows={3}
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
				</div>

				<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>Hora de Inicio *</label>
						<input
							type='datetime-local'
							value={formData.start_time}
							onChange={e => handleInputChange('start_time', e.target.value)}
							required
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								timeValidation?.errors.some(e => e.includes('inicio'))
									? 'border-red-500 focus:ring-red-500'
									: 'border-gray-300'
							}`}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>Hora de Fin *</label>
						<input
							type='datetime-local'
							value={formData.end_time}
							onChange={e => handleInputChange('end_time', e.target.value)}
							required
							className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
								timeValidation?.errors.some(e => e.includes('fin'))
									? 'border-red-500 focus:ring-red-500'
									: 'border-gray-300'
							}`}
						/>
					</div>

					<div>
						<label className='block text-sm font-medium text-gray-700 mb-2'>Capacidad</label>
						<input
							type='number'
							value={formData.capacity}
							onChange={e => handleInputChange('capacity', parseInt(e.target.value))}
							min='1'
							className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</div>
				</div>

				{/* Mostrar errores y advertencias de validación de horarios */}
				{timeValidation && (timeValidation.errors.length > 0 || timeValidation.warnings.length > 0) && (
					<div className='mt-4'>
						{timeValidation.errors.length > 0 && (
							<div className='bg-red-50 border border-red-200 rounded-md p-4 mb-3'>
								<div className='flex'>
									<div className='flex-shrink-0'>
										<svg className='h-5 w-5 text-red-400' viewBox='0 0 20 20' fill='currentColor'>
											<path
												fillRule='evenodd'
												d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
												clipRule='evenodd'
											/>
										</svg>
									</div>
									<div className='ml-3'>
										<h3 className='text-sm font-medium text-red-800'>Errores de validación de horarios</h3>
										<div className='mt-2 text-sm text-red-700'>
											<ul className='list-disc pl-5 space-y-1'>
												{timeValidation.errors.map((error, index) => (
													<li key={index}>{error}</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
						)}

						{timeValidation.warnings.length > 0 && (
							<div className='bg-yellow-50 border border-yellow-200 rounded-md p-4'>
								<div className='flex'>
									<div className='flex-shrink-0'>
										<svg className='h-5 w-5 text-yellow-400' viewBox='0 0 20 20' fill='currentColor'>
											<path
												fillRule='evenodd'
												d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
												clipRule='evenodd'
											/>
										</svg>
									</div>
									<div className='ml-3'>
										<h3 className='text-sm font-medium text-yellow-800'>Advertencias de horarios</h3>
										<div className='mt-2 text-sm text-yellow-700'>
											<ul className='list-disc pl-5 space-y-1'>
												{timeValidation.warnings.map((warning, index) => (
													<li key={index}>{warning}</li>
												))}
											</ul>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				)}
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-2'>Ponente *</label>
					<select
						value={formData.speaker_id}
						onChange={e => handleInputChange('speaker_id', e.target.value)}
						required
						className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'>
						<option value=''>Seleccionar ponente...</option>
						{speakers?.map(speaker => (
							<option key={speaker.id} value={speaker.id}>
								{speaker.name} {speaker.company ? `- ${speaker.company}` : ''}
							</option>
						))}
					</select>
				</div>
				{/* Botones de acción */}
				<div className='flex justify-end space-x-3 pt-4'>
					<button
						type='button'
						onClick={handleCancel}
						className='px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors'>
						Cancelar
					</button>
					<button
						type='submit'
						disabled={isLoading || (timeValidation ? !timeValidation.isValid : false)}
						className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
						{isLoading ? 'Guardando...' : editingSession ? 'Actualizar' : 'Crear'}
					</button>
				</div>
			</form>
		</div>
	);
};

export default SessionForm;
