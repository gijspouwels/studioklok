<template>
  <div class="matrix">
    <div class="hours">
      <div class="digit">{{ hourDigits[0] }}</div>
      <div class="digit">{{ hourDigits[1] }}</div>
    </div>
    <div class="separator">:</div>
    <div class="minutes">
      <div class="digit">{{ minuteDigits[0] }}</div>
      <div class="digit">{{ minuteDigits[1] }}</div>
    </div>
    <div class="separator">:</div>
    <div class="seconds">
      <div class="digit">{{ secondDigits[0] }}</div>
      <div class="digit">{{ secondDigits[1] }}</div>
    </div>
    <div class="frames" v-bind:style="{'opacity': frameBrightness + '%'}">
      <div class="digit">{{ frameDigits[0] }}</div>
      <div class="digit">{{ frameDigits[1] }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LcdTimecode",
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
    font-family: 'LCD';
    src: url('../assets/font/DS-DIGII.woff') format('woff');
  }

  @import "../assets/variables";

  .matrix {
    font-family: 'LCD', Avenir, Helvetica, Arial, sans-serif;
    position: absolute;
    color: $led-color;

    z-index: 99;
    width: 100%;
    top: 39%;
    font-size: 20vh;
    line-height: 1em;
    text-align: center;

    .hours, .minutes, .seconds, .separator {
      display: inline-block;
    }

    .frames {
      position: absolute;
      width: 100%;
      top: 15vh;
      text-align: center;
      font-size: 0.5em;
      //filter: blur(0.5px);
    }

    .digit {
      width: 0.5em;
      text-align: right;
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