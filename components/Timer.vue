<template>
  <!--Timer Componenent -->
  <div class="timer">
    <!-- start of the timer section -->
    <div>
      <h4 class="text-9xl pt-0 mt-0 font-bold">
        {{ timerMinutes }}:{{ timerSeconds }}
      </h4>
      <div class="button-toggle">
        <button @click="start" v-if="isActive === false">START</button>
        <button @click="stop" v-if="isActive === true">STOP</button>
      </div>
    </div>
    <!-- end of the timer section -->
  </div>
</template>
<script>
// const notificationSound = require("~/assets/goeswithoutsaying.mp3").default;
export default {
  name: "Timer",
  data() {
    return {
      isActive: false,
      timerType: 0,
      totalSeconds: 5,
      pomodoroInstance: null,
      // notificationSound,
    };
  },
  computed: {
    // show minutes
    timerMinutes() {
      const minutes = Math.floor(this.totalSeconds / 60);
      return this.formatTime(minutes);
    },
    // show seconds
    timerSeconds() {
      let sec = this.totalSeconds % 60;
      return this.formatTime(sec);
    },
  },
  methods: {
    // formats time function
    formatTime(time) {
      if (time < 10) {
        return "0" + time;
      }
      return time.toString();
    },
    // start the timeer count
    start() {
      alert('마피아 투표를 시작합니다.!')
      this.pomodoroInstance = setInterval(() => {
        this.totalSeconds -= 1;
        if (
          Math.floor(this.totalSeconds / 60) === 0 &&
          this.totalSeconds % 60 === 0
        ) {
          // var audio = new Audio(this.notificationSound);
          // audio.play();
          clearInterval(this.pomodoroInstance);
          (this.totalSeconds = 10), (this.isActive = false);
          this.$emit("timeoutEvent")
          alert('투표종료!')
        }
      }, 1000);
      this.isActive = true;
    },
    // stop the timer interval
    stop() {
      clearInterval(this.pomodoroInstance);
      this.isActive = false;
    },
  },
};
</script>
<style scoped>
</style>
