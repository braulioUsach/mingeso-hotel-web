<template>
<div class="client">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div v-if="reservations.length > 0">
          <div class="row">
            <div class="col-3">DNI</div>
            <div class="col-3">Habitación</div>
            <div class="col-3">Llegada</div>
            <div class="col-3">Salida</div>
          </div>
        </div>
        <div v-for="(reservation,n) in reservations">
          <div class="row">
            <div class="col-3">{{reservation.dni}}</div>
            <div class="col-3">{{reservation.room}}</div>
            <div class="col-3">{{reservation.checkin}}</div>
            <div class="col-3">{{reservation.checkout}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <form v-on:submit.prevent="onSubmit">
          <div class="row">
            <div class="col-xs-12 col-md-2"></div>
            <div class="col-xs-12 col-md-8">
              <div class="form-group">
                <label for="rut">Reserva (Opcional)</label>
                <input type="text" class="form-control" id="booking" v-model="formReservation.bookingCode"  />
              </div>
            </div>
            <div class="col-xs-12 col-md-2"></div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="rut">Nombre Completo</label>
                <input type="text" class="form-control" id="name" placeholder="Juan Pérez" v-model="formReservation.dni" required />
              </div>
            </div>
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="rut">DNI</label>
                <input type="text" class="form-control" id="dni" placeholder="12.345.678-9" v-model="formReservation.dni" required />
              </div>
            </div>
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="roomType">Tipo Documento</label>
                <select class="form-control" name="roomsType" id="roomsType" v-model="formReservation.roomType" required @change="readRooms()">
                  <option v-for="(item, index) in roomsType" v-bind:key="index" :value="item">{{ item }}</option>
                </select>
              </div>
            </div>
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="rut">Nacionalidad</label>
                <select class="form-control" name="typedni" id="typedni" v-model="formReservation.dni" required  @change="readRooms()">
                  <option v-for="(item, index) in clients" v-bind:key="item.dni" :value="item.dni">{{ item.dni }} - {{ item.fullName }}</option>
                </select>
              </div>
            </div>
            
          </div>
          <div class="row mt-4 float-right">
            <div class="form-group">
              <button class="btn btn-primary">Crear Check-In</button>
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
import VDaySelector from 'vuelendar/components/vl-day-selector';
import VRangeSelector from 'vuelendar/components/vl-range-selector';
export default {
  components: {
    VDaySelector,
    VRangeSelector
  },
  data() {
    return {
      bookingCode: '',
      dni: '',
      firstName: '',
      reservations: [],
      newReservation: '',
      roomsType: [],
      rooms: [],
      roomsLoaded: false,
      reservedDays: [],
      clients : [],
      clientsLoaded: false,
      formReservation: {
        bookingCode: '',
        dni: '',
        checkin: '',
        checkout: '',
        roomType: '',
        room: ''
      }
    };
  },
  mounted() {
    if (localStorage.getItem('firstName')) {
      this.firstName = localStorage.getItem('firstName');
    }
    this.createBooking();
    this.readRoomsType();
    this.loadClients();
  },
  methods: {
    persist(bookingCode) {
      localStorage.bookingCode = bookingCode;
    },
    createBooking() {
      axios
        .get(`${process.env.VUE_APP_API_URL}/new_reservation`)
        .then(response => {
          const {
            bookingCode
          } = response.data;
          this.persist(bookingCode);
          this.formReservation.bookingCode = bookingCode;
          this.bookingCode = bookingCode;
        })
        .catch(error => {
          console.log("no se pudo crear reserva");
          console.error(error);
        });
    },
    readRoomsType() {
      this.roomsType = [
        "Simple",
        "Doble",
        "Triple",
        "Cuadruple",
        "Matrimonial"
      ]
    },
    readRooms() {
      this.roomsLoaded = false;
      this.formReservation.checkin = '';
      this.formReservation.checkout = '';
      axios
        .post(`${process.env.VUE_APP_API_URL}/room/listByType`, {
          type: this.formReservation.roomType
        })
        .then(response => {
          this.rooms = response.data.map((room) => {
            return {
              code: room.code
            }
          });
          this.roomsLoaded = true;
        })
        .catch(error => {
          console.log("no se pudo cargar las habitaciones");
          console.error(error);
        });
    },
    addReservation() {
      if (!this.formReservation) return;
      this.reservations.push(this.formReservation);
      this.formReservation = {
        bookingCode: this.formReservation.bookingCode,
        dni: this.formReservation.dni,
        checkin: '',
        checkout: '',
        roomType: '',
        room: ''
      };
      this.saveReservations();
      // {"type":"none","start":"2019-12-19","end":"2019-12-31","room":"108","code":"RS190045","dni":"28092637-K"}
    },
    saveReservations() {
      let parsed = JSON.stringify(this.formReservation);
      localStorage.setItem('reservations', parsed);
    },
    loadReservedDays() {
      this.reservedDays = [];
      axios.get(`${process.env.VUE_APP_API_URL}/reservation_list`)
        .then(response => {
          response.data.filter((reservation) => {
            if (reservation.codeRoom === this.formReservation.room) {
              this.reservedDays.push(reservation.starDate.substring(0, 10));
            }
          })
        })
        .catch(err => {
          console.error(err);
        })
    },
    onSubmit() {
      axios
        .post(`${process.env.VUE_APP_API_URL}/period/add`, {
          type: this.formReservation.roomType,
          start: this.formReservation.checkin,
          end: this.formReservation.checkout,
          room: this.formReservation.room,
          code: this.formReservation.bookingCode,
          dni: this.formReservation.dni,
        })
        .then((response) => {
          this.persist();
          const isValidResponse = response.data

          if (isValidResponse) {
            this.addReservation();
          }
        })
        .catch(error => {
          console.log("no se pudo agregar habitación");
          console.error(error);
        });
    },
    loadClients() {
      this.clientsLoaded = false;
      this.clients = [];
      axios.get(`${process.env.VUE_APP_API_URL}/clients`)
        .then(response => {
          this.clientsLoaded = true;
          console.log('clients loaded');
          this.clients = response.data.map(client => {
            return {
              dni: client.dniNumber,
              fullName: `${client.firstName} ${client.lastName}`
            }
          });
        })
        .catch(err => {
          console.error(err);
        })
    },
  }
};
</script>
<style src="vuelendar/scss/vuelendar.scss" lang="scss" />
