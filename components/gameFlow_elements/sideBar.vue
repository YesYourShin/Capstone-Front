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
          <div class="jobSkill">특수능력 : 매일 밤마다 특정 유저 1명을 지목하여 죽일 수 있습니다. 마피아가 2명일 경우, 2명 모두 같은 유저를 지목하여야 됩니다.</div>
          <div class="jobInformation">시민과 힘을 합쳐 마피아를 찾아내어야 합니다.</div>
        </div>
        <div v-show="createPoliceDiv" class="gameJobBox">
          <div class="jobImage">
            <img src="@/assets/sidebar/police.svg">
          </div>
          <div class="jobName">경찰</div>
          <div class="jobSkill">특수능력 : 매일 밤마다 특정 유저 1명을 지목하여 그 유저의 직업을 알 수 있습니다.</div>
          <div class="jobInformation">시민과 힘을 합쳐 마피아를 찾아내어야 합니다.</div>
        </div>
        <div v-show="createDoctorDiv" class="gameJobBox">
          <div class="jobImage">
            <img src="@/assets/sidebar/doctor.svg">
          </div>
          <div class="jobName">의사</div>
          <div class="jobSkill">특수능력 : 매일 밤마다 특정 유저 1명을 지목하여 마피아의 공격으로부터 보호할 수 있습니다.</div>
          <div class="jobInformation">시민과 힘을 합쳐 마피아를 찾아내어야 합니다.</div>
        </div>
        <div v-show="createCitizenDiv" class="gameJobBox">
          <div class="jobImage">
            <img src="@/assets/sidebar/citizen.svg">
          </div>
          <div class="jobName">시민</div>
          <div class="jobSkill">특수능력 : 없음</div>
          <div class="jobInformation">의사, 경찰과 힘을 합쳐 마피아를 찾아내어야 합니다.</div>
        </div>
      </div>
      <div class="gameSettingBox">
        <exitGame :escapeGame="'/lobby'"></exitGame>
      </div>
    </div>
  </div>
</template>
<script>
import exitGame from "@/components/gameFlow_elements/exitGame.vue";
import { GameEvent } from "@/api/mafiaAPI";

export default {
  name: "SideBar",
  components: {
    exitGame
  },
  computed: {
    myInfo() {
      return this.$store.getters["user/getMyInfo"];
    },
    roomMembers() {
      return this.$store.state.stream.roomMembers;
    },
    surviveMembers() {
      return this.$store.state.stream.surviveMembers;
    },
  },
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
    },

    // exit() {
    //   var unpublish = { request: "unpublish" };
    //   var leave = { request: "leave" };
    //   let vrc = this;
    //   this.$root.roomSocket.emit(GameEvent.LEAVE);
    //   this.storePlugin.send({
    //     message: unpublish,
    //     success: function () {
    //       vrc.$store.commit("stream/removeAllSubscribers");
    //       vrc.$store.commit("stream/destroyRoomMembers");
    //     },
    //     error: function (error) {
    //       console.log("unpublish failed:", error);
    //     },
    //   });
    //   this.storePlugin.send({
    //     message: leave,
    //     success: function () {
    //       vrc.janus.destroy();
    //     },
    //     error: function (error) {
    //       console.log("leave failed:", error);
    //     },
    //   });
    //   if (this.speechEvents) {
    //     this.speechEvents.stop();
    //     this.speechEvents = null;
    //   }
    // },
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
  background: black;
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
  background: #fff;
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
  background:#171717;
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
  background:#171717;
}
div[class="gameJobViewer"] {
  display:flex;
  height:600px;
  width:90%;
  margin: 0 auto;
  background:#171717;
  justify-content: center;
  align-items: center;
}
div[class="gameJobBox"] {
  display:inline-block;
  border: 2px solid #fbbf24;
  background:#171717;
  color:#fff;
}

div[class="jobName"] {
  background: #fbbf24;
  text-align: center;
  font-size: 24pt;
  color: #000;
}

div[class="jobInformation"] {
  font-size: 16pt;
  text-align: center;
  margin: 10px 0 10px 0;
    background:#171717;
}

div[class="jobSkill"] {
  font-size: 16pt;
  text-align: center;
  margin: 10px 0 10px 0;
  background:#171717;
}

div[class="gameSettingBox"] {
  display:flex;
  align-items:center;
  background:#171717;
  flex-direction: column;
  height:300px;
  margin: 0 auto;
}
</style>
