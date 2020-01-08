<template>
    <div class="checkin">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <form v-on:submit.prevent="onSubmit">
                        <div class="row">
                            <div class="col-xs-12 col-md-2"></div>
                            <div class="col-xs-12 col-md-8">
                                <div class="form-group">
                                    <label for="rut">Reserva (Opcional)</label>
                                    <input type="text" class="form-control" id="booking"
                                           v-model="formCheckin.bookingCode"/>
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
                                            item.label }}
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
                                                :value="item">{{ item.label }}
                                        </option>
                                    </select>

                                </div>
                            </div>
                            <div class="col-xs-12 col-md-2">
                                <div class="form-group">
                                    <button @click="Guardar()" type="button" class="btn btn-primary">Añadir Persona</button>
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
                                <td v-text="persona.dniType.label"></td>
                                <td v-text="persona.country.label"></td>
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
                arrayPersonas: [],
                firstName: '',
                lastName: '',
                dni: '',
                country: '',
                country_id: 0,
                dniType: '',
                countries: [],
                dnisType: [],
                formCheckin: {
                    bookingCode: '',
                    firstName: '',
                    lastName: '',
                    dni: '',
                    country: 0,
                    dniType: ''
                }
            };
        },
        mounted() {
            this.readDNISType();
            this.getCountries();
        },
        methods: {
            Guardar() {
                var persona = {
                    firstName: this.firstName, lastName: this.lastName,
                    dni: this.dni, country: this.country, dniType: this.dniType
                }
                this.arrayPersonas.push(persona);
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
                        this.countries = response.data.map((country) => {
                            return {
                                id: country.id_country,
                                label: country.name
                            }
                        });
                    })
                    .catch(error => {
                        this.countries = [{
                            id: "1",
                            label: "Chile"
                        }];
                    });
            },
            readDNISType() {
                axios
                    .get(`${process.env.VUE_APP_API_URL}/type_dni`)
                    .then(response => {
                        this.dnisType = response.data.map((dnitype) => {
                            return {
                                id: dnitype.id_dni_type,
                                label: dnitype.name
                            }
                        });
                    })
                    .catch((_) => {
                        this.dnisType = [{
                            id: "1",
                            label: "Rut"
                        },{
                            id: "2",
                            label: "Pasaporte"
                        },{
                            id: "3",
                            label: "Otro DNI"
                        }];
                    });
            },
            onSubmit() {
                axios
                    .post(`${process.env.VUE_APP_API_URL}/checkin`, {
                        reservationCode: this.formCheckin.bookingCode,
                        users: this.arrayPersonas
                    })
                    .then((response) => {
                        
                    })
                    .catch(error => {
                        console.log("No se pudo realizar el Check-In");
                        console.error(error);
                    });
            },
        }
    };
</script>
