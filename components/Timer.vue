<template>
  <!--Timer Componenent -->
  <div class="timer">
    <!-- start of the timer section -->
    <div>
      <h3>
        {{ timerMinutes }}:{{ timerSeconds }}
      </h3>
      <div class="button-toggle">
        <button @click="startVote">시작</button>
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
          alert('의심되는 플레이어 투표 종료')
          this.$emit("timeoutVote")

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
          alert('사형 찬반투표 종료')
          this.$emit("timeoutPunishmentVote")
        }
      }, 1000);
    },
    nightEvent() {
      alert('능력 사용')
      this.pomodoroInstance = setInterval(() => {
        this.totalSeconds -= 1;
        if (
          Math.floor(this.totalSeconds / 60) === 0 &&
          this.totalSeconds % 60 === 0
        ) {
          clearInterval(this.pomodoroInstance);
          (this.totalSeconds = 5),
          alert('능력 사용이 완료되었습니다')
          this.$emit("nightEvent")
        }
      }, 1000);
    },
    morningEvent() {
      this.pomodoroInstance = setInterval(() => {
        this.totalSeconds -= 1;
        if (
          Math.floor(this.totalSeconds / 60) === 0 &&
          this.totalSeconds % 60 === 0
        ) {
          clearInterval(this.pomodoroInstance);
          (this.totalSeconds = 5),
          alert('아침이 종료되었습니다.')
          this.startVote();
        }
      }, 1000);
    },
  },
};
</script>
<style scoped>
</style>
