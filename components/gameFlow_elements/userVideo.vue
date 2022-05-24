<template>
  <div class="grid grid-cols-5 gap-4 justify-evenly">
    <div
      class="videobox justify-self-center mx-2 mb-3 w-full rounded"
      v-for="(s, n) in roomMembers"
      :key="s.userId"
      :class="`${s.speaking ? 'border-green-500' : 'border-white'}`"
    >
      <div class="aspect-video">
        <div v-if="s.stream" class="videoCut">
          <video
            v-if="s.nickname !== myInfo.profile.nickname"
            :ref="'remote' + s.userId"
            :id="'remote' + s.userId"
            :src-object.prop.camel="s.stream"
            autoplay
          ></video>
          <video
            v-else
            class="myVideo"
            :ref="'remote' + s.userId"
            :id="'remote' + s.userId"
            :src-object.prop.camel="s.stream"
            autoplay
            muted
          ></video>
          <!-- 추가해야 할 조건 = 자신의 직업이 마피아일 때, 마피아인 사람 -->
          <!-- v-if flag===false && s.nickname === job 마피아면 캔버스 클래스 안줌  -->
          <canvas
            v-if="
              flag === false &&
              s.nickname !== myInfo.profile.nickname &&
              s.die === false
            "
            :class="['output_canvas' + s.id]"
            :id="['output_canvas' + n]"
            width="640"
            height="360"
            class="w-[360px] h-[206px] bg-black"
          >
          </canvas>
          <canvas
            v-else
            :class="['output_canvas' + s.id]"
            :id="['output_canvas' + n]"
            width="640"
            height="360"
          >
          </canvas>
        </div>
      </div>
      <!-- 여기까지 div v-if s.stream -->
      <div class="grid grid-cols-4 font-semibold userInfo">
        <div
          v-if="
            flag === false &&
            s.nickname !== myInfo.profile.nickname &&
            s.die === false
          "
          :class="`col-span-1 text-center bg-black-500 text-white`"
        >
          Lv.{{ s.level }}
        </div>
        <div v-else :class="`col-span-1 text-center bg-green-500 text-white`">
          Lv.{{ s.level }}
        </div>
        <!-- 첫날 밤, 마피아 유저는 이름 빨간색 -->
        <div class="col-span-3 bg-white px-1">
          {{ s.nickname }}
        </div>
      </div>
    </div>
    <Memo></Memo>
  </div>
</template>

