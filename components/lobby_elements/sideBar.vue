<template lang="">
  <div>
    <input type="checkbox" id="menuIcon" />
    <label for="menuIcon"> <span></span><span></span><span></span> </label>
    <div class="sideBar">
      <div class="nullBox">
      </div>
      <div class="gameJobViewer">
        <div v-show="createMafiaDiv" class="gameJobBox" >
          <div class="jobImage">
            <img src="@/assets/sidebar/mafia.svg">
          </div>
          <div class="jobName">마피아</div>
          <div class="jobInformation">특수능력 : 매일 밤마다 한 명의 유저를 죽일 수 있습니다. 마피아가 2명 이상일 경우에는, 모든 마피아가 같은 유저를 지목하여야 됩니다.</div>
        </div>
        <div v-show="createPoliceDiv" class="gameJobBox">
          <div class="jobImage">
            <img src="@/assets/sidebar/police.svg">
          </div>
          <div class="jobName">경찰</div>
          <div class="jobInformation">특수능력 : 매일 밤마다 한 명의 유저를 지목하여 유저의 직업을 알 수 있습니다.</div>
        </div>
        <div v-show="createDoctorDiv" class="gameJobBox">
          <div class="jobImage">
            <img src="@/assets/sidebar/doctor.svg">
          </div>
          <div class="jobName">의사</div>
          <div class="jobInformation">특수능력 : 매일 밤마다 한 명의 유저를 지목하여 마피아의 공격으로부터 보호할 수 있습니다.</div>
        </div>
        <div v-show="createCitizenDiv" class="gameJobBox">
          <div class="jobImage">
            <img src="@/assets/sidebar/citizen.svg">
          </div>
          <div class="jobName">시민</div>
          <div class="jobInformation">시민과 힘을 합쳐 마피아를 찾아내어야 합니다.</div>
        </div>
      </div>
      <div class="gameSettingBox">
        <button>이 게임에서 나가기</button>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: "SideBar",
  data() {
    return {
      createMafiaDiv : false,
      createPoliceDiv : false,
      createDoctorDiv : false,
      createCitizenDiv : false
    }

  },
  methods: {
    myJobMafia() {
      this.createMafiaDiv = true;
    },
    myJobPolice() {
      this.createPoliceDiv = true;
    },
    myJobDoctor() {
      this.createDoctorDiv = true;
    },
    myJobCitizen() {
      this.createCitizenDiv = true;
    }
  }

};
</script>
<style lang="css" scoped>
input[id="menuIcon"] {
  display: none;
}
input[id="menuIcon"] + label {
  display: block;
  width: 60px;
  height: 50px;
  position: fixed;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
input[id="menuIcon"] + label span {
  display: block;
  position: absolute;
  width: 100%;
  height: 5px;
  border-radius: 30px;
  background: #fff;
  transition: all 0.35s;
}
input[id="menuIcon"] + label span:nth-child(1) {
  top: 0;
}
input[id="menuIcon"] + label span:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}
input[id="menuIcon"] + label span:nth-child(3) {
  bottom: 0;
}
input[id="menuIcon"]:checked + label {
  z-index: 9999;
}
input[id="menuIcon"]:checked + label span {
  background: #000;
}
input[id="menuIcon"]:checked + label span:nth-child(1) {
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}
input[id="menuIcon"]:checked + label span:nth-child(2) {
  opacity: 0;
}
input[id="menuIcon"]:checked + label span:nth-child(3) {
  bottom: 50%;
  transform: translateY(50%) rotate(-45deg);
}

div[class="sideBar"] {
  width: 300px;
  height: 100%;
  background: #222;
  position: fixed;
  top: 0;
  right: -300px;
  z-index: 9998;
  transition: all 0.35s;
}
input[id="menuIcon"]:checked + label + div {
  right: 0;
}
div[class="nullBox"] {
  display:flex;
  align-items:center;
  height:100px;
  background:red;
}
div[class="gameJobViewer"] {
  display:flex;
  align-items:center;
  height:600px;
  background:green;
}
div[class="gameJobBox"] {
  display:inline-block;
  background:blue;
  color:#fff;
}
div[class="gameSettingBox"] {
  display:flex;
  align-items:center;
  background:blue;
  flex-direction: column;
}
</style>
