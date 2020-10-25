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
      let hours = this.$parent.addLeadingZero(this.$parent.timecode.hours);
      let minutes = this.$parent.addLeadingZero(this.$parent.timecode.minutes);
      let seconds = this.$parent.addLeadingZero(this.$parent.timecode.seconds);
      return `${hours}:${minutes}:${seconds}`;
    },
    frame() {
      return this.$parent.addLeadingZero(this.$parent.timecode.frames);
    }
  },
  methods: {
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
    margin-top: -0.7em;
    color: $led-color;
    text-align: center;
  }
</style>