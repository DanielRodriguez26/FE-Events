import type { ISessionDto } from '@/domain/session/session.interface';
import { useSessionManager } from '@/application/hooks/useSessionManager';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import SessionForm from './SessionForm';
import SessionList from './SessionList';

interface SessionManagerProps {
	sessions: ISessionDto[];
	eventId: number;
	isOrganizer?: boolean;
	isLoading?: boolean;
}

const SessionManagerForm: React.FC<SessionManagerProps> = ({
	sessions: propSessions,
	eventId,
	isOrganizer = false,
	isLoading = false,
}) => {
	// 1. Usar el custom hook para toda la lógica
	const {
		sessions,
		speakers,
		error,
		clearError,
		showCreateForm,
		setShowCreateForm,
		editingSession,
		formData,
		timeValidation,
		handleInputChange,
		handleSubmit,
		handleEdit,
		handleCancel,
		handleDelete,
		deleteSessionAction,
		loadSessionsByEvent,
	} = useSessionManager(eventId, propSessions);

	return (
		<div className='space-y-6'>
			{/* Mensajes de error */}
			{error && <ErrorDisplay error={error} onDismiss={clearError} onRetry={() => loadSessionsByEvent(eventId)} />}

			{/* Header y botón de agregar */}
			<div className='flex items-center justify-between'>
				<div>
					<h3 className='text-lg font-semibold text-gray-900'>Sesiones del Evento</h3>
					<p className='text-sm text-gray-600'>
						{sessions?.length || 0} sesión{(sessions?.length || 0) !== 1 ? 'es' : ''} programada
						{(sessions?.length || 0) !== 1 ? 's' : ''}
					</p>
				</div>
				<button
					onClick={() => setShowCreateForm(true)}
					className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'>
					Agregar Sesión
				</button>
			</div>

			{/* Formulario de creación/edición */}
			{isOrganizer && showCreateForm && (
				<SessionForm
					formData={formData}
					editingSession={editingSession}
					speakers={speakers}
					isLoading={isLoading}
					timeValidation={timeValidation}
					handleInputChange={handleInputChange}
					handleSubmit={handleSubmit}
					handleCancel={handleCancel}
				/>
			)}

			{/* Lista de sesiones */}
			{isLoading ? (
				<div className='flex justify-center items-center py-8'>
					<div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
				</div>
			) : (
				<SessionList sessions={sessions || []} isOrganizer={isOrganizer} onEdit={handleEdit} onDelete={handleDelete} />
			)}
		</div>
	);
};

export default SessionManagerForm;
