<template>
  <div>
    <div class="columns is-mobile is-multiline">
      <div class="column is-2-mobile is-offset-9-mobile is-offset-10-tablet">
        <button class="button is-info" @click="isModal = true">
          Add
        </button>
      </div>
      <div class="column is-6-mobile is-4-tablet" v-for="control in controls" :key="control['.key']">
        <div class="card">
          <div class="card-content button-control">
            <span class="label-button">
              <h1 class="title is-5">{{control.name}}</h1>
            </span>
            <span @click="$emit('removeControl', control['.key'])" class="span-icon-close">
              <b-icon icon="close-circle" size="" type=""></b-icon>
            </span>
            <button :class="`button ${getStatus(control.pin) === 1 ? 'is-primary' : 'is-light'}`" @click="sendToNode(control.pin, 3)">
              {{control.pin}}
            </button>
          </div>
        </div>
      </div>
    </div>
    <br>

    <h1 class="title is-5">Message: {{message}}</h1>
    <button v-if="!isTouch" class="button is-primary push-button is-large" @mousedown="startRecording" @mouseup="stopRecording">
      <span v-if="!record" class="icon">
        <i class="fas fa-microphone"></i>&nbsp;
        PUSH TO TALK
      </span>
      <p v-if="record" class="icon">
        <i class="fas fa-ellipsis-h"></i>
      </p>
    </button>
    <button v-if="isTouch" class="button is-primary push-button is-large" @touchstart="startRecording" @mouseup="stopRecording">
      <span v-if="!record"><i class="fas fa-microphone"></i>&nbsp;PUSH TO TALK</span>
      <span v-if="record">...</span>
    </button>
    <div :class="`modal ${isModal ? 'is-active': ''}`">
      <div class="modal-background"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add new Control</p>
          <button class="delete" aria-label="close"></button>
        </header>
        <div class="modal-card-body" style="height:50vh;">
              <b-field label="Name" type="info">
                  <b-input v-model="name"></b-input>
              </b-field>
              <b-field label="Pin" >
                <b-dropdown  v-model="pin">
                    <button class="button is-primary" slot="trigger">
                        <span>{{pin}}</span>
                        <b-icon icon="menu-down"></b-icon>
                    </button>
                    <b-dropdown-item v-for="p in pins" :key="p.name" :value="p.name">{{p.name}}</b-dropdown-item>
                </b-dropdown>
            </b-field>
          </div>
          <footer class="modal-card-foot">
            <button class="button is-success" @click="addControl">Save</button>
            <button class="button" @click="isModal = false">Cancel</button>
          </footer>
      </div>

      <button class="modal-close is-large" aria-label="close" @click="isModal = false"></button>
    </div>
  </div>
</template>
<script>
/* global Recorder, Microgear */
import Axios from 'axios'
var audioContext
var recorder
const APPID = process.env.NETPIE_APPID
const APPKEY = process.env.NETPIE_APPKEY
const APPSECRET = process.env.NETPIE_APPSECRET