<script>
import Memo from "@/components/gameFlow_elements/memo.vue";
import { Hands } from "@mediapipe/hands";
import {
  fingersCount as vote,
  check,
  punishment,
} from "@/common/detection/hand";
export default {
  data() {
    return {
      vStatus: false, // 손가락 카운트
      cStatus: false, // ox 체크
      pStatus: false, // 엄지로 죽이기
      vote: false,
      check: false,
      punishment: false,
      voteResult: null,
      checkResult: null,
      punishmentResult: null,
      myVideo: null,
      myCanvas: null,
      myCtx: null,
      voteNum: null,
      voteCount: null,
      nextEvent: null,
      skillTrue: null,
      isPuase: false,
      timer: null,
      mediaStatus: true,
      leave: false,
    };
  },
  props: {
    // flag는 낮밤 캠 끄기, anotherMafia는 자신 이외의 마피아를 알기 위함
    flag: {
      type: Boolean,
      required: false,
    },
    anotherMafia: {
      type: String,
    },
  },
  components: {
    Memo,
  },
  computed: {
    myInfo() {
      return this.$store.getters["user/getMyInfo"];
    },
    roomMembers() {
      return this.$store.state.stream.roomMembers;
    },
    surviveMembers() {
      return this.$store.state.stream.surviveMembers;
    },
  },
  created() {
    //! 현 문제점
    // * data로 선언한 것을 clearInterval하면 먹히지 않음 (해결)
    // * 존재하지 않는 유저를 지목할 경우 취소해야 함. (해결 => 지목불가)
    // * 자신이 몇번을 지목했는지, 알 수 있도록 표시가 필요함.
    // * 두번 찍히는거 생긴다면 정확히 원인 파악 필요! (해결)
    // * 타이머 멈췄을 때 다시 동작 되도록...
    // todo 1. 백엔드 요청 -> 하루 지나면 투표값 전부 초기화 필요

    // ! 만약 타이머가 종료됐을 경우, 투표를 안한 사람만 넘겨줘야 한다.
    // ! 투표 한 사람이 중복으로 넘겨주면 안됨!!

    this.$nuxt.$on("voteTimeFinish", (data) => {
      if (this.skillTrue === false && this.checkNum !== true) {
        console.log(data);
        clearInterval(this.voteLoading);
        this.vStatus = false;
        this.vote = false;
        this.cStatus = false;
        this.check = false;
        this.$emit("voteNumEmit", null);
        this.voteLoading = null;
        this.checkLoading = null;
      }
    });

    this.$nuxt.$on("punishmentTimeFinish", (data) => {
      if (typeof this.punishmentEmit !== "boolean") {
        console.log(data);
        clearInterval(this.punishLoading);
        this.pStatus = false;
        this.punishment = false;
        this.$emit("punishmentEmit", false);
      }
    }),
      this.$nuxt.$on("skillTimeFinish", (data) => {
        if (this.skillTrue === true && typeof this.checkNum !== "boolean") {
          console.log(data);
          clearInterval(this.voteLoading);
          this.vStatus = false;
          this.vote = false;
          this.cStatus = false;
          this.check = false;
          this.$emit("skillNumEmit", null);
          this.voteLoading = null;
          this.checkLoading = null;
        }
      });
  },

  async mounted() {
    this.myVideo = document.getElementById(`remote${this.myInfo.profile.id}`);
    this.myCanvas = document.getElementsByClassName(
      `output_canvas${this.myInfo.profile.id}`
    )[0];
    if (this.myCanvas) {
      this.myCtx = this.myCanvas.getContext("2d");
    }
    // await this.handCognition(this.myVideo, this.myCanvas, this.myCtx);
  },
  watch: {
    voteResult: function (newVoteResult) {
      console.log("Vote Result", newVoteResult);
      if (
        newVoteResult > 0 &&
        newVoteResult <= this.$store.state.stream.roomMembers.length &&
        newVoteResult !== null &&
        this.$store.state.stream.roomMembers[newVoteResult - 1].die === false &&
        newVoteResult !== this.voteNum
      ) {
        this.voteNum = newVoteResult;
        this.changeVoteResult();
      }
    },

    checkResult: function (newCheckResult) {
      console.log("Check Result", newCheckResult);
      if (
        typeof newCheckResult === "boolean" &&
        newCheckResult !== this.checkNum
      ) {
        this.checkNum = newCheckResult;
        this.changeCheckResult();
      }
    },
    punishmentResult: function (newPunishmentResult) {
      // newPunishmentResult === 'a'
      console.log("Punishment Result", newPunishmentResult);
      if (
        typeof newPunishmentResult === "boolean" &&
        newPunishmentResult !== this.punishmentNum
      ) {
        this.punishmentNum = newPunishmentResult;
        this.punishmentCheckResult();
      }
    },
  },
  beforeunload() {
    this.leave = true;
  },
  methods: {
    startVoteMotion() {
      this.mediaStatus = true;
      this.skillTrue = false;
      this.voteResults();
    },
    checkVoteMotion() {
      this.mediaStatus = true;
      this.checkResults();
    },
    punishmentVoteMotion() {
      this.mediaStatus = true;
      this.punishmentResults();
    },
    skillMotion() {
      this.mediaStatus = true;
      this.skillTrue = true;
      this.voteResults();
    },
    unLoadEvent: function (event) {
      if (this.isLeaveSite) return;
      event.preventDefault();
      event.returnValue = "";
    },
    voteResults() {
      console.log("손 인식 시작");
      this.vStatus = this.vote ? false : true;
    },
    checkResults() {
      console.log("체크 인식 시작");
      this.cStatus = this.check ? false : true;
    },
    punishmentResults() {
      console.log("투표 인식 시작");
      this.pStatus = this.punishment ? false : true;
    },

    changeVoteResult() {
      this.voteCount = 0;
      clearInterval(this.voteLoading);
      this.voteLoading = setInterval(() => {
        if (this.voteCount < 3) {
          this.voteCount += 1;
          console.log(this.voteCount);
        } else if (this.voteCount === 3) {
          clearInterval(this.voteLoading);
          console.log("체크 완료");
          this.vStatus = false;
          this.vote = false;
          this.checkVoteMotion();
          this.voteLoading = null;
          console.log(this.voteNum);
        }
      }, 1000);
    },

    changeCheckResult() {
      this.checkCount = 0;
      clearInterval(this.changeCheckResult);
      this.checkLoading = setInterval(() => {
        if (this.checkCount < 3) {
          this.checkCount += 1;
          console.log(this.checkCount);
        } else if (this.checkCount === 3) {
          clearInterval(this.checkLoading);
          console.log("체크 인식 완료" + this.checkNum);
          // this.mediaStatus = null
          this.cStatus = false;
          this.check = false;
          // 스킬 사용이 아니고, 체크했을 경우
          if (this.skillTrue === false && this.checkNum === true) {
            this.$emit("voteNumEmit", this.voteNum);
            this.checkLoading = null;
            this.checkNum = null;
            this.voteNum = null;
            // this.$emit('voteNumEmit', null)
            console.log("투표 값 넘겨줌" + this.voteNum);
            // 스킬 사용이고, 체크했을 경우
          } else if (this.skillTrue === true && this.checkNum === true) {
            this.$emit("skillNumEmit", this.voteNum);
            this.checkNum = null;
            this.checkLoading = null;
            this.voteNum = null;
            console.log("스킬 값 넘겨줌" + this.voteNum);
            // 만약 모션 취소를 할 경우 다시 선택하는걸로 되돌아간다.
          } else if (this.skillTrue === false && this.checkNum === false) {
            this.checkNum = null;
            this.checkLoading = null;
            this.voteNum = null;
            this.startVoteMotion();
            console.log("투표 다시");
          } else if (this.skillTrue === true && this.checkNum === false) {
            this.checkNum = null;
            this.checkLoading = null;
            this.voteNum = null;
            this.skillMotion();
            console.log("스킬 다시");
          }
        }
      }, 1000);
    },

    punishmentCheckResult() {
      this.punishmentCount = 0;
      clearInterval(this.punishLoading);
      this.punishLoading = setInterval(() => {
        // this.punishLoading의 주소값이 계속 업데이트
        if (this.punishmentCount < 3) {
          this.punishmentCount += 1;
          console.log(this.punishmentCount);
        } else if (this.punishmentCount === 3) {
          clearInterval(this.punishLoading);
          // this.mediaStatus = null
          this.pStatus = false;
          this.punishment = false;
          this.punishmentEmit = this.punishmentNum;
          this.$emit("punishmentEmit", this.punishmentEmit);
          // 죽음 값을 완벽히 인식했을 때만 가능
          console.log(this.punishmentEmit + "죽음 투표");
          this.punishLoading = null;
        }
      }, 1000);
    },

    async handCognition(videoElement, canvasElement, canvasCtx) {
      // videoElement.style.display = "none";
      let onResults = async (results) => {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        // 기준점을 지정한 크기(x,y)만큼 평행이동함
        canvasCtx.translate(canvasElement.width, 0);
        // scale(x,y)
        // x : 수평 방향의 배율. 음수 값은 수직 축에서 픽셀을 뒤집음
        // y : 수직 방향의 배율. 음수 값은 가로 축에서 픽셀을 뒤집음
        canvasCtx.scale(-1, 1);
        // canvasCtx.drawImage(
        //   results.image,
        //   0,
        //   0,
        //   canvasElement.width,
        //   canvasElement.height
        // );
        let vStatus = this.vStatus;
        let cStatus = this.cStatus;
        let pStatus = this.pStatus;
        let status = vStatus
          ? "vStatus"
          : cStatus
          ? "cStatus"
          : pStatus
          ? "pStatus"
          : false;
        switch (status) {
          case "vStatus":
            if (results.multiHandLandmarks) {
              this.voteResult = vote(
                results,
                canvasElement,
                canvasCtx,
                vStatus
              );
            }
            break;
          case "cStatus":
            if (results.multiHandLandmarks) {
              this.checkResult = check(
                results,
                canvasElement,
                canvasCtx,
                cStatus
              );
            }
            break;
          case "pStatus":
            if (results.multiHandLandmarks) {
              this.punishmentResult = punishment(
                results,
                canvasElement,
                canvasCtx,
                pStatus
              );
            }
            break;
          default:
            canvasCtx.restore();
        }
      };
      // setInterval(test, 16);
      let myStream;
      const getMedia = async () => {
        try {
          myStream = this.roomMembers.find((e) => {
            return e.id === this.myInfo.id;
          }).stream;
          console.log(myStream);
          videoElement.srcObject = myStream;
          videoElement.play();
          this.mediaStatus = true;
          await media();
          // this.mediaStatus = false;
        } catch (e) {
          console.log(e);
        }
      };
      const hands = new Hands({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        },
      });
      hands.setOptions({
        maxNumHands: 2,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5,
      });
      hands.onResults(onResults);
      const media = async () => {
        if (!videoElement) {
          requestAnimationFrame(media);
        } else if (this.leave) {
          return;
        } else {
          if (!this.mediaStatus) {
            canvasCtx.save();
            canvasCtx.clearRect(
              0,
              0,
              canvasElement.width,
              canvasElement.height
            );
            // 기준점을 지정한 크기(x,y)만큼 평행이동함
            canvasCtx.translate(canvasElement.width, 0);
            // scale(x,y)
            // x : 수평 방향의 배율. 음수 값은 수직 축에서 픽셀을 뒤집음
            // y : 수직 방향의 배율. 음수 값은 가로 축에서 픽셀을 뒤집음
            canvasCtx.scale(-1, 1);
            // canvasCtx.drawImage(
            //   videoElement,
            //   0,
            //   0,
            //   canvasElement.width,
            //   canvasElement.height
            // );
            canvasCtx.restore();
            requestAnimationFrame(media);
          } else {
            await hands.send({ image: videoElement });
            requestAnimationFrame(media);
          }
        }
      };
      getMedia();
    },
  },
};
</script>

<style lang="scss" scoped="scoped">
@import "~assets/userVideo.scss";
</style>
