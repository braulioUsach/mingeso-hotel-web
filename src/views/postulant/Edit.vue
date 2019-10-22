<template>
  <div class="postulant">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <form v-on:submit.prevent="onSubmit">
            <!-- Rut -->
            <!-- TODO validar rut -->
            <div class="form-group">
              <label for="rut">Rut</label>
              <input
                type="text"
                class="form-control"
                id="rut"
                placeholder="11.111.111-1"
                v-model="form.rut"
              />
            </div>

            <!-- Nombre del postulante -->
            <div class="form-group">
              <label for="name">Nombre completo</label>
              <input
                type="text"
                class="form-control"
                id="name"
                placeholder="Jhon Doe"
                v-model="form.name"
              />
            </div>

            <!-- Fecha de nacimiento -->
            <!-- TODO usar librería para seleccionar fechas -->
            <div class="form-group">
              <label for="name">Fecha de nacimiento</label>
              <input
                type="text"
                class="form-control"
                id="birth_date"
                placeholder="YYYY-MM-DD"
                v-model="form.dateBirth"
              />
            </div>

            <!-- Carrera a la que postula -->
            <div class="form-group">
              <label for="Course">Carrera a la que postula</label>
              <select class="form-control" name="Course" id="Course" v-model="form.Course">
                <option
                  v-for="(item, index) in Courses"
                  v-bind:key="index"
                  :value="item.name"
                >
                  {{ item.name }}
                </option>
              </select>
            </div>

            <!-- Button submit -->
            <div class="form-group">
              <button class="btn btn-primary">Crear</button>
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
      Courses: [],
      form: {
        rut: "",
        name: "",
        dateBirth: "",
        Course: ""
      }
    };
  },
  mounted() {
    this.getCourses();
  },
  methods: {
    getCourses() {
      // TODO en un futuro estas carreras deben ser consumidas de algun servicio disponibilizado por le Backend
      this.Courses = [
        { name: "Ingeniería Civil Biomédica" },
        { name: "Ingeniería Civil en Telemática" },
        { name: "Ingeniería Civil en Mecatrónica" },
        { name: "Ingeniería Civil en Ambiente" },
        { name: "Ingeniería Civil en Electricidad" },
        { name: "Ingeniería Civil en Geografía" },
        { name: "Ingeniería Civil en Industria" },
        { name: "Ingeniería Civil en Informática" },
        { name: "Ingeniería Civil en Mecánica" },
        { name: "Ingeniería Civil en Metalurgia" },
        { name: "Ingeniería Civil en Minas" },
        { name: "Ingeniería Civil en Obras Civiles" },
        { name: "Ingeniería Civil en Química" },
        { name: "Ingeniería Comercial" },
        { name: "Ingeniería de Alimentos" },
        { name: "Ingeniería de Ejecución en Climatización" },
        { name: "Ingeniería de Ejecución en Computación de Informática" },
        { name: "Ingeniería de Ejecución en Electricidad" },
        { name: "Ingeniería de Ejecución en Geomensura" },
        { name: "Ingeniería de Ejecución en Industria" },
        { name: "Ingeniería de Ejecución en Mecánica" },
        { name: "Ingeniería de Ejecución en Metalurgia" },
        { name: "Ingeniería de Ejecución en Minas" },
        { name: "Ingeniería de Ejecución en Química" },
        { name: "Ingeniería en Agronegocios" },
        { name: "Ingeniería Civil en Biotecnología" },
        { name: "Ingeniería Estadística" },
        { name: "Ingeniería Física" },
        { name: "Ingeniería Matemática" }
      ];
    },
    onSubmit() {
      axios
        .post(`${process.env.VUE_APP_API_URL}/estudiantes/agregar`, {
          name: this.form.name,
          rut: this.form.rut,
          course: this.form.name,
          dateBirth: this.form.dateBirth
        })
        .then(() => {
          console.log("Usuario Agregado");
          this.$router.go("/");
        })
        .catch(error => {
          console.log("error", error);
        });
    }
  }
};
</script>
