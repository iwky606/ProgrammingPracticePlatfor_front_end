import {
    get,
    post,
    put,
    del
} from './http';

const submissionApi = {
    getSubmission: (params) => get(`/problem/submissions`, params),
    getSubmissionDetail: (id) => get(`/problem/submission/detail?id=${id}`),
    submitCode: (params) => post('/problem/submit', params),
}

export default submissionApi;