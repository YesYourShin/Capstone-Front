<template>
  <div :class="{ 'gamebox-first': this.flag, 'gamebox-second': !this.flag }">
    <div class="dayTimeBox">
      <DayCount ref="dayCount" class="chatbox"></DayCount>
      <Timer
        v-on:startThisGame="gameStart"
        v-on:finishPunishmentVote="nightEvent"
        v-on:nightFinishEvent="nightResult"
        v-on:startVote="startVote"
        v-on:finishVote="finishVote"
        ref="timer"
        class="timerbox"
        >{{ counter }}</Timer
      >
    </div>
    <Billboard ref="billboard" />

    <!-- <div class="itemBox">
        <div class="settingbox">
          <div class="settingCamAndMic">
            <img :src="require(`../assets/ingame/muteMic.png`)">
            <img :src="require(`../assets/ingame/offCam.png`)"></div>
          </div>
        <div class="timebox">
          <Timer
              v-on:timeoutVote="finishVote"
              v-on:timeoutPunishmentVote="finishPunishmentVote"
              v-on:nightEvent="nightEvent"
              ref="timer">
          </Timer>
        </div>
      </div> -->
    <div class="videomainbox">
      <!-- <div class="videobox">
        <video
          id="myVideo"
          ref="myVideo"
          muted
          :src-object.prop.camel="publishStream.stream"
          autoplay
        ></video>
        <canvas
          :class="['aspect-video my_canvas']"
          width="1280"
          height="720"
        ></canvas>
        <div :class="['userInfo' + 9]">
          {{
            "level : " +
            userLevel[9] +
            "   " +
            userName[9] +
            " " +
            survivePlayer[9]
          }}
        </div>
      </div> -->
      <div class="videobox" v-for="(s, n) in roomMembers" :key="s.id">
        <div v-if="s.stream">
          <video
            v-if="s.nickname !== myInfo.profile.nickname"
            :class="['aspect-video usercam' + s.id]"
            :id="['usercam' + s.id]"
            :src-object.prop.camel="s.stream"
            autoplay
          >
            {{ s.id }}
          </video>
          <video
            v-else
            :class="['aspect-video usercam' + s.id]"
            :id="['usercam' + s.id]"
            :src-object.prop.camel="s.stream"
            autoplay
            muted
          ></video>
          <canvas
            :class="['aspect-video output_canvas' + s.id]"
            :id="['output_canvas' + n]"
            width="640"
            height="360"
          ></canvas>
          <div :class="['userInfo' + s.id]">
            {{ "level : " + userLevel[s.id - 1] + "   " + userName[s.id - 1] }}
          </div>
        </div>
        <!-- <Memo class="memoInfo" ></Memo> -->
      </div>
      <Memo></Memo>
      <div>
        {{ "내 번호:" + this.myInfo.profile.id }}
        <input
          type="checkbox"
          id="checkbox1"
          v-model="fingers"
          v-on:click="fingersResults(this)"
        /><label>지목</label>
        <input
          type="checkbox"
          id="checkbox2"
          v-model="check"
          v-on:click="checkResults(this)"
        /><label>지목확인</label>
        <input
          type="checkbox"
          id="checkbox3"
          v-model="vote"
          v-on:click="voteResults(this)"
        /><label>찬반투표</label>
      </div>
      <div>
        <!-- <button v-on:click="cameraSwitch(true)">camera on</button> -->
        <button v-on:click="mediaStatus = true">camera on</button>
        <button v-on:click="mediaStatus = false">camera off</button>
      </div>
    </div>
    <SideBar />
  </div>
</template>

<script>
import Timer from "@/components/Timer.vue";
import Billboard from "@/components/gameFlow_elements/billboard.vue";
import SideBar from "@/components/lobby_elements/sideBar.vue";
import Memo from "@/components/memo.vue";
import dayjs from "dayjs";
import { GameEvent } from "@/api/mafiaAPI";
import DayCount from "@/components/gameFlow_elements/dayCountView.vue";
import { Hands } from "@mediapipe/hands";
import { fingersCount, check, vote } from "@/common/detection/hand";

