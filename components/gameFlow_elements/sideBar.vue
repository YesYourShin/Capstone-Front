<template lang="">
  <div>

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
      <!-- <div class="gameSettingBox">
        <exitGame :escapeGame="'/lobby'"></exitGame>
      </div> -->
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
<style lang="scss" scoped>
.gameJobBox{
  width: 300px;
  height: 400px;
  border-top: 5px solid #fbbf24;
  border-bottom: 5px solid #fbbf24;
  border-right: 5px solid #fbbf24;
  background-color: rgba(255, 255, 255, 0.893);

  .jobImage{
    width: 150px;
    height: 150px;
    margin: auto;
    margin-top: 10px;
  }

  .jobName{
    width: 100%;
    background-color: #fbbf24;
    height: 50px;
    line-height: 55px;
    text-align: center;
    font-size: 25px;
    margin-top: 10px;
  }
  .jobSkill{
    margin-top: 10px;
    padding: 0 10px;
  }
  .jobInformation{
    margin-top: 10px;
    padding: 0 10px;
  }
}
</style>
