<template>
    <Menubar :model="items">
        <template #start>
            <Logo class="cursor" @click="goto('/')" />
        </template>
        <template #item="{ item, props }">
            <a v-ripple class="flex items-center" v-bind="props.action"
                @click="() => { if (item.router) goto(item.router) }"
                v-if="!item.admin || (item.admin && auth.isAdmin)">
                <i :class="item.icon" style=""></i>
                <span class=" ml-2">{{ item.label }}</span>
                <span v-if="item.hasSubmenu" class="pi pi-fw pi-angle-down ml-2" />
            </a>
        </template>
        <template #end>
            <div class="flex items-center gap-2">
                <!-- 以后可能会有用，比如加个新闻搜索等 -->
                <!-- <InputText placeholder="Search for news" type="text" class="w-32 sm:w-auto" /> -->
                <div v-if="auth.isGuest" class="gap-1">
                    <Button @click="goto('/register')" :severity="registerBtn" class="register-btn" label="注册"
                        @mouseenter="registerBtn = 'secondary'" @mouseleave="registerBtn = 'contrast'"></Button>
                    <span style="margin: 0 5px"> | </span>
                    <Button @click="goto('/login')" :severity="loginBtn" class="login-btn" label="登录"
                        @mouseenter="loginBtn = 'contrast'" @mouseleave="loginBtn = 'secondary'"></Button>
                </div>
                <Avatar class="cursor" @click="goto('/user')" v-else />
            </div>
        </template>
    </Menubar>
</template>

<script setup>
import { ref } from 'vue';

import { useGoto } from '@/hooks/useRouterUtil';

import { useAuthInfoStore } from '@/stores/auth';

import Button from 'primevue/button';
import Logo from '@/assets/icons/Logo.vue';
import Menubar from 'primevue/menubar';
import InputText from 'primevue/inputtext';
import Avatar from '@/assets/icons/Avatar.vue';

const items = ref([
    {
        label: '首页',
        icon: 'pi pi-home',
        router: '/'
    },
    {
        label: '题库',
        icon: 'pi pi-list',
        router: '/questions'
    },
    {
        label: '排行榜',
        icon: 'pi pi-envelope',
        router: '/rank'
    },
    {
        label: '管理',
        icon: 'pi pi-cog',
        // router: '/admin',
        admin: true,
        hasSubmenu: true,
        items: [
            {
                label: '题目管理',
                icon: 'pi pi-list',
                router: '/admin/questions'
            },
            {
                label: '题目集管理',
                icon: 'pi pi-folder',
                router: '/admin/set'
            }
        ]
    }
])

const goto = useGoto();
const auth = useAuthInfoStore();

const loginBtn = ref("secondary")
const registerBtn = ref("contrast")

</script>

<style lang="scss" scoped>
.register-btn,
.login-btn {
    height: 35px;
}
</style>