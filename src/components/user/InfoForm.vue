<template>
    <div class="login-form flex col gap-3 pad">
        <div class="line flex row gap-2 width-100">
            <FloatLabel class="padding-0 width-100">
                <InputText id="username" v-model="username" class="width-100" />
                <label for="username">用户名</label>
            </FloatLabel>
        </div>
        <div class="line flex row gap-2 width-100">
            <FloatLabel class="padding-0 width-100">
                <Password id="password" v-model="password" class="width-100 child-width-100" />
                <label for="password">密码</label>
            </FloatLabel>
        </div>
        <div class="line flex row gap-2 width-100" v-if="mode == 'register'">
            <FloatLabel class="padding-0 width-100">
                <Password id="password" v-model="repassword" class="width-100 child-width-100" :feedback="false"/>
                <label for="password">确认密码</label>
            </FloatLabel>
        </div>
    </div>
    <div class="flex-grow-1"></div>
    <div class="buttons width-100" v-if="props.mode == 'login'">
        <Button label="登录" class="width-100" severity="contrast" @click="handleClick" />
        <Line>没有账号?</Line>
        <Button label="去注册" class="width-100" severity="secondary" @click="goto('/register')" />
    </div>
    <div class="buttons width-100" v-else>
        <Button label="注册" class="width-100" severity="contrast" @click="handleClick" />
        <Line>已有账号?</Line>
        <Button label="去登录" class="width-100" severity="secondary" @click="goto('/login')" />
    </div>
</template>

<script setup>
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Line from '@/components/Line.vue';

import { ref } from 'vue';
import { useGoto } from '@/hooks/useRouterUtil';
import toast from '@/utils/toast';


const username = ref("");
const password = ref("");
const repassword = ref("");

const props = defineProps({
    mode: {
        type: String,
        default: 'login'
    }
});
const emit = defineEmits(['button-click']);

const goto = useGoto();

const check = () => {
    if (username.value == '' || password.value == '') {
        toast.warn('用户名或密码不能为空');
        return false;
    }
    if (props.mode == 'register') {
        if (password.value != repassword.value) {
            toast.warn('两次密码不一致');
            return false;
        }
    }
    return true;
}

const handleClick = () => {
    if (check()) {
        let form = {
            username: username.value,
            password: password.value
        }
        if (props.mode == 'register') {
            form['repassword'] = repassword.value;
        }
        emit('button-click', form);
    }
}
</script>

<style lang="scss" scoped>
.login-form {
    width: 100%;
    margin-top: 20px;
}

.pad {
    padding: 0 20px;
}

.buttons {
    padding: 0 20px;
}

</style>