import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const { user } = useSelector((state) => state.auth);

    // بنشيك لو اليوزر موجود ومعاه توكن فعلاً
    // لو الباك أند بيبعت التوكن جوه الـ user object كدة: user.token
    const hasToken = user && (user.token || localStorage.getItem('user'));

    // لو فيه توكن، اتفضل ادخل (Outlet)، لو مفيش، ارجع للـ Auth
    return hasToken ? <Outlet /> : <Navigate to="/auth" />;
};

export default ProtectedRoute;