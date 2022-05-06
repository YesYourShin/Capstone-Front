import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";

import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";

export const punishment = (results, canvasElement, canvasCtx, pStatus) => {
  let safe = false;
  let kill = false;
  let text = "";
  let punishmentResult = null;
  if (results.multiHandedness[1]) {
    text = "한 손만 인식시켜 주세요.";
  } else if (results.multiHandedness.length == 0) {
    punishmentResult = null;
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
      // kill이 true일 경우 투표 결과도 true,
      // safe가 true일 경우 투표 결과는 false
      // 둘 다 false일 경우 투표 결과는 null
      if (kill == true) {
        punishmentResult = true;
        text = "찬성";
      } else if (safe == true) {
        punishmentResult = false;
        text = "반대";
      }
      if (landmarks && kill == false && safe == false) {
        punishmentResult = null;
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
  if (pStatus) {
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
  return punishmentResult;
};
