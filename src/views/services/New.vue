<template>
<div class="services">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <form v-on:submit.prevent="onSubmit">
          <div class="row">
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="room">Habitación</label>
                <select class="form-control" name="room" id="room" v-model="formAddService.room" >
                  <option v-for="(item, index) in rooms" v-bind:key="index" :value="item.label">{{ item.label }}</option>
                </select>
              </div>
            </div>
              <div class="col-xs-12 col-md-6">
                <div class="form-group">
                  <label for="service">Servicio</label>
                  <select class="form-control" name="service" id="service" v-model="formAddService.service" required>
                    <option v-for="(item, index) in services" v-bind:key="index" :value="item.label">{{ item.label }}</option>
                  </select>
                </div>
              </div>
              <div class="col-xs-12 col-md-6">
                <div class="form-group">
                  <label for="name">Inicio</label>
                  <input type="time" class="form-control" id="inicioServicio" placeholder="23:00" v-model="formAddService.inicio" required />
                </div>
              </div>
              <div class="col-xs-12 col-md-6">
                <div class="form-group">
                  <label for="dni">Término</label>
                  <input type="time" class="form-control" id="finServicio" placeholder="00:00" v-model="formAddService.fin" required />
                </div>
              </div>            
            </div>
            <div class="row mt-4 float-right">
              <div class="form-group">
                <button class="btn btn-primary">Añadir Servicio</button>
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
      services: [],
      rooms: [],
      formAddService: {
        room: '',
        service: '',
        inicio: '',
        fin: ''
      }
    };
  },
  mounted() {
    this.getServices();
    this.getRooms();
  },
  methods: {
    persist(bookingCode) {
      localStorage.bookingCode = bookingCode;
    },
    getServices() {
      axios
        .get(`${process.env.VUE_APP_API_URL}/services`)
        .then(response => {
          this.services = response.data.map((service) => {
            return {
              id: service.id_service,
              label: service.name
            }
          });
        })
        .catch(error => {
          this.services = [{
            id: "Piscina Temperada",
            label: "Piscina Temperada"
          }];
        });
    },
    getRooms() {
      axios
        .get(`${process.env.VUE_APP_API_URL}/rooms`)
        .then(response => {
          this.rooms = response.data.map((room) => {
            return {
              id: room.id_room,
              label: room.name
            }
          });
        })
        .catch(error => {
          this.rooms = [{
            id: "201",
            label: "201"
          }];
        });
    },
    addService() {
      if (!this.formAddService) return;
      this.service.push(this.formAddService);
      this.formAddService = {
        room: this.formAddService.room,
        service: this.formAddService.service,
        inicio: this.formAddService.inicio,
        fin: this.formAddService.fin
      };
      this.saveService();
    },
    saveService() {
      let parsed = JSON.stringify(this.formAddService);
      localStorage.setItem('service', parsed);
    },
    onSubmit() {
      axios
        .post(`${process.env.VUE_APP_API_URL}/services/add`, {
          room: this.formAddService.room,
          service: this.formAddService.service,
          inicio: this.formAddService.inicio,
          fin: this.formAddService.fin
        })
        .then((response) => {
          this.persist();
          const isValidResponse = response.data

          if (isValidResponse) {
            this.addService();
          }
        })
        .catch(error => {
          console.log("No se puede asociar el servicio a la habitación");
          console.error(error);
        });
    },
  }
};
</script>