var microgear = Microgear.create({
  key: APPKEY,
  secret: APPSECRET,
  alias: 'myhtml'
})
export default {
  props: ['controls'],
  data () {
    return {
      name: '',
      pin: 'D1',
      pins: [{
        name: 'D1',
        status: 0
      }, {
        name: 'D2',
        status: 0
      }, {
        name: 'D3',
        status: 0
      }, {
        name: 'D4',
        status: 0
      }, {
        name: 'D5',
        status: 0
      }, {
        name: 'D6',
        status: 0
      }, {
        name: 'D7',
        status: 0
      }, {
        name: 'D8',
        status: 0
      }],
      isModal: false,
      record: false,
      apiKey: process.env.SPEECH_APIKEY,
      data: {
        'audio': {
          'content': null
        },
        'config': {
          'enableAutomaticPunctuation': true,
          'encoding': 'LINEAR16',
          'sampleRateHertz': 44100,
          'languageCode': 'th-TH',
          'speechContexts': [{
            'phrases': [
              'เปิด',
              'D',
              '1',
              '2',
              '3',
              '4',
              '5',
              '5'
            ]
          }]
        }
      },
      message: '',
      response: 't',
      isTouch: false
    }
  },
  created () {
    var isTouch = ('ontouchstart' in document.documentElement)
    if (isTouch) {
      this.isTouch = true
    } else {
      this.isTouch = false
    }
    console.log('Audio context set up.1')
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia
      window.URL = window.URL || window.webkitURL

      audioContext = new AudioContext()
      console.log('Audio context set up.')
      console.log('navigator.getUserMedia ' + (navigator.getUserMedia ? 'available.' : 'not present!'))
      this.response += 'set up' + navigator.getUserMedia ? 'available.' : 'not present!'
    } catch (e) {
      alert('No web audio support in this browser!')
    }
    const that = this
    navigator.getUserMedia({
      audio: true
    }, function (stream) {
      that.startUserMedia(stream)
    }, function (e) {
      console.log('No live audio input: ' + e)
    })
    microgear.on('message', (topic, msg) => {
      topic = topic.trim()
      console.log(topic, msg)
      if (/^(\/finalproject\/D)[1-8]\/nodemcu_esp8266$/.test(topic)) {
        const name = topic.substr(14, 2)
        console.log(name)
        let pin = this.pins.find(pin => pin.name === name)
        if (pin) pin.status = parseInt(msg)
      }
    })

    microgear.on('connected', function () {
      // console.log('Now I am connected with netpie...')
      microgear.subscribe('/D1/nodemcu_esp8266')
      microgear.subscribe('/D2/nodemcu_esp8266')
      microgear.subscribe('/D4/nodemcu_esp8266')
      microgear.subscribe('/D5/nodemcu_esp8266')
      microgear.subscribe('/D6/nodemcu_esp8266')
      microgear.subscribe('/D7/nodemcu_esp8266')
      microgear.subscribe('/D8/nodemcu_esp8266')
    })

    microgear.on('present', function (event) {
      // console.log(event)
    })

    microgear.on('absent', function (event) {
      // console.log(event)
    })

    microgear.connect(APPID)
  },
  mounted () {
    microgear.chat(`nodemcu_esp8266`, 'init data')
  },
  methods: {
    getStatus (pin) {
      return this.pins.find(p => p.name === pin).status
    },
    addControl () {
      this.$emit('addControl', this.name, this.pin)
      this.name = ''
      this.pin = 'D1'
      this.isModal = false
    },
    checkSpeech (text) {
      text = text.trim()
      if (/^(เปิด).*[1-8]$/.test(text)) {
        this.sendToNode('D' + text.substr(text.length - 1), '1')
      }
      if (/^(ปิด).*[1-8]$/.test(text)) {
        this.sendToNode('D' + text.substr(text.length - 1), '0')
      }
    },
    async sendToNode (pin, value) {
      let message = '#' + pin + ',' + value
      await Axios.put('https://api.netpie.io/microgear/finalproject/nodemcu_esp8266?auth=E4zB6asDPHU2UOz:kP1OG3IYyC4mDZ88YLAzL6tBS', message).then(function (response) {
        console.log(response)
      }).catch(function (error) {
        console.log(error)
      })
      console.log(pin)
    },
    startUserMedia (stream) {
      const input = audioContext.createMediaStreamSource(stream)
      // Media stream created
      recorder = new Recorder(input)
      // Recorder initialised
    },
    startRecording () {
      this.record = true
      // Start Recording
      recorder && recorder.record()
      // setTimeout(this.stopRecording, 4000)
    },
    stopRecording () {
      this.record = false
      // Stopped Recording
      recorder && recorder.stop()
      // create WAV download link using audio data blob
      this.processRecording()
      recorder.clear()
    },
    processRecording () {
      const vm = this
      recorder && recorder.exportWAV(function (blob) {
        var reader = new window.FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
          const baseData = reader.result
          const base64Data = baseData.replace('data:audio/wav;base64,', '')
          vm.data.audio.content = base64Data
          Axios.post(`https://speech.googleapis.com/v1/speech:recognize?key=${vm.apiKey}`, vm.data).then(response => {
            const result = response.data.results[0].alternatives[0]
            console.log(result.transcript)
            vm.message = result.transcript.trim()
            vm.checkSpeech(result.transcript.trim())
          }).catch(error => {
            console.log('ERROR:' + error)
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.button-control {
  width: 100%;
  padding-top: 80%;
  position:relative;
}
.label-button {
  position: absolute;
  border-radius: 100px;
  left: 15%;
  top: 5%;
}
.span-icon-close {
    position: absolute;
    border-radius: 100px;
    top: 1%;
    right: 1%;
    cursor: pointer;
}
.button-control button{
  position: absolute;
  border-radius: 100px;
  left: 15%;
  top: 25%;
  height: 70% !important;
  width: 70% !important;
}
.push-button {
  width: 100%;
  position: relative;
  margin-bottom: 0%;
  left: 0px;
  bottom: 0px !important;
}
</style>
