<template>
  <div class="canvasmemo">
    <div :class="['canvasmemo' + index]" v-for="index in 10" :key="index">
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
      userNum: 3,
      imgWidth: [],
      imgHeight: [],
      imgSrc: [],
      // videoElement: "",
      canvasElement: "",
      canvasCtx: "",
      test: 123,
      imgSrc: [],
      img: ["", "", "", "", "", "", "", "", "", ""],
      imgWidth: [],
      imgHeight: [],
    };
  },

  mounted() {
    // this.videoElement = document.getElementsByClassName("usercam1")[0];
    // this.canvasElement = document.getElementsByClassName("output_canvas1")[0];
    // this.canvasCtx = this.canvasElement.getContext("2d");
    // this.videoElement.style.display = "none";
    for (let i = 0; i < 10; i++) {
      const myFace = document.getElementById(`usercam${i + 1}`);
      this.canvasElement = document.getElementsByClassName(
        `output_canvas${i + 1}`
      )[0];
      this.canvasCtx = this.canvasElement.getContext("2d");
      const canvasElement = this.canvasElement;
      const canvasCtx = this.canvasCtx;
      myFace.style.display = "none";

      let myStream;

      async function getMedia() {
        try {
          myStream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true,
          });

          myFace.srcObject = myStream;
        } catch (e) {
          console.log(e);
        }
      }

      let onResults = (results) => {
        // console.log(results);
        // console.log(i);

        // let img = new Image();
        // img.src = require("../assets/image/mafia_hat.png");
        // let imgWidth = 20;
        // let imgHeight = 20;

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
                const canvasWidth = canvasElement.width / 2;
                const canvasHeight = canvasElement.height / 2;
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
            } else if (img.src.includes("police_hat.png")) {
              if (
                (rightHeady > leftHeady
                  ? rightHeady - leftHeady
                  : leftHeady - rightHeady) >
                leftHeadx - rightHeadx
              ) {
                const canvasWidth = canvasElement.width / 2;
                const canvasHeight = canvasElement.height / 2;
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
            } else if (img.src.includes("doctor_hat.png")) {
              if (
                (rightHeady > leftHeady
                  ? rightHeady - leftHeady
                  : leftHeady - rightHeady) >
                leftHeadx - rightHeadx
              ) {
                const canvasWidth = canvasElement.width / 2;
                const canvasHeight = canvasElement.height / 2;
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
            } else if (img.src.includes("military_helmet.png")) {
              if (
                (rightHeady > leftHeady
                  ? rightHeady - leftHeady
                  : leftHeady - rightHeady) >
                leftHeadx - rightHeadx
              ) {
                const canvasWidth = canvasElement.width / 2;
                const canvasHeight = canvasElement.height / 2;
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
        }
        canvasCtx.restore();
      };

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

      const camera = new Camera(myFace, {
        onFrame: async () => {
          await faceMesh.send({ image: myFace });
        },
        width: 640,
        height: 480,
      });
      camera.start();
    }
  },
  // 해야할일, 투표
  methods: {
    // onResults(results) {
    //   for (let i = 1; i <= 10; i++) {
    //     const canvasElement = document.getElementsByClassName(
    //       "output_canvas" + i
    //     )[0];
    //     const canvasCtx = canvasElement.getContext("2d");
    //   }
    //   let img = new Image();
    //   img.src = this.imgSrc || "";
    //   let imgWidth = this.imgWidth;
    //   let imgHeight = this.imgHeight;
    //   canvasCtx.save();
    //   canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    //   // 기준점을 지정한 크기(x,y)만큼 평행이동함
    //   canvasCtx.translate(canvasElement.width, 0);
    //   // scale(x,y)
    //   // x : 수평 방향의 배율. 음수 값은 수직 축에서 픽셀을 뒤집음
    //   // y : 수직 방향의 배율. 음수 값은 가로 축에서 픽셀을 뒤집음
    //   canvasCtx.scale(-1, 1);
    //   canvasCtx.drawImage(
    //     results.image,
    //     0,
    //     0,
    //     canvasElement.width,
    //     canvasElement.height
    //   );
    //   if (results.multiFaceLandmarks.length == 0) {
    //     const canvasWidth = canvasElement.width / 2;
    //     const canvasHeight = canvasElement.height / 2;
    //     const canvasx = canvasElement.width / 2 - canvasWidth / 2;
    //     const canvasy = 0;
    //     // console.log(canvasy);
    //     img.onload = canvasCtx.drawImage(
    //       img,
    //       canvasx,
    //       canvasy,
    //       canvasWidth,
    //       canvasHeight
    //     );
    //     canvasCtx.restore();
    //   } else if (results.multiFaceLandmarks) {
    //     for (const landmarks of results.multiFaceLandmarks) {
    //       drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {
    //         color: "#C0C0C070",
    //         lineWidth: 1,
    //       });
    //       drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {
    //         color: "#FF3030",
    //       });
    //       drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {
    //         color: "#FF3030",
    //       });
    //       drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {
    //         color: "#FF3030",
    //       });
    //       drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {
    //         color: "#30FF30",
    //       });
    //       drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {
    //         color: "#30FF30",
    //       });
    //       drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {
    //         color: "#30FF30",
    //       });
    //       drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {
    //         color: "#E0E0E0",
    //       });
    //       drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {
    //         color: "#E0E0E0",
    //       });
    //       let leftHeadx = 0;
    //       let leftHeady = 0;
    //       let rightHeadx = 0;
    //       let rightHeady = 0;
    //       for (let i = 0; i < landmarks.length; i++) {
    //         for (let j = i; j == i; j++) {
    //           // 오른쪽 머리
    //           if (i == 162) {
    //             rightHeadx = landmarks[i].x * canvasElement.width;
    //             rightHeady = landmarks[i].y * canvasElement.height;
    //           }
    //           // 왼쪽 머리
    //           if (i == 389) {
    //             leftHeadx = landmarks[i].x * canvasElement.width;
    //             leftHeady = landmarks[i].y * canvasElement.height;
    //           }
    //         }
    //       }
    //       if (img.src.includes("mafia_hat.png")) {
    //         if (
    //           (rightHeady > leftHeady
    //             ? rightHeady - leftHeady
    //             : leftHeady - rightHeady) >
    //           leftHeadx - rightHeadx
    //         ) {
    //           const canvasWidth = canvasElement.width / 2;
    //           const canvasHeight = canvasElement.height / 2;
    //           const canvasx = canvasElement.width / 2 - canvasWidth / 2;
    //           const canvasy = 0;
    //           img.onload = canvasCtx.drawImage(
    //             img,
    //             canvasx,
    //             canvasy,
    //             canvasWidth,
    //             canvasHeight
    //           );
    //         } else {
    //           // canvas x y는 화면상의 이미지 위치
    //           // canvas Width Height는 이미지의 크기
    //           const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
    //           const canvasWidth = (leftHeadx - rightHeadx) * 2;
    //           const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
    //           const canvasy =
    //             rightHeady > leftHeady
    //               ? rightHeady - canvasHeight - (rightHeady - leftHeady) / 2
    //               : rightHeady - canvasHeight + (leftHeady - rightHeady) / 2;
    //           img.onload = canvasCtx.drawImage(
    //             img,
    //             canvasx,
    //             canvasy,
    //             canvasWidth,
    //             canvasHeight
    //           );
    //         }
    //       } else if (img.src.includes("police_hat.png")) {
    //         if (
    //           (rightHeady > leftHeady
    //             ? rightHeady - leftHeady
    //             : leftHeady - rightHeady) >
    //           leftHeadx - rightHeadx
    //         ) {
    //           const canvasWidth = canvasElement.width / 2;
    //           const canvasHeight = canvasElement.height / 2;
    //           const canvasx = canvasElement.width / 2 - canvasWidth / 2;
    //           const canvasy = 0;
    //           img.onload = canvasCtx.drawImage(
    //             img,
    //             canvasx,
    //             canvasy,
    //             canvasWidth,
    //             canvasHeight
    //           );
    //         } else {
    //           // canvas x y는 화면상의 이미지 위치
    //           // canvas Width Height는 이미지의 크기
    //           const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
    //           const canvasWidth = (leftHeadx - rightHeadx) * 2;
    //           const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
    //           const canvasy =
    //             rightHeady > leftHeady
    //               ? rightHeady - canvasHeight - (rightHeady - leftHeady) / 2
    //               : rightHeady - canvasHeight + (leftHeady - rightHeady) / 2;
    //           img.onload = canvasCtx.drawImage(
    //             img,
    //             canvasx,
    //             canvasy,
    //             canvasWidth,
    //             canvasHeight
    //           );
    //         }
    //       } else if (img.src.includes("doctor_hat.png")) {
    //         if (
    //           (rightHeady > leftHeady
    //             ? rightHeady - leftHeady
    //             : leftHeady - rightHeady) >
    //           leftHeadx - rightHeadx
    //         ) {
    //           const canvasWidth = canvasElement.width / 2;
    //           const canvasHeight = canvasElement.height / 2;
    //           const canvasx = canvasElement.width / 2 - canvasWidth / 2;
    //           const canvasy = 0;
    //           img.onload = canvasCtx.drawImage(
    //             img,
    //             canvasx,
    //             canvasy,
    //             canvasWidth,
    //             canvasHeight
    //           );
    //         } else {
    //           // canvas x y는 화면상의 이미지 위치
    //           // canvas Width Height는 이미지의 크기
    //           const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
    //           const canvasWidth = (leftHeadx - rightHeadx) * 2;
    //           const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
    //           const canvasy =
    //             rightHeady > leftHeady
    //               ? rightHeady - canvasHeight - (rightHeady - leftHeady) / 2
    //               : rightHeady - canvasHeight + (leftHeady - rightHeady) / 2;
    //           img.onload = canvasCtx.drawImage(
    //             img,
    //             canvasx,
    //             canvasy,
    //             canvasWidth,
    //             canvasHeight
    //           );
    //         }
    //       } else if (img.src.includes("military_helmet.png")) {
    //         if (
    //           (rightHeady > leftHeady
    //             ? rightHeady - leftHeady
    //             : leftHeady - rightHeady) >
    //           leftHeadx - rightHeadx
    //         ) {
    //           const canvasWidth = canvasElement.width / 2;
    //           const canvasHeight = canvasElement.height / 2;
    //           const canvasx = canvasElement.width / 2 - canvasWidth / 2;
    //           const canvasy = 0;
    //           img.onload = canvasCtx.drawImage(
    //             img,
    //             canvasx,
    //             canvasy,
    //             canvasWidth,
    //             canvasHeight
    //           );
    //         } else {
    //           // canvas x y는 화면상의 이미지 위치
    //           // canvas Width Height는 이미지의 크기
    //           const canvasx = rightHeadx - (leftHeadx - rightHeadx) / 2;
    //           const canvasWidth = (leftHeadx - rightHeadx) * 2;
    //           const canvasHeight = (imgHeight / imgWidth) * canvasWidth;
    //           // const canvasy = (rightHeady > leftHeady ? rightHeady-canvasHeight-(rightHeady - leftHeady) / 2 : rightHeady-canvasHeight+(leftHeady - rightHeady) / 2)
    //           const canvasy =
    //             rightHeady > leftHeady
    //               ? rightHeady -
    //                 (canvasHeight / 2 + canvasHeight / 5) -
    //                 (rightHeady - leftHeady) / 2
    //               : leftHeady -
    //                 (canvasHeight / 2 + canvasHeight / 5) -
    //                 (leftHeady - rightHeady) / 2;
    //           img.onload = canvasCtx.drawImage(
    //             img,
    //             canvasx,
    //             canvasy,
    //             canvasWidth,
    //             canvasHeight
    //           );
    //         }
    //       }
    //     }
    //     canvasCtx.restore();
    //   }
    // },
    memoJob(job, index) {
      // let img = new Image();
      // img.src = "";
      // let imgWidth = 0;
      // let imgHeight = 0;
      if (job == "citizen") {
        this.imgSrc[index - 1] = "";
        this.imgWidth[index - 1] = 0;
        this.imgHeight[index - 1] = 0;
      } else if (job == "police") {
        this.imgSrc[index - 1] = require("../assets/image/police_hat.png");
        this.imgWidth[index - 1] = 600;
        this.imgHeight[index - 1] = 451;
        console.log(this.imgSrc[index]);
      } else if (job == "doctor") {
        this.imgSrc[index - 1] = require("../assets/image/doctor_hat.png");
        this.imgWidth[index - 1] = 1000;
        this.imgHeight[index - 1] = 630;
      } else if (job == "soldier") {
        this.imgSrc[index - 1] = require("../assets/image/military_helmet.png");
        this.imgWidth[index - 1] = 246;
        this.imgHeight[index - 1] = 250;
      } else if (job == "mafia") {
        this.imgSrc[index - 1] = require("../assets/image/mafia_hat.png");
        this.imgWidth[index - 1] = 1125;
        this.imgHeight[index - 1] = 701;
      } else if (job == "none") {
        this.imgSrc[index - 1] = "";
        this.imgWidth[index - 1] = 0;
        this.imgHeight[index - 1] = 0;
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
.canvasmemo1 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 30px;
  left: 230px;
  top: 293px;
  background-color: red;
}
.canvasmemo2 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 30px;
  left: 610px;
  top: 293px;
  background-color: red;
}
.canvasmemo3 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 30px;
  left: 990px;
  top: 293px;
  background-color: red;
}
.canvasmemo4 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 30px;
  left: 1370px;
  top: 293px;
  background-color: red;
}
.canvasmemo5 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 30px;
  left: 230px;
  top: 560px;
  background-color: red;
}
.canvasmemo6 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 30px;
  left: 1370px;
  top: 560px;
  background-color: red;
}
.canvasmemo7 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 30px;
  left: 230px;
  top: 796px;
  background-color: red;
}
.canvasmemo8 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 30px;
  left: 610px;
  top: 796px;
  background-color: red;
}
.canvasmemo9 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 30px;
  left: 990px;
  top: 796px;
  background-color: red;
}
.canvasmemo10 {
  position: absolute;
  overflow: visible;
  width: 320px;
  height: 30px;
  left: 1370px;
  top: 796px;
  background-color: red;
}
</style>
