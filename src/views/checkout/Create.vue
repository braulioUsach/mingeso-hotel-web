<template>
<div class="checkout">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <form v-on:submit.prevent="onSubmit">
          <div class="row">
            <div class="col-xs-12 col-md-2"></div>
            <div class="col-xs-12 col-md-8">
              <div class="form-group">
                <label for="nationality">Habitación</label>
                <select class="form-control" name="country" id="country" v-model="formCheckin.country" required>
                  <option v-for="(item, index) in countries" v-bind:key="index" :value="item.label">{{ item.label }}</option>
                </select>
              </div>
            </div>
            <div class="col-xs-12 col-md-2"></div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="name">Nombre Completo</label>
                <input type="text" class="form-control" id="name" v-model="formCheckin.name" :disabled="true" required />
              </div>
            </div>
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="dni">Noches Alojadas</label>
                <input type="text" class="form-control" id="dni" v-model="formCheckin.dni" :disabled="true" required />
              </div>
            </div>

            <div class="col-xs-12 col-md-12">
              Aquí va a ir los servicios contratados por la habitación
            </div>

            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="dniType">Forma de Pago</label>
                <select class="form-control" name="dnisType" id="dnisType" v-model="formCheckin.dniType" required>
                  <option v-for="(item, index) in dnisType" v-bind:key="index" :value="item">{{ item }}</option>
                </select>
              </div>
            </div>            
          </div>
          <div class="row mt-4 float-right">
            <div class="form-group">
              <button class="btn btn-primary">Guardar</button>
            </div>
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
      dnisType: [],
      formCheckin: {
        bookingCode: '',
        name: '',
        dni: '',
        country: 0,
        dniType: ''
      }
    };
  },
  mounted() {
    this.readDNISType();
    this.getCountries();
  },
  methods: {
    persist(bookingCode) {
      localStorage.bookingCode = bookingCode;
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
    readDNISType() {
      this.dnisType = [
        "Rut",
        "Pasaporte",
        "Otro DNI"
      ]
    },
    addCheckIn() {
      if (!this.formCheckin) return;
      this.checkin.push(this.formCheckin);
      this.formCheckin = {
        bookingCode: this.formCheckin.bookingCode,
        dni: this.formCheckin.dni,
        name: this.formCheckin.name,
        country: this.formCheckin.country,
        dniType: this.dniType
      };
      this.saveCheckin();
    },
    saveCheckin() {
      let parsed = JSON.stringify(this.formCheckin);
      localStorage.setItem('checkin', parsed);
    },
    onSubmit() {
      axios
        .post(`${process.env.VUE_APP_API_URL}/checkin/add`, {
          name: this.formCheckin.name,
          dni: this.formCheckin.dni,
          dniType: this.formCheckin.dniType,
          code: this.formCheckin.bookingCode,
          country: this.formCheckin.country,
        })
        .then((response) => {
          this.persist();
          const isValidResponse = response.data

          if (isValidResponse) {
            this.addCheckIn();
          }
        })
        .catch(error => {
          console.log("No se pudo realizar el Check-In");
          console.error(error);
        });
    },
  }
};
</script>
