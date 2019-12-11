<template>
<div class="booking">
  <div class="">
    <div class="row">
      <div class="col-12">
        <div class="row">
          <div class="col-3"></div>
          <div class="col-1">
            <div class="button-calendar" @click="moveStartDate(-1)">-1 día</div>
            <div class="button-calendar" @click="moveStartDate(-7)">-1 sem</div>
          </div>
          <div class="col-5"></div>
          <div class="col-1">
            <div class="button-calendar" @click="moveStartDate(1)">+1 día</div>
            <div class="button-calendar" @click="moveStartDate(7)">+1 sem</div>
          </div>
        </div>
        <div class="row">
          <div class="col-1"></div>
          <div class="col-2 row-empty">Habitación</div>
          <div v-for="n in daysToDisplay" class="col-1 row-empty">{{getDay(n - 1)}}</div>
        </div>
        <div v-for="(reservation,n) in reservations">
          <div class="row" style="text-align: center">
            <div class="col-1"></div>
            <div class="col-2 row-empty">{{reservation.room}}</div>
            <template v-for="(col,n) in reservation.listRow">
              <div v-if="col.bookingCode === 'Sin Reserva'" :class="`col-${col.colSpan}`" class="row-empty">
              </div>
              <div v-else :class="`col-${col.colSpan}`" class="row-reserved">
                <div>{{col.firstName}} {{col.lastName}}</div>
                <div>{{col.bookingCode !== "Sin Reserva" ? col.bookingCode : ''}}</div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import axios from "axios";
import moment from "moment";
import VDaySelector from 'vuelendar/components/vl-day-selector';
import VRangeSelector from 'vuelendar/components/vl-range-selector';
const daysToDisplay = 7
export default {
  components: {
    VDaySelector,
    VRangeSelector,
    daysToDisplay
  },
  data() {
    return {
      reservations: [],
      reservationsLoaded: false,
      daysToDisplay: 7,
      startDate: moment().format("YYYY-MM-DD"),
      endDate: moment().add(daysToDisplay - 1, 'days').format("YYYY-MM-DD"),
      grid: [],

    }
  },
  mounted() {
    this.loadReservations()
  },
  methods: {
    async loadReservations() {
      try {
        const request = await axios.post(`${process.env.VUE_APP_API_URL}/booking/listByDateWithColSpan`, {
          start: this.startDate,
          end: this.endDate
        })
        const reservations = request.data;
        this.reservationsLoaded = true;
        this.reservations = reservations
        return reservations;
      } catch (err) {
        return new Error(`No se pudo cargar reservas`)
      }
    },
    findReservationsByRoom(roomToFind, reservations) {
      return rooms.filter(room => roomToFind === room.codeRoom)
    },
    getDay(n) {
      return moment(this.startDate).add(n, 'days').format('DD/MMM/YY');
    },
    moveStartDate(n) {
      this.startDate = moment(this.startDate).add(n, 'days').format("YYYY-MM-DD")
      this.endDate = moment(this.endDate).add(n, 'days').format("YYYY-MM-DD")
      this.reservations = [];
      this.loadReservations()
    }
  }
};
</script>
<style src="vuelendar/scss/vuelendar.scss" lang="scss">
</style > <style lang="css" > .row-reserved {
    border: 1px solid #dee2e6;
    background: #b8daff;
}
.row-empty {
    border: 1px solid #dee2e6;
}

.button-calendar {
    border: 1px solid #fafafa;
    border-radius: 10px;
    background: #fafafa;
    cursor: pointer;
    margin: 5px 0;
    padding: 3px;
}
</style>
