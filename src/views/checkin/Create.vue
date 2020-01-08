<template>
    <div class="checkin">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <form v-on:submit.prevent="onSubmit">
                        <div class="row">
                            <div class="col-xs-12 col-md-12">
                                <b><label style="color: blue;" name="info" id="info" v-text="info"></label></b>
                                <b><label style="color: red;" name="error" id="error" v-text="error"></label></b>
                            </div>
                            <div class="col-xs-12 col-md-2"></div>
                            <div class="col-xs-12 col-md-8">
                                <div class="form-group">
                                    <label for="rut">Habitación</label>
                                    <select class="form-control" name="rooms" id="rooms" v-model="room">
                                        <option v-for="(item, index) in rooms" v-bind:key="index" :value="item">{{
                                            item.code }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-xs-12 col-md-2"></div>
                        </div>
                        <div class="row">
                            <div class="col-xs-12 col-md-2">
                                <div class="form-group">
                                    <label for="firstName">Nombre</label>
                                    <input type="text" class="form-control" id="firstName" placeholder="Juan"
                                           v-model="firstName"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <div class="form-group">
                                    <label for="lastName">Apellido</label>
                                    <input type="text" class="form-control" id="lastName" placeholder="Pérez"
                                           v-model="lastName"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <div class="form-group">
                                    <label for="dnisType">Tipo Documento</label>
                                    <select class="form-control" name="dnisType" id="dnisType" v-model="dniType">
                                        <option v-for="(item, index) in dnisType" v-bind:key="index" :value="item">{{
                                            item.name }}
                                        </option>
                                    </select>
                                </div>
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <div class="form-group">
                                    <label for="dni">DNI</label>
                                    <input type="text" class="form-control" id="dni" placeholder="12.345.678-9"
                                           v-model="dni"/>
                                </div>
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <div class="form-group">
                                    <label for="nationality">País de origen</label>
                                    <select class="form-control" name="country" id="country" v-model="country">
                                        <option v-for="(item, index) in countries" v-bind:key="index"
                                                :value="item">{{ item.name }}
                                        </option>
                                    </select>

                                </div>
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <div class="form-group">
                                    <button @click="Guardar()" type="button" class="btn btn-primary">Añadir Persona
                                    </button>
                                </div>
                            </div>
                        </div>
                        <table class="table text-center">
                            <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>DNI</th>
                                <th>Tipo Documento</th>
                                <th>Pais</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="persona in arrayPersonas" :key="persona.id">
                                <td v-text="persona.firstName"></td>
                                <td v-text="persona.lastName"></td>
                                <td v-text="persona.dni"></td>
                                <td v-text="persona.dniType.name"></td>
                                <td v-text="persona.country.name"></td>
                            </tr>
                            </tbody>
                        </table>
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

    export default {
        data() {
            return {
                info: "",
                arrayPersonas: [],
                firstName: '',
                lastName: '',
                dni: '',
                country: '',
                dniType: '',
                countries: [],
                dnisType: [],
                rooms: [],
                formCheckin: {
                    bookingCode: ''
                }
            };
        },
        mounted() {
            this.readDNISType();
            this.getCountries();
            this.getRooms();
            this.Guardar();
        },
        methods: {
            Guardar() {
                var person = {
                    firstName: this.firstName, lastName: this.lastName,
                    countryId: this.country.id, dni: this.dni, type_dni_id: this.dniType.id,
                    country: this.country, dniType: this.dniType
                }
                this.arrayPersonas.push(person);
                this.firstName = "";
                this.lastName = "";
                this.dni = "";
                this.country = "";
                this.dniType = "";
            },
            persist(bookingCode) {
                localStorage.bookingCode = bookingCode;
            },
            getCountries() {
                axios
                    .get(`${process.env.VUE_APP_API_URL}/countries`)
                    .then(response => {
                        this.countries = response.data
                    })
                    .catch(error => {
                        this.countries = [{
                            id: "1",
                            name: "Chile"
                        }];
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
            readDNISType() {
                axios
                    .get(`${process.env.VUE_APP_API_URL}/type_dni`)
                    .then(response => {
                        this.dnisType = response.data;
                    })
                    .catch((_) => {
                        this.dnisType = [{
                            id: "1",
                            name: "Rut"
                        }, {
                            id: "2",
                            name: "Pasaporte"
                        }, {
                            id: "3",
                            name: "Otro DNI"
                        }];
                    });
            },
            onSubmit() {
                axios
                    .post(`${process.env.VUE_APP_API_URL}/checkin`, {
                        roomId: this.rooms.idRoom,
                        users: this.arrayPersonas
                    })
                    .then((response) => {
                        this.rooms = "";
                        this.arrayPersonas = "";
                        this.error = "";
                        this.info = "Se creó el check-in correctamente";
                    })
                    .catch(error => {
                        this.error = "No se pudo realizar el Check-in";
                        this.info = "";
                        console.log("No se pudo realizar el Check-In");
                        console.error(error);
                    });
            },
        }
    };
</script>
