import {
    get,
    post,
    put,
    del
} from '@/api/http';

const userApi = {
    login: (params) => { 
        return post('/user/login', params);
    },
    logout: () => {
        return post('/user/logout');
    },
    register: (params) => {
        return post('/user/register', params);
    },
};

export default userApi;