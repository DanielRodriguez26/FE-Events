import { useEventFilters } from '@/application/hooks';
import InputField from '../ui/InputField';
import useStore from '@infrastructure/store/store';

const Filter = () => {
	const { formData, handleChange, handleSubmit, isSubmitting, clearFilters } = useEventFilters();
	const { allevents } = useStore();
	const events = allevents?.items || [];

	return (
		<div className='flex flex-col rounded-lg shadow-sm max-w-full p-8 my-6 border border-slate-600'>
			<form className='flex flex-row gap-4' onSubmit={handleSubmit}>
				<InputField
					id='title'
					name='title'
					type='text'
					placeholder='Título del evento'
					value={formData.title}
					onChange={handleChange}
				/>
				<select
					name='location'
					value={formData.location}
					onChange={e =>
						handleChange({
							target: { name: e.target.name, value: e.target.value },
						} as React.ChangeEvent<HTMLInputElement>)
					}
					className='w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer'>
					<option value=''>Todas las ubicaciones</option>
					{events.map(event => (
						<option key={event.id} value={event.location}>
							{event.location}
						</option>
					))}
				</select>
				<InputField
					id='date_from'
					name='date_from'
					type='date'
					placeholder='Fecha desde'
					value={formData.date_from}
					onChange={handleChange}
				/>
				<InputField
					id='date_to'
					name='date_to'
					type='date'
					placeholder='Fecha hasta'
					value={formData.date_to}
					onChange={handleChange}
				/>
				<div className='flex items-center gap-2'>
					<input
						type='checkbox'
						id='is_active'
						name='is_active'
						checked={formData.is_active || true}
						onChange={handleChange}
						className='w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500'
					/>
					<label htmlFor='is_active' className='text-sm text-gray-700'>
						Solo activos
					</label>
				</div>
				<button
					type='submit'
					disabled={isSubmitting}
					className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
					{isSubmitting ? 'Filtrando...' : 'Filtrar'}
				</button>
				<button
					type='button'
					onClick={clearFilters}
					className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors'>
					Limpiar
				</button>
			</form>
		</div>
	);
};

export default Filter;
