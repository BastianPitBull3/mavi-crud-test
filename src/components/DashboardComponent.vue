<template>
  <div class="container">
    <!-- Navbar -->
    <nav class="navbar">
      <ul>
        <li><router-link to="/dashboard">Agregar Cliente</router-link></li>
        <li><router-link to="/clients">Ver Clientes</router-link></li>
      </ul>
    </nav>

    <!-- Formulario para crear o actualizar cliente -->
    <div class="form-container">
      <h2>{{ isEdit ? 'Editar Cliente' : 'Crear Cliente' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="firstName">Nombre:</label>
          <input type="text" id="firstName" v-model="client.firstName" required />
        </div>
        <div class="form-group">
          <label for="lastName">Apellido:</label>
          <input type="text" id="lastName" v-model="client.lastName" required />
        </div>
        <div class="form-group">
          <label for="motherLastName">Apellido Materno:</label>
          <input type="text" id="motherLastName" v-model="client.motherLastName" required />
        </div>
        <div class="form-group">
          <label for="address">Dirección:</label>
          <input type="text" id="address" v-model="client.address" required />
        </div>
        <div class="form-group">
          <label for="email">Correo Electrónico:</label>
          <input type="email" id="email" v-model="client.email" required />
        </div>
        <button type="submit" class="submit-btn">{{ isEdit ? 'Actualizar Cliente' : 'Crear Cliente' }}</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      clients: [],
      client: {
        firstName: "",
        lastName: "",
        motherLastName: "",
        address: "",
        email: "",
      },
      isEdit: false,
      token: localStorage.getItem("token") || "", // Obtén el token desde localStorage
    };
  },
  methods: {

    async fetchClient(clientId) {
      try {
        const response = await axios.get(`http://localhost:3000/api/clients/${clientId}`, {
          headers: { Authorization: `Bearer ${this.token}` }
        });
        this.client = response.data;
        this.isEdit = true;
      } catch (error) {
        console.error("Error obteniendo el cliente:", error);
        if (error.response && error.response.status === 403) {
          alert("Acceso denegado. Verifica tu sesión.");
        }
      }
    },

    async createClient() {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/clients",
          this.client,
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
        this.clients.push(response.data);
        this.clearForm();
      } catch (error) {
        console.error("Error creando cliente:", error);
      }
    },

    async updateClient() {
      try {
        const response = await axios.put(
          `http://localhost:3000/api/clients/${this.client.id}`,
          this.client,
          { headers: { Authorization: `Bearer ${this.token}` } }
        );
        const index = this.clients.findIndex((c) => c.id === this.client.id);
        this.clients[index] = response.data;
        this.clearForm();
      } catch (error) {
        console.error("Error actualizando cliente:", error);
      }
    },

    handleSubmit() {
      if (this.isEdit) {
        this.updateClient(); // Si estamos en modo edición, actualizamos el cliente
      } else {
        this.createClient(); // Si no, creamos un nuevo cliente
      }
    },

    clearForm() {
      this.client = {
        firstName: "",
        lastName: "",
        motherLastName: "",
        address: "",
        email: "",
      };
      this.isEdit = false; // Limpiamos el formulario y volvemos a crear cliente
    },

    editClient(client) {
      this.client = { ...client }; // Copiamos los datos del cliente seleccionado
      this.isEdit = true; // Establecemos que estamos en modo edición
    },

    async deleteClient(clientId) {
      try {
        await axios.delete(`http://localhost:3000/api/clients/${clientId}`, {
          headers: { Authorization: `Bearer ${this.token}` },
        });
        this.clients = this.clients.filter((client) => client.id !== clientId);
      } catch (error) {
        console.error("Error eliminando cliente:", error);
      }
    },

    goToDashboard() {
      this.$router.push("/dashboard"); // Navegar al dashboard sin cliente para crear uno nuevo
    },
  },
  mounted() {
  if (this.$route.query.isEdit === 'true') {
    const clientId = this.$route.query.clientId;
    if (clientId) {
      this.fetchClient(clientId);  // Método para obtener el cliente por ID
    }
  }},
};
</script>

<style scoped>
/* Estilos para el contenedor principal */
.container {
  font-family: Arial, sans-serif;
  margin: 20px;
}

/* Navbar */
.navbar {
  background-color: #333;
  padding: 10px;
}

.navbar ul {
  list-style-type: none;
  padding: 0;
  display: flex;
  justify-content: center;
}

.navbar li {
  margin: 0 15px;
}

.navbar a {
  color: white;
  text-decoration: none;
  font-size: 18px;
}

.navbar a:hover {
  text-decoration: underline;
}

/* Formulario */
.form-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-container h2 {
  text-align: center;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-btn:hover {
  background-color: #45a049;
}

/* Lista de Clientes */
.clients-list {
  list-style-type: none;
  padding: 0;
  max-width: 600px;
  margin: 20px auto;
}

.client-item {
  background-color: #f1f1f1;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.client-item span {
  font-size: 18px;
}

.btn-edit,
.btn-delete {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit:hover {
  background-color: #0056b3;
}

.btn-delete {
  background-color: #dc3545;
}

.btn-delete:hover {
  background-color: #c82333;
}
</style>