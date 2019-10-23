<template>
<div class="client">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="col-xs-12 col-md-6">
          <div>Reserva nº {{this.bookingCode}}</div>
        </div>
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
      firstName: ''
    };
  },
  mounted() {
    if (localStorage.dni) {
      this.dni = localStorage.dni;
    }

    if (localStorage.firstName) {
      this.firstName = localStorage.firstName;
    }
    this.createBooking();
  },
  methods: {
    persist(bookingCode) {
      localStorage.bookingCode = bookingCode;
    },
    createBooking() {
      axios
        .get(`${process.env.VUE_APP_API_URL}/new_reservation`)
        .then(response => {
          console.log({
            data: response.data
          });
          const {
            bookingCode
          } = response.data;
          this.persist(bookingCode);
          this.bookingCode = bookingCode;
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }
};
</script>
