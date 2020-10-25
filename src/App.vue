<template>
  <div id="app" v-bind:class="{'glow': settings.ledGlow}">
    <div id="clock" v-bind:class="{'no-cursor': settings.cursorHidden}">
      <LcdTimecode v-if="(settings.style === 'lcd')" />
      <LedMatrix v-if="(settings.style === 'led')" />
      <FpsClock v-if="(settings.style === 'fps')" />
      <div class="second-led" v-for="second in 60" v-bind:key="second.id" v-bind:style="{transform:'rotate(' + ((second-1) * 6) + 'deg)'}">
        <div class="led" v-bind:class="{'on':(second <= timecode.seconds+1)}"></div>
      </div>
      <div class="hour-led" v-for="hour in 12" v-bind:key="hour.id" v-bind:style="{transform:'rotate(' + ((hour-1) * 30) + 'deg)'}">
        <div class="led on"></div>
      </div>
      <div id="logo" v-bind:class="{'hidden': logoHidden}" v-shortkey="['ctrl', 'x']" @shortkey="hideLogo">
        <a href="http://zender.io" target="_blank">
          <img src="@/assets/img/zender-wit.svg" alt="Zender.io">
        </a>
      </div>
    </div>
    <a class="hamburger" href="#" v-bind:class="{'visible': menuVisible}" v-on:click="toggleMenu" v-shortkey="['m']" @shortkey="toggleMenu"><font-awesome-icon icon="bars" /></a>
    <div id="menu" v-bind:class="{'hidden': !menuVisible}">
      <div class="row">
        <div class="col-md-6">
          <div class="form-group">
            <label class="d-block">Cursor <span class="shortcut">C</span></label>
            <div class="btn-group btn-group-toggle" data-toggle="buttons" v-shortkey.once="['c']" @shortkey="toggleCursor">
              <label class="btn btn-secondary" v-bind:class="{active: !settings.cursorHidden}">
                <input type="radio" autocomplete="off" v-model="settings.cursorHidden" v-bind:value="false"> Show
              </label>
              <label class="btn btn-secondary" v-bind:class="{active: settings.cursorHidden}">
                <input type="radio" autocomplete="off" v-model="settings.cursorHidden" v-bind:value="true"> Hide
              </label>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label class="d-block">LED Glow <span class="shortcut">L</span></label>
            <div class="btn-group btn-group-toggle" data-toggle="buttons" v-shortkey.once="['l']" @shortkey="toggleLed">
              <label class="btn btn-secondary" v-bind:class="{active: settings.ledGlow}">
                <input type="radio" autocomplete="off" v-model="settings.ledGlow" v-bind:value="true"> On
              </label>
              <label class="btn btn-secondary" v-bind:class="{active: !settings.ledGlow}">
                <input type="radio" autocomplete="off" v-model="settings.ledGlow" v-bind:value="false"> Off
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group">
        <label for="clock-style">Numbers</label>
        <select class="form-control" id="clock-style" v-model="settings.style">
          <option value="lcd">LCD digits</option>
          <option value="led">LED digits</option>
          <option value="fps">Text</option>
        </select>
      </div>
      <div class="form-group">
        <label for="frame-brightness">Frame Numbers</label>
        <input type="range" class="form-control-range" id="frame-brightness" min="0" max="100" v-model="settings.frameBrightness">
      </div>
      <div class="row">
        <div class="col-md-12">
          <div class="form-group">
            <label class="d-block">FPS <span class="shortcut">ctrl + alt + [1&ndash;{{availableFps.length}}]</span></label>
            <div class="btn-group btn-group-toggle" data-toggle="buttons">
              <label class="btn btn-secondary" v-for="(fps, index) in availableFps" v-bind:key="fps.id"  v-bind:class="{'active': (settings.fps === fps)}">
                <input type="radio" autocomplete="off" v-model="settings.fps" v-bind:value="fps" v-shortkey.once="['ctrl', 'alt', index + 1]" @shortkey="setFps(fps)"> {{ fps }}
              </label>
            </div>
          </div>
        </div>
      </div>
      <a href="#" @click.prevent="loadDefaultSettings" disabled>Reload default settings</a>
    </div>
  </div>
</template>

<script>
import 'bootstrap'
const Timecode = require('smpte-timecode')
import * as Tone from 'tone'

import LedMatrix from "./components/LedMatrix"
import FpsClock from "./components/FpsClock"
import LcdTimecode from "./components/LcdTimecode"

const defaultSettings = {
  fps: 25,
  dropFrame: false,
  style: 'lcd',
  cursorHidden: false,
  ledGlow: true,
  frameBrightness: 0,
}

