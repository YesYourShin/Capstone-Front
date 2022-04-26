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
  </div>
</template>

<script>
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import io from "socket.io-client";
export default {
  name: "App",
  components: {},
  head: {
    script: [
      // {
      //   src: "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs",
      //   crossorigin: "anonymous",
      //   body: true,
      // },
      {
        src: "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs/dist/tf.min.js",
        crossorigin: "anonymous",
        body: true,
      },
      // {
      //   src: "https://cdn.jsdelivr.net/npm/@tensorflow-models/blazeface",
      //   crossorigin: "anonymous",
      //   body: true,
      // },
      // {
      //   src: "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
      //   crossorigin: "anonymous",
      //   body: true,
      // },
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
      // {
      //   src: "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js",
      //   crossorigin: "anonymous",
      //   body: true,
      // },
      // {
      //   src: "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
      //   crossorigin: "anonymous",
      //   body: true,
      // },
    ],
  },

  data() {
    return {
      playUsersNum: 10, // 게임 인원 수
      userNum: 1, // 자신의 번호
      fstatus: false, // 손가락 카운트
      cstatus: false, // ox 체크
      vstatus: false, // 엄지로 죽이기
      imgSrc: [],
      img: [],
      imgWidth: [],
      imgHeight: [],
      fingers: false,
      check: false,
      vote: false,
      landmarks: [],
      topLeftLandmarks: [],
      bottomRightLandmarks: [],
      myVideo: false,
      myCanvas: false,
      myCtx: false,
      othersLandmarks: [],
      socket: null,
      testLandmark: {},
      testImage: {},
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
    this.socket = this.$nuxtSocket({
      channel: "/game",
      withCredentials: true,
      transports: ["websocket"],
    });
      // 자기 비디오랑 캔버스
      this.myVideo = document.getElementById(
        `usercam${this.myInfo.profile.id}`
      );
      this.myCanvas = document.getElementsByClassName(
        `output_canvas${this.myInfo.profile.id}`
      )[0];
      this.myCtx = this.myCanvas.getContext("2d");

      await this.handCognition();
      await this.myFace();

    //   // 타인의 스트림만큼 캔버스에 메모 그리기
      // for (let data of this.roomMembers) {
      //   if (data.id != this.myInfo.profile.id) {
      //     await this.faceMemo(data);
      //   }
      // }
    };
    main();
  },
  // 해야할일, 투표
  methods: {
    async handCognition() {
      const videoElement = this.myVideo;
      const canvasElement = this.myCanvas;
      const canvasCtx = this.myCtx;

      videoElement.style.display = "none";

      let onResults = async (results) => {
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
              this.fingersCount(results, canvasElement, canvasCtx, fStatus);
            }
            break;
          case "cStatus":
            if (results.multiHandLandmarks) {
              this.checking(results, canvasElement, canvasCtx, cStatus);
            }
            break;
          case "vStatus":
            if (results.multiHandLandmarks) {
              this.voting(results, canvasElement, canvasCtx, vStatus);
            }
            break;
          default:
            canvasCtx.restore();
        }
      };

      // const model = handPoseDetection.SupportedModels.MediaPipeHands;
      // const detectorConfig = {
      //   runtime: "mediapipe",
      //   solutionPath: "https://cdn.jsdelivr.net/npm/@mediapipe/hands",
      //   modelType: "full",
      // };
      // const detector = await handPoseDetection.createDetector(
      //   model,
      //   detectorConfig
      // );

      // const test = async () => {
      //   canvasCtx.save();
      //   canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      //   // 기준점을 지정한 크기(x,y)만큼 평행이동함
      //   canvasCtx.translate(canvasElement.width, 0);
      //   // scale(x,y)
      //   // x : 수평 방향의 배율. 음수 값은 수직 축에서 픽셀을 뒤집음
      //   // y : 수직 방향의 배율. 음수 값은 가로 축에서 픽셀을 뒤집음
      //   canvasCtx.scale(-1, 1);
      //   canvasCtx.drawImage(
      //     videoElement,
      //     0,
      //     0,
      //     canvasElement.width,
      //     canvasElement.height
      //   );

      //   const hands = await detector.estimateHands(videoElement);
      //   console.log(hands[0]);

      //   canvasCtx.restore();
      // };
      // setInterval(test, 16);

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

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await hands.send({ image: videoElement });
        },
        width: 1280,
        height: 720,
      });

      camera.start();

      // async function handDetection() {
      //   if (!videoElement) {
      //     requestAnimationFrame(handDetection);
      //   } else {
      //     await hands.send({ image: videoElement });
      //     requestAnimationFrame(handDetection);
      //   }
      // }

      // handDetection();
    },
    fingersCount(results, canvasElement, canvasCtx, fStatus) {
      let rightHandLandmarks = {};
      let leftHandLandmarks = {};
      let rightFingersStatus = {
        RIGHT_THUMB: false,
        RIGHT_INDEX_FINGER: false,
        RIGHT_MIDDLE_FINGER: false,
        RIGHT_RING_FINGER: false,
        RIGHT_PINKY: false,
      };
      let leftFingersStatus = {
        LEFT_THUMB: false,
        LEFT_INDEX_FINGER: false,
        LEFT_MIDDLE_FINGER: false,
        LEFT_RING_FINGER: false,
        LEFT_PINKY: false,
      };
      let n = 0;

      // 손을 인식해서 접혔는지 상태를 확인
      for (const landmarks of results.multiHandLandmarks) {
        if (results.multiHandedness) {
          // 오른손
          if (results.multiHandedness[n].label == "Right") {
            rightHandLandmarks = landmarks;
            rightFingersStatus = this.rightHand(
              rightHandLandmarks,
              rightFingersStatus
            );
          }
          // 왼손
          if (results.multiHandedness[n].label == "Left") {
            leftHandLandmarks = landmarks;
            leftFingersStatus = this.leftHand(
              leftHandLandmarks,
              leftFingersStatus
            );
          }
          n += 1;
        }

        // 랜드마크대로 손 그림
        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, landmarks, {
          color: "#FF0000",
          lineWidth: 2,
        });
      }
      canvasCtx.restore();

      const text = this.cognitionErrorCheck(
        rightHandLandmarks,
        rightFingersStatus,
        leftHandLandmarks,
        leftFingersStatus
      );

      if (fStatus) {
        canvasCtx.font = `${canvasElement.width / 12}px gulim`;
        canvasCtx.fillStyle = "rgba(255,255,255,1)";
        canvasCtx.fillText(
          "몇 번을 지목하겠습니까?",
          canvasElement.width / 15,
          canvasElement.height / 8
        );
        canvasCtx.fillText(
          text,
          canvasElement.width / 15,
          (canvasElement.height / 8) * 2
        );
        console.log(text);
      } else {
        console.log("no fingers");
      }
    },
    rightHand(rightHandLandmarks, rightFingersStatus) {
      // 엄지 4번(x)가 새끼손가락 17번(x)보다 왼쪽에 있을 때(손 바닥면)
      if (rightHandLandmarks[4]["x"] < rightHandLandmarks[17]["x"]) {
        // 엄지 4번(x)가 엄지 3번 (x)보다 왼쪽에 있고 엄지 4번 (y)이 검지 6번 (y) 보다 아래에 있을 경우
        if (
          rightHandLandmarks[4]["x"] < rightHandLandmarks[3]["x"] &&
          rightHandLandmarks[4]["y"] > rightHandLandmarks[6]["y"]
        ) {
          rightFingersStatus["RIGHT_THUMB"] = true;
        }
      }

      // 엄지 4번(x)가 새끼손가락 17번(x)보다 오른쪽에 있을 때(손 등면)
      else if (rightHandLandmarks[17]["x"] < rightHandLandmarks[4]["x"]) {
        // 엄지 4번(x)가 엄지 2번(x)보다 오른쪽에 있고 엄지 4번 (y)가 검지 6번(y)보다 위에 있을 경우
        if (
          rightHandLandmarks[4]["x"] > rightHandLandmarks[2]["x"] &&
          rightHandLandmarks[4]["y"] > rightHandLandmarks[6]["y"]
        ) {
          rightFingersStatus["RIGHT_THUMB"] = true;
        }
      }

      // 나머지 손가락 4개의 맨 위(y)가 한 개 아래의 관절(y)보다 높을 경우
      if (rightHandLandmarks[8]["y"] < rightHandLandmarks[6]["y"]) {
        rightFingersStatus["RIGHT_INDEX_FINGER"] = true;
      }
      if (rightHandLandmarks[12]["y"] < rightHandLandmarks[10]["y"]) {
        rightFingersStatus["RIGHT_MIDDLE_FINGER"] = true;
      }
      if (rightHandLandmarks[16]["y"] < rightHandLandmarks[14]["y"]) {
        rightFingersStatus["RIGHT_RING_FINGER"] = true;
      }
      if (rightHandLandmarks[20]["y"] < rightHandLandmarks[18]["y"]) {
        rightFingersStatus["RIGHT_PINKY"] = true;
      }
      return rightFingersStatus;
    },
    leftHand(leftHandLandmarks, leftFingersStatus) {
      // 엄지 4번(x)가 새끼손가락 17번(x)보다 오른쪽에 있을 때(손 바닥면)
      if (leftHandLandmarks[17]["x"] < leftHandLandmarks[4]["x"]) {
        // 엄지 4번(x)가 엄지 3번 (x)보다 오른쪽에 있고 엄지 4번 (y)이 검지 6번 (y) 보다 아래에 있을 경우
        if (
          leftHandLandmarks[4]["x"] > leftHandLandmarks[3]["x"] &&
          leftHandLandmarks[4]["y"] > leftHandLandmarks[6]["y"]
        ) {
          leftFingersStatus["LEFT_THUMB"] = true;
        }
      }

      // 엄지 4번(x)가 새끼손가락 17번(x)보다 왼쪽에 있을 때(손 등면)
      else if (leftHandLandmarks[17]["x"] > leftHandLandmarks[4]["x"]) {
        // 엄지 4번(x)가 엄지 2번(x)보다 왼쪽에 있고 엄지 4번 (y)이 검지 6번 (y) 보다 아래에 있을 경우
        if (
          leftHandLandmarks[4]["x"] < leftHandLandmarks[2]["x"] &&
          leftHandLandmarks[4]["y"] > leftHandLandmarks[6]["y"]
        ) {
          leftFingersStatus["LEFT_THUMB"] = true;
        }
      }

      // 나머지 손가락 4개의 맨 위(y)가 한 개 아래의 관절(y)보다 높을 경우
      if (leftHandLandmarks[8]["y"] < leftHandLandmarks[6]["y"]) {
        leftFingersStatus["LEFT_INDEX_FINGER"] = true;
      }
      if (leftHandLandmarks[12]["y"] < leftHandLandmarks[10]["y"]) {
        leftFingersStatus["LEFT_MIDDLE_FINGER"] = true;
      }
      if (leftHandLandmarks[16]["y"] < leftHandLandmarks[14]["y"]) {
        leftFingersStatus["LEFT_RING_FINGER"] = true;
      }
      if (leftHandLandmarks[20]["y"] < leftHandLandmarks[18]["y"]) {
        leftFingersStatus["LEFT_PINKY"] = true;
      }

      return leftFingersStatus;
    },
    cognitionErrorCheck(
      rightHandLandmarks,
      rightFingersStatus,
      leftHandLandmarks,
      leftFingersStatus
    ) {
      let recognitionError;
      let text = "";
      if (rightHandLandmarks.length > 0) {
        if (
          rightHandLandmarks[0]["y"] < rightHandLandmarks[1]["y"] ||
          (rightHandLandmarks[0]["y"] - rightHandLandmarks[5]["y"]) / 2 >
            rightHandLandmarks[0]["y"] - rightHandLandmarks[17]["y"]
        ) {
          recognitionError = true;
          text = "손을 정확하게 인식시켜주세요.";
        }
      }

      if (leftHandLandmarks.length > 0) {
        if (
          leftHandLandmarks[0]["y"] < leftHandLandmarks[1]["y"] ||
          (leftHandLandmarks[0]["y"] - leftHandLandmarks[5]["y"]) / 2 >
            leftHandLandmarks[0]["y"] - leftHandLandmarks[17]["y"]
        ) {
          recognitionError = true;
          text = "손을 정확하게 인식시켜주세요.";
        }
      }

      if (
        !recognitionError &&
        (rightHandLandmarks.length > 0 || leftHandLandmarks.length > 0)
      ) {
        let rightFingersCount = 0;
        let leftFingersCount = 0;

        for (let fingersStatus of Object.values(rightFingersStatus)) {
          if (fingersStatus == true) {
            rightFingersCount += 1;
          }
        }

        for (let fingers of Object.values(leftFingersStatus)) {
          if (fingers == true) {
            leftFingersCount += 1;
          }
        }

        let totalFingers = rightFingersCount + leftFingersCount;
        if (totalFingers == 0) {
          text = "0번은 없습니다.";
        } else {
          text = totalFingers + "번";
        }
      }

      return text;
    },
    checking(results, canvasElement, canvasCtx, cStatus) {
      let right_hand = {};
      let left_hand = {};
      let text = "";
      let n = 0;
      for (const landmarks of results.multiHandLandmarks) {
        if (results.multiHandedness) {
          if (results.multiHandedness[n].label == "Right") {
            right_hand = landmarks;
          }

          if (results.multiHandedness[n].label == "Left") {
            left_hand = landmarks;
          }
          n += 1;
        }

        drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
          color: "#00FF00",
          lineWidth: 5,
        });
        drawLandmarks(canvasCtx, landmarks, {
          color: "#FF0000",
          lineWidth: 2,
        });
      }
      canvasCtx.restore();
      if (right_hand.length > 0 && left_hand.length > 0) {
        if (
          right_hand[9]["x"] > left_hand[9]["x"] &&
          right_hand[12]["y"] < right_hand[0]["y"] &&
          left_hand[12]["y"] < left_hand[0]["y"] &&
          right_hand[5]["x"] < right_hand[0]["x"] &&
          left_hand[5]["x"] > left_hand[0]["x"]
        ) {
          text = "네";
        } else if (
          right_hand[9]["x"] < left_hand[9]["x"] &&
          right_hand[12]["y"] < right_hand[0]["y"] &&
          left_hand[12]["y"] < left_hand[0]["y"] &&
          right_hand[9]["x"] < right_hand[0]["x"] &&
          left_hand[9]["x"] > left_hand[0]["x"]
        ) {
          text = "아니요";
        } else {
          text = "손을 정확하게 인식시켜주세요.";
        }
      } else if (right_hand.length > 0 || left_hand.length > 0) {
        text = "손을 정확하게 인식시켜주세요.";
      }
      if (cStatus) {
        canvasCtx.font = `${canvasElement.width / 12}px gulim`;
        canvasCtx.fillStyle = "rgba(0,0,0,1)";
        canvasCtx.fillText(
          "n번에게 투표하시겠습니까?",
          canvasElement.width / 15,
          canvasElement.height / 8
        );
        canvasCtx.fillText(
          text,
          canvasElement.width / 15,
          (canvasElement.height / 8) * 2
        );
        console.log(text);
      } else {
        console.log("no check");
      }
    },
    voting(results, canvasElement, canvasCtx, vStatus) {
      let safe = false;
      let kill = false;
      let text = "";
      if (results.multiHandedness[1]) {
        text = "한 손만 인식시켜 주세요.";
      } else {
        for (const landmarks of results.multiHandLandmarks) {
          if (
            landmarks[4]["y"] < landmarks[17]["y"] &&
            landmarks[4]["y"] < landmarks[3]["y"]
          ) {
            kill = true;
          } else if (
            landmarks[4]["y"] > landmarks[17]["y"] &&
            landmarks[4]["y"] > landmarks[3]["y"]
          ) {
            safe = true;
          }

          if (kill == true) {
            text = "찬성";
          } else if (safe == true) {
            text = "반대";
          }
          if (landmarks && kill == false && safe == false) {
            text = "손을 정확하게 인식시켜 주세요.";
          }

          drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
            color: "#00FF00",
            lineWidth: 5,
          });
          drawLandmarks(canvasCtx, landmarks, {
            color: "#FF0000",
            lineWidth: 2,
          });
        }
      }
      canvasCtx.restore();
      if (vStatus) {
        canvasCtx.font = `${canvasElement.width / 12}px gulim`;
        canvasCtx.fillStyle = "rgba(0,0,0,1)";
        canvasCtx.fillText(
          "죽이겠습니까?",
          canvasElement.width / 15,
          canvasElement.height / 8
        );
        canvasCtx.fillText(
          text,
          canvasElement.width / 15,
          (canvasElement.height / 8) * 2
        );
      } else {
        console.log("no vote");
      }
    },
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

        // console.log(landmarks);
        // canvasCtx.save();
        // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        // canvasCtx.translate(canvasElement.width, 0);
        // canvasCtx.scale(-1, 1);

        // canvasCtx.drawImage(
        //   videoElement,
        //   0,
        //   0,
        //   canvasElement.width,
        //   canvasElement.height
        // );

        // if (landmarks.length > 0) {
        //   landmarks[0].landmarks.forEach((landmark) => {
        //     canvasCtx.fillRect(landmark[0], landmark[1], 50, 50);
        //   });
        // }

        await this.postLandmarks(landmarks);
        await this.getLandmarks();

        // canvasCtx.restore();
      };

      videoElement.addEventListener("loadeddata", async () => {
        const blazeface = require("@tensorflow-models/blazeface");
        model = await blazeface.load();
        setInterval(detectFaces, 16);
      });
    },
    postLandmarks(landmarks) {
      const id = this.myInfo.profile.id;
      this.socket.emit("myFaceLandmarks", {
        landmarks: landmarks[0],
        id: id,
      });
    },
    getLandmarks() {
      this.socket.on("othersFaceLandmarks", (data) => {
        console.log(data);
        this.testLandmark[data.id] = data.landmarks;
        console.log(this.testLandmark);
      });
    },
    faceMemo(data) {
      const id = data.id;
      const videoElement = document.getElementById(`usercam${id}`);
      const canvasElement = document.getElementsByClassName(
        `output_canvas${id}`
      )[0];
      const canvasCtx = canvasElement.getContext("2d");

      videoElement.style.display = "none";

      this.testImage[id] = {
        img: null,
        imgSrc: null,
        imgWidth: null,
        imgHeight: null,
      };

      const detectFace = async () => {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(
          videoElement,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );

        // 여기가 문제야?
        const landmarks = this.testLandmark[id];

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
          let imgPoliceHat = img.src.includes("police_hat.png");
          let imgDoctorHat = img.src.includes("doctor_hat.png");
          let imgMilitaryHelmet = img.src.includes("military_helmet.png");
          let imgMafiaHat = img.src.includes("mafia_hat.png");

          if (
            imgCitizenHat ||
            imgPoliceHat ||
            imgDoctorHat ||
            imgMafiaHat ||
            imgMilitaryHelmet
          ) {
            const canvasWidth = bottomRightx - topLeftx;
            const canvasHeight = bottomRighty - topLefty;
            const canvasx = topLeftx;
            const canvasy = topLefty - canvasHeight;

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
    fingersResults() {
      if (!this.fingers) this.fStatus = true;
      else {
        this.fStatus = false;
      }
    },
    checkResults() {
      if (!this.check) this.cStatus = true;
      else {
        this.cStatus = false;
      }
    },
    voteResults() {
      if (!this.vote) this.vStatus = true;
      else {
        this.vStatus = false;
      }
    },
    memoJob(job, id) {
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
            imgSrc: require("../assets/image/police_hat.png"),
            imgWidth: 600,
            imgHeight: 451,
          };
          break;
        case "doctor":
          this.testImage[id] = {
            imgSrc: require("../assets/image/doctor_hat.png"),
            imgWidth: 1000,
            imgHeight: 630,
          };
          break;
        case "mafia":
          this.testImage[id] = {
            imgSrc: require("../assets/image/mafia_hat.png"),
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
