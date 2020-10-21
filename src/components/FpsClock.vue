<template>
  <div class="plain">
    <span class="time">{{ time }}</span>
    <span class="frame-separator" v-if="(frameBrightness > 0)" v-bind:style="{'opacity': ($parent.timecode.frames === 0 ? frameBrightness + 2 : frameBrightness ) + '%'}">:</span>
    <span class="frames" v-if="(frameBrightness > 0)" v-bind:style="{'opacity': frameBrightness + '%'}">{{ frame }}</span>
  </div>
</template>

<script>
export default {
  name: "FpsCLock",
  computed: {
    frameBrightness() {
      return this.$parent.settings.frameBrightness;
    },
    time() {
      let hours = this.addLeadingZero(this.$parent.timecode.hours);
      let minutes = this.addLeadingZero(this.$parent.timecode.minutes);
      let seconds = this.addLeadingZero(this.$parent.timecode.seconds);
      return `${hours}:${minutes}:${seconds}`;
    },
    frame() {
      return this.addLeadingZero(this.$parent.timecode.frames);
    }
  },
  methods: {
    addLeadingZero(num, size = 2) {
      num = num.toString();
      while (num.length < size) num = "0" + num;
      return num;
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/variables";

  #clock .plain {
    position: absolute;
    width: 100%;
    top: 50%;
    font-size: 12vh;
    font-weight: 500;
    margin-top: -0.6em;
    color: $led-color;
    text-align: center;
  }
</style>