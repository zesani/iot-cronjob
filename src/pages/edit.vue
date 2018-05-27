<template>
  <div class="container is-fluid columns is-mobile is-centered">
    <div style="column display: inline-block;">
      <h1 class="title"> Edit Job </h1>
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
          <button class="button is-success" @click="updateSchedule">
              <span>Edit</span>
          </button>
        </b-field>
          <b-field>
          <button @click="$router.replace('/')" class="button">
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
  props: ['schedules'],
  data () {
    return {
      moment,
      time: new Date(),
      pin: 'D1',
      pins: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8'],
      operation: 'ON',
      schedule: {}
    }
  },
  mounted () {
    const schedule = this.schedules.find(schedule => schedule['.key'] === this.$route.params.key)
    if (schedule) {
      this.pin = schedule.pin
      this.operation = schedule.operation
      this.time = new Date(moment().set('hour', schedule.time.split(':')[0]).set('minute', schedule.time.split(':')[1]).format())
      this.schedule = schedule
    }
  },
  methods: {
    updateSchedule () {
      this.$emit('update', {
        ...this.schedule,
        pin: this.pin,
        time: moment(this.time).format('HH:mm'),
        operation: this.operation
      })
      this.$router.replace('/')
    }
  }
}
</script>
