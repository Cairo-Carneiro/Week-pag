import { useForm } from 'react-hook-form';

interface LoginFormData {
    email: string;
    password: string;
}

function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormData>();
    
    const onSubmit = (data: LoginFormData) => { 
        console.log(data);
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <input 
                    type="email" 
                    {...register('email', {
                        required: 'Email é obrigatório',
                        pattern: {
                            value: /^[^@]+@[^@]+\.[^@]+$/,
                            message: 'Email inválido'
                        }
                    })} 
                />
                {errors.email && (
                    <span className="text-red-500 text-sm">
                        {errors.email?.message}
                    </span>
                )}
            </div>
            
            <div>
                <input 
                    type="password" 
                    {...register('password', {
                        required: 'Senha é obrigatória'
                    })} 
                />
                {errors.password && (
                    <span className="text-red-500 text-sm">
                        {errors.password?.message}
                    </span>
                )}
            </div>
            
            <button type="submit">Entrar</button>
        </form>
    );
}

export default LoginPage;