 git  <template>
<div class="client">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div v-for="(reservation,n) in reservations">
          <div class="row">
            <div class="col-2">{{reservation.dni}}</div>
            <div class="col-2">{{reservation.room}}</div>
            <div class="col-2">{{reservation.room}}</div>
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
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="rut">Reserva</label>
                <input type="text" class="form-control" id="booking" v-model="formReservation.bookingCode" :readonly="true" required />
              </div>
            </div>
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="rut">DNI</label>
                <input type="text" class="form-control" id="dni" placeholder="12.345.678-9" v-model="formReservation.dni" required />
              </div>
            </div>
          </div>
          <!--
          <div class="row">
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="rut">Ingreso</label>
                <input type="text" class="form-control" id="checkin" placeholder="YYYY-MM-DD" v-model="formReservation.checkin" required />
              </div>
            </div>

            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="rut">Salida</label>
                <input type="text" class="form-control" id="checkout" placeholder="YYYY-MM-DD" v-model="formReservation.checkout" required />
              </div>
            </div>
          </div>
        -->
          <div class="row">
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="roomType">Tipo Habitación</label>
                <select class="form-control" name="roomsType" id="roomsType" v-model="formReservation.roomType" required @change="readRooms()">
                  <option v-for="(item, index) in roomsType" v-bind:key="index" :value="item">{{ item }}</option>
                </select>
              </div>
            </div>
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="room">Habitación</label>
                <select class="form-control" name="room" id="room" v-model="formReservation.room" required :disabled="!this.roomsLoaded" @change="loadReservedDays()">
                  <option v-for="(item, index) in rooms" v-bind:key="index" :value="item.code">{{ item.code }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-12">
              <div class="form-group">
                <label for="room">Periodo de reserva</label>
                <v-range-selector
                  :start-date.sync="formReservation.checkin"
                  :end-date.sync="formReservation.checkout"
                  :is-disabled="date => this.reservedaDays.includes(date)"
                />
              </div>
            </div>
          </div>
          <div class="row mt-4 float-right">
            <div class="form-group">
              <button class="btn btn-primary">Agregar Habitación</button>
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
      reservedaDays: [],
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
        "Duadruple",
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
    },
    saveReservations() {
      let parsed = JSON.stringify(this.formReservation);
      localStorage.setItem('reservations', parsed);
    },
    loadReservedDays() {
      this.reservedaDays = [];
      const dummy = [{
          "bookingcode": "RS190001",
          "starDate": "2019-01-10T00:00:00.000+0000",
          "endDate": "2019-05-12T00:00:00.000+0000",
          "firstName": "Daniel",
          "lastName": "Alvarez",
          "codeRoom": "205",
          "floor": 2
        },
        {
          "bookingcode": "RS190001",
          "starDate": "2019-05-13T00:00:00.000+0000",
          "endDate": "2019-05-14T00:00:00.000+0000",
          "firstName": "Daniel",
          "lastName": "Alvarez",
          "codeRoom": "205",
          "floor": 2
        },
        {
          "bookingcode": "RS190003",
          "starDate": "2019-10-10T00:00:00.000+0000",
          "endDate": "2019-10-12T00:00:00.000+0000",
          "firstName": "Test",
          "lastName": "Braulio",
          "codeRoom": "205",
          "floor": 2
        },
        {
          "bookingcode": "RS190003",
          "starDate": "2019-10-10T00:00:00.000+0000",
          "endDate": "2019-10-13T00:00:00.000+0000",
          "firstName": "Test",
          "lastName": "Braulio",
          "codeRoom": "209",
          "floor": 2
        },
        {
          "bookingcode": "RS190003",
          "starDate": "2019-10-10T00:00:00.000+0000",
          "endDate": "2019-10-15T00:00:00.000+0000",
          "firstName": "Test",
          "lastName": "Braulio",
          "codeRoom": "207",
          "floor": 2
        }
      ];
      dummy.filter((reservation) => {
        console.log(`${reservation.codeRoom} || ${this.formReservation.room}`);
        if (reservation.codeRoom === this.formReservation.room) {
          console.log(reservation.starDate.substring(0, 10));
          this.reservedaDays.push(reservation.starDate.substring(0, 10));
        }
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
    }
  }
};
</script>
<style src="vuelendar/scss/vuelendar.scss" lang="scss"></style>
