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
                <label for="room">Habitación</label>
                <select class="form-control" name="rooms" id="rooms" v-model="room" required>
                  <option v-for="(item, index) in rooms" v-bind:key="index" :value="item">{{ item.code }}</option>
                </select>
              </div>
            </div>
            <div class="col-xs-12 col-md-2"></div>
          </div>
          <div class="row">
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="name">Nombre Completo</label>
                <input type="text" class="form-control" id="name" v-model="formCheckout.name" :disabled="true" required />
              </div>
            </div>
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="days">Noches Alojadas</label>
                <input type="text" class="form-control" id="days" v-model="formCheckout.days" :disabled="true" required />
              </div>
            </div>

            <div class="col-xs-12 col-md-12">
              Aquí va a ir los servicios contratados por la habitación
            </div>

            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="payment-method">Forma de Pago</label>
                <select class="form-control" name="payment-method" id="payment-method" v-model="paymentMethods" required>
                  <option v-for="(item, index) in paymentMethods" v-bind:key="index" :value="item">{{ item.name }}</option>
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
      rooms: [],
      paymentMethods: [],
      formCheckout: {
        room: '',
        name: '',
        days: '',
        paymentMethod: 0
      }
    };
  },
  mounted() {
    this.getPaymentMethods();
  },
  methods: {
    persist(bookingCode) {
      localStorage.bookingCode = bookingCode;
    },
    getRooms() {
                axios
                    .get(`${process.env.VUE_APP_API_URL}/room/listAll`)
                    .then(response => {
                        this.rooms = response.data
                    })
                    .catch(error => {
                        this.rooms = [{
                            idRoom: "1",
                            code: "205"
                        }];
                    });
            },
    getPaymentMethods() {
      axios
        .get(`${process.env.VUE_APP_API_URL}/payment_method`)
        .then(response => {
          
        })
        .catch(error => {
          this.paymentMethods = [{
            id: "1",
            name: "Efectivo"
          }];
        });
    },
    onSubmit() {
      axios
        .post(`${process.env.VUE_APP_API_URL}/checkout/add`, {
          room: this.rooms.idRoom,
          paymentMethod: this.paymentMethods.id,
        })
        .then((response) => {

        })
        .catch(error => {
          console.log("No se pudo realizar el Check-Out");
          console.error(error);
        });
    },
  }
};
</script>
