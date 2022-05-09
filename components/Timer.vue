<template>
  <!--Timer Componenent -->
  <div class="timer h-screen">
    <!-- start of the timer section -->
    <div>
      <div v-show="timerStart" class="timerSet" >
            <div class="flex flex-wrap p-4 ">
            <BaseProgress :percentage="contentProgress" >
             {{ timerMinutes }}:{{ timerSeconds }}
             <!-- <span class="text-xs text-black w-full flex justify-end pr-2">{{totalSeconds}}</span> -->
            </BaseProgress>
            </div>

       </div>
      <div class="button-toggle">
      </div>
    </div>
  </div>
</template>
<script>
import BaseProgress from "@/components/gameFlow_elements/BaseProgress.vue";

export default {
  name: "Timer",
  props: ["realTime"],
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
      timerStart: true,
      striped: true,
      progressStart: 0,
      contentProgress: 0,
      colors: [
        "gray",
        "yellow",
        "orange",
        "red",
        "green",
        "teal",
        "blue",
        "indigo",
        "purple",
        "pink"
      ],
    };
  },
  components: {
    BaseProgress
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
    // 스킵은 아직 구현 안됨
    // skipEvent() {
    //   this.totalSeconds = 5;
    //   this.skipThisEvent = false;
    // },
    // formats time function
    formatTime(time) {
      if (time < 10) {
        return "0" + time;
      }
      return time.toString();
    },
    // 아침이 되었을 때 움직이는 타이머
    morningTimer() {
      this.timerStart = true;
      this.skipThisEvent = true;
      this.pomodoroInstance = setInterval(() => {
        this.totalSeconds -= 1;
        this.contentProgress += 100/60;
        if (
          Math.floor(this.totalSeconds / 60) === 0 &&
          this.totalSeconds % 60 === 0
        ) {
          clearInterval(this.pomodoroInstance);
          (this.totalSeconds = 60),
          (this.contentProgress = 0),
          this.$emit("startVote")
        }
      }, 1000);
    },
    // 마피아로 의심되는 유저를 지목할 때 쓰이는 타이머
    voteTimer() {
      this.timerStart = true;
      this.skipThisEvent = true;
      this.pomodoroInstance = setInterval(() => {
        this.totalSeconds -= 1;
        this.contentProgress += 100/60;
        if (
          Math.floor(this.totalSeconds / 60) === 0 &&
          this.totalSeconds % 60 === 0
        ) {
          clearInterval(this.pomodoroInstance);
          (this.totalSeconds = 60),
          (this.contentProgress = 0),
          this.$emit("finishVote")
          this.pomodoroInstance = null
        }
      }, 1000);
    },
    // 특정 유저가 지목되고, 사형 찬반투표를 할 때 쓰이는 타이머
    punishmentTimer() {
      this.timerStart = true;
      this.skipThisEvent = true;
      this.pomodoroInstance = setInterval(() => {
        this.totalSeconds -= 1;
        this.contentProgress += 100/60;
        if (
          Math.floor(this.totalSeconds / 60) === 0 &&
          this.totalSeconds % 60 === 0
        ) {
          clearInterval(this.pomodoroInstance);
          (this.totalSeconds = 60),
          (this.contentProgress = 0),
          this.$emit("finishPunishmentVote")
          this.pomodoroInstance = null
        }
      }, 1000);
    },
    // 밤이 되었을 때 쓰이는 타이머
    nightEvent() {
      this.timerStart = true;
      this.skipThisEvent = true;
      this.pomodoroInstance = setInterval(() => {
        this.totalSeconds -= 1;
        this.contentProgress += 100/60;
        if (
          Math.floor(this.totalSeconds / 60) === 0 &&
          this.totalSeconds % 60 === 0
        ) {
          clearInterval(this.pomodoroInstance);
          (this.totalSeconds = 60),
          (this.contentProgress = 0),
          this.$emit("nightFinishEvent")
          this.pomodoroInstance = null
        }
      }, 1000);
    },
  },
};
</script>
<style lang=""></style>