export default {
  name: 'App',
  components: { LedMatrix, FpsClock, LcdTimecode },
  data() {
    return {
      publicPath: process.env.BASE_URL,
      settings: defaultSettings,
      timecode: new Timecode(0, 25, false),
      availableFps: [24, 25, 29.97, 30, 50, 59.94, 60],
      menuVisible: false,
      logoHidden: false,
    }
  },
  mounted() {
    if (localStorage.settings) {
      this.settings = JSON.parse(localStorage.settings);
    }

    setInterval(() => {
      this.setTimecode();
    },10);
  },
  watch: {
    'settings': {
      handler(settings) {
        localStorage.settings = JSON.stringify(settings);
      }, deep: true
    },
    'settings.cursorHidden': function () {
      if (this.settings.cursorHidden) {
        const element = document.createElement("style");
        element.innerHTML = "* { cursor: none; } #menu * { cursor: default !important; }";
        element.setAttribute('id', 'hide-cursor');
        document.head.appendChild(element);
      } else {
        const element = document.getElementById('hide-cursor');
        element.parentNode.removeChild(element);
      }
    }
  },
  methods: {
    setTimecode() {
      this.timecode = new Timecode(new Date(), this.settings.fps);
    },
    toggleMenu() {
      this.menuVisible = !this.menuVisible;
    },
    toggleCursor() {
      this.settings.cursorHidden = !this.settings.cursorHidden;
    },
    toggleLed() {
      this.settings.ledGlow = !this.settings.ledGlow;
    },
    setFps(fps) {
      this.settings.fps = fps;
    },
    loadDefaultSettings() {
      this.settings = defaultSettings;
    },
    hideLogo() {
      this.logoHidden = true;
    },
    addLeadingZero(num, size = 2) {
      num = num.toString();
      while (num.length < size) num = "0" + num;
      return num;
    },
    toArray(number) {
      let output = [], sNumber = this.addLeadingZero(number).toString();
      for (let i = 0; i < 2; i += 1) output.push(+sNumber.charAt(i));
      return output;
    },
    getBinaryTimecode() {
      if (this.timecode.frameRate > 30) {
        console.log("Framerates above 30fps are not compatible for SMPTE.");
        return;
      }

      const timecode = this.timecode;

      const frameArray = this.toArray(timecode.frames);
      const frameTensBin = this.addLeadingZero(frameArray[0].toString(2), 2);
      const frameUnitBin = this.addLeadingZero(frameArray[1].toString(2), 4);

      const secondArray = this.toArray(timecode.seconds);
      const secondTensBin = this.addLeadingZero(secondArray[0].toString(2), 3);
      const secondUnitBin = this.addLeadingZero(secondArray[1].toString(2), 4);

      const minuteArray = this.toArray(timecode.minutes);
      const minuteTensBin = this.addLeadingZero(minuteArray[0].toString(2), 3);
      const minuteUnitBin = this.addLeadingZero(minuteArray[1].toString(2), 4);

      const hourArray = this.toArray(timecode.hours);
      const hourTensBin = this.addLeadingZero(hourArray[0].toString(2), 2);
      const hourUnitBin = this.addLeadingZero(hourArray[1].toString(2), 4);

      return frameUnitBin + '0000' + frameTensBin /* User bits field 1 */ + (timecode.dropFrame ? '1' : '0') + '0' /* "Color frame" flag */ + '0000' /* User bits field 2 */ +
          secondUnitBin + '0000' + secondTensBin /* User bits field 3 */ + '0' /* flag */ + '0000' /* User bits field 4 */ +
          minuteUnitBin + '0000' + minuteTensBin /* User bits field 5 */ + '0' /* flag */ + '0000' /* User bits field 6 */ +
          hourUnitBin + '0000' + hourTensBin /* User bits field 7 */ + '0' /* Clock flag */ + '0' /* flag */ + '0000' /* User bits field 8 */
          + '0011111111111101' /* Sync word, fixed bit pattern */;
    },
    // startSmpte() {
    //   let maxFrequency = this.timecode.frameRate * 80;
    //   let bit = 0;
    //   let newTimecode = true;
    //   let timecode = null;
    //
    //   const osc = new Tone.Oscillator(bit * 100, 'square').toDestination();
    //   const clock = new Tone.Clock(time => {
    //     if (newTimecode) {
    //       timecode = this.getBinaryTimecode()
    //       newTimecode = false;
    //     }
    //
    //     const pulse = timecode.charAt(bit);
    //     osc.frequency.value = (pulse === '1' ? maxFrequency : maxFrequency / 2);
    //
    //     bit++;
    //
    //     if (bit >= 80) {
    //       bit = 0;
    //       newTimecode = true;
    //     }
    //
    //   }, maxFrequency); // maxFrequency
    //
    //   clock.start();
    //   osc.start();
    // }
  }
}
</script>