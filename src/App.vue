<template>
  <div id="app">
    <div class="container is-fluid">
    <div class="columns is-mobile is-centered">
      <div class="column is-11-mobile is-6-tablet is-4-desktop">
        <b-tabs type="is-toggle" v-model="index" @change="nav" @input="nav" expanded>
            <b-tab-item label="Lists" ></b-tab-item>
            <b-tab-item label="Add" ></b-tab-item>
            <b-tab-item label="Control" ></b-tab-item>
        </b-tabs>
        <router-view @add="add" @remove="remove" @update="update" @changeIndex="changeIndex" @addControl="addControl" @removeControl="removeControl" :schedules="schedules" :controls="controls"/>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
var firebaseApp = firebase.initializeApp({
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: 'iot-cronjob.firebaseapp.com',
  databaseURL: 'https://iot-cronjob.firebaseio.com',
  projectId: 'iot-cronjob',
  storageBucket: 'iot-cronjob.appspot.com',
  messagingSenderId: '623382483463'
})
console.log(process.env)
var db = firebaseApp.database()
export default {
  data () {
    return {
      index: 0
    }
  },
  name: 'App',
  firebase: {
    schedules: db.ref('schedules'),
    controls: db.ref('controls')
  },
  mounted () {
    this.$router.replace('/')
  },
  methods: {
    add (time, pin, operation) {
      console.log(time, pin, operation)
      this.$firebaseRefs.schedules.push({
        time,
        pin,
        operation,
        status: true
      })
      this.changeIndex(0)
    },
    remove (key) {
      this.$firebaseRefs.schedules.child(key).remove()
    },
    nav (index) {
      if (index === 0) this.$router.replace('/')
      if (index === 1) this.$router.replace('/create')
      if (index === 2) this.$router.replace('/control')
    },
    changeIndex (index) {
      this.index = index
    },
    update (schedule) {
      const copySchedule = {...schedule}
      delete copySchedule['.key']
      this.$firebaseRefs.schedules.child(schedule['.key']).set(copySchedule)
    },
    addControl (name, pin) {
      this.$firebaseRefs.controls.push({
        name,
        pin
      })
    },
    removeControl (key) {
      this.$firebaseRefs.controls.child(key).remove()
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
// Import Bulma's core
@import "~bulma/sass/utilities/_all";
// Import Bulma and Buefy styles
// Set your colors
$primary: $turquoise;
$primary-invert: findColorInvert($primary);
$twitter: #4099FF;
$twitter-invert: findColorInvert($twitter);

// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert),
    "twitter": ($twitter, $twitter-invert)
);

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;
// Import Bulma and Buefy styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
</style>
