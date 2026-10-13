import axios,{isAxiosError} from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';


export const api = axios.create({
    baseURL: '/api/v1',
    withCredentials: true, // cookies - cors
    headers:{
        'Content-Type': 'application/json'
    }
})







