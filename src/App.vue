<template>
  <div id="app" v-bind:class="{'glow': settings.ledGlow}">
    <div id="clock" v-bind:class="{'no-cursor': settings.cursorHidden}">
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
          <img src="./assets/img/zender-wit.svg" alt="Zender.io">
        </a>
      </div>
    </div>
    <a class="hamburger" href="#" v-bind:class="{'visible': menuVisible}" v-on:click="toggleMenu" v-shortkey="['m']" @shortkey="toggleMenu"><i class="fa fa-bars"></i></a>
    <div id="menu" v-bind:class="{'hidden': !menuVisible}">
      <div class="form-group">
        <label class="d-block">FPS <span class="shortcut">ctrl + alt + [1&ndash;{{availableFps.length}}]</span></label>
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label class="btn btn-secondary" v-for="(fps, index) in availableFps" v-bind:key="fps.id"  v-bind:class="{'active': (settings.fps === fps)}">
            <input type="radio" autocomplete="off" v-model="settings.fps" v-bind:value="fps" v-shortkey.once="['ctrl', 'alt', index + 1]" @shortkey="setFps(fps)"> {{ fps }}
          </label>
        </div>
      </div>
      <div class="form-group">
        <div class="row">
          <div class="col-md-6">
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
          <div class="col-md-6">
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
        <label for="clock-style">Style</label>
        <select class="form-control" id="clock-style" v-model="settings.style">
          <option value="fps">FPS</option>
          <option value="led">LED</option>
        </select>
      </div>
      <div class="form-group">
        <label for="frame-brightness">Frame brightness</label>
        <input type="range" class="form-control-range" id="frame-brightness" min="0" max="100" v-model="settings.frameBrightness">
      </div>
      <a href="#" @click.prevent="loadDefaultSettings" disabled>Reload default settings</a>
    </div>
  </div>
</template>

<script>
import 'bootstrap'
const Timecode = require('smpte-timecode')

import LedMatrix from "./components/LedMatrix"
import FpsClock from "./components/FpsClock"

const defaultSettings = {
  fps: 25,
  dropFrame: false,
  style: 'fps',
  cursorHidden: false,
  ledGlow: true,
  frameBrightness: 30,
}

export default {
  name: 'App',
  components: { LedMatrix, FpsClock },
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
      this.getNow();
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
    getNow() {
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
    }
  }
}
</script>