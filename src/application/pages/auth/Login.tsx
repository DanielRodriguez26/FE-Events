import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useError } from '@application/hooks';
import InputField from '@components/ui/InputField';
import ErrorDisplay from '@components/ui/ErrorDisplay';

// Componente de página de login
// Permite a los usuarios iniciar sesión en la aplicación
const Login: React.FC = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);

	const { login } = useAuth();
	const { error, clearError, handleError } = useError();
	const navigate = useNavigate();
	const location = useLocation();

	// Obtener la ruta de donde venía el usuario (si existe)
	const from = location.state?.from?.pathname || '/';

	// Manejar el envío del formulario
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		clearError();

		try {
			const success = await login({ username, password });
			if (success) {
				// Redirigir a la página de donde venía o al dashboard
				navigate(from, { replace: true });
			}
		} catch (err) {
			handleError(err, 'Login');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8 sm:w-96'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Iniciar Sesión</h2>
					<p className='mt-2 text-center text-sm text-gray-600'>Accede a tu cuenta para continuar</p>
				</div>

				<form className='mt-8 mb-2 w-80 max-w-screen-lg sm:w-96' onSubmit={handleSubmit}>
					<div className='mb-1 flex flex-col gap-6'>
						<InputField id='username' name='username' type='text' placeholder='Nombre de usuario' value={username} onChange={e => setUsername(e.target.value)} />
						<InputField	id='password' name='password' type='password' placeholder='Contraseña' value={password}onChange={e => setPassword(e.target.value)}/>
					</div>

					<ErrorDisplay 
						error={error} 
						onDismiss={clearError}
						className="mt-4"
					/>

					<div>
						<button
							type='submit'
							disabled={isSubmitting}
							className='mt-4 w-full rounded-md bg-slate-800 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'>
							{isSubmitting ? (
								<div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
							) : (
								'Iniciar Sesión'
							)}
						</button>
					</div>

					<div className='text-center mt-4'>
						<p className='text-sm text-gray-600'>
							¿No tienes cuenta?{' '}
							<button
								type='button'
								onClick={() => navigate('/register')}
								className='font-medium text-blue-600 hover:text-blue-500'>
								Regístrate aquí
							</button>
						</p>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
