import {
    get,
    post,
    put,
    del
} from './http';

const questionSetApi = {
    getSets: (params) => get('/problem_sets/sets_lists', params),
    getSet: (params) => get('/problem_sets/detail', params),
    getNewSetId: () => post('/problem_sets/create'),
    updateSet: (params) => post('/problem_sets/edit/info', params),
    addQuestion: (params) => post('/problem_sets/add/problem', params),
    delQuestion: (params) => post('/problem_sets/del/problem', params),
}

export default questionSetApi;
