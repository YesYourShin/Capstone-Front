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
      contentProgressPer: 60,
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
      this.serverEnd = dayjs(end.end)
      this.clientStartTime = dayjs()
      this.serverEnd.format("YYYY-MM-DD HH:mm:ss")
      console.log(typeof this.serverEnd)
      console.log(typeof this.clientStartTime)
      // this.totalSeconds = this.serverEnd.diff(this.clientRealTime, 's')
    });
    // 그리고 일정 시간에 함께 다음 이벤트로 emit 할 수 있어야 함.
  },
  methods: {
    // 스킵은 아직 구현 안됨

    formatTime(time) {
      if (time < 10) {
        return "0" + time;
      }
      return time.toString();
    },
    // 아침이 되었을 때 움직이는 타이머
    // totalseconds = serverEnd - clientRealTime
    // setInterval 내에서 clientRealtime 갱신
    morningTimer() {
      this.$root.gameSocket.emit(GameEvent.TIMER);

        this.$swal({
          icon: 'success',
          title: '아침이 되었습니다',
          html: '자유롭게 대화하며 서로에 대해 알아가는 시간입니다.',
          timer: 1000,
          showConfirmButton: false,
          showClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === this.$swal.DismissReason.timer) {
            console.log('아침 모달 시작')
          }
        })

      setTimeout(() => {
        this.timerStart = true;
        this.clientRealTime = dayjs()
        this.clientRealTime.format("YYYY-MM-DD HH:mm:ss")
        this.totalSeconds = this.serverEnd.diff(this.clientRealTime, 's')
        this.contentProgressPer = this.totalSeconds
        this.pomodoroInstance = setInterval(() => {
          this.clientRealTime = dayjs()
          this.clientRealTime.format("YYYY-MM-DD HH:mm:ss")
          this.totalSeconds = this.serverEnd.diff(this.clientRealTime, 's')
          this.contentProgress += 100/this.contentProgressPer;
          if (
            this.clientRealTime.format("YYYY-MM-DD HH:mm:ss") === this.serverEnd.format("YYYY-MM-DD HH:mm:ss")
          ) {
            clearInterval(this.pomodoroInstance);
            (this.totalSeconds = 60),
            (this.contentProgress = 0),
            this.$emit("startVote")
            this.pomodoroInstance = null
            console.log('아침 타이머 중단')
          }
        }, 1000);
      }, 1000)
    },
    // 마피아로 의심되는 유저를 지목할 때 쓰이는 타이머
    voteTimer() {
      this.$root.gameSocket.emit(GameEvent.TIMER);

        this.$swal({
          icon: 'success',
          title: '투표를 시작합니다',
          html: '마피아로 의심되는 유저를 지목합니다',
          timer: 1000,
          showConfirmButton: false,
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === this.$swal.DismissReason.timer) {
            console.log('투표 모달 시작')
          }
        })

      setTimeout(() => {
        this.timerStart = true;
        this.clientRealTime = dayjs()
        this.clientRealTime.format("YYYY-MM-DD HH:mm:ss")
        this.totalSeconds = this.serverEnd.diff(this.clientRealTime, 's')
        this.contentProgressPer = this.totalSeconds
        this.pomodoroInstance = setInterval(() => {
          this.clientRealTime = dayjs()
          this.clientRealTime.format("YYYY-MM-DD HH:mm:ss")
          this.totalSeconds = this.serverEnd.diff(this.clientRealTime, 's')
          this.contentProgress += 100/this.contentProgressPer;
          if (
            this.clientRealTime.format("YYYY-MM-DD HH:mm:ss") === this.serverEnd.format("YYYY-MM-DD HH:mm:ss")
          ) {
            clearInterval(this.pomodoroInstance);
            (this.totalSeconds = 60),
            (this.contentProgress = 0),
            this.$nuxt.$emit('voteTimeFinish', '유저 지목 이벤트 중단')
            this.$emit('finishVote')
            this.pomodoroInstance = null
            console.log('유저 지목 타이머 중단')
          }
        }, 1000);
      }, 1000)
    },
    // 특정 유저가 지목되고, 사형 찬반투표를 할 때 쓰이는 타이머
    punishmentTimer() {
      this.$root.gameSocket.emit(GameEvent.TIMER);

        this.$swal({
          icon: 'success',
          title: '유저가 지목되었습니다',
          html: '해당 유저에 대한 찬반투표를 시작합니다',
          timer: 1000,
          showConfirmButton: false,
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === this.$swal.DismissReason.timer) {
            console.log('찬반 모달 시작')
          }
        })

      setTimeout(() => {
        this.timerStart = true;
        this.clientRealTime = dayjs()
        this.clientRealTime.format("YYYY-MM-DD HH:mm:ss")
        this.totalSeconds = this.serverEnd.diff(this.clientRealTime, 's')
        this.contentProgressPer = this.totalSeconds
        this.pomodoroInstance = setInterval(() => {
          this.clientRealTime = dayjs()
          this.clientRealTime.format("YYYY-MM-DD HH:mm:ss")
          this.totalSeconds = this.serverEnd.diff(this.clientRealTime, 's')
          this.contentProgress += 100/this.contentProgressPer;
          if (
            this.clientRealTime.format("YYYY-MM-DD HH:mm:ss") === this.serverEnd.format("YYYY-MM-DD HH:mm:ss")
          ) {
            clearInterval(this.pomodoroInstance);
            (this.totalSeconds = 60),
            (this.contentProgress = 0),
            this.$nuxt.$emit('punishmentTimeFinish', '찬반 이벤트 중단')
            this.$emit('finishPunishmentVote')
            this.pomodoroInstance = null
            console.log('찬반 타이머 중단')
          }
        }, 1000);
      }, 1000)
    },
    // 밤이 되었을 때 쓰이는 타이머
    nightEvent() {
      this.$root.gameSocket.emit(GameEvent.TIMER);

        this.$swal({
          icon: 'success',
          title: '밤이 되었습니다',
          html: '마피아를 지목합니다.',
          timer: 1000,
          showConfirmButton: false,
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === this.$swal.DismissReason.timer) {
            console.log('밤 모달 시작')
          }
        })

      setTimeout(() => {
        this.timerStart = true;
        this.clientRealTime = dayjs()
        this.clientRealTime.format("YYYY-MM-DD HH:mm:ss")
        this.totalSeconds = this.serverEnd.diff(this.clientRealTime, 's')
        this.contentProgressPer = this.totalSeconds
        this.pomodoroInstance = setInterval(() => {
          this.clientRealTime = dayjs()
          this.clientRealTime.format("YYYY-MM-DD HH:mm:ss")
          this.totalSeconds = this.serverEnd.diff(this.clientRealTime, 's')
          this.contentProgress += 100/this.contentProgressPer;
          if (
            this.clientRealTime.format("YYYY-MM-DD HH:mm:ss") === this.serverEnd.format("YYYY-MM-DD HH:mm:ss")
          ) {
            clearInterval(this.pomodoroInstance);
            (this.totalSeconds = 60),
            (this.contentProgress = 0),
            this.$nuxt.$emit('skillTimeFinish', '밤, 능력 이벤트 중단')
            this.$emit('nightResult')
            this.pomodoroInstance = null
            console.log('능력 타이머 중단')
          }
        }, 1000);
      }, 1000)
    },
  },
};
</script>
<style lang=""></style>

