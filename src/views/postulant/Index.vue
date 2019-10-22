<template>
  <div class="postulant">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <table class="table table-hover">
            <thead>
              <th>Nombre del postulante</th>
              <th>Rut</th>
              <th>Curso</th>
            </thead>
            <tbody>
              <tr v-for="(item, index) in postulants" v-bind:key="index">
                <td>{{ item.name }}</td>
                <td>{{ item.rut }}</td>
                <td>{{ item.course }}</td>
              </tr>
            </tbody>
          </table>
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
      postulants: []
    };
  },
  mounted() {
    this.getPostulants();
  },
  methods: {
    getPostulants() {
      axios
        .get(`${process.env.VUE_APP_API_URL}/estudiantes`)
        .then(response => {
          this.postulants = response.data;
        })
        .catch(() => {});
    }
  }
};
</script>
