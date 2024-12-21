<template>
  <router-view>
    <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div>
        <label for="email">Email</label>
        <input type="email" v-model="email" id="email" required />
      </div>
      <div>
        <label for="password">Password</label>
        <input type="password" v-model="password" id="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
  </router-view>
  
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
// import { useRouter } from 'vue-router';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    // const router = useRouter();

    const login = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/login', {
          email: email.value,
          password: password.value,
        });

        const token = response.data.token; // Suponiendo que el backend devuelve el token
        localStorage.setItem('token', token); // Guardar el token en localStorage

        // Redirigir al dashboard o a la página principal después del login
        // router.push('/dashboard');
      } catch (error) {
        console.error('Error al iniciar sesión', error);
        alert('Credenciales incorrectas');
      }
    };

    return {
      email,
      password,
      login,
    };
  },
};
</script>

<style scoped>
/* Agrega estilos para tu formulario aquí */
</style>