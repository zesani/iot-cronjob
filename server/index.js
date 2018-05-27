var cron = require('cron')
var admin = require('firebase-admin')

var serviceAccount = require('./service.json')
var Axios = require('axios')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://iot-cronjob.firebaseio.com'
})
var db = admin.database()
var Schedules = db.ref('/schedules')
var schedules = []
var Logs = db.ref('/logs')

Schedules.on('child_added', function (snapshot, prevChildKey) {
  const schedule = snapshot.val()
  const times = schedule.time.split(':')
  schedule.key = snapshot.key
  schedule.cronJob = new cron.CronJob({
    cronTime: `00 ${times[1]} ${times[0]} * * *`,
    onTick: tick,
    start: true,
    timeZone: 'Asia/Bangkok',
    context: { schedule: {...schedule, cronJob: ''} }
  })
  console.log('add ', schedule.key, schedule.time, schedule.pin, schedule.operation)
  schedules.push(schedule)
})

Schedules.on('child_changed', function (snapshot, prevChildKey) {
  const scheduleChanged = snapshot.val()
  console.log(scheduleChanged)
  let schedule = schedules.find(schedule => schedule.key === snapshot.key)
  const tempSchedule = {
    ...schedule
  }
  if (schedule) {
    schedule.status = scheduleChanged.status
    schedule.pin = scheduleChanged.pin
    schedule.time = scheduleChanged.time
    schedule.operation = scheduleChanged.operation
  }
  if (schedule.status !== tempSchedule.status) {
    if (schedule.status) schedule.cronJob.start()
    else schedule.cronJob.stop()
  }
  if (schedule.time !== tempSchedule.time) {
    const times = schedule.time.split(':')
    schedule.cronJob.setTime(new cron.CronTime(`00 ${times[1]} ${times[0]} * * *`))
    schedule.cronJob.start()
  }
  if (schedule.pin !== tempSchedule.pin) {
    schedule.cronJob.stop()
    const times = schedule.time.split(':')
    schedule.cronJob = new cron.CronJob({
      cronTime: `00 ${times[1]} ${times[0]} * * *`,
      onTick: tick,
      start: true,
      timeZone: 'Asia/Bangkok',
      context: { schedule: {...schedule, cronJob: ''} }
    })
  }
  if (schedule.operation !== tempSchedule.operation) {
    schedule.cronJob.stop()
    const times = schedule.time.split(':')
    schedule.cronJob = new cron.CronJob({
      cronTime: `00 ${times[1]} ${times[0]} * * *`,
      onTick: tick,
      start: true,
      timeZone: 'Asia/Bangkok',
      context: { schedule: {...schedule, cronJob: ''} }
    })
  }
  console.log('child_changed', {...schedule, cronJob: ''})
})

Schedules.on('child_removed', function (snapshot, prevChildKey) {
  const key = snapshot.key
  const index = schedules.findIndex(schedule => schedule.key === key)
  if (index) {
    schedules[index].cronJob.stop()
    schedules.splice(index, 1)
  }
  console.log('child_removed', key)
})
function tick () {
  let message = '#' + this.schedule.pin
  console.log(this.schedule)
  if (this.schedule.operation === 'ON') message += ',1'
  else message += ',0'
  Axios.put('https://api.netpie.io/microgear/finalproject/nodemcu_esp8266?auth=E4zB6asDPHU2UOz:kP1OG3IYyC4mDZ88YLAzL6tBS', message).then(function (response) {
    console.log(response.data)
  }).catch(function (error) {
    console.log(error)
  })
  Logs.push(this.schedule)
}
