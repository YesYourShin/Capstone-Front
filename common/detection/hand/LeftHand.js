export const leftHand = (leftHandLandmarks, leftFingersStatus) => {
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
};