export default {
  name: "App",
  props: {
    roomInfo: Object,
  },
  components: {
    Timer,
    Billboard,
    SideBar,
    Memo,
    DayCount,
  },
  computed: {
    myInfo() {
      return this.$store.getters["user/getMyInfo"];
    },
    roomMembers() {
      return this.$store.state.stream.roomMembers;
    },
    roomId() {
      const value = this.$store.state.roomId;
      console.log("this is nuxt vue", value);
      return value;
    },
  },
  data() {
    return {
      userLevel: [108, 17, 9, 666, 722, 15, 11, 12, 13, 14], // 각 유저의 레벨 (더미)
      userName: [
        "유저1",
        "유저2",
        "유저3",
        "유저4",
        "유저5",
        "유저6",
        "유저7",
        "유저8",
        "유저9",
        "유저10",
      ], // 각 유저의 닉네임(더미)
      electedPlayer: 0, // 마피아로 의심되는 유저 투표
      punishmentPlayer: false, // 찬반 투표, 디폴트는 반대
      selectedUser: false, // 자신의 선택 확정, 디폴트는 미승인 (true가 되야 선택값 넘어감)
      mafiaSelected: 0, // 마피아일 경우 유저 지목
      doctorSelected: 0, // 의사일 경우 유저 지목
      policeSelected: 0, // 경찰일 경우 유저 지목
      myNum: 0,
      myJob: "",
      myNick: "",
      flag: false,
      day: false,
      counter: 60,
      fstatus: false, // 손가락 카운트
      cstatus: false, // ox 체크
      vstatus: false, // 엄지로 죽이기
      fingers: false,
      check: false,
      vote: false,
      totalFingers: null,
      checkResult: null,
      voteResult: null,
      myVideo: null,
      myCanvas: null,
      myCtx: null,
    };
  },
  async mounted() {
    // let newRemoteFeed = null;
    this.socket = this.$nuxtSocket({
      channel: "/game",
      withCredentials: true,
      transports: ["websocket"],
    });
    this.gameSocketSet();
    this.myVideo = document.getElementById(`usercam${this.myInfo.profile.id}`);
    this.myCanvas = document.getElementsByClassName(
      `output_canvas${this.myInfo.profile.id}`
    )[0];
    this.myCtx = this.myCanvas.getContext("2d");
    await this.handCognition(this.myVideo, this.myCanvas, this.myCtx);
  },
  watch: {
    // 질문이 변경될 때 마다 이 기능이 실행됩니다.
    totalFingers: function (newTotalFingers) {
      console.log("total fingers", newTotalFingers);
    },
    checkResult: function (newCheckResult) {
      console.log("Check Result", newCheckResult);
    },
    voteResult: function (newVoteResult) {
      console.log("Vote Result", newVoteResult);
    },
  },
  created() {},
  methods: {
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

        let fStatus = this.fStatus;
        let cStatus = this.cStatus;
        let vStatus = this.vStatus;

        let status = fStatus
          ? "fStatus"
          : cStatus
          ? "cStatus"
          : vStatus
          ? "vStatus"
          : false;
        switch (status) {
          case "fStatus":
            if (results.multiHandLandmarks) {
              this.totalFingers = fingersCount(
                results,
                canvasElement,
                canvasCtx,
                fStatus
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
          default:
            canvasCtx.restore();
        }
      };

      // setInterval(test, 16);
      let myStream;
      const getMedia = async () => {
        try {
          myStream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: { width: 1280, height: 720 },
            // video: true,
          });
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
    fingersResults() {
      this.fStatus = this.fingers ? false : true;
    },
    checkResults() {
      this.cStatus = this.check ? false : true;
    },
    voteResults() {
      this.vStatus = this.vote ? false : true;
    },
    // 게임에 입장하는 즉시 실행되며, 유저의 소켓 정보 받아옴
    gameSocketSet() {
      // this.myNum = this.myInfo.profile.nickname
      console.log("현재 방 번호", this.$store.state.roomId.roomId);
      this.socket.emit("game:join", {
        roomId: this.$store.state.roomId.roomId,
      });
      this.$refs.billboard.gameStartBoard();
      this.socket.on("gamejoin", (data) => {
        console.log(data);
        this.myNick = data.profile.nickname;
        console.log(this.myNick);
        // this.mySocketId = data.user
        // console.log(this.mySocketId)
      });
      // this.socket.on()

      // 입장 5초 후에 게임을 시작한다.
      setTimeout(() => {
        this.gameStart();
      }, 5000);
    },
    // 게임 스타트, 게임 스타트 관련 데이터
    gameStart() {
      this.socket.emit(GameEvent.Start);
      this.socket.on(GameEvent.Start, (data) => {
        console.log(data);
        this.grantPlayerJob();
      });
      this.$refs.billboard.grantPlayerJobBeforeBoard();
    },
    // 직업 배분 결과 통지, 지금 빌보드에 뜨는건 더미라서 마피아라고 뜬다.
    grantPlayerJob() {
      this.$refs.billboard.grantPlayerJobAfterBoard();
      // setTimeout(() => {
      // this.flowMessage = '당신은 테스트입니다.'
      // setTimeout(()=> {
      //   this.flowMessage = '빨리 만드시기 바랍니다.'
      //   setTimeout(()=> {
      // this.morningEvent();
      //   }, 1000)
      // }, 1000)
      // },1000)
      this.socket.emit(GameEvent.Job);
      console.log("직업 분배 소켓");
      this.socket.on(GameEvent.Job, (data) => {
        console.log(data.job);
        // this.myJob = data.
      });

      // setTimeout(() => {
      //   this.socket.emit("grantJob")
      //   this.socket.on('grantJob', (data) => {
      //     console.log(data)
      //     console.log(data2)
      //     this.userSocketInfo = data2
      //     this.myJob = data.jobs.job
      //     console.log(this.myJob)
      //     for(let i = 0 ; i < this.userSocketInfo.length; i++) {
      //       if (this.mySocketId == this.userSocketInfo[i]) {
      //         this.myNum = i+1
      //       }
      //     }
      //     console.log(this.myNum);
      //     for(let i = 0 ; i < this.userSocketInfo.length; i++) {
      //       if (i == this.myNum-1) {
      //         this.myJob = data.jobs[i].job
      //       }
      //     }
      //     console.log(this.myJob);
      //     this.myJob = data.jobs[this.myNum].job
      //     console.log(this.roomJob);
      //     this.flowMessage = '당신은 ' + this.myJob + '입니다'
      //     setTimeout(() => {
      //       if (this.myJob == 'MAFIA') {
      //         this.flowMessage = '시민들에게 들키지 않고 다른 마피아와 힘을 합쳐 시민을 제거하면 됩니다.'
      //       } else if (this.myJob == 'DOCTOR') {
      //         this.flowMessage = '당신은 매일 밤마다 1명의 유저를 선택하여 마피아의 공격으로부터 보호할 수 있습니다. 단, 자신은 보호할 수 없습니다. 다른 시민 유저와 힘을 합쳐 마피아를 찾아내어 제거하여야 합니다.'
      //       } else if (this.myJob == 'POLICE') {
      //         this.flowMessage = '당신은 매일 밤마다 1명의 유저를 선택하여 해당 유저의 직업을 알 수 있습니다. 단, 자신은 선택할 수 없습니다. 다른 시민 유저와 힘을 합쳐 마피아를 찾아내어 제거하여야 합니다.'
      //       } else {
      //         this.flowMessage = '당신은 다른 시민들과 힘을 합쳐 마피아를 찾아내어 제거하여야 합니다.'
      //       }
      setTimeout(() => {
        this.morningEvent();
      }, 3000);
      // },3000)
      // })

      // }, 3000)
    },
    // 아침 이벤트 시작
    // 빌보드에서 아침 메서드 실행
    //
    morningEvent() {
      this.$refs.billboard.morningEventBoard();
      const dayjs = require("dayjs");
      const morningStart = dayjs();
      morningStart.format();
      console.log(morningStart);
      this.socket.emit(GameEvent.Day, {
        day: this.flag,
      });
      this.socket.on(GameEvent.Day, (data) => {
        console.log(data);
        this.flag = data.day;
      });
      this.socket.emit(GameEvent.Timer);
      this.socket.on(GameEvent.Timer, (data) => {
        console.log(data);
        // while(dayjs.format === data.start) {
        //   this.$refs.timer.morningTimer();
        // }
      });
      this.$refs.timer.morningTimer();
      this.$refs.dayCount.nextDay();
      console.log("타이머 실행");
      // 타이머에서 다음 메서드를 실행하게 한다!
    },
    startVote() {
      console.log("투표는 소켓 없음");
      this.$refs.billboard.startVoteBoard();
      setTimeout(() => {
        this.$refs.timer.voteTimer();
        this.electedPlayer = 1;
        this.selectedUser = true;
      }, 3000);

      //여기서 유저 지목 값 받아올 수 있어야 함.
      // this.myVote = 1;
      // console.log(this.myVote);
      // let voteNum = 0;
      // setTimeout(()=> {
      // this.socket.emit(GameEvent.Vote, {
      // voteNum : this.myVote,
      // })
      //   // this.finishVote();

      // this.finishVote();
      // },3000)
      // this.finishVote();
    },

    // 투표값 전송을 위한 메서드로, 집계는 startVote에서 한다.
    // 자신의 투표값
    voteNumCheck() {
      if (this.selectedUser === true) {
        this.electedPlayer = 1;
        this.socket.emit(
          GameEvent.Vote,
          {
            vote: this.electedPlayer,
          },
          this.finishVote()
        );
      }
    },

    finishVote() {
      setTimeout(() => {
        this.socket.on(GameEvent.FinishV, (data) => {
          console.log(data);
          this.PunishmentVote();
        });
      }, 3000);
      this.$refs.billboard.finishVoteBoard();
      // this.socket.on(GameEvent.FinishV, (data) => {
      //   console.log(data)
      // })
      // this.finishPunishmentVote();
      // setTimeout(()=> {
      // //   this.socket.on('finishVote', (data) => {
      // //     console.log(data)
      // //     for(let i = 0; i < data.length; i++) {
      // //       if (data.voteSum[i]>this.electedPlayer) {
      // //         this.electedPlayer = data.voteSum[i]
      // //         this.electedPlayersNum = 0
      // //       } else if (data.voteSum[i] == this.electedPlayer) {
      // //         this.electedPlayer = 0
      // //         this.electedPlayersNum++
      // //       }
      // //     }
      // //     console.log(this.electedPlayer)
      // //   })

      // },3000)
    },
    PunishmentVote() {
      this.$refs.billboard.startPunishmentVoteBoard();
      setTimeout(() => {
        this.$refs.timer.punishmentTimer();
        this.punishmentPlayer = true;
      }, 3000);
      // setTimeout(() => {
      // this.socket.emit(GameEvent.Punish)
      // this.socket.on(GameEvent.FinishP, (data) => {
      //   console.log(data)
      // })
      // this.nightEvent();
      // },3000)
    },

    punishmentVoteCheck() {
      this.socket.emit(
        GameEvent.FinishP,
        {
          punishVote: this.punishmentPlayer,
        },
        this.finishPunishmentVote()
      );
    },

    finishPunishmentVote() {
      setTimeout(() => {
        this.socket.on(GameEvent.FinishP, (data) => {
          console.log(data);
          this.nightEvent();
        });
      }, 3000);
      this.$refs.billboard.finishPunishmentVoteBoard();
    },

    nightEvent() {
      this.socket.emit(GameEvent.Day, {
        day: this.flag,
      });
      this.socket.on(GameEvent.Day, (data) => {
        console.log(data);
        this.flag = data.day;
      });
      this.socket.emit(GameEvent.Timer);
      this.socket.on(GameEvent.Timer, (data) => {
        console.log(data);
      });
      this.$refs.billboard.nightEventBoard();
      setTimeout(() => {
        this.$refs.timer.nightEvent();
        if (this.myJob == "MAFIA") {
          this.socket.emit(GameEvent.Mafia);
        } else if (this.myJob == "DOCTOR") {
          this.socket.emit(GameEvent.Doctor);
        } else if (this.myJob == "POLICE") {
          this.socket.emit(GameEvent.Police);
          this.socket.on(GameEvent.Police, (data) => {
            console.log(data);
          });
        } else {
        }
        this.socket.emit(GameEvent.Punish);
        this.socket.on(GameEvent.FinshP, (data) => {
          console.log(data);
        });
      }, 3000);

      // setTimeout(() => {
      // this.nightResult();
      // },3000)
    },
    nightResult() {
      console.log("3");
      // this.$refs.billboard.finishAllVote();
      this.$refs.billboard.nightResultBoard();
      // this.killPlayer = prompt("마피아가 죽일 유저 선택!");
      // console.log(this.survivePlayer[this.killPlayer]);
      // console.log(this.killPlayer);
      // for (let i = 0; i < 10; i++) {
      //   if (this.playerJob[i] == "의사" && this.survivePlayer[i] == true) {
      //     this.doctorSelected = prompt("의사가 살릴 유저 선택");
      //   }
      // }
      // if (this.survivePlayer[this.killPlayer - 1] == false) {
      //   this.killPlayer = prompt("죽일 유저 다시 선택");
      // } else {
      //   if (
      //     this.doctorSelected == this.killPlayer &&
      //     this.killPlayer != this.survivePlayer[this.killPlayer - 1]
      //   ) {
      //     this.flowMessage =
      //       "마피아가 " +
      //       this.killPlayer +
      //       "를 공격하였으나 의사의 도움으로 플레이어는 생존하였습니다.";
      //     this.electedPlayersNum = 1;
      //     this.electedPlayerVote = 0;
      //     (this.electedPlayer = 0), // 지목된 플레이어
      //       (this.electedPlayerVote = 0), // 지목된 플레이어가 받은 득표
      //       (this.playerVote = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // 각 유저의 투표수
      //     setTimeout(() => {
      //       this.flowMessage = "아침이 되었습니다.";
      //       this.$refs.timer.morningEvent();
      //     }, 5000);
      //   } else {
      //     if (this.playerJob[this.killPlayer - 1] == "마피아") {
      //       this.mafiaNum = this.mafiaNum - 1;
      //     } else {
      //       this.citizenNum = this.citizenNum - 1;
      //     }
      //     console.log("마피아는" + this.mafiaNum);
      //     console.log("시민은" +this.citizenNum);
      //     this.survivePlayer.splce(this.killPlayer - 1, 1, false);
      //     console.log(this.surviePlayer);
      //     this.electedPlayersNum= 1;
      //     this.electedPlayerVote = 0;
      //     (this.electedPlayer = 0), // 지목된 플레이어
      //       (this.electedPlayerVote = 0), // 지목된 플레이어가 받은 득표
      //       (this.playerVote = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // 각 유저의 투표수

      //     if (
      //       this.mafiaNum == 0 ||
      //       this.citizenNum == 0 ||
      //       this.mafiaNum >= this.citizenNum
      //     ) {
      //       this.victorySearch();
      //     } else {
      //       setTimeout(() => {
      //         this.flowMessage = "아침이 되었습니다.";
      //         this.$refs.timer.morningEvent();
      //       }, 5000);
      //       // 낮 이벤트 진행
      //     }
      // }
      setTimeout(() => {
        this.morningEvent();
      }, 3000);
    },
  },
  victorySearch() {
    console.log("test", this.mafiaNum);
    console.log("test", this.citizenNum);
    if (this.mafiaNum == 0) {
      this.citizenWin();
      // 마피아 0명, 시민 승리
    } else if (this.citizenNum == 0 || this.mafiaNum >= this.citizenNum) {
      this.mafiaWin();
      // 시민 팀이 마피아 수보다 같거나 적음, 마피아 승리
    }
  },
  mafiaWin() {
    this.flowMessage =
      "마피아가 남아있는 시민의 수와 같거나 많습니다. 마피아가 승리하였습니다.";
  },
  citizenWin() {
    this.flowMessage = "마피아가 모두 사라졌습니다. 시민 팀이 승리하였습니다.";
  },

  // async asyncData({ params }) {
  //   const roomInfo = await getRoom(params.id);
  //   console.log('roomId : room ',params)
  //   return { roomInfo: roomInfo.data.data };
  // },
};
</script>

<style lang="scss" scoped="scoped">
@import "~assets/game.scss";
</style>
