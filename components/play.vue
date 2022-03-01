<template>
  <div class="flex flex-col min-h-screen w-full">
    <!-- <Billboard blilboard-vote="vote-result"/> -->
    <Billboard />
    <div class="videobox">
      <video :class="['usercam' + index]" v-for="index in 8" :key="index">
        {{ index }}
      </video>
      <video class="usercam9 input_video"></video>
      <canvas class="output_canvas" width="240px" height="180px"></canvas>
      <video class="usercam10 input_video2"></video>
      <div class="canvasmemo">
        <!-- <input
          :id="['button' + index]"
          v-for="index in 6"
          type="button"
          :key="index"
        /> -->
        <input
          type="button"
          id="button1"
          v-on:click="memoJob('citizen')"
          value="시민"
        />
        <input
          type="button"
          id="button2"
          v-on:click="memoJob('police')"
          value="경찰"
        />
        <input
          type="button"
          id="button3"
          v-on:click="memoJob('doctor')"
          value="의사"
        />
        <input
          type="button"
          id="button4"
          v-on:click="memoJob('soldier')"
          value="군인"
        />
        <input
          type="button"
          id="button5"
          v-on:click="memoJob('mafia')"
          value="마피아"
        />
        <input
          type="button"
          id="button6"
          v-on:click="memoJob('none')"
          value="메모삭제"
        />
      </div>
      <div :class="['userInfo' + index]" v-for="index in 6" :key="index">
        {{
          "level : " +
          userLevel[index - 1] +
          "   " +
          userName[index - 1] +
          survivePlayer[index - 1]
        }}
      </div>
    </div>
    <div class="settingbox">
      <!-- <div class="sound_setting">사운드 설정</div> -->
      <div class="settingCamAndMic">
        <img :src="require(`../assets/ingame/muteMic.png`)" />
        <img :src="require(`../assets/ingame/offCam.png`)" />
      </div>

      <!-- <div class="cam_setting">카메라 설정</div> -->
    </div>

    <div class="timebox">
      <Timer
        v-on:timeoutVote="finishVote"
        v-on:timeoutPunishmentVote="finishPunishmentVote"
        v-on:nightEvent="nightEvent"
        ref="timer"
      ></Timer>
    </div>
    <div class="home bg-purple-400 w-full"></div>
    <SideBar />
  </div>
</template>

