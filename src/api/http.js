import axios from 'axios'
import toast from '../utils/toast';

const http = axios.create({
    baseURL: '/api',
    timeout: 5000,
});


http.interceptors.request.use(
    config => {
        return config
    },
    error => {
        console.warn(error)
        return Promise.reject(error)
    }
);

http.interceptors.response.use(
    (response) => {
        let responseCode = response.data.code;
        if (responseCode && responseCode != 20021) {
            toast.error(response.data.message);
            return Promise.reject(response);
        }
        return response
    },
    (error) => {
        if (error.code === 'ECONNABORTED' || error.message === "Network Error" || error.message.includes("timeout")) {
            toast.error('请求超时, 请检查网络');
        }
        if (error.response.status == 401) {
            toast.error('请先登录');
            return Promise.reject(error.response);
        }

        return Promise.resolve(error.response)
    }
)   

function post(url, params = {}) {
    return new Promise((resolve, reject) => {
        http({
            url,
            method: 'post',
            data: params,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        http({
            url,
            method: 'get',
            params,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

function del(url, params = {}) {
    return new Promise((resolve, reject) => {
        http({
            url,
            method: 'delete',
            params,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

function put(url, params = {}) {
    return new Promise((resolve, reject) => {
        http({
            url,
            method: 'put',
            data: params,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json; charset=UTF-8'
            }
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

function postMultipart(url, params = {}) {
    return new Promise((resolve, reject) => {
        http({
            url,
            method: 'post',
            data: params,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data; boundary=' + new Date().getTime()
            }
        }).then(res => {
            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
}

export {
    http,
    post,
    get,
    del,
    put,
    postMultipart
}