<template>
    <div class="grid grid-cols-5 gap-4 justify-evenly">
      <div class="videobox justify-self-center mx-2 mb-3 w-full rounded " v-for="(s, n) in roomMembers" :key="s.userId">
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
              <canvas
              :class="['output_canvas' + s.id]"
              :id="['output_canvas' + n]"
              width="640"
              height="360"
              ></canvas>
            </div>
          </div>
            <!-- 여기까지 div v-if s.stream -->
            <div class="grid grid-cols-4 font-semibold userInfo">
              <div
                :class="`
                col-span-1 text-center
                    bg-black text-white`"
              >
                Lv.{{ s.level }}
              </div>
              <div class="col-span-3 bg-white px-1">
                {{ s.nickname }}
              </div>
            </div>
          </div>
      <!-- <Memo></Memo> -->
    </div>

</template>

<script>
import Memo from "@/components/memo.vue";
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
      isPuase : false,
      timer: null,
      mediaStatus: false
    }
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
    this.$nuxt.$on('voteTimeFinish', (data) => {
      console.log(data)
      clearInterval(this.voteLoading)
      this.mediaStatus = false
      this.vStatus = false
      this.vote = false
      this.cStatus = false
      this.check = false
      if(this.skillTrue === false && this.checkNum === true) {
        this.$emit('voteNumEmit', this.voteNum)
        console.log('투표 값 넘겨줌' + this.voteNum)
      } else {
        this.$emit('voteNumEmit', null)
        console.log('투표 값 널로 넘겨줌')
      }
    }),

    this.$nuxt.$on('punishmentTimeFinish', (data) => {
      console.log(data)
      clearInterval(this.punishLoading)
      this.mediaStatus = false
      this.pStatus = false
      this.punishment = false
      if (this.punishmentNum === null) {
        this.$emit('punishmentEmit', this.punishmentNum)
      }
    }),

    this.$nuxt.$on('skillTimeFinish', (data) => {
      console.log(data)
      clearInterval(this.voteLoading)
      this.mediaStatus = false
      this.vStatus = false
      this.vote = false
      this.cStatus = false
      this.check = false
      if(this.skillTrue === true && this.checkNum === true) {
        this.$emit('skillNumEmit', this.voteNum)
        console.log('스킬 값 넘겨줌' + this.voteNum)
      } else {
        this.$emit('skillNumEmit', null)
        console.log('스킬 값 널로 넘겨줌')
      }
    })
  },
  async mounted() {
    this.myVideo = document.getElementById(`remote${this.myInfo.profile.id}`);
    this.myCanvas = document.getElementsByClassName(
      `output_canvas${this.myInfo.profile.id}`
    )[0];
    if (this.myCanvas) {
      this.myCtx = this.myCanvas.getContext("2d");
    }
    await this.handCognition(this.myVideo, this.myCanvas, this.myCtx);

  },
  watch: {
    // 질문이 변경될 때 마다 이 기능이 실행됩니다.
    // Todo 없는 번호 찍으면 다시 투표하게
    voteResult: function (newVoteResult) {
      console.log("Vote Result", newVoteResult);
      this.voteNum = newVoteResult
      this.voteCount = 0
      if (this.voteNum != 0) {
        let voteLoading = setInterval(() => {
          if (this.voteCount < 3) {
            this.voteCount += 1
          } else if (newVoteResult != this.voteNum && this.vote==99999) {
            this.voteCount = 0
            console.log('이거 안뜨면 안되냐')
            clearInterval(voteLoading)
          } else if (this.voteCount > 2) {
            this.voteCount = 0
            console.log('체크 완료')
            this.mediaStatus = false
            this.vStatus = false
            this.vote = false
            this.checkVoteMotion()
            clearInterval(voteLoading)
          }
        }, 1000)
      }
    },
    // ! 오류 뜨는거 잡아야 됨 캠 안꺼지느ㅏㄴ거랑 반복 wathc
    checkResult: function (newCheckResult) {
      console.log("Check Result", newCheckResult);
      this.checkNum = newCheckResult
      this.checkCount = 0
      if (this.checkNum === true || this.checkNum === false) {
        let checkLoading = setInterval(() => {
          if (this.checkCount < 3) {
            this.checkCount += 1
          } else if (newCheckResult != this.checkNum) {
            this.checkCount = 0
            clearInterval(checkLoading)
          } else if (this.checkCount > 2 && this.checkNum == true) {
            console.log('체크 인식 완료' + this.checkNum)
            this.mediaStatus = false
            this.cStatus = false
            this.check = false
            this.checkCount = 0
            clearInterval(checkLoading)
          } else if (this.checkCount > 2 && this.checkNum == false) {
            this.mediaStatus = false
            this.cStatus = false
            this.check = false
            this.checkCount = 0
            this.startVoteMotion()
            console.log('투표 다시')
            clearInterval(checkLoading)
          }
        }, 1000)
      }
    },
    punishmentResult: function (newPunishmentResult) {
      console.log("Punishment Result", newPunishmentResult);
      this.punishmentNum = newPunishmentResult
      this.punishmentCount = 0
      if (this.punishmentNum == true || this.punishmentNum == false) {
        this.punishLoading = setInterval(() => {
          this.punishmentCount += 1
          if (newPunishmentResult != this.punishmentNum) {
            this.punishmentCount = 0
            clearInterval(this.punishLoading);
          } else if (this.punishmentCount > 2) {
            this.mediaStatus = false
            this.pStatus = false
            this.punishment = false
            clearInterval(this.punishLoading);
            this.$emit('punishmentEmit', this.punishmentNum)
            this.punishmentCount = 0
          }
        }, 1000)
      }
    },
  },
  methods: {
    startVoteMotion(){
      this.mediaStatus = true
      this.skillTrue = false
      this.voteResults()
    },
    checkVoteMotion() {
      this.mediaStatus = true
      this.checkResults()
    },
    punishmentVoteMotion() {
      this.mediaStatus = true
      this.punishmentResults()
    },
    skillMotion() {
      this.mediaStatus = true
      this.skillTrue = true
      this.voteResults()
    },
    unLoadEvent: function (event) {
      if (this.isLeaveSite) return;
      event.preventDefault();
      event.returnValue = "";
    },
    voteResults() {
      console.log("손 인식 시작");
      this.vStatus = this.vote ? false : true
    },
    checkResults() {
      console.log("체크 인식 시작");
      this.cStatus = this.check ? false : true;
    },
    punishmentResults() {
      console.log("투표 인식 시작");
      this.pStatus = this.punishment ? false : true;
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
            return e.id === this.myInfo.id
          }).stream
          console.log(myStream)
          videoElement.srcObject = myStream;
          videoElement.play();
          // this.cameraSwitch(true);
          this.mediaStatus = true;
          await media();
          // this.cameraSwitch(false);
          this.mediaStatus = false;
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
  }
}
</script>

<style lang="scss" scoped="scoped">
@import "~assets/userVideo.scss";
</style>
