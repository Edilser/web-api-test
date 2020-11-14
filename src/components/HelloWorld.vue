<template>
<div>
<div class="text-center">
  <div>
    <img src="../assets/image.png" width="700px" height="200px" alt="" srcset="">
  </div>
  <v-container>
    <v-card color="grey lighten-3">
      <v-card-title>Busquedas</v-card-title>
    <v-row
      class="mb-6 ml-5"
      justify="center"
      no-gutters
    >
      <v-col lg="3" class="mr-5 mt-5">
        <v-combobox 
          @change="changetext"
          outlined 
          solo 
          :items="datos" 
          chips 
          label="Seleccione el tipo de filtro" 
          v-model="typeFilter">
        </v-combobox>
      </v-col>
      <v-col md="4" class="mt-5">
        <v-text-field
          solo-white
          :label="nexText"
          outlined
          v-model="nameFilter"
        ></v-text-field>
      </v-col>
      <v-col lg="2" class="mt-5">
        <v-btn
          rounded
          class="ma-2 fas fa-search"
          :loading="loading"
          :disabled="loading"
          :color="colors"
          @click="sendFilter">
          Buscar
            <v-icon
              right>
              mdi-checkbox-marked-circle
            </v-icon>
        </v-btn>
      </v-col>
      <v-col lg="2" class="mt-7 mr-10">
        <v-btn
          rounded
          outlined
          color="red"
          @click="limpiar">
          Limpiar
        </v-btn>
      </v-col>
    </v-row>
    </v-card>
  </v-container>
  </div>
  <div class="tabla" v-show="canciones">
    <v-data-table
      style="width: 900px;"
      :headers="headers"
      :items="vectorFinal"
      :items-per-page="10"
      class="elevation-1"
  ></v-data-table>
  <img src="../assets/canciones.png" alt="" srcset="">
  </div>
  <div class="tabla" v-show="shows">
    <v-data-table
      style="width: 900px;"
      :headers="headers2"
      :items="vectorFinal"
      :items-per-page="10"
      class="elevation-1"
  ></v-data-table>
  <img src="../assets/shows.png" alt="" srcset="">
  </div>
  <div class="tabla" v-show="peliculas">
    <v-data-table
      style="width: 900px;"
      :headers="headers3"
      :items="vectorFinal"
      :items-per-page="10"
      class="elevation-1"
  ></v-data-table>
  <img src="../assets/peliculas.jpg" alt="" srcset="">
  </div>
</div>
</template>

