<template>
<div class="checkout">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <form v-on:submit.prevent="onSubmit">
          <div class="row">
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="room">Habitación</label>
                <select class="form-control" name="rooms" id="rooms" v-model="room" required>
                  <option v-for="(item, index) in rooms" v-bind:key="index" :value="item">{{ item.code }}</option>
                </select>
              </div>
            </div>
            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="days">Noches Alojadas</label>
                <input type="text" class="form-control" id="days" v-model="formCheckout.days" :disabled="true" required />
              </div>
            </div>

            <table class="table text-center">
              <thead>
              <tr>
                  <th>Servicio Contratado</th>
                  <th>Valor</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="service in hired_services" :key="service.id">
                  <td v-text="service.name"></td>
                  <td v-text="service.price"></td>
              </tr>
              </tbody>
          </table>

            <div class="col-xs-12 col-md-6">
              <div class="form-group">
                <label for="payment-method">Forma de Pago</label>
                <select class="form-control" name="payment-method" id="payment-method" v-model="paymentMethod" required>
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
      hired_services: [],
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
    this.getRooms();
  },
  methods: {
    persist(bookingCode) {
      localStorage.bookingCode = bookingCode;
    },
    CargarDatos(){
        axios
          .post(`${process.env.VUE_APP_API_URL}/sebaaaaaaaaa`, {
            id_room: this.rooms.id
          })
          .then(response => {

          })
          .catch(error => {
            console.log("no se pudo cargar los datos");
            console.error(error);
          });
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
            this.paymentMethods = response.data
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