<script>
import Timer from "@/components/Timer.vue";
import Billboard from "@/components/gameFlow_elements/billboard.vue";
// import StartAndRule from "@/components/gameFlow/startAndRule.vue";
import SideBar from "@/components/lobby_elements/sideBar.vue";
export default {
  name: "App",
  components: {
    Timer,
    Billboard,
    SideBar,
  },
  head: {
    script: [
      {
        src: "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
        crossorigin: "anonymous",
        body: true,
      },
      {
        src: "https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js",
        crossorigin: "anonymous",
        body: true,
      },
      {
        src: "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
        crossorigin: "anonymous",
        body: true,
      },
      {
        src: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js",
        crossorigin: "anonymous",
        body: true,
      },
      {
        src: "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
        crossorigin: "anonymous",
        body: true,
      },
      // {
      //   type: "text/javascript",
      //   src: "filter.js",
      //   body: true,
      // },
      // {
      //   type: "text/javascript",
      //   src: "hands.js",
      //   body: true,
      // },
    ],
  },

  data() {
    return {
      flowMessage: "투v",
      playerVote: [0, 0, 0, 0, 0, 0],
      playerJob: ["시민", "시민", "시민", "시민", "시민", "마피아"],
      survivePlayer: ["", "", "", "", "", ""],
      userLevel: [108, 17, 9, 666, 722, 15],
      userName: [
        "전국마피아신",
        "사실저마피아",
        "발가락이용자",
        "시민원챔",
        "머래너나잘해",
        "정치하면던짐",
      ],
      electedPlayersNum: 1,
      electedPlayers: 0,
      electedPlayerVote: 0,
      punishmentPlayer: 0,
      punishmentPros: 0,
      punishmentCons: 0,
      killUser: "",
      userNum: 3,
      imgWidth: 0,
      imgHeight: 0,
      imgSrc: "",
      videoElement: "",
      canvasElement: "",
      canvasCtx: "",
    };
  },

  mounted() {
    this.videoElement = document.getElementsByClassName("input_video")[0];
    this.canvasElement = document.getElementsByClassName("output_canvas")[0];
    this.canvasCtx = this.canvasElement.getContext("2d");
    this.videoElement.style.display = "none";

    const faceMesh = new FaceMesh({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
      },
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    faceMesh.onResults(this.onResults);

    const camera = new Camera(this.videoElement, {
      onFrame: async () => {
        await faceMesh.send({ image: this.videoElement });
      },
      width: 640,
      height: 480,
    });
    camera.start();
  },
  // 해야할일, 투표
  methods: {
    onResults(results) {
      let canvasElement = this.canvasElement;
      let canvasCtx = this.canvasCtx;
      let img = new Image();
      img.src = this.imgSrc;
      let imgWidth = this.imgWidth;
      let imgHeight = this.imgHeight;
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      // 기준점을 지정한 크기(x,y)만큼 평행이동함
      canvasCtx.translate(canvasElement.width, 0);
      // scale(x,y)
      // x : 수평 방향의 배율. 음수 값은 수직 축에서 픽셀을 뒤집음
      // y : 수직 방향의 배율. 음수 값은 가로 축에서 픽셀을 뒤집음
      canvasCtx.scale(-1, 1);
      canvasCtx.drawImage(
        results.image,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      if (results.multiFaceLandmarks.length == 0) {
        const canvasWidth = 400;
        const canvasHeight = 249;
        const canvasx = canvasElement.width / 2 - canvasWidth / 2;
        const canvasy = canvasElement.height / 2 - canvasHeight / 2;

        // console.log(canvasx)
        img.onload = canvasCtx.drawImage(
          img,
          canvasx,
          canvasy,
          canvasWidth,
          canvasHeight
        );

        canvasCtx.restore();
      } else if (results.multiFaceLandmarks) {
        for (const landmarks of results.multiFaceLandmarks) {
          drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
            color: "#C0C0C070",
            lineWidth: 1,
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {
            color: "#FF3030",
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {
            color: "#FF3030",
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {
            color: "#FF3030",
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {
            color: "#30FF30",
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {
            color: "#30FF30",
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {
            color: "#30FF30",
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {
            color: "#E0E0E0",
          });
          drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {
            color: "#E0E0E0",
          });

          let leftHeadx = 0;
          let leftHeady = 0;
          let rightHeadx = 0;
          let rightHeady = 0;
          for (let i = 0; i < landmarks.length; i++) {
            for (let j = i; j == i; j++) {
              // 오른쪽 머리
              if (i == 162) {
                rightHeadx = landmarks[i].x * canvasElement.width;
                rightHeady = landmarks[i].y * canvasElement.height;
              }
              // 왼쪽 머리
              if (i == 389) {
                leftHeadx = landmarks[i].x * canvasElement.width;
                leftHeady = landmarks[i].y * canvasElement.height;
              }
            }
          }

          if (img.src.includes("mafia_hat.png")) {
            if (
              (rightHeady > leftHeady
                ? rightHeady - leftHeady
                : leftHeady - rightHeady) >
              leftHeadx - rightHeadx
            ) {
              const canvasWidth = 400;
              const canvasHeight = 249;
              const canvasx = canvasElement.width / 2 - canvasWidth / 2;
              const canvasy = canvasElement.height / 2 - canvasHeight / 2;

              img.onload = canvasCtx.drawImage(
                img,
                canvasx,
                canvasy,
                canvasWidth,
                canvasHeight
              );
            } else {
              // canvas x y는 화면상의 이미지 위치
              // canvas Width Height는 이미지의 크기
              const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
              const canvasWidth = (leftHeadx - rightHeadx) * 2;
              const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
              const canvasy =
                rightHeady > leftHeady
                  ? rightHeady - canvasHeight - (rightHeady - leftHeady) / 2
                  : rightHeady - canvasHeight + (leftHeady - rightHeady) / 2;

              img.onload = canvasCtx.drawImage(
                img,
                canvasx,
                canvasy,
                canvasWidth,
                canvasHeight
              );
            }
          } else if (img.src.includes("police_hat.png")) {
            if (
              (rightHeady > leftHeady
                ? rightHeady - leftHeady
                : leftHeady - rightHeady) >
              leftHeadx - rightHeadx
            ) {
              const canvasWidth = 400;
              const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
              const canvasx = canvasElement.width / 2 - canvasWidth / 2;
              const canvasy = canvasElement.height / 2 - canvasHeight / 2;

              img.onload = canvasCtx.drawImage(
                img,
                canvasx,
                canvasy,
                canvasWidth,
                canvasHeight
              );
            } else {
              // canvas x y는 화면상의 이미지 위치
              // canvas Width Height는 이미지의 크기
              const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
              const canvasWidth = (leftHeadx - rightHeadx) * 2;
              const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
              const canvasy =
                rightHeady > leftHeady
                  ? rightHeady - canvasHeight - (rightHeady - leftHeady) / 2
                  : rightHeady - canvasHeight + (leftHeady - rightHeady) / 2;

              img.onload = canvasCtx.drawImage(
                img,
                canvasx,
                canvasy,
                canvasWidth,
                canvasHeight
              );
            }
          } else if (img.src.includes("doctor_hat.png")) {
            if (
              (rightHeady > leftHeady
                ? rightHeady - leftHeady
                : leftHeady - rightHeady) >
              leftHeadx - rightHeadx
            ) {
              const canvasWidth = 400;
              const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
              const canvasx = canvasElement.width / 2 - canvasWidth / 2;
              const canvasy = canvasElement.height / 2 - canvasHeight / 2;

              img.onload = canvasCtx.drawImage(
                img,
                canvasx,
                canvasy,
                canvasWidth,
                canvasHeight
              );
            } else {
              // canvas x y는 화면상의 이미지 위치
              // canvas Width Height는 이미지의 크기
              const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
              const canvasWidth = (leftHeadx - rightHeadx) * 2;
              const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
              const canvasy =
                rightHeady > leftHeady
                  ? rightHeady - canvasHeight - (rightHeady - leftHeady) / 2
                  : rightHeady - canvasHeight + (leftHeady - rightHeady) / 2;

              img.onload = canvasCtx.drawImage(
                img,
                canvasx,
                canvasy,
                canvasWidth,
                canvasHeight
              );
            }
          } else if (img.src.includes("military_helmet.png")) {
            if (
              (rightHeady > leftHeady
                ? rightHeady - leftHeady
                : leftHeady - rightHeady) >
              leftHeadx - rightHeadx
            ) {
              const canvasWidth = 400;
              const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
              const canvasx = canvasElement.width / 2 - canvasWidth / 2;
              const canvasy = canvasElement.height / 2 - canvasHeight / 2;

              img.onload = canvasCtx.drawImage(
                img,
                canvasx,
                canvasy,
                canvasWidth,
                canvasHeight
              );
            } else {
              // canvas x y는 화면상의 이미지 위치
              // canvas Width Height는 이미지의 크기
              const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
              const canvasWidth = (leftHeadx - rightHeadx) * 2;
              const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
              // const canvasy = (rightHeady > leftHeady ? rightHeady-canvasHeight-(rightHeady - leftHeady) / 2 : rightHeady-canvasHeight+(leftHeady - rightHeady) / 2)
              const canvasy =
                rightHeady > leftHeady
                  ? rightHeady -
                    (canvasHeight / 2 + canvasHeight / 5) -
                    (rightHeady - leftHeady) / 2
                  : leftHeady -
                    (canvasHeight / 2 + canvasHeight / 5) -
                    (leftHeady - rightHeady) / 2;

              img.onload = canvasCtx.drawImage(
                img,
                canvasx,
                canvasy,
                canvasWidth,
                canvasHeight
              );
            }
          }
        }
        canvasCtx.restore();
      }
    },
    memoJob(job) {
      // let img = new Image();
      // img.src = "";
      // let imgWidth = 0;
      // let imgHeight = 0;
      if (job == "citizen") {
        this.imgSrc = "";
        this.imgWidth = 0;
        this.imgHeight = 0;
      } else if (job == "police") {
        this.imgSrc = require("../assets/image/police_hat.png");
        this.imgWidth = 600;
        this.imgHeight = 451;
      } else if (job == "doctor") {
        this.imgSrc = require("../assets/image/doctor_hat.png");
        this.imgWidth = 1000;
        this.imgHeight = 630;
      } else if (job == "soldier") {
        this.imgSrc = require("../assets/image/military_helmet.png");
        this.imgWidth = 246;
        this.imgHeight = 250;
      } else if (job == "mafia") {
        this.imgSrc = require("../assets/image/mafia_hat.png");
        this.imgWidth = 1125;
        this.imgHeight = 701;
      } else if (job == "none") {
        this.imgSrc = "";
        this.imgWidth = 0;
        this.imgHeight = 0;
      }
    },
    finishVote() {
      for (var i = 0; i < this.playerVote.length; i++) {
        this.playerVote[i] = Math.floor(Math.random() * 10);
        if (this.electedPlayerVote == this.playerVote[i]) {
          this.electedPlayersNum = this.electedPlayersNum + 1;
        }
        if (this.electedPlayerVote < this.playerVote[i]) {
          this.electedPlayerVote = this.playerVote[i];
          this.electedPlayers = i;
          this.electedPlayersNum = 1;
        }
      }

      if (this.electedPlayersNum != 1) {
        this.flowMessage = "투표종료. 중복 혹은 무효처리";
        this.electedPlayers = null;
        // 밤 & 능력사용 이벤트 (타이머로 이동하여)
        // this.$refs.timer.nightEvent()
        setTimeout(this.$refs.timer.nightEvent(), 3000);
      } else {
        this.flowMessage = "투표완료. 집행대상자 선정 완료";
        console.log(this.$refs.timer);
        setTimeout(this.$refs.timer.startPunishmentVote(), 3000);
        // this.$refs.timer.startPunishmentVote()

        // 찬반투표 이벤트. (타이머로 이동하여 )
      }
    },
    gameStart() {
      this.flowMessage = "마피아 게임을 시작합니다";
      // 3초 딜레이 넣고 바로 grantJob() 넣기
    },
    grantJob() {
      this.flowMessage = "직업을 선정하였습니다. 당신은 마피아입니다!";
      // 3초 딜레이 넣고 설명 더 넣고, morningEvent() 실행하기
      //
    },
    finishPunishmentVote() {
      alert("사형 찬반투표 종료");
      this.punishmentPros = Math.floor(Math.random() * 5);
      this.punishmentCons = Math.floor(Math.random() * 5);
      console.log(this.punishmentPros, this.punishmentCons);
      if (this.punishmentPros > this.punishmentCons) {
        this.flowMessage = this.electedPlayers + 1 + " 를 사형합니다.";
        // this.killUser = document.getElementsByClassName("usercam1")
        // this.killUser.style.backgroundColor = "#ffffff";
        // 플레이어 제거 후 밤 & 능력사용 이벤트 진행
        this.$refs.timer.nightEvent();
      } else {
        this.flowMessage = "투표가 부결되어 사형하지 않습니다.";
        // 능력사용 이벤트 진행
        this.$refs.timer.nightEvent();
      }
    },
    nightEvent() {
      alert("능력 사용 종료");
      this.flowMessage = "능력 사용이 끝났습니다.";
      this.userKill = Math.floor(Math.random() * 4);
      console.log(this.userKill);
      this.$refs.timer.morningEvent();
      this.morningEvent();
      // 낮 이벤트 진행
    },
    morningEvent() {
      this.flowMessage = "아침이 되었습니다.";
      this.$refs.timer.startVote();
      // 지목 유저 삭제 이벤트 발생
      // this.flowMessage = 'X번 플레이어가 사망하였습니다.'
      //
    },
    startVotee() {
      this.flowMessage = "마피아로 의심되는 유저를 지목합니다";
      //Timer.vue의 startVote가 실행되게끔 한다.
    },
  },
};
</script>

<style lang="scss" scoped>
.output_canvas {
  position: absolute;
  overflow: visible;
  width: 240px;
  height: 180px;
  left: 990px;
  top: 617px;
}
.canvasmemo {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 30px;
  left: 990px;
  top: 796px;
  background-color: red;
}
// .usercam9 {
//   position: absolute;
//   overflow: visible;
//   width: 320px;
//   height: 180px;
//   left: 990px;
//   top: 617px;
//   background-color: #ff00ff;
// }

.messagebox {
  position: absolute;
  overflow: visible;
  width: 580px;
  height: 250px;
  left: 670px;
  top: 315px;
  background-color: #b1b11a;
}
.userInfo1 {
  position: absolute;
  overflow: visible;
  width: 320px;
  // min-width: 320px;
  // width: 16vw; height는 계산 좀 해야됨..
  height: 30px;
  left: 230px;
  top: 263px;
  background-color: #ffffff;
}

.usercam1 {
  position: absolute;
  overflow: visible;
  width: 320px;
  // min-width: 320px;
  // width: 16vw; height는 계산 좀 해야됨..
  height: 180px;
  left: 230px;
  top: 83px;
  background-color: #ff00ff;
}
.userInfo2 {
  position: absolute;
  overflow: visible;
  width: 320px;
  // min-width: 320px;
  // width: 16vw; height는 계산 좀 해야됨..
  height: 30px;
  left: 610px;
  top: 263px;
  background-color: #ffffff;
}

.usercam2 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 180px;
  left: 610px;
  top: 83px;
  background-color: #ff00ff;
}
.userInfo3 {
  position: absolute;
  overflow: visible;
  width: 320px;
  // min-width: 320px;
  // width: 16vw; height는 계산 좀 해야됨..
  height: 30px;
  left: 990px;
  top: 263px;
  background-color: #ffffff;
}
.usercam3 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 180px;
  left: 990px;
  top: 83px;
  background-color: #ff00ff;
}
.userInfo4 {
  position: absolute;
  overflow: visible;
  width: 320px;
  // min-width: 320px;
  // width: 16vw; height는 계산 좀 해야됨..
  height: 30px;
  left: 1370px;
  top: 263px;
  background-color: #ffffff;
}
.usercam4 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 180px;
  left: 1370px;
  top: 83px;
  background-color: #ff00ff;
}
.userInfo5 {
  position: absolute;
  overflow: visible;
  width: 320px;
  // min-width: 320px;
  // width: 16vw; height는 계산 좀 해야됨..
  height: 30px;
  left: 230px;
  top: 530px;
  background-color: #ffffff;
}
.usercam5 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 180px;
  left: 230px;
  top: 350px;
  background-color: #ff00ff;
}
.userInfo6 {
  position: absolute;
  overflow: visible;
  width: 320px;
  // min-width: 320px;
  // width: 16vw; height는 계산 좀 해야됨..
  height: 30px;
  left: 1370px;
  top: 530px;
  background-color: #ffffff;
}
.usercam6 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 180px;
  left: 1370px;
  top: 350px;
  background-color: #ff00ff;
}
.usercam7 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 180px;
  left: 230px;
  top: 617px;
  background-color: #ff00ff;
}
.usercam8 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 180px;
  left: 610px;
  top: 617px;
  background-color: #ff00ff;
}
.usercam9 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 180px;
  left: 990px;
  top: 617px;
  background-color: #ff00ff;
}
.usercam10 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 180px;
  left: 1370px;
  top: 617px;
  background-color: #ff00ff;
}
.settingbox {
  position: absolute;
  overflow: visible;

  width: 400px;
  height: 50px;
  left: 780px;
  top: 850px;
  background-color: #ff0000;
}
.settingCamAndMic {
  float: left;
}
.timebox {
  position: absolute;
  overflow: visible;
  width: 200px;
  height: 50px;
  left: 1200px;
  top: 850px;
  background-color: #ff00ff;
}
</style>
