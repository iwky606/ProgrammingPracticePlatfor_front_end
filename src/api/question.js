import {
    get,
    post,
    put,
    del,
    postMultipart
} from '@/api/http';

const questionApi = {
    getQuestions: (params) => get('/problem/problems', params),
    getQuestion: (id) => get(`/problem/detail?id=${id}`),
    updateQuestion: (params) => post('/problem/edit', params),
    addQuestion: (params) => post('/problem/create', params),
    delQuestion: (id) => post(`/problem/del/${id}`),
};

export default questionApi;