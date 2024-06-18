import app from '@/utils/app';

const getToast = () => app.config.globalProperties.$toast;

const toast = {
    success: (title, msg = "") => {
        getToast().add({ severity: 'success', summary: title, detail: msg, life: 3000 });
    },
    warn: (title, msg = "") => {
        getToast().add({ severity: 'warn', summary: title, detail: msg, life: 3000 });
    },
    error: (title, msg = "") => {
        getToast().add({ severity: 'error', summary: title, detail: msg, life: 3000 });
    },
    info: (title, msg = "") => {
        getToast().add({ severity: 'info', summary: title, detail: msg, life: 3000 });
    },
    secondary: (title, msg = "") => {
        getToast().add({ severity: 'secondary', summary: title, detail: msg, life: 3000 });
    },
    contrast: (title, msg = "") => {
        getToast().add({ severity: 'contrast', summary: title, detail: msg, life: 3000 });
    }
};

export default toast;