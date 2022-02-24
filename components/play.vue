<template>
<div class="flex flex-col min-h-screen w-full">
<!-- <Billboard blilboard-vote="vote-result"/> -->
<Billboard />
  <div class="videobox" >
    <video :class="['usercam'+ index]" v-for="index in 10" :key="index">{{ index }}</video>
    <div :class="['userInfo'+ index]" v-for="index in 6" :key="index">{{'level : ' + userLevel[index-1] +'   '+ userName[index-1] + survivePlayer[index-1]}}</div>
  </div>
  <div class="settingbox">
    <!-- <div class="sound_setting">사운드 설정</div> -->
    <div class="settingCamAndMic">
    <img :src="require(`../assets/ingame/muteMic.png`)">
    <img :src="require(`../assets/ingame/offCam.png`)">
    </div>

    <!-- <div class="cam_setting">카메라 설정</div> -->
  </div>

  <div class="timebox">
    <Timer v-on:timeoutVote="finishVote" v-on:timeoutPunishmentVote="finishPunishmentVote"
    v-on:nightEvent="nightEvent"
    ref="timer"></Timer>
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
      survivePlayer: ['', '', '', '','',''],
      userLevel: [108, 17, 9, 666, 722, 15],
      userName : ['전국마피아신', '사실저마피아', '발가락이용자', '시민원챔', '머래너나잘해', '정치하면던짐'],
      electedPlayersNum: 1,
      electedPlayers: 0,
      electedPlayerVote: 0,
      punishmentPlayer: 0,
      punishmentPros: 0,
      punishmentCons: 0,
      killUser: '',
      userNum: 3,

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
        this.electedPlayers = null
        // 밤 & 능력사용 이벤트 (타이머로 이동하여)
        // this.$refs.timer.nightEvent()
        setTimeout(this.$refs.timer.nightEvent(), 3000);
      } else {
        this.flowMessage = '투표완료. 집행대상자 선정 완료'
        console.log(this.$refs.timer);
        setTimeout(this.$refs.timer.startPunishmentVote(), 3000);
        // this.$refs.timer.startPunishmentVote()

        // 찬반투표 이벤트. (타이머로 이동하여 )
      }
    },
    gameStart() {
      this.flowMessage = '마피아 게임을 시작합니다'
      // 3초 딜레이 넣고 바로 grantJob() 넣기
    },
    grantJob() {
      this.flowMessage = '직업을 선정하였습니다. 당신은 마피아입니다!'
      // 3초 딜레이 넣고 설명 더 넣고, morningEvent() 실행하기
      //
    },
    finishPunishmentVote() {
      alert('사형 찬반투표 종료')
      this.punishmentPros = Math.floor(Math.random()*5);
      this.punishmentCons = Math.floor(Math.random()*5);
      console.log(this.punishmentPros, this.punishmentCons)
      if (this.punishmentPros > this.punishmentCons) {
        this.flowMessage = this.electedPlayers+1 + ' 를 사형합니다.'
          // this.killUser = document.getElementsByClassName("usercam1")
          // this.killUser.style.backgroundColor = "#ffffff";
        // 플레이어 제거 후 밤 & 능력사용 이벤트 진행
          this.$refs.timer.nightEvent()
      } else {
        this.flowMessage = '투표가 부결되어 사형하지 않습니다.'
        // 능력사용 이벤트 진행
        this.$refs.timer.nightEvent()
      }
    },
    nightEvent() {
        alert('능력 사용 종료')
        this.flowMessage = '능력 사용이 끝났습니다.'
        this.userKill = Math.floor(Math.random()*4);
        console.log(this.userKill)
        this.$refs.timer.morningEvent()
        this.morningEvent();
        // 낮 이벤트 진행
    },
    morningEvent() {
      this.flowMessage = '아침이 되었습니다.'
      this.$refs.timer.startVote()
      // 지목 유저 삭제 이벤트 발생
      // this.flowMessage = 'X번 플레이어가 사망하였습니다.'
      //
    },
    startVotee() {
      this.flowMessage = '마피아로 의심되는 유저를 지목합니다'
      //Timer.vue의 startVote가 실행되게끔 한다.
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
  .userInfo1 {
    position: absolute;
		overflow: visible;
    width: 320px;
    // min-width: 320px;
    // width: 16vw; height는 계산 좀 해야됨..
		height: 30px;
		left: 230px;
		top: 263px;
    background-color: #ffffff;
  }

  .usercam1   {
    position: absolute;
		overflow: visible;
    width: 320px;
    // min-width: 320px;
    // width: 16vw; height는 계산 좀 해야됨..
		height: 180px;
		left: 230px;
		top: 83px;
    background-color: #ff00ff;
  }
  .userInfo2 {
    position: absolute;
		overflow: visible;
    width: 320px;
    // min-width: 320px;
    // width: 16vw; height는 계산 좀 해야됨..
		height: 30px;
		left: 610px;
		top: 263px;
    background-color: #ffffff;
  }

  .usercam2   {
		position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 610px;
		top: 83px;
    background-color: #ff00ff;
  }
  .userInfo3 {
    position: absolute;
		overflow: visible;
    width: 320px;
    // min-width: 320px;
    // width: 16vw; height는 계산 좀 해야됨..
		height: 30px;
		left: 990px;
		top: 263px;
    background-color: #ffffff;
  }
    .usercam3 {
		position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 990px;
		top: 83px;
    background-color: #ff00ff;
  }
  .userInfo4 {
    position: absolute;
		overflow: visible;
    width: 320px;
    // min-width: 320px;
    // width: 16vw; height는 계산 좀 해야됨..
		height: 30px;
		left: 1370px;
		top: 263px;
    background-color: #ffffff;
  }
    .usercam4 {
		position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 1370px;
		top: 83px;
    background-color: #ff00ff;
  }
  .userInfo5 {
    position: absolute;
		overflow: visible;
    width: 320px;
    // min-width: 320px;
    // width: 16vw; height는 계산 좀 해야됨..
		height: 30px;
		left: 230px;
		top: 530px;
    background-color: #ffffff;
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
  .userInfo6 {
    position: absolute;
		overflow: visible;
    width: 320px;
    // min-width: 320px;
    // width: 16vw; height는 계산 좀 해야됨..
		height: 30px;
		left: 1370px;
		top: 530px;
    background-color: #ffffff;
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
		top: 617px;
    background-color: #ff00ff;
  }
        .usercam8 {
		position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 610px;
		top: 617px;
    background-color: #ff00ff;
  }
          .usercam9 {
		position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 990px;
		top: 617px;
    background-color: #ff00ff;
  }
            .usercam10 {
		position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 1370px;
		top: 617px;
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
  .settingCamAndMic {
    float: left;
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
