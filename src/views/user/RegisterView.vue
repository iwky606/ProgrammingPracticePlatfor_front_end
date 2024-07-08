<template>
    <div class="flex col align-center login-box">
        <div class="flex-grow-1"></div>
        <div>
            <Logo style="width: 70px; height: 80px" />
        </div>
        <InfoForm mode="register" @button-click="handleClick" />
        <div class="flex-grow-1"></div>
    </div>
</template>

<script setup>
import InfoForm from '@/components/user/InfoForm.vue';
import Logo from '@/assets/icons/Logo.vue';

import { useAuthInfoStore } from '@/stores/auth';
import { useGoto } from '@/hooks/useRouterUtil';
import { onMounted } from 'vue';

const auth = useAuthInfoStore();
const goto = useGoto();

onMounted(() => {
    if (!auth.isGuest) {
        goto('/');
    }
})

const handleClick = (form) => {
    const { username, password, repassword } = form;
    const params = {
        username,
        password,
        "checkPassword": repassword,
        "auth": "STUDENT"
    };
    auth.register(params, () => {
        goto('/');
    });
}
</script>

<style lang="scss" scoped>
.login-box {
    width: 600px;
    height: 70vh;
    max-width: 400px;
    margin: 40px auto;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
}
</style>