import { useState } from 'react';
import useStore from '@infrastructure/store/store';
import type { IEventFilter } from '@/domain/event/event.interface';

const initialFormData: IEventFilter = {
	title: '',
	location: '',
	is_active: true,
	date_from: '',
	date_to: '',
};

export const useEventFilters = () => {
	const { setEventSearch } = useStore();
	const [formData, setFormData] = useState(initialFormData);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [currentFilters, setCurrentFilters] = useState(initialFormData);
	const [currentPage, setCurrentPage] = useState(1);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target;

		if (type === 'checkbox') {
			setFormData(prev => ({ ...prev, [name]: checked }));
		} else {
			setFormData(prev => ({ ...prev, [name]: value }));
		}
	};

	const resetForm = () => {
		setFormData(initialFormData);
		setCurrentFilters(initialFormData);
		setCurrentPage(1);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await setEventSearch(formData, 1, 10);
			setCurrentFilters(formData);
			setCurrentPage(1);
			console.log('✅ Filtro aplicado exitosamente');
		} catch (error) {
			console.error('❌ Error al aplicar filtro:', error);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Función para limpiar filtros y volver a eventos normales
	const clearFilters = () => {
		setCurrentFilters(initialFormData);
		setCurrentPage(1);
		// Limpiar los filtros del store también
		setEventSearch(initialFormData, 1, 10);
		console.log('✅ Filtros limpiados');
	};

	const handlePageChange = async (page: number) => {
		if (currentFilters !== initialFormData) {
			setIsSubmitting(true);
			try {
				await setEventSearch(currentFilters, page, 10);
				setCurrentPage(page);
				console.log('✅ Página de filtros cambiada exitosamente');
			} catch (error) {
				console.error('❌ Error al cambiar página de filtros:', error);
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	return {
		formData,
		handleChange,
		resetForm,
		handleSubmit,
		isSubmitting,
		currentFilters,
		currentPage,
		handlePageChange,
		clearFilters,
	};
};
