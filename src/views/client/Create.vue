<template>
<div class="client">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <form v-on:submit.prevent="onSubmit">
          <div class="row">
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="firstName">Nombre</label>
                <input type="text" class="form-control" id="firstName" placeholder="Juan" v-model="form.firstName" required />
              </div>
            </div>
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="lastName">Apellido</label>
                <input type="text" class="form-control" id="lastName" placeholder="Pérez" v-model="form.lastName" required />
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="rut">DNI</label>
                <input type="text" class="form-control" id="dni" placeholder="11.111.111-1" v-model="form.dni" required />
              </div>
            </div>

            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="nationality">País de origen</label>
                <select class="form-control" name="country" id="country" v-model="form.country" required>
                  <option
                    v-for="(item, index) in countries"
                    v-bind:key="index"
                    :value="item.id"
                  >{{ item.label }}</option>
                </select>
              </div>
            </div>
          </div>

          <div class="row">
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="rut">Correo electrónico</label>
                <input type="text" class="form-control" id="email" placeholder="client@email.com" v-model="form.email" required />
              </div>
            </div>
          </div>
          <!-- Button submit -->
          <div class="form-group">
            <button class="btn btn-primary">Crear</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      countries: [],
      form: {
        dni: "",
        firstName: "",
        lastName: "",
        country: 0,
        email: ""
      }
    };
  },
  mounted() {
    this.getCountries();
  },
  methods: {
    getCountries() {
      axios
        .get(`${process.env.VUE_APP_API_URL}/countries`)
        .then((response) => {
          console.log(response.data);
          this.countries = response.data;
          console.log("Countries loaded");
        })
        .catch(error => {
          console.log("error", error);
        });
    },
    onSubmit() {
      axios
        .post(`${process.env.VUE_APP_API_URL}/client`, {
          dni: this.form.dni,
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          country: this.form.country,
          email: this.form.email
        })
        .then(() => {
          console.log("Cliente creado");
          this.$router.go("/");
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }
};
</script>
