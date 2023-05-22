import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import toastConfig from '../config/toastConfig';


function LogoutHandler() {
    const navigate = useNavigate();

    if(res.status===401){
        toast.warning('Session Timeout', toastConfig)
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        navigate('/login')
    }
    else if(res.status===200){
        // res = await res.json();
    }
}

export default LogoutHandler