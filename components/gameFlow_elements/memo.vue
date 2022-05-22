<template>
  <div class="canvasmemo">
    <div
      :class="['canvasmemo' + index.id]"
      v-for="index of this.roomMembers"
      :key="index.id"
    >
      {{ index.id }}
      <input
        type="button"
        id="button1"
        v-on:click="memoJob('citizen', index.id)"
        value="시민"
      />
      <input
        type="button"
        id="button2"
        v-on:click="memoJob('police', index.id)"
        value="경찰"
      />
      <input
        type="button"
        id="button3"
        v-on:click="memoJob('doctor', index.id)"
        value="의사"
      />
      <input
        type="button"
        id="button5"
        v-on:click="memoJob('mafia', index.id)"
        value="마피아"
      />
      <input
        type="button"
        id="button6"
        v-on:click="memoJob('none', index.id)"
        value="메모삭제"
      />
    </div>
    <div>
      <!-- <button v-on:click="cameraSwitch(true)">camera on</button> -->
      <button v-on:click="mediaStatus = true">camera on</button>
      <button v-on:click="mediaStatus = false">camera off</button>
    </div>
  </div>
</template>

<script>
// import io from "socket.io-client";
import * as tf from "@tensorflow/tfjs";
export default {
  name: "App",
  components: {},
  data() {
    return {
      playUsersNum: 10, // 게임 인원 수
      userNum: 1, // 자신의 번호
      imgSrc: [],
      img: [],
      imgWidth: [],
      imgHeight: [],
      landmarks: [],
      topLeftLandmarks: [],
      bottomRightLandmarks: [],
      // myVideo: false,
      // myCanvas: false,
      // myCtx: false,
      othersLandmarks: [],
      socket: null,
      testLandmark: {},
      testImage: {},
      camera: null,
      faceDetection: null,
      mediaStatus: true,
      btStatus: null,
    };
  },
  create() {},
  computed: {
    myInfo() {
      return this.$store.getters["user/getMyInfo"];
    },
    roomMembers() {
      return this.$store.state.stream.roomMembers;
    },
  },
  mounted() {
    // ! 원하는 기능
    // ! 해당 유저의 비디오에서 우클릭 하여
    // ! 메모를 동작하게 한다.
    // ! 메모를 동작시킬 때는 미디어스트림을 켜야 한다.
    // ! 현재 투표에서 미디어스트림이 스위치가 되는데
    // ! 지금 userVideo.vue의 코드에서 미디어스트림은 항상 on을 해도 괜찮은가?
    // ! 렉이 우려되기에 테스트가 필요할 듯 ...
    /*
      해야할 것
      1. 손 인식 -> 얼굴 인식 -> 나머지 영상 순으로 하나 끝나면 하나 켜지게 할 것
        한 번에 여러 개가 동시에 켜지니 에러가 발생하는 듯? 근데 이렇게 어떻게 하지
      2. 나머지 영상은 스트림으로 받아서 영상이 켜지게 할 것
        지금은 자기 스트림으로 자기 카메라가 켜지게 되어 있음
        받은 스트림을 video 태그랑 어떻게 연결함?
        -> 스트림 받아서 video 태그랑 연결
      3. 메모로 쓰이는 모자 이미지의 캔버스 크기 지정?
       -> ?
      4. gameroom에서 replace하면 hand 동작 안 함 이유? 544줄
       -> cdn이었던걸 npm으로 설치해서 해결


      문제점?
      1. 마스크를 쓰면 인식률이 엄청 낮아짐
        인식이 안 되는 건 아닌데 마스크 위로 인식되다보니 범위가 이상하게 잡힘
        -> 게임 플레이 시에는 마스크를 쓰지 말 것
      2. 얼굴이 여러개 인식 됨
        하나만 인식되게 지정할 수 없어서 여러 얼굴이 인식됨
        -> 처음 인식된 얼굴만 그리게 해서 해결
      3. mediapipe 얼굴인식을 사용하니 게임에서 렉?이 발생함

      주의사항
      1. [크롬 - 설정 - 시스템 - 가능한 경우 하드웨어 가속 사용] 할 것
        안 그러면 카메라 렉에 느려터짐

      모르겠다
      1. async await 할 때 꼭 return 해야 되나

      현재
      1. 게임 입장시 맨 처음 video 태그가 자신의 카메라
      2. 두 번째 video 태그부터 타인의 카메라
      3. 게임 입장하면 자신의 카메라에서 얼굴 랜드마크를 소켓서버로 보내서 전체 인원한테 뿌려줌(현재 자신 포함으로 뿌리고 있고 카메라 번호를 주는 방식으로 2번으로 고정해놔서 고쳐야 됨)
      4. 게임 카메라 번호가 아니라 스트림 id로 하려했는데 자신의 스트림은 vuex에 아이디가 없어서 번호로 하는 게 나을 듯?
      5. 묘하게 캔버스가 느린 느낌?
      6. 가끔 캔버스가 잠시 안 나오는데 이건 모르겠다
        -> Remote track flowing again: 이라 뜸 Janus 문제?
      7. {video 태그 순서}랑 {얼굴 랜드마크 소켓서버로 보낼 때 같이 보낼 유저 정보의 종류}
    */

    const main = async () => {
      // 소켓 연결
      // this.socket = io("http://localhost:3065/game", {
      //   transports: ["websocket"],
      // });
      // 자기 비디오랑 캔버스
      this.myVideo = document.getElementById(`remote${this.myInfo.profile.id}`);
      this.myCanvas = document.getElementsByClassName(
        `output_canvas${this.myInfo.profile.id}`
      )[0];
      this.myCtx = this.myCanvas.getContext("2d");

      // await this.handCognition();
      await this.myFace();

      // 타인의 스트림만큼 캔버스에 메모 그리기
      // for (let data of this.roomMembers) {
      //   if (data.id != this.myInfo.profile.id) {
      //     await this.faceMemo(data);
      //   }
      // }
    };
    // main();
  },
  // 해야할일, 투표
  methods: {
    myFace() {
      const videoElement = this.myVideo;
      const canvasElement = this.myCanvas;
      const canvasCtx = this.myCtx;

      // videoElement.style.display = "none";
      let model;

      const detectFaces = async () => {
        /*
    `predictions` is an array of objects describing each detected face, for example:

    [
      {
        topLeft: [232.28, 145.26],
        bottomRight: [449.75, 308.36],
        probability: [0.998],
        landmarks: [
          [295.13, 177.64], // right eye
          [382.32, 175.56], // left eye
          [341.18, 205.03], // nose
          [345.12, 250.61], // mouth
          [252.76, 211.37], // right ear
          [431.20, 204.93] // left ear
        ]
      }
    ]
    */
        let landmarks = await model.estimateFaces(videoElement, false);

        // 자신의 얼굴 랜드마크 확인
        // console.log(landmarks);
        canvasCtx.save();
        // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        // canvasCtx.translate(canvasElement.width, 0);
        // canvasCtx.scale(-1, 1);

        canvasCtx.fillRect(10, 10, 50, 50);

        // canvasCtx.drawImage(
        //   videoElement,
        //   0,
        //   0,
        //   canvasElement.width,
        //   canvasElement.height
        // );

        // if (landmarks.length) {
        //   landmarks[0].landmarks.forEach((landmark) => {
        //     canvasCtx.fillRect(landmark[0], landmark[1], 50, 50);
        //   });
        // }

        await this.postLandmarks(landmarks);
        await this.getLandmarks();

        canvasCtx.restore();
      };

      videoElement.addEventListener("loadeddata", async () => {
        const blazeface = require("@tensorflow-models/blazeface");
        model = await blazeface.load();
        setInterval(detectFaces, 30);
      });
    },
    postLandmarks(landmarks) {
      const id = this.myInfo.profile.id;
      this.$root.gameSocket.emit("myFaceLandmarks", {
        landmarks: landmarks[0],
        id: id,
      });
    },
    getLandmarks() {
      this.$root.gameSocket.on("othersFaceLandmarks", (data) => {
        this.testLandmark[data.id] = data.landmarks;
      });
    },
    faceMemo(data) {
      const id = data.id;
      const videoElement = document.getElementById(`remote${id}`);
      const canvasElement = document.getElementsByClassName(
        `output_canvas${id}`
      )[0];
      const canvasCtx = canvasElement.getContext("2d");

      // videoElement.style.display = "none";

      this.testImage[id] = {
        img: null,
        imgSrc: null,
        imgWidth: null,
        imgHeight: null,
      };

      const detectFace = async () => {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        // canvasCtx.drawImage(
        //   videoElement,
        //   0,
        //   0,
        //   canvasElement.width,
        //   canvasElement.height
        // );

        // 여기가 문제야?
        const landmarks = this.testLandmark[id];
        // console.log(landmarks);
        // 랜드마크로 얼굴 그리기
        if (landmarks)
          this.testLandmark[id].landmarks.forEach((landmark) => {
            canvasCtx.fillRect(landmark[0], landmark[1], 10, 10);
          });

        // 이미지;
        this.testImage[id].img = new Image();
        if (this.testImage[id].imgSrc != null)
          this.testImage[id].img.src = this.testImage[id].imgSrc;

        let img = this.testImage[id].img;
        let imgWidth = this.testImage[id].imgWidth;
        let imgHeight = this.testImage[id].imgHeight;

        if (!landmarks) {
          const canvasWidth = canvasElement.width / 2;
          const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
          const canvasx = canvasElement.width / 2 - canvasWidth / 2;
          const canvasy = 0;
          img.onload = canvasCtx.drawImage(
            img,
            canvasx,
            canvasy,
            canvasWidth,
            canvasHeight
          );
        } else {
          let bottomRightx = landmarks.bottomRight[0];
          let bottomRighty = landmarks.bottomRight[1];
          let topLeftx = landmarks.topLeft[0];
          let topLefty = landmarks.topLeft[1];

          let imgCitizenHat = "";
          let imgPoliceHat = img.src.includes("police_hat");
          let imgDoctorHat = img.src.includes("doctor_hat");
          let imgMafiaHat = img.src.includes("mafia_hat");

          console.log("landmark else");
          console.log(img.src);
          console.log(imgPoliceHat);
          console.log(imgDoctorHat);
          console.log(imgMafiaHat);

          if (imgCitizenHat || imgPoliceHat || imgDoctorHat || imgMafiaHat) {
            const canvasWidth = bottomRightx - topLeftx;
            const canvasHeight = bottomRighty - topLefty;
            const canvasx = topLeftx;
            const canvasy = topLefty - canvasHeight;
            console.log("landmark else > if");
            img.onload = canvasCtx.drawImage(
              img,
              canvasx,
              canvasy,
              canvasWidth,
              canvasHeight
            );
          }
        }

        canvasCtx.restore();
      };
      setInterval(detectFace, 16);
    },

    memoJob(job, id) {
      // console.log(job);
      switch (job) {
        case "citizen":
          this.testImage[id] = {
            imgSrc: "",
            imgWidth: 0,
            imgHeight: 0,
          };
          break;
        case "police":
          this.testImage[id] = {
            imgSrc: require("@/assets/memo/police_hat.png"),
            imgWidth: 600,
            imgHeight: 451,
          };
          break;
        case "doctor":
          this.testImage[id] = {
            imgSrc: require("@/assets/memo/doctor_hat.png"),
            imgWidth: 1000,
            imgHeight: 630,
          };
          break;
        case "mafia":
          this.testImage[id] = {
            imgSrc: require("@/assets/memo/mafia_hat.png"),
            imgWidth: 1125,
            imgHeight: 701,
          };
          break;
        case "none":
          this.testImage[id] = {
            imgSrc: "",
            imgWidth: 0,
            imgHeight: 0,
          };
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped="scoped">
@import "~assets/userVideo.scss";
</style>
