<template>
    <Menubar :model="items">
        <template #start>
            <Logo class="cursor" @click="goto('/')" />
        </template>
        <template #item="{ item, props }">
            <a v-ripple class="flex items-center" v-bind="props.action"
                @click="handleItemClick(item)"
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
                <Avatar class="cursor" @contextmenu="onAvatarClicked" @click="onAvatarClicked" v-else />
                <ContextMenu ref="menu" :model="contextmenu" />
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
import ContextMenu from 'primevue/contextmenu';

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
        label: '提交记录',
        icon: 'pi pi-envelope',
        router: '/submission'
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
    },
    {
        icon: 'pi pi-github',
        label: 'GitHub',
        href: "https://github.com/iwky606/ProgrammingPracticePlatform"
    }
])

const contextmenu = [
    // {
    //     label: '个人中心',
    //     icon: 'pi pi-user',
    //     command: () => goto('/user')
    // },
    {
        label: '退出登录',
        icon: 'pi pi-sign-out',
        command: () => handleLogout()
    }
]

// const emit = defineEmits(['logout'])

const goto = useGoto();
const auth = useAuthInfoStore();

const loginBtn = ref("secondary")
const registerBtn = ref("contrast")
const menu = ref(null);

const onAvatarClicked = (params) => {
    menu.value.toggle(params);
}

const handleLogout = () => {
    // emit('logout');  
    auth.logout()  
}

const handleItemClick = (item) => {
    if (item.router) goto(item.router);
    else if (item.href) window.open(item.href, '_blank');
}
</script>

<style lang="scss" scoped>
.register-btn,
.login-btn {
    height: 35px;
}
</style>