import routes from './routes.js';

// global reactive store
export const store = Vue.reactive({
    dark: JSON.parse(localStorage.getItem('dark')) || false,
    toggleDark() {
        this.dark = !this.dark;
        localStorage.setItem('dark', JSON.stringify(this.dark));
    },
});

const app = Vue.createApp({});

// THE GREATEST FIX OF HISTORY?
app.config.globalProperties.store = store;

// router
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
});

app.use(router);

app.mount('#app');