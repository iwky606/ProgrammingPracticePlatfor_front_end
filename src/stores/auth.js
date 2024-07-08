import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import api from '@/api'
import toast from '@/utils/toast'

import md5 from 'js-md5'

export const useAuthInfoStore = defineStore('authInfo', () => {
    const AUTHTYPE = {
        ADMIN: "ADMIN",
        USER: "STUDENT",
        TEACHER: "TEACHER",
        GUEST: "GUEST"
    }

    const auth = ref(AUTHTYPE.GUEST)

    const login = async (params, fn) => {
        params.password = md5(params.password)
        api.userApi.login(params).then(res => {
            if (res.data.message == 'ok') {
                auth.value = res.data.data.auth
                fn()
            } else {
                toast.error(res.data.message)
            }
        })
    }

    const logout = () => {
        api.userApi.logout().then(res => { 
            if (res.data.message == 'ok') {
                auth.value = AUTHTYPE.GUEST
            } else {
                toast.error(res.data.message)
            }
        
        })
    }

    const register = async (params, fn) => {
        params.password = md5(params.password)
        params.checkPassword = md5(params.checkPassword)
        api.userApi.register(params).then(res => {
            if (res.data.message == 'ok') {
                auth.value = res.data.data.auth
                fn()
            } else {
                toast.error(res.data.message)
            }
        })
    }

    const getAuth = () => {
        return auth.value
    }

    const isAdmin = computed(() => auth.value === AUTHTYPE.ADMIN)

    const isUser = computed(() => auth.value === AUTHTYPE.USER)

    const isTeacher = computed(() => auth.value === AUTHTYPE.TEACHER)

    const isGuest = computed(() => auth.value === AUTHTYPE.GUEST)

    return {
        getAuth, login, logout, register, isAdmin, isUser, isGuest, isTeacher, auth
    }
}, {
    persist: {
        expire: 1000 * 60,
        enalbled: true,
        storage: sessionStorage
    }
}
)