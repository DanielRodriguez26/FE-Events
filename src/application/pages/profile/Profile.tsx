import { useNavigate } from 'react-router-dom';
import useStore from '@infrastructure/store/store';
import Layout from '@/application/layout/Layout';
import Loading from '@/components/ui/Loading';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { useProfile } from '@/application/hooks/useProfile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import UserInfo from '@/components/profile/UserInfo';
import EventList from '@/components/profile/EventList';

const Profile: React.FC = () => {
	const navigate = useNavigate();
	const { logout } = useStore(); // Asumiendo que tienes una acción de logout en tu store

	// 1. Usar el hook para obtener toda la lógica y el estado
	const { user, userEvents, loading, error } = useProfile();

	const handleLogout = () => {
		logout();
		navigate('/login');
	};

	// 2. Renderizar condicionalmente basado en el estado del hook
	if (loading) {
		return (
			<Layout>
				<Loading />
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout>
				<ErrorMessage error={error} />
			</Layout>
		);
	}

	// 3. Componer la UI con los componentes de presentación
	return (
		<Layout>
			<div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
				<ProfileHeader user={user} events={userEvents} />

				<UserInfo user={user} onLogout={handleLogout} />

				<div className='bg-white rounded-lg shadow-lg overflow-hidden'>
					<div className='px-6 py-4 border-b border-gray-200'>
						<h2 className='text-xl font-semibold text-gray-900'>Mis Eventos</h2>
					</div>
					<EventList events={userEvents} />
				</div>
			</div>
		</Layout>
	);
};

export default Profile;
