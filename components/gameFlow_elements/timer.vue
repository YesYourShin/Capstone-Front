<template>
  <div class="timer h-screen">
    <div>
      <div v-show="timerStart" class="timerSet" >
            <div class="flex flex-wrap p-3 ">
            <BaseProgress :percentage="contentProgress">
             {{ timerMinutes }}:{{ timerSeconds }}
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
    this.$root.gameSocket.on(GameEvent.TIMER, (start, end) => {
      console.log(start)
      this.serverEnd = dayjs(end.end).format("YYYY.MM.DD HH:mm:ss")
      this.clientRealTime = dayjs().format("YYYY.MM.DD HH:mm:ss");
      console.log(this.serverEnd.diff(this.clientRealTime, 's'));
      this.totalSeconds = this.serverEnd.diff(this.clientRealTime, 's')
    });
    // 그리고 일정 시간에 함께 다음 이벤트로 emit 할 수 있어야 함.
  },
  methods: {
    // 스킵은 아직 구현 안됨
    // ! 스킵
    // ! 스킵의 경우, 유저가 스킵 버튼을 누르면 백엔드로 emit을 한다.
    // ! 백엔드에서는 유저 수 만큼의 길이의 배열이 있으며, 모두 false가 기록되어 있다.
    // ! 그리고 유저가 emit을 하면, 유저의 번호에 맞는 원소가 true가 된다.
    // * [false, false, false] 상태에서 2번 유저의 skip 이벤트 발생시
    // * [false, true, false] 로 변경
    // ! 백엔드는 유저의 emit을 받을 때 마다 for문으로 배열을 검사한다.
    // ! 배열의 모든 원소가 true일 경우, 클라이언트로 스킵 요청 emit을 한다.
    // ! 모든 클라이언트에서는 타이머의 End Time을 갱신한다.
    // ! 그리고 그 End Time에 맞게 totalSeconds를 5~10초 남게 갱신한다.
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
        // day.js의 시/분/초 단위로 같은 시간인지 확인
        // 같은 시점에서 다음 이벤트로 넘어가기 위해 on 한다.
        if (
          Math.floor(this.totalSeconds / 60) === 0 &&
          this.totalSeconds % 60 === 0
        ) {
          clearInterval(this.pomodoroInstance);
          (this.totalSeconds = 60),
          (this.contentProgress = 0),
          this.pomodoroInstance = null
          console.log('아침 타이머 중단')
        }
      }, 500);
      this.nextEvent = setInterval(() => {
        this.clientRealTime = dayjs().format("YYYY.MM.DD HH:mm:ss");
        if (this.clientRealTime === this.serverEnd) {
            clearInterval(this.nextEvent);
            this.$emit("startVote")
            this.nextEvent = null
            console.log('실제 아침 종료 이벤트는 이것')
        }
      }, 500)
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
          this.pomodoroInstance = null
          console.log('투표 타이머 중단')
        }
      }, 500);
      this.nextEvent = setInterval(() => {
        this.clientRealTime = dayjs().format("YYYY.MM.DD HH:mm:ss");
        if (this.clientRealTime === this.serverEnd) {
          clearInterval(this.nextEvent);
          this.$nuxt.$emit('voteTimeFinish', '투표 타이머 중단')
          this.$emit('finishVote')
          this.nextEvent = null
          console.log('실제 투표 종료 이벤트는 이것')
        }
      }, 500)
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
          this.pomodoroInstance = null
          console.log('심판 타이머 중단')
        }
      },500);
      this.nextEvent = setInterval(() => {
        this.clientRealTime = dayjs().format("YYYY.MM.DD HH:mm:ss");
        if (this.clientRealTime === this.serverEnd) {
          clearInterval(this.nextEvent);
          this.$nuxt.$emit('punishmentTimeFinish', '찬반 타이머 중단')
          this.$emit('finishPunishmentVote')
            this.nextEvent = null
            console.log('실제 심판 종료 이벤트는 이것')
        }
      }, 500)
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
          console.log('타이머 종료, 밤 결과 실행')
          this.pomodoroInstance = null
        }
      }, 500);
      this.nextEvent = setInterval(() => {
        this.clientRealTime = dayjs().format("YYYY.MM.DD HH:mm:ss");
        if (this.clientRealTime === this.serverEnd) {
          clearInterval(this.nextEvent);
          this.$nuxt.$emit('skillTimeFinish', '능력 타이머 중단')
          this.$emit('nightResult')
            this.nextEvent = null
            console.log('실제 스킬 종료 이벤트는 이것')
        }
      }, 500)
    },
  },
};
</script>
<style lang=""></style>

