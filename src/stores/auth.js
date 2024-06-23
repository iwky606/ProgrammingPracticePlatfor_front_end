import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthInfoStore = defineStore('authInfo', () => {
    const AUTHTYPE = {
        ADMIN: 0,
        USER: 1,
        GUEST: 2
    }

    const auth = ref(AUTHTYPE.ADMIN)

    const setAuth = (newAuth) => {
        auth.value = newAuth
    }

    const removeAuth = () => {
        auth.value = AUTHTYPE.GUEST
    }

    const getAuth = () => {
        return auth.value
    }

    const isAdmin = computed(() => auth.value === AUTHTYPE.ADMIN)

    const isUser = computed(() => auth.value === AUTHTYPE.USER)

    const isGuest = computed(() => auth.value === AUTHTYPE.GUEST)

    return {
        getAuth, setAuth, removeAuth, isAdmin, isUser, isGuest
    }
},
    {
        persist: true
    }
)