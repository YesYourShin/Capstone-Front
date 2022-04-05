<template>
  <div class="gamebox">
    <!-- <Billboard blilboard-vote="vote-result"/> -->
    <div class="chatbox">
      <button v-on:click="exitRoom">
        게임 채팅방 여기에! (지금은 소켓 제거)
      </button>
    </div>
    <Billboard ref="billboard" />
    <Timer
      v-on:startThisGame="gameStart"
      v-on:timeoutPunishmentVote="finishPunishmentVote"
      v-on:nightSkillEvent="nightSkillEvent"
      v-on:startVote="startVote"
      v-on:timeoutVote="finishVote"
      ref="timer"
      class="timerbox"
    ></Timer>

    <!-- <div class="itemBox">
        <div class="settingbox">
          <div class="settingCamAndMic">
            <img :src="require(`../assets/ingame/muteMic.png`)">
            <img :src="require(`../assets/ingame/offCam.png`)"></div>
          </div>
        <div class="timebox">
          <Timer
              v-on:timeoutVote="finishVote"
              v-on:timeoutPunishmentVote="finishPunishmentVote"
              v-on:nightEvent="nightEvent"
              ref="timer">
          </Timer>
        </div>
      </div> -->

    <div class="videomainbox">
      <div class="videobox" v-for="index in 10" :key="index">
        <video
          :class="['aspect-video usercam' + index]"
          :id="['usercam' + index]"
        >
          {{ index }}
        </video>
        <canvas
          :class="['aspect-video output_canvas' + index]"
          width="1280"
          height="720"
        ></canvas>
        <div :class="['userInfo' + index]">
          {{
            "level : " +
            userLevel[index - 1] +
            "   " +
            userName[index - 1] +
            " " +
            survivePlayer[index - 1]
          }}
        </div>
        <!-- <Memo class="memoInfo" ></Memo> -->
      </div>
      <Memo></Memo>
    </div>
    <SideBar />
  </div>
</template>

