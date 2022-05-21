<template>
  <!--Timer Componenent -->
  <div class="timer h-screen">
    <!-- start of the timer section -->
    <div>
      <div v-show="timerStart" class="timerSet" >
            <div class="flex flex-wrap p-3 ">
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
import { GameEvent } from "@/api/mafiaAPI";
import dayjs from "dayjs";

export default {
  name: "Timer",
  props: ["realTime"],
  components: {
    BaseProgress,
    dayjs,
  },
  data() {
    return {
      serverStart: null,
      serverEnd : null,
      clientRealTime: null,

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
  mounted() {
        // 타이머의 시간을 기준으로 60초 환산 (지금은 클라이언트 기준 60초)
    // this.$root.gameSocket.on(GameEvent.TIMER, (start, end) => {
    //   // ! serverStart : 서버 스타트 / serverEnd : 서버 엔드
    //   // ! clientRealTime : 클라이언트 타이머 (스타트랑 엔드 비교 위함)
    //   // let serverStart = dayjs(start.start, 'YYYY-MM-DDTHH:mm:ssZ')
    //   // ! 일단 start, end가 object로 오므로, 아래와 같은 양식을 사용해야 함.
    //   this.serverStart = dayjs(start.start)
    //   console.log(this.serverStart)
    //   this.serverEnd = dayjs(end.end)
    //   console.log(this.serverEnd)
    //   this.clientRealTime = dayjs();
    //   console.log(this.clientRealTime)
    //   console.log(this.serverEnd.diff(this.serverStart));
    //   console.log(this.serverEnd.diff(this.serverStart, 'm'));
    //   console.log(this.serverEnd.diff(this.serverStart, 's'));
    //   this.totalSeconds = this.serverEnd.diff(this.serverStart, 's')
    // });
    this.$root.gameSocket.on(GameEvent.TIMER, (start, end) => {
      console.log(start)
      this.serverEnd = dayjs(end.end)
      this.clientRealTime = dayjs();
      console.log(this.serverEnd.diff(this.clientRealTime, 's'));
      this.totalSeconds = this.serverEnd.diff(this.serverStart, 's')
    });
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
      this.$root.gameSocket.emit(GameEvent.TIMER);
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
          this.pomodoroInstance = null
          console.log('아침 타이머 중단')
        }
      }, 330);
    },
    // 마피아로 의심되는 유저를 지목할 때 쓰이는 타이머
    voteTimer() {
      this.$root.gameSocket.emit(GameEvent.TIMER);
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
          this.$nuxt.$emit('voteTimeFinish', '투표 타이머 중단')
          this.$emit('finishVote')
          this.pomodoroInstance = null
          console.log('투표 타이머 중단')
        }
      }, 330);
    },
    // 특정 유저가 지목되고, 사형 찬반투표를 할 때 쓰이는 타이머
    punishmentTimer() {
      this.$root.gameSocket.emit(GameEvent.TIMER);
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
          this.$nuxt.$emit('punishmentTimeFinish', '찬반 타이머 중단')
          this.$emit('finishPunishmentVote')
          this.pomodoroInstance = null
          console.log('심판 타이머 중단')
        }
      },330);
    },
    // 밤이 되었을 때 쓰이는 타이머
    nightEvent() {
      this.$root.gameSocket.emit(GameEvent.TIMER);
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
          this.$nuxt.$emit('skillTimeFinish', '능력 타이머 중단')
          this.$emit('nightResult')
          console.log('타이머 종료, 밤 결과 실행')
          this.pomodoroInstance = null
        }
      }, 330);
    },
  },
};
</script>
<style lang=""></style>

