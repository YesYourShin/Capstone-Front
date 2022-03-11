<template>
  <div class="canvasmemo">
    <div :class="['canvasmemo' + index]" v-for="index in 10" :key="index">
      {{ index }}
      <input
        type="button"
        id="button1"
        v-on:click="memoJob('citizen', index)"
        value="시민"
      />
      <input
        type="button"
        id="button2"
        v-on:click="memoJob('police', index)"
        value="경찰"
      />
      <input
        type="button"
        id="button3"
        v-on:click="memoJob('doctor', index)"
        value="의사"
      />
      <input
        type="button"
        id="button4"
        v-on:click="memoJob('soldier', index)"
        value="군인"
      />
      <input
        type="button"
        id="button5"
        v-on:click="memoJob('mafia', index)"
        value="마피아"
      />
      <input
        type="button"
        id="button6"
        v-on:click="memoJob('none', index)"
        value="메모삭제"
      />
    </div>
    <div>
      {{ "내 번호:" + userNum }}
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
export default {
  name: "App",
  components: {},
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
    ],
  },

  data() {
    return {
      userNum: 7,
      imgWidth: [],
      imgHeight: [],
      imgSrc: [],
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
    };
  },

  mounted() {
    for (let i = 0; i < 10; i++) {
      if (i == this.userNum - 1) {
        this.handCognition(i);
      } else {
        this.faceMemo(i);
      }
    }
  },
  // 해야할일, 투표
  methods: {
    handCognition(i) {
      const videoElement = document.getElementById(`usercam${i + 1}`);
      const canvasElement = document.getElementsByClassName(
        `output_canvas${i + 1}`
      )[0];
      const canvasCtx = canvasElement.getContext("2d");

      videoElement.style.display = "none";
      let onResults = (results) => {
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

        if (fStatus) {
          if (results.multiHandLandmarks) {
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
            let text = "";
            let n = 0;
            for (const landmarks of results.multiHandLandmarks) {
              if (results.multiHandedness) {
                // 오른손
                if (results.multiHandedness[n].label == "Right") {
                  rightHandLandmarks = landmarks;

                  // 엄지 4번(x)가 새끼손가락 17번(x)보다 왼쪽에 있을 때(손 바닥면)
                  if (
                    rightHandLandmarks[4]["x"] < rightHandLandmarks[17]["x"]
                  ) {
                    // 엄지 4번(x)가 엄지 3번 (x)보다 왼쪽에 있고 엄지 4번 (y)이 검지 6번 (y) 보다 아래에 있을 경우
                    if (
                      rightHandLandmarks[4]["x"] < rightHandLandmarks[3]["x"] &&
                      rightHandLandmarks[4]["y"] > rightHandLandmarks[6]["y"]
                    ) {
                      rightFingersStatus["RIGHT_THUMB"] = true;
                    }
                  }

                  // 엄지 4번(x)가 새끼손가락 17번(x)보다 오른쪽에 있을 때(손 등면)
                  else if (
                    rightHandLandmarks[17]["x"] < rightHandLandmarks[4]["x"]
                  ) {
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
                  if (
                    rightHandLandmarks[12]["y"] < rightHandLandmarks[10]["y"]
                  ) {
                    rightFingersStatus["RIGHT_MIDDLE_FINGER"] = true;
                  }
                  if (
                    rightHandLandmarks[16]["y"] < rightHandLandmarks[14]["y"]
                  ) {
                    rightFingersStatus["RIGHT_RING_FINGER"] = true;
                  }
                  if (
                    rightHandLandmarks[20]["y"] < rightHandLandmarks[18]["y"]
                  ) {
                    rightFingersStatus["RIGHT_PINKY"] = true;
                  }
                }
                // 왼손
                if (results.multiHandedness[n].label == "Left") {
                  leftHandLandmarks = landmarks;

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
                  else if (
                    leftHandLandmarks[17]["x"] > leftHandLandmarks[4]["x"]
                  ) {
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
            let recognitionError;

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
          }
        } else if (cStatus) {
          console.log(cStatus);
          if (results.multiHandLandmarks) {
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
          }
        } else if (vStatus) {
          if (results.multiHandLandmarks) {
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
          }
        } else {
          canvasCtx.restore();
        }
      };

      let myStream;

      async function getMedia() {
        try {
          myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width: 1280, height: 720 },
          });

          videoElement.srcObject = myStream;
        } catch (e) {
          console.log(e);
        }
      }

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

      getMedia();

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await hands.send({ image: videoElement });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
    },
    faceMemo(i) {
      const videoElement = document.getElementById(`usercam${i + 1}`);
      const canvasElement = document.getElementsByClassName(
        `output_canvas${i + 1}`
      )[0];
      const canvasCtx = canvasElement.getContext("2d");

      videoElement.style.display = "none";

      let onResults = (results) => {
        this.img[i] = new Image();
        if (this.imgSrc[i]) this.img[i].src = this.imgSrc[i];
        let img = this.img[i];
        let imgWidth = this.imgWidth[i];
        let imgHeight = this.imgHeight[i];
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.translate(canvasElement.width, 0);
        canvasCtx.scale(-1, 1);
        canvasCtx.drawImage(
          results.image,
          0,
          0,
          canvasElement.width,
          canvasElement.height
        );

        if (results.multiFaceLandmarks.length == 0) {
          // canvas x y는 화면상의 이미지 위치
          // canvas Width Height는 이미지의 크기
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
        }

        if (results.multiFaceLandmarks) {
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

            let imgCitizenHat = "";
            let imgPoliceHat = img.src.includes("police_hat.png");
            let imgDoctorHat = img.src.includes("doctor_hat.png");
            let imgMilitaryHelmet = img.src.includes("military_helmet.png");
            let imgMafiaHat = img.src.includes("mafia_hat.png");

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

            if (imgCitizenHat || imgPoliceHat || imgDoctorHat || imgMafiaHat) {
              if (
                (rightHeady > leftHeady
                  ? rightHeady - leftHeady
                  : leftHeady - rightHeady) >
                leftHeadx - rightHeadx
              ) {
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
            } else if (imgMilitaryHelmet) {
              if (
                (rightHeady > leftHeady
                  ? rightHeady - leftHeady
                  : leftHeady - rightHeady) >
                leftHeadx - rightHeadx
              ) {
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
                // canvas x y는 화면상의 이미지 위치
                // canvas Width Height는 이미지의 크기
                const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
                const canvasWidth = (leftHeadx - rightHeadx) * 2;
                const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
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
        }
        canvasCtx.restore();
      };

      let myStream;

      async function getMedia() {
        try {
          myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: { width: 1280, height: 720 },
            // video: true,
          });
          videoElement.srcObject = myStream;
        } catch (e) {
          console.log(e);
        }
      }

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
      faceMesh.onResults(onResults);

      getMedia();

      const camera = new Camera(videoElement, {
        onFrame: async () => {
          await faceMesh.send({ image: videoElement });
        },
        width: 1280,
        height: 720,
      });
      camera.start();
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
    memoJob(job, index) {
      switch (job) {
        case "citizen":
          this.imgSrc[index - 1] = "";
          this.imgWidth[index - 1] = 0;
          this.imgHeight[index - 1] = 0;
          break;
        case "police":
          this.imgSrc[index - 1] = require("../assets/image/police_hat.png");
          this.imgWidth[index - 1] = 600;
          this.imgHeight[index - 1] = 451;
          break;
        case "doctor":
          this.imgSrc[index - 1] = require("../assets/image/doctor_hat.png");
          this.imgWidth[index - 1] = 1000;
          this.imgHeight[index - 1] = 630;
          break;
        case "soldier":
          this.imgSrc[
            index - 1
          ] = require("../assets/image/military_helmet.png");
          this.imgWidth[index - 1] = 246;
          this.imgHeight[index - 1] = 250;
          break;
        case "mafia":
          this.imgSrc[index - 1] = require("../assets/image/mafia_hat.png");
          this.imgWidth[index - 1] = 1125;
          this.imgHeight[index - 1] = 701;
          break;
        case "none":
          this.imgSrc[index - 1] = "";
          this.imgWidth[index - 1] = 0;
          this.imgHeight[index - 1] = 0;
          break;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// .canvasmemo {
//   position: absolute;
//   overflow: visible;
//   width: 320px;
//   height: 30px;
//   left: 990px;
//   top: 796px;
//   background-color: red;
// }
// .canvasmemo1 {
//   position: absolute;
//   overflow: visible;
//   width: 320px;
//   height: 30px;
//   left: 230px;
//   top: 293px;
//   background-color: red;
// }
// .canvasmemo2 {
//   position: absolute;
//   overflow: visible;
//   width: 320px;
//   height: 30px;
//   left: 610px;
//   top: 293px;
//   background-color: red;
// }
// .canvasmemo3 {
//   position: absolute;
//   overflow: visible;
//   width: 320px;
//   height: 30px;
//   left: 990px;
//   top: 293px;
//   background-color: red;
// }
// .canvasmemo4 {
//   position: absolute;
//   overflow: visible;
//   width: 320px;
//   height: 30px;
//   left: 1370px;
//   top: 293px;
//   background-color: red;
// }
// .canvasmemo5 {
//   position: absolute;
//   overflow: visible;
//   width: 320px;
//   height: 30px;
//   left: 230px;
//   top: 560px;
//   background-color: red;
// }
// .canvasmemo6 {
//   position: absolute;
//   overflow: visible;
//   width: 320px;
//   height: 30px;
//   left: 1370px;
//   top: 560px;
//   background-color: red;
// }
// .canvasmemo7 {
//   position: absolute;
//   overflow: visible;
//   width: 320px;
//   height: 30px;
//   left: 230px;
//   top: 796px;
//   background-color: red;
// }
// .canvasmemo8 {
//   position: absolute;
//   overflow: visible;
//   width: 320px;
//   height: 30px;
//   left: 610px;
//   top: 796px;
//   background-color: red;
// }
// .canvasmemo9 {
//   position: absolute;
//   overflow: visible;
//   width: 320px;
//   height: 30px;
//   left: 990px;
//   top: 796px;
//   background-color: red;
// }
// .canvasmemo10 {
//   position: absolute;
//   overflow: visible;
//   width: 320px;
//   height: 30px;
//   left: 1370px;
//   top: 796px;
//   background-color: red;
// }
</style>
