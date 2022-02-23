<template>
  <!--Timer Componenent -->
  <div class="timer">
    <!-- start of the timer section -->
    <div>
      <h6>
        {{ timerMinutes }}:{{ timerSeconds }}
      </h6>
      <div class="button-toggle">
        <button @click="startPunishmentVote">시작</button>
        <!-- <button @click="start" v-if="isActive === false">START</button> -->
        <!-- <button @click="stop" v-if="isActive === true">STOP</button> -->
      </div>
    </div>

  </div>
</template>
<script>

export default {
  name: "Timer",
  data() {
    return {
      isActive: true,
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
    startVote() {
      alert('마피아 투표를 시작합니다.!')
      this.pomodoroInstance = setInterval(() => {
        this.totalSeconds -= 1;
        if (
          Math.floor(this.totalSeconds / 60) === 0 &&
          this.totalSeconds % 60 === 0
        ) {
          clearInterval(this.pomodoroInstance);
          (this.totalSeconds = 5),
          this.$emit("timeoutVote")
          alert('투표종료!')
        }
      }, 1000);
    },
    startPunishmentVote() {
      alert(this.$parent.electedPlayers + '유저의 사형 투표를 시작하겠습니다.')
      this.pomodoroInstance = setInterval(() => {
        this.totalSeconds -= 1;
        if (
          Math.floor(this.totalSeconds / 60) === 0 &&
          this.totalSeconds % 60 === 0
        ) {
          clearInterval(this.pomodoroInstance);
          (this.totalSeconds = 5),
          this.$emit("timeoutPunishmentVote")
          alert('투표종료!')
        }
      }, 1000);
    },
  },
};
</script>
<style scoped>
</style>
