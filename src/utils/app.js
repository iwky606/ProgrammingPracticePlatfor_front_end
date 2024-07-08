import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import VMdEditor from '@kangc/v-md-editor';
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import Prism from 'prismjs';
import 'prismjs/components/prism-json';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import eventBus from 'vue3-eventbus'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
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
app.use(VMdPreview)
app.use(VMdEditor)
app.use(PrimeVue, {
    theme: {
        preset: Aura
    },
    ripple: true
});
app.use(ToastService);
app.use(ConfirmationService);
app.use(router)
app.use(eventBus)

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate, {
    expires: "1h"
})
app.use(pinia)
router.beforeEach((to, from, next) => {
    const auth = useAuthInfoStore()
    if (to.meta.requiresAuth && !auth.isAdmin) {
        next({ name: '404' })
        return
    }
    next()
})

app.directive('ripple', Ripple);

export default app