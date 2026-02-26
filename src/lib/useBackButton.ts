import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Custom hook to intercept browser back button
 * Redirects to /skills instead of going back to previous pages
 */
export const useBackButton = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Push initial history state so back button is active
        window.history.pushState(null, '', window.location.href);

        const handlePopState = () => {
            // Always go to skills when back is pressed
            navigate('/skills', { replace: false });
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate]);
};