<script>
import Timer from "@/components/Timer.vue";
import Billboard from "@/components/gameFlow_elements/billboard.vue";
// import StartAndRule from "@/components/gameFlow/startAndRule.vue";
import SideBar from "@/components/lobby_elements/sideBar.vue";
import Memo from "@/components/memo.vue";
import io from "socket.io-client";
export default {
  name: "App",
  components: {
    Timer,
    Billboard,
    SideBar,
    Memo,
  },
  data() {
    return {
      memoFor: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      flowMessage: "게임 시작버튼 눌러주세요", //전광판에 나올 메세지
      playerVote: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 각 유저의 투표수
      playerJob: [], // 각 유저의 직업
      survivePlayer: [], // 각 유저의 생존여부
      userLevel: [108, 17, 9, 666, 722, 15, 11, 12, 13, 14], // 각 유저의 레벨 (더미)
      userName: [
        "유저1",
        "유저2",
        "유저3",
        "유저4",
        "유저5",
        "유저6",
        "유저7",
        "유저8",
        "유저9",
        "유저10",
      ], // 각 유저의 닉네임(더미)
      electedPlayersNum: 1, // 최다 투표 유저가 중복될 경우, 그만큼 +1한다.
      electedPlayer: 0, // 지목된 플레이어
      electedPlayerVote: 0, // 지목된 플레이어가 받은 득표
      punishmentPlayer: 0, // 찬반투표로 죽을 유저
      punishmentPros: 0, // 찬성표
      punishmentCons: 0, // 반대표
      killPlayer: 0,
      mafiaNum: 2,
      citizenNum: 8,
      voteNum: 0,
      doctorSelected: 0,
      roomJob: [],
    };
  },
  created() {
    // this.socket = io("http://localhost:3065/game", {
    //   transports: ["websocket"],
    // });
  },
  mounted() {},
  methods: {
    exitRoom() {
      this.socket.emit("exitRoom");
    },
    gameStart() {
      this.flowMessage = "마피아 게임을 시작합니다";
      setTimeout(() => {
        this.flowMessage = "직업을 배분했습니다";
        this.socket.emit("grantJob");
      }, 3000);
    },

    morningEvent() {
      this.flowMessage = "낮이 되었습니다.";
      // this.backgroundChange.backgroundImage = url("@/assets/game/night.png");
      console.log("실행됨");
      // this.electedPlayer = -1;
      this.$refs.timer.morningEvent();
      // this.$refs.timer.startVote()
      // 지목 유저 삭제 이벤트 발생
      // this.flowMessage = 'X번 플레이어가 사망하였습니다.'
      //
    },
    startVote() {
      this.punishmentPros = Math.floor(Math.random() * 5);
      this.flowMessage =
        "해가 저물어갑니다. 밤이 되기 전, 마피아로 의심되는 유저를 지목합니다";
      this.$refs.timer.startVote();
      //Timer.vue의 startVote가 실행되게끔 한다.
    },

    finishVote() {
      // 투표결과 취합
      // 중복된 플레이어가 없고, 특정 플레이어가 가장 많은 표를 받으면
      // 해당 플레이어를 찬반투표로 넘긴다.
      this.electedPlayersNum = 1;
      for (let i = 0; i < this.playerVote.length; i++) {
        if (this.survivePlayer[i] == true) {
          // this.playerVote[i] = Math.floor(Math.random()*10);
          this.voteNum = prompt(i + 1 + "플레이어가 투표합니다.");
          this.playerVote.splice(
            this.voteNum - 1,
            1,
            this.playerVote[this.voteNum - 1] + 1
          );
          console.log(this.playerVote);
        }

        // this.playerVote[i]++;
        // if(this.electedPlayerVote == this.playerVote[i]) {
        //   this.electedPlayersNum = this.electedPlayersNum + 1;
        //   this.electedPlayer = i;
        // } else if (this.electedPlayerVote < this.playerVote[i]) {
        //   this.electedPlayerVote = this.playerVote[i]; // 최대득표수
        //   this.electedPlayer = i; // 최다득표자
        //   this.electedPlayersNum = 1; // 최다득표자가 중복될 경우
        // }
      }
      for (let i = 0; i < this.playerVote.length; i++) {
        if (this.electedPlayerVote == this.playerVote[i]) {
          this.electedPlayersNum = this.electedPlayersNum + 1;
          this.electedPlayer = i;
        } else if (this.electedPlayerVote < this.playerVote[i]) {
          this.electedPlayerVote = this.playerVote[i]; // 최대득표수
          this.electedPlayer = i; // 최다득표자
          this.electedPlayersNum = 1; // 최다득표자가 중복될 경우
        }
      }

      if (this.electedPlayersNum != 1) {
        this.electedPlayer = 0;
        this.electedPlayersNum = 1;
        this.flowMessage = "투표종료. 중복 혹은 무효처리";

        this.$refs.billboard.voteBillboard();
        // 밤 & 능력사용 이벤트 (타이머로 이동하여)
        // this.$refs.timer.nightEvent()

        setTimeout(() => {
          this.flowMessage = "밤이 되었습니다. 능력을 사용합니다.";
          this.$refs.timer.nightEvent();
          this.$refs.billboard.finishAllVote();
        }, 5000);

        // setTimeout(, 3000);
      } else {
        this.flowMessage = "투표완료. 집행대상자 선정 완료";
        console.log(this.playerVote);
        setTimeout(() => {
          this.flowMessage = this.electedPlayer + 1 + "유저의 사형 투표 시작";
        }, 5000);
        this.$refs.billboard.voteBillboard();
        console.log(this.$refs.timer);
        setTimeout(() => {
          this.$refs.timer.startPunishmentVote();
        }, 5000);
        // setTimeout(this.$refs.timer.startPunishmentVote(), 3000);
        // this.$refs.timer.startPunishmentVote()
        // 찬반투표 이벤트. (타이머로 이동하여 )
      }
    },

    finishPunishmentVote() {
      this.punishmentPros = Math.floor(Math.random() * 5);
      // this.punishmentCons = Math.floor(Math.random()*5);
      this.punishmentCons = 0;
      this.$refs.billboard.punishmentVoteBillboard();
      if (this.punishmentPros > this.punishmentCons) {
        this.survivePlayer.splice(this.electedPlayer, 1, false);
        this.flowMessage =
          "투표 결과 " + (this.electedPlayer + 1) + " 를 사형합니다.";
        console.log(this.survivePlayer);
        console.log("마피아는" + this.mafiaNum);
        console.log("시민은" + this.citizenNum);
        if (
          this.playerJob[this.electedPlayer] == "마피아" &&
          this.survivePlayer[this.electedPlayer] == false
        ) {
          this.mafiaNum = this.mafiaNum - 1;
        } else if (
          this.playerJob[this.electedPlayer] != "마피아" &&
          this.survivePlayer[this.electedPlayer] == false
        ) {
          this.citizenNum = this.citizenNum - 1;
        }
        console.log("마피아는" + this.mafiaNum);
        console.log("시민은" + this.citizenNum);
        // for(let i = 0; i < 10; i++) {
        //       console.log('마피아는 앞에서' + this.mafiaNum)
        //       console.log('시민은 앞에서' + this.citizenNum)
        //       if (this.playerJob[i] == '마피아' && this.survivePlayer[i] == false) {
        //         this.mafiaNum = this.mafiaNum - 1
        //       } else if (this.playerJob[i] != '마피아' && this.survivePlayer[i] == false) {
        //         this.citizenNum = this.citizenNum - 1
        //       }
        //     }
        if (
          this.mafiaNum == 0 ||
          this.citizenNum == 0 ||
          this.mafiaNum >= this.citizenNum
        ) {
          this.victorySearch();
        } else {
          setTimeout(() => {
            this.flowMessage = "밤이 되었습니다. 능력을 사용합니다.";
            this.$refs.timer.nightEvent();
          }, 5000);
          this.electedPlayer = 0;
        }
      } else {
        this.flowMessage = "투표가 부결되어 사형하지 않습니다.";
        // 능력사용 이벤트 진행
        this.$refs.billboard.punishmentVoteBillboard();
        // setTimeout(() => {
        //     this.$refs.billboard.finishAllVote()
        //   }, 5000);
        setTimeout(() => {
          this.flowMessage = "밤이 되었습니다. 능력을 사용합니다.";
          this.$refs.timer.nightEvent();
        }, 5000);
        this.electedPlayer = 0;
      }
      // this.$refs.billboard.finishAllVote()
    },
    nightSkillEvent() {
      this.$refs.billboard.finishAllVote();
      this.flowMessage = "능력 사용이 끝났습니다.";
      this.killPlayer = prompt("마피아가 죽일 유저 선택!");
      console.log(this.survivePlayer[this.killPlayer]);
      console.log(this.killPlayer);
      for (let i = 0; i < 10; i++) {
        if (this.playerJob[i] == "의사" && this.survivePlayer[i] == true) {
          this.doctorSelected = prompt("의사가 살릴 유저 선택");
        }
      }
      if (this.survivePlayer[this.killPlayer - 1] == false) {
        this.killPlayer = prompt("죽일 유저 다시 선택");
      } else {
        if (
          this.doctorSelected == this.killPlayer &&
          this.killPlayer != this.survivePlayer[this.killPlayer - 1]
        ) {
          this.flowMessage =
            "마피아가 " +
            this.killPlayer +
            "를 공격하였으나 의사의 도움으로 플레이어는 생존하였습니다.";
          this.electedPlayersNum = 1;
          this.electedPlayerVote = 0;
          (this.electedPlayer = 0), // 지목된 플레이어
            (this.electedPlayerVote = 0), // 지목된 플레이어가 받은 득표
            (this.playerVote = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // 각 유저의 투표수
          setTimeout(() => {
            this.flowMessage = "아침이 되었습니다.";
            this.$refs.timer.morningEvent();
          }, 5000);
        } else {
          if (this.playerJob[this.killPlayer - 1] == "마피아") {
            this.mafiaNum = this.mafiaNum - 1;
          } else {
            this.citizenNum = this.citizenNum - 1;
          }
          console.log("마피아는" + this.mafiaNum);
          console.log("시민은" + this.citizenNum);
          this.survivePlayer.splice(this.killPlayer - 1, 1, false);
          console.log(this.survivePlayer);
          this.electedPlayersNum = 1;
          this.electedPlayerVote = 0;
          (this.electedPlayer = 0), // 지목된 플레이어
            (this.electedPlayerVote = 0), // 지목된 플레이어가 받은 득표
            (this.playerVote = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // 각 유저의 투표수

          if (
            this.mafiaNum == 0 ||
            this.citizenNum == 0 ||
            this.mafiaNum >= this.citizenNum
          ) {
            this.victorySearch();
          } else {
            setTimeout(() => {
              this.flowMessage = "아침이 되었습니다.";
              this.$refs.timer.morningEvent();
            }, 5000);
            // 낮 이벤트 진행
          }
        }
      }
    },
    victorySearch() {
      console.log("test", this.mafiaNum);
      console.log("test", this.citizenNum);
      if (this.mafiaNum == 0) {
        this.citizenWin();
        // 마피아 0명, 시민 승리
      } else if (this.citizenNum == 0 || this.mafiaNum >= this.citizenNum) {
        this.mafiaWin();
        // 시민 팀이 마피아 수보다 같거나 적음, 마피아 승리
      }
    },
    mafiaWin() {
      this.flowMessage =
        "마피아가 남아있는 시민의 수와 같거나 많습니다. 마피아가 승리하였습니다.";
    },
    citizenWin() {
      this.flowMessage =
        "마피아가 모두 사라졌습니다. 시민 팀이 승리하였습니다.";
    },
  },
};
</script>

<style lang="scss" scoped="scoped">
@import "~assets/game.scss";
</style>
