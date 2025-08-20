import { React, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const OAuth2RedirectHandler = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const user = {
                    id: decodedToken.id,
                    email: decodedToken.sub,
                    firstName: decodedToken.firstName,
                    lastName: decodedToken.lastName,
                    businessName: decodedToken.businessName,
                    role: decodedToken.role
                };

                login(user, token);

                if (user.role === 'ROLE_ADMIN') {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/');
                }
            } catch (error) {
                console.error("Invalid token:", error);
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [searchParams, navigate, login]);

    return <div>Loading...</div>;
};

export default OAuth2RedirectHandler;