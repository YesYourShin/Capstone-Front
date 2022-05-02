export const rightHand = (rightHandLandmarks, rightFingersStatus) => {
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
};
