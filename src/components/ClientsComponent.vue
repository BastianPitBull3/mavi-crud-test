<template>
  <router-view>
    <div>
      <h1>Gestión de Clientes</h1>
  
      <!-- Formulario para crear o actualizar cliente -->
      <form @submit.prevent="handleSubmit">
        <div>
          <label for="firstName">Nombre:</label>
          <input type="text" id="firstName" v-model="client.firstName" required />
        </div>
        <div>
          <label for="lastName">Apellido:</label>
          <input type="text" id="lastName" v-model="client.lastName" required />
        </div>
        <div>
          <label for="motherLastName">Apellido Materno:</label>
          <input type="text" id="motherLastName" v-model="client.motherLastName" required />
        </div>
        <div>
          <label for="address">Dirección:</label>
          <input type="text" id="address" v-model="client.address" required />
        </div>
        <div>
          <label for="email">Correo Electrónico:</label>
          <input type="email" id="email" v-model="client.email" required />
        </div>
        <button type="submit">{{ isEdit ? 'Actualizar Cliente' : 'Crear Cliente' }}</button>
      </form>
  
      <hr>
  
      <!-- Mostrar la lista de clientes -->
      <h2>Lista de Clientes</h2>
      <ul>
        <li v-for="client in clients" :key="client.id">
          <span>{{ client.firstName }} {{ client.lastName }}</span>
          <button @click="editClient(client)">Editar</button>
          <button @click="deleteClient(client.id)">Eliminar</button>
        </li>
      </ul>
    </div>
  </router-view>
    
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        clients: [],  // Almacena los clientes obtenidos
        client: {     // Objeto para cliente en formulario
          firstName: "",
          lastName: "",
          motherLastName: "",
          address: "",
          email: ""
        },
        isEdit: false,  // Flag para saber si estamos editando un cliente
        token: "YOUR_JWT_TOKEN",  // Asegúrate de tener el token JWT aquí
      };
    },
    methods: {
      // Obtener todos los clientes
      async fetchClients() {
        try {
          const response = await axios.get("http://localhost:3000/api/clients", {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
          this.clients = response.data;
        } catch (error) {
          console.error("Error obteniendo clientes:", error);
        }
      },
  
      // Crear un nuevo cliente
      async createClient() {
        try {
          const response = await axios.post(
            "http://localhost:3000/api/clients",
            this.client,
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          );
          this.clients.push(response.data);  // Añadir el nuevo cliente a la lista
          this.clearForm();
        } catch (error) {
          console.error("Error creando cliente:", error);
        }
      },
  
      // Editar un cliente existente
      editClient(client) {
        this.client = { ...client };  // Llenar el formulario con los datos del cliente
        this.isEdit = true;  // Cambiar al modo de edición
      },
  
      // Actualizar un cliente
      async updateClient() {
        try {
          const response = await axios.put(
            `http://localhost:3000/api/clients/${this.client.id}`,
            this.client,
            {
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }
          );
          const index = this.clients.findIndex((c) => c.id === this.client.id);
          this.clients[index] = response.data;  // Actualizar cliente en la lista
          this.clearForm();
        } catch (error) {
          console.error("Error actualizando cliente:", error);
        }
      },
  
      // Eliminar un cliente
      async deleteClient(clientId) {
        try {
          await axios.delete(`http://localhost:3000/api/clients/${clientId}`, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          });
          this.clients = this.clients.filter((client) => client.id !== clientId); // Eliminar cliente de la lista
        } catch (error) {
          console.error("Error eliminando cliente:", error);
        }
      },
  
      // Manejar el envío del formulario (crear o actualizar)
      handleSubmit() {
        if (this.isEdit) {
          this.updateClient();
        } else {
          this.createClient();
        }
      },
  
      // Limpiar el formulario
      clearForm() {
        this.client = {
          firstName: "",
          lastName: "",
          motherLastName: "",
          address: "",
          email: ""
        };
        this.isEdit = false;
      }
    },
  
    // Cargar los clientes cuando el componente se monta
    mounted() {
      this.fetchClients();
    },
  };
  </script>
  
  <style scoped>
  /* Estilos opcionales */
  </style>
  