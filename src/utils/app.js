import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import VMdEditor from '@kangc/v-md-editor';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';

import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import Ripple from 'primevue/ripple';

import App from '@/App.vue'
import router from '@/router'

import { useAuthInfoStore } from '@/stores/auth';

const app = createApp(App)

VMdPreview.use(vuepressTheme, {
    Prism,
});

VMdEditor.use(vuepressTheme, {
    Prism,
});

app.use(createPinia())
app.use(VMdPreview)
app.use(VMdEditor)

const auth = useAuthInfoStore()


app.use(PrimeVue, {
    theme: {
        preset: Aura
    },
    ripple: true
});
app.use(ToastService);
app.use(router)


router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth && !auth.isAdmin) {
        next({ name: '404' })
        return
    }
    next()
})
console.log(router.getRoutes())

app.directive('ripple', Ripple);

export default app