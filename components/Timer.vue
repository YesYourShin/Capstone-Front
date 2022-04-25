<template>
  <!--Timer Componenent -->
  <div class="timer">
    <!-- start of the timer section -->
    <div>
      <div v-show="timerStart" class="timerSet" >
       {{ timerMinutes }}:{{ timerSeconds }}
       </div>
      <div class="button-toggle">
        <!-- <button @click="gameStart" v-show="newGame">시작</button> -->
        <!-- <button @click="skipEvent" v-show="skipThisEvent">스킵</button> -->
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
      totalSeconds: 60,
      pomodoroInstance: null,
      // notificationSound,
      skipAdd: false,
      newGame: true,
      skipThisEvent: false,
      timerStart: false,
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
    skipEvent() {
      this.totalSeconds = 5;
      this.skipThisEvent = false;
    },

    // formats time function
    formatTime(time) {
      if (time < 10) {
        return "0" + time;
      }
      return time.toString();
    },
    gameStart() {
      this.timerStart = false;
      this.skipAdd = true;
      this.newGame = false;
      this.$emit("startThisGame")
    },
    startVote() {
      this.timerStart = true;
      this.skipThisEvent = true;
      this.pomodoroInstance = setInterval(() => {
        this.totalSeconds -= 1;

        if (
          Math.floor(this.totalSeconds / 60) === 0 &&
          this.totalSeconds % 60 === 0
        ) {
          clearInterval(this.pomodoroInstance);
          (this.totalSeconds = 60),
          this.$emit("timeoutVote")
        }
      }, 1000);
    },
    startPunishmentVote() {
      this.timerStart = true;
      this.skipThisEvent = true;
      // alert(this.$parent.electedPlayers + '유저의 사형 투표를 시작하겠습니다.')
      this.pomodoroInstance = setInterval(() => {
        this.totalSeconds -= 1;

        if (
          Math.floor(this.totalSeconds / 60) === 0 &&
          this.totalSeconds % 60 === 0
        ) {
          clearInterval(this.pomodoroInstance);
          (this.totalSeconds = 60),
          this.$emit("timeoutPunishmentVote")
        }
      }, 1000);

    },
    nightEvent() {
      this.timerStart = true;
      this.skipThisEvent = true;
      this.pomodoroInstance = setInterval(() => {
        this.totalSeconds -= 1;

        if (
          Math.floor(this.totalSeconds / 60) === 0 &&
          this.totalSeconds % 60 === 0
        ) {
          clearInterval(this.pomodoroInstance);
          (this.totalSeconds = 60),
          this.$emit("nightSkillEvent")
        }
      }, 1000);
    },
    morningEvent() {
      this.timerStart = true;
      this.skipThisEvent = true;
      this.pomodoroInstance = setInterval(() => {
        this.totalSeconds -= 1;

        if (
          Math.floor(this.totalSeconds / 60) === 0 &&
          this.totalSeconds % 60 === 0
        ) {
          clearInterval(this.pomodoroInstance);
          (this.totalSeconds = 60),
          this.$emit("startVote")
        }
      }, 1000);
    },
  },
};
</script>
<style lang="scss" scoped="scoped">
@import "~assets/timer.scss";
</style>
