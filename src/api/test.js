const test = {
    getQuestions: (param) => {
        let values = [];
        const rows = param.rows;
        for (let i = 1; i <= rows; i++) {
            values.push({
                id: i,
                title: '题目' + i,
                level: Math.floor(Math.random() * 3),
                accuracy: Math.floor(Math.random() * 100) + '%',
                process: Math.random() > 0.5 ? '是' : '否'
            });
        }
        return new Promise((resolve, reject) => {
            resolve({
                code: 20021,
                message: 'success',
                data: {
                    total: 100,
                    values
                }
            });
        });
    },
    getRankList: (param) => {
        let values = [];
        const rows = param.rows;
        for (let i = 0; i < rows; i++) {
            values.push({
                user: 'user' + i,
                accept: Math.floor(Math.random() * 100),
                submit: Math.floor(Math.random() * 100),
                accuracy: Math.floor(Math.random() * 100) + '%'
            });
        }
        return new Promise((resolve, reject) => {
            resolve({
                code: 20021,
                message: 'success',
                data: {
                    total: 100,
                    values
                }
            });
        });
    },
    getAdminQuestions: (param) => { 
        let values = [];
        const rows = param.rows;
        for (let i = 1; i <= rows; i++) {
            values.push({
                id: i,
                title: '题目' + i,
                level: Math.floor(Math.random() * 3),
            });
        }
        return new Promise((resolve, reject) => {
            resolve({
                code: 20021,
                message: 'success',
                data: {
                    total: 100,
                    values
                }
            });
        });
    },
    getAdminQuestionsSets: (param) => {
        let values = [];
        const rows = param.rows;
        for (let i = 1; i <= rows; i++) {
            values.push({
                id: i,
                title: '题目集' + i,
                number: Math.floor(Math.random() * 100),
            });
        }
        return new Promise((resolve, reject) => {
            resolve({
                code: 20021,
                message: 'success',
                data: {
                    total: 100,
                    values
                }
            });
        });
    }
}

export default test;