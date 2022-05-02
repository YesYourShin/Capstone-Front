import { rightHand, leftHand, cognitionErrorCheck } from ".";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
export const fingersCount = (results, canvasElement, canvasCtx, fStatus) => {
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
        rightFingersStatus = rightHand(rightHandLandmarks, rightFingersStatus);
      }
      // 왼손
      if (results.multiHandedness[n].label == "Left") {
        leftHandLandmarks = landmarks;
        leftFingersStatus = leftHand(leftHandLandmarks, leftFingersStatus);
      }
      n++;
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

  const { text, totalFingers } = cognitionErrorCheck(
    rightHandLandmarks,
    rightFingersStatus,
    leftHandLandmarks,
    leftFingersStatus
  );
  //   this.totalFingers = totalFingers;

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
    // console.log(text);
  } else {
    console.log("no fingers");
  }
  console.log(totalFingers);
  return totalFingers;
};
