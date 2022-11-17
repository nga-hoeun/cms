import { createApp } from 'vue'
import App from './App.vue'
import router from './router/router'
import NavigationBar from './components/NavigationBar.vue'
import formComponent from './components/formComponent.vue'
import profileView from './views/ProfileView.vue'
import loginView from './views/LoginView.vue'
import DashboardView from './views/DashboardView.vue'
import { createPinia } from 'pinia'
import cors from "cors"


const app = createApp(App).use(createPinia());
app.use(router)
app.use(cors)
app.component("navigation-bar",NavigationBar);
app.component("login-view",loginView)
app.component("dashboard-view",DashboardView)
app.component("login-form",formComponent);
app.component("profile-view",profileView)
// app.component("post-card",cardComponent);
app.mount('#app')
