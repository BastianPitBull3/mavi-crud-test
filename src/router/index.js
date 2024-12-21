import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/LoginComponent.vue';
import Dashboard from '../components/ClientsComponent.vue'; // Ejemplo de página de destino

const routes = [
  { path: '/login', component: Login },
  { path: '/dashboard', component: Dashboard },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// Añadir lógica para proteger rutas que requieren autenticación
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('token')) {
    next('/login'); // Redirigir al login si no hay token
  } else {
    next(); // Continuar si está autenticado o la ruta no requiere autenticación
  }
});

export default router;
