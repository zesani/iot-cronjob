<template>
  <div>
    <div class="card" v-for="schedule in schedules" :key="schedule['.key']">
      <div class="card-content time-card">
        <div class="columns is-mobile is-multiline">
          <div class="column is-4-mobile is-offset-8-mobile is-2-tablet is-offset-10-tablet test">
            <div class="columns is-mobile is-gapless">
              <div class="column is-6">
                <span @click="$router.replace('/edit/' + schedule['.key'])" class="span-icon">
                  <b-icon icon="pencil" size=""></b-icon>
                </span>
              </div>
              <div class="column is-6">
                <span @click="$emit('remove', schedule['.key'])" class="span-icon">
                  <b-icon icon="close-circle" size="" type=""></b-icon>
                </span>
              </div>
            </div>
          </div>
          <div class="column is-4">
            <h1 class="title is-hidden-mobile">{{schedule.time}}</h1>
            <h1 class="title is-hidden-tablet is-4">{{schedule.time}}</h1>
          </div>
          <div class="column is-2 is-hidden-mobile">
            <h1 class="title">{{schedule.pin}}</h1>
          </div>
           <div class="column is-3 is-hidden-tablet">
            <h1 class="title is-4">{{schedule.pin}}</h1>
          </div>
          <div class="column is-3 is-hidden-mobile">
            <button  style="cursor: initial;" :class="`button ${schedule.operation === 'ON' ? 'is-success' : 'is-danger'}`">
                <b-icon :icon="schedule.operation === 'ON' ? 'lightbulb-on-outline' : 'lightbulb-outline'"></b-icon>
                <span>{{schedule.operation}}</span>
            </button>
          </div>
          <div class="column is-2 is-hidden-tablet">
            <button  style="cursor: initial;" :class="`button ${schedule.operation === 'ON' ? 'is-success' : 'is-danger'}`">
                <b-icon :icon="schedule.operation === 'ON' ? 'lightbulb-on-outline' : 'lightbulb-outline'"></b-icon>
            </button>
          </div>
          <div class="column is-1">
            <div class="field">
              <b-switch :value="schedule.status" @click.native="switchto(schedule)"
              type="is-success">
              </b-switch>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
export default {
  props: ['schedules'],
  data () {
    return {
      pins: ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8']
    }
  },
  methods: {
    switchto (schedule) {
      console.log(schedule)
      this.$emit('update', {...schedule, status: !schedule.status})
    }
  }
}
</script>
<style scoped>
.test {
  margin-top: 0px;
  margin-right: -10px  !important;
  padding-top: 0px;
  padding-bottom: 20px;
  height: 0px !important;
  padding-right: 0px;
}
.time-card {
  padding-right: 12px;
}
.span-icon {
  cursor: pointer;
}
.span-icon :hover {
  color: #EC445A;
}
</style>
