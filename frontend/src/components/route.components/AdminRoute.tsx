
import {Navigate, Outlet, useLocation} from 'react-router';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export default function AdminRoute(){
    const {admin, isAdminAuthenticated, isLoading} = useAdminAuth();
    const location = useLocation();

    if(isLoading){
        return(
             <div className="flex justify-center items-center h-screen bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        )
    }

    if(!isAdminAuthenticated){
        return <Navigate to="/admin/login" state={{from: location}} replace/>
    }

    if(admin?.role !== 'admin'){
        return <Navigate to='/admin/login' replace/>
    }

    return <Outlet/>; // return the children
}