<script>
import axios from 'axios'
  export default {
    data () {
      return {
        texto: '',
        vectorFinal: [],
        canciones: false,
        shows: false,
        peliculas: false,
        vector: [],
        vector2: [],
        colors: 'primary',
        nameFilter: '',
        datos: [
          'Shows',
          'Canciones',
          'Peliculas'
        ],
        typeFilter: '',
        loader: null,
        loading: false,
        nexText: '',
        headers: [
          { text: 'Artista', align: 'start', sortable: false, value: 'artista'},
          { text: 'Musica', sortable: false, value: 'musica' },
          { text: 'Disco', sortable: false, value: 'disco' },
          { text: 'Genero', sortable: false, value: 'genero' },
          { text: 'Pais', sortable: false, value: 'pais' },
        ],
        headers2: [
          { text: 'Show', align: 'start', sortable: false, value: 'show'},
          { text: 'Genero', sortable: false, value: 'genero' },
          { text: 'Lenguaje', sortable: false, value: 'lenguaje' },
          { text: 'Clasificación', sortable: false, value: 'genero' },
          { text: 'Estrenada', sortable: false, value: 'estreno' },
        ],
        headers3: [
          { text: 'Artista', align: 'start', sortable: false, value: 'artista'},
          { text: 'Pelicula', sortable: false, value: 'pelicula' },
          { text: 'Lanzamiento', sortable: false, value: 'lanzamiento' },
          { text: 'Genero', sortable: false, value: 'genero' },
          { text: 'Pais', sortable: false, value: 'pais' },
        ]
      }
    },
    methods: {
      limpiar () {
        this.typeFilter = ''
        this.nameFilter = ''
        this.canciones = false
        this.peliculas = false
        this.shows = false
        this.nexText = ''
      },
      sendFilter () {
        this.canciones = false;
        this.shows = false;
        this.peliculas = false;
        this.vector = [];
        this.vector2 = [];
        this.vectorFinal = [];
        const l = 'loading'
        if (this.typeFilter === '') {
          alert('Ingrese el tipo de filtro')
        } else if (this.nameFilter === '' || this.nameFilter === undefined) {
          alert('Ingrese un dato para filtrar')
        } else {
          this[l] = !this[l]
          this.texto = this.nameFilter.replace(' ','+');
          this.getData(this.typeFilter, this.texto)
          setTimeout(() => (this[l] = false), 400)
          this.loader = null
        }
      },
      async getData(filtro, name) {
        this.vector = []
        this.vector2 = []
        this.vectorFinal = []
        if (filtro === 'Canciones') {
          await axios.get(`https://edilser-api.herokuapp.com/api/songs/${name}`)
          .then((resp) => {
              resp.data.results.forEach(element => this.vector.push(element));
              for (let i = 0; i < this.vector.length; i++) {
                this.vector2.push({
                  artista: this.vector[i].artistName,
                  musica: this.vector[i].trackName,
                  disco: this.vector[i].discNumber,
                  genero: this.vector[i].primaryGenreName,
                  pais: this.vector[i].country
                })
              }
          })
          this.ordenar(this.vector2,'canciones');
        } else if (filtro === 'Peliculas') {
          await axios.get(`https://edilser-api.herokuapp.com/api/movies/${name}`)
          .then((resp) => {
              resp.data.results.forEach(element => this.vector.push(element));
              for (let i = 0; i < this.vector.length; i++) {
                this.vector2.push({
                  artista: this.vector[i].artistName,
                  pelicula: this.vector[i].trackName,
                  lanzamiento: this.vector[i].releaseDate,
                  genero: this.vector[i].primaryGenreName,
                  pais: this.vector[i].country
                })
              }
          })
          this.ordenar(this.vector2,'Peliculas');
        } else if (filtro === 'Shows') {
          await axios.get(`https://edilser-api.herokuapp.com/api/shows/${name}`)
          .then((resp) => {
              resp.data.forEach(element => this.vector.push(element));
              for (let i = 0; i < this.vector.length; i++) {
                this.vector2.push({
                  show: this.vector[i].show.name,
                  genero: this.vector[i].show.genres[0],
                  lenguaje: this.vector[i].show.language,
                  clasificacion: this.vector[i].show.rating.average,
                  estreno: this.vector[i].show.premiered
                })
              }
          })
          this.ordenar(this.vector2,'shows');
        }
      },
      ordenar (vector, habilitar) {
        if (habilitar === 'canciones') {
          this.vectorFinal = vector.sort(function (a, b) {
            if (a.artista > b.artista) {
              return 1;
            }
            if (a.artista < b.artista) {
              return -1;
            }
            return 0;
          });
          this.canciones = true
        }
        else if (habilitar === 'shows') {
          this.vectorFinal = vector.sort(function (a, b) {
            if (a.show > b.show) {
              return 1;
            }
            if (a.show < b.show) {
              return -1;
            }
            return 0;
          });
          this.shows = true
        }
        else if (habilitar === 'Peliculas') {
          this.vectorFinal = vector.sort(function (a, b) {
            if (a.artista > b.artista) {
              return 1;
            }
            if (a.artista < b.artista) {
              return -1;
            }
            return 0;
          });
          this.peliculas = true
        }
      },
      changetext () {
        if (this.typeFilter === 'Shows') {
          this.nexText = 'Ingrese el nombre del show'
          this.colors = 'success'
        } else if (this.typeFilter === 'Canciones') {
          this.nexText = 'Ingrese el nombre de la canción'
          this.colors = 'red darken-1'
        } else if (this.typeFilter === 'Peliculas') {
          this.nexText = 'Ingrese el nombre de la pelicula'
          this.colors = 'orange accent-3'
        } else {
          this.nexText = ''
          this.colors = 'primary'
          this.nameFilter = ''
        }
      }
    }
  }
</script>

<style>
  .v-input__slot {
    background-color: white !important;
  }
  .tabla {
    display: flex;
    justify-content: center;
    margin-bottom: 5%;
  }

  .tabla > img {
    width: 200px;
    height: 200px;
    margin-left: 30px;
  }
</style>
