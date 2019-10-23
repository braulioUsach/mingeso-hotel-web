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
                  <option v-for="(item, index) in countries" v-bind:key="index" :value="item.label">{{ item.label }}</option>
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
        first_name: "",
        last_name: "",
        country: 0,
        email: ""
      }
    };
  },
  mounted() {
    this.getCountries();
  },
  methods: {
    persist() {
      localStorage.dni = this.form.dni;
      localStorage.firstName = this.form.firstName;
    },
    getCountries() {
      axios
        .get(`${process.env.VUE_APP_API_URL}/countries`)
        .then(response => {
          this.countries = response.data.map((country) => {
            return {
              id: country.id_country,
              label: country.name
            }
          });
        })
        .catch(error => {
          this.countries = [{
            id: "Chile",
            label: "Chile"
          }];
        });
    },
    onSubmit() {
      axios
        .post(`${process.env.VUE_APP_API_URL}/client/user`, {
          dni: this.form.dni,
          first_name: this.form.firstName,
          last_name: this.form.lastName,
          country: this.form.country,
          email: this.form.email
        })
        .then(() => {
          this.persist();
          this.$router.push({ name: 'create-booking'});
          // this.$router.go("/booking/create");
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }
};
</script>
