 git  <template>
<div class="client">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div v-for="(reservation,n) in reservations">
          <p>
            <span class="cat">{{reservation}}</span> <button @click="removeReservation(n)">Eliminar</button>
          </p>
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
                <input type="text" class="form-control" id="booking" v-model="formReservation.bookingCode" editable=false required />
              </div>
            </div>
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="rut">DNI</label>
                <input type="text" class="form-control" id="dni" placeholder="YY-MM-DD" v-model="formReservation.dni" required />
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="rut">Ingreso</label>
                <input type="text" class="form-control" id="checkin" placeholder="YY-MM-DD" v-model="formReservation.checkin" required />
              </div>
            </div>

            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="rut">Salida</label>
                <input type="text" class="form-control" id="checkout" placeholder="YY-MM-DD" v-model="formReservation.checkout" required />
              </div>
            </div>
          </div>
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
                <select class="form-control" name="room" id="room" v-model="formReservation.room" required>
                  <option v-for="(item, index) in rooms" v-bind:key="index" :value="code">{{ item.code }}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="form-group">
              <button class="btn btn-primary">Crear</button>
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
      bookingCode: '',
      dni: '',
      firstName: '',
      reservations: [],
      newReservation: '',
      roomsType: [],
      rooms: [],
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
    if (localStorage.getItem('dni')) {
      this.dni = localStorage.getItem('dni');
      this.formReservation.dni = localStorage.getItem('dni');
    }

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
          console.log("error", error);
        });
    },
    readRoomsType() {
      this.roomsType = [
        "simple",
        "doble",
      ]
    },
    readRooms() {
      axios
        .post(`${process.env.VUE_APP_API_URL}/room/listByType`, {
          type: this.formReservation.roomType
        })
        .then(response => {
          this.rooms = response.data;
        })
        .catch(error => {
          console.log("no se pudo cargar las habitaciones");
          console.error(error);
        });
    },
    addReservation() {
      if (!this.formReservation) return;
      this.reservations.push(this.formReservation);
      console.log({
        formReservation: this.formReservation
      });
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
    removeReservation(x) {
      this.cats.splice(x, 1);
      this.saveReservations();
    },
    saveReservations() {
      // let parsed = JSON.stringify(this.reservations);
      let parsed = JSON.stringify(this.formReservation);
      localStorage.setItem('reservations', parsed);
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
          console.log('response');
          console.log(response.data)
          const isValidResponse = response.data
          if(isValidResponse) {
            this.addReservation();
          }
          // this.$router.push({ name: 'create-booking'});
          // this.$router.go("/booking/create");
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }
};
</script>
