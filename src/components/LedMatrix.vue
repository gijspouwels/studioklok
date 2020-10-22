<template>
  <div class="matrix">
    <div id="hours">
      <div class="digit">{{ hourDigits[0] }}</div>
      <div class="digit">{{ hourDigits[1] }}</div>
    </div>
    <div id="separator">:</div>
    <div id="minutes">
      <div class="digit">{{ minuteDigits[0] }}</div>
      <div class="digit">{{ minuteDigits[1] }}</div>
    </div>
    <div id="seconds">
      <div class="digit">{{ secondDigits[0] }}</div>
      <div class="digit">{{ secondDigits[1] }}</div>
    </div>
    <div id="frames" v-bind:style="{'opacity': frameBrightness + '%'}">
      <div class="digit">{{ frameDigits[0] }}</div>
      <div class="digit">{{ frameDigits[1] }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LedMatrix",
  computed: {
    frameBrightness() {
      return this.$parent.settings.frameBrightness;
    },
    hourDigits: function () {
      return this.splitDigits(this.$parent.timecode.hours);
    },
    minuteDigits: function () {
      return this.splitDigits(this.$parent.timecode.minutes);
    },
    secondDigits: function () {
      return this.splitDigits(this.$parent.timecode.seconds);
    },
    frameDigits: function () {
      return this.splitDigits(this.$parent.timecode.frames);
    }
  },
  methods: {
    splitDigits(num) {
      const digits = num.toString().split('');
      let digitArray = digits.map(Number);

      if (digitArray.length === 1) {
        digitArray.unshift(0);
      }

      return digitArray;
    }
  }
}
</script>

<style lang="scss" scoped>
  @font-face {
    font-family: 'LED';
    src: url('../assets/font/LEDDotMatrixRegular.woff2') format('woff2'),
    url('../assets/font/LEDDotMatrixRegular.woff') format('woff');
  }

  @import "../assets/variables";

  .matrix {
    font-family: 'LED', Avenir, Helvetica, Arial, sans-serif;
    position: absolute;
    color: $led-color;

    z-index: 99;
    width: 100%;
    top: 35%;
    font-size: 25vh;
    line-height: 1em;

    #hours {
      position: absolute;
      right: 52.5%;
    }

    #minutes {
      position: absolute;
      left: 52.5%;
    }

    #seconds {
      position: absolute;
      width: 100%;
      top: 20vh;
      text-align: center;
      font-size: 0.75em;
    }

    #frames {
      position: absolute;
      width: 100%;
      top: 20vh;
      left: 20%;
      text-align: center;
      font-size: 0.25em;
      //filter: blur(0.5px);
    }

    #separator {
      position: absolute;
      width: 100%;
      top: -0.05em;
      text-align: center;
      font-size: 0.8em;
    }

    .digit {
      width: 0.666em;
      display: inline-block;
    }
  }

  .glow {
    .matrix {
      transition: 250ms;
      color: lighten($led-color, 5%);
      text-shadow: 0 0 3vh darken($led-color, 10%), 0 0 20vh $led-color;
      //filter: blur(0.5px);
    }
  }
</style>