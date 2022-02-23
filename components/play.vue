<template>
<div class="flex flex-col min-h-screen w-full">
<!-- <Billboard blilboard-vote="vote-result"/> -->
<Billboard />
  <div class="videobox" >
    <video :class="['usercam'+ index]" v-for="index in 10" :key="index">{{ index }}</video>
  </div>
  <div class="settingbox">
    <div class="sound_setting">사운드 설정</div>
    <div class="cam_setting">카메라 설정</div>
  </div>
  <div class="timebox">
    <Timer v-on:timeoutVote="finishVote" v-on:timeoutPunishmentVote="finishPunishmentVote"></Timer>
  </div>
  <div class="home bg-purple-400 w-full">
  </div>
  <SideBar/>
</div>
</template>

<script>
import Timer from '@/components/Timer.vue';
import Billboard from '@/components/gameFlow_elements/billboard.vue';
// import StartAndRule from "@/components/gameFlow/startAndRule.vue";
import SideBar from "@/components/lobby_elements/sideBar.vue";
export default {
  name: "App",
  components: {
    Timer, Billboard, SideBar,
  },

  data() {
    return {
      flowMessage: '투v',
      playerVote: [0,0,0,0,0,0],
      playerJob: ['시민','시민','시민','시민','시민','마피아'],
      playerPros: [0,0,0,0,1,0],
      electedPlayersNum: 1,
      electedPlayers: 0,
      electedPlayerVote: 0,
      punishmentPlayer: 0,
      punishmentPros: 0,
      punishmentCons: 0,
    };
  },

  mounted() {

  },
  // 해야할일, 투표
  methods: {
    finishVote() {
      for (var i = 0; i < this.playerVote.length; i++) {
        this.playerVote[i] = Math.floor(Math.random()*10);
        if(this.electedPlayerVote == this.playerVote[i]) {
          this.electedPlayersNum = this.electedPlayersNum + 1;
        }
        if (this.electedPlayerVote < this.playerVote[i]) {
          this.electedPlayerVote = this.playerVote[i];
          this.electedPlayers = i;
          this.electedPlayersNum = 1;
        }
      }
      if (this.electedPlayersNum != 1) {
        this.flowMessage = '투표종료. 중복 혹은 무효처리'
        this.electedPlayers = 'null'
        // 밤 & 능력사용 이벤트 (타이머로 이동하여)
      } else {
        this.flowMessage = '투표완료. 집행대상자 선정 완료'
        // 찬반투표 이벤트. (타이머로 이동하여 )
      }
    },
    gameStart() {

    },
    grantJob() {

    },
    finishPunishmentVote() {
      this.punishmentPros = Math.floor(Math.random()*5);
      this.punishmentCons = Math.floor(Math.random()*5);
      console.log(this.punishmentPros, this.punishmentCons)
      if (this.punishmentPros > this.punishmentCons) {
        this.flowMessage = this.electedPlayers+1 + ' 를 사형합니다.'
        function punishmentPlayer() {
          var usercam1 = document.getElementById("usercam1")
          usercam1.style.backgroundColor = "red";
        }
        punishmentPlayer()
        // 플레이어 제거 후 밤 & 능력사용 이벤트 진행
      } else {
        this.flowMessage = '투표가 부결되어 사형하지 않습니다.'
        // 능력사용 이벤트 진행
      }
    }
  },
};
</script>

<style lang="scss" scoped>
	.messagebox {
		position: absolute;
		overflow: visible;
		width: 580px;
		height: 250px;
		left: 670px;
		top: 315px;
    background-color: #b1b11a;
	}
  .usercam1   {
    position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 230px;
		top: 113px;
    background-color: #ff00ff;
  }
  .usercam2   {
		position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 610px;
		top: 113px;
    background-color: #ff00ff;
  }
    .usercam3 {
		position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 990px;
		top: 113px;
    background-color: #ff00ff;
  }
    .usercam4 {
		position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 1370px;
		top: 113px;
    background-color: #ff00ff;
  }
    .usercam5 {
		position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 230px;
		top: 350px;
    background-color: #ff00ff;
  }
  .usercam6 {
		position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 1370px;
		top: 350px;
    background-color: #ff00ff;
  }
      .usercam7 {
		position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 230px;
		top: 587px;
    background-color: #ff00ff;
  }
  //       .usercam8 {
	// 	position: absolute;
	// 	overflow: visible;
	// 	width: 320px;
	// 	height: 180px;
	// 	left: 610px;
	// 	top: 587px;
  //   background-color: #ff00ff;
  // }
          .usercam9 {
		position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 990px;
		top: 587px;
    background-color: #ff00ff;
  }
            .usercam10 {
		position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 1370px;
		top: 587px;
    background-color: #ff00ff;
  }
  .settingbox {
    		position: absolute;
		    overflow: visible;
        width: 400px;
        height: 50px;
        left: 780px;
        top: 850px;
        background-color: #ff0000;
  }
    .timebox {
    		position: absolute;
		    overflow: visible;
        width: 200px;
        height: 50px;
        left: 1200px;
        top: 850px;
        background-color: #ff00ff;
  }
</style>
