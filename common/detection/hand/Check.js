import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
export const check = (results, canvasElement, canvasCtx, cStatus) => {
  let right_hand = {};
  let left_hand = {};
  let text = "";
  let n = 0;
  let checkResult = null;
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
      checkResult = true;
      text = "네";
    } else if (
      right_hand[9]["x"] < left_hand[9]["x"] &&
      right_hand[12]["y"] < right_hand[0]["y"] &&
      left_hand[12]["y"] < left_hand[0]["y"] &&
      right_hand[9]["x"] < right_hand[0]["x"] &&
      left_hand[9]["x"] > left_hand[0]["x"]
    ) {
      checkResult = false;
      text = "아니요";
    } else {
      checkResult = null;
      text = "손을 정확하게 인식시켜주세요.";
    }
  } else {
    checkResult = null;
    text = "손을 정확하게 인식시켜주세요.";
  }
  if (cStatus) {
    canvasCtx.font = `${canvasElement.width / 12}px gulim`;
    canvasCtx.fillStyle = "rgba(0,0,0,1)";
    canvasCtx.fillText(
      checkResult +"번에게 투표하시겠습니까?",
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
    console.log("no check");
  }
  return checkResult;
};
