<template>
  <div class="container is-fluid columns is-mobile is-centered">
    <div style="column display: inline-block;">
      <h1 class="title"> Create New Job </h1>
      <b-field grouped>
          <b-field label="Time">
            <b-timepicker
                inline
                v-model="time"
                placeholder="Select Time..."
                icon="clock"
                :readonly="false">
            </b-timepicker>
          </b-field>
      </b-field>
      <b-field grouped>
          <b-field label="Pin" >
              <b-dropdown  v-model="pin">
                  <button class="button is-primary" slot="trigger">
                      <span>{{pin}}</span>
                      <b-icon icon="menu-down"></b-icon>
                  </button>
                  <b-dropdown-item v-for="p in pins" :key="p" :value="p">{{p}}</b-dropdown-item>
              </b-dropdown>
          </b-field>
          <b-field label="Operation" >
            <b-field >
              <b-radio-button v-model="operation"
                  native-value="ON"
                  type="is-success">
                  <b-icon icon="lightbulb-on-outline"></b-icon>
                  <span>ON</span>
              </b-radio-button>
              <b-radio-button v-model="operation"
                  native-value="OFF"
                  type="is-danger">
                  <b-icon icon="lightbulb-outline"></b-icon>
                  <span>OFF</span>
              </b-radio-button>
             </b-field>
          </b-field>
      </b-field>
      <b-field grouped>
        <b-field >
          <button class="button is-success" @click="$emit('add', `${moment(time).format('HH:mm')}`, pin, operation)">
              <span>SAVE</span>
          </button>
        </b-field>
          <b-field>
          <button @click="$emit('changeIndex', 0)" class="button">
              <span>Cancel</span>
          </button>
          </b-field>
      </b-field>
      </div>
  </div>
</template>
<script>
import moment from 'moment'
export default {
  props: ['add'],
  data () {
    return {
      moment,
      time: new Date(),
      pin: 'D1',
      pins: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'],
      operation: 'ON'
    }
  },
  mounted () {
  }
}
</script>
