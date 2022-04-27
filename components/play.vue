<template>
  <div :class="{'gamebox-first': this.flag, 'gamebox-second': !this.flag}" >
    <!-- <Billboard blilboard-vote="vote-result"/> -->
    <div class="chatbox">
      <button v-on:click="exitRoom">
        게임 채팅방 여기에! (지금은 소켓 제거)
      </button>
    </div>
    <Billboard ref="billboard" />
    <Timer
      v-on:startThisGame="gameStart"
      v-on:finishPunishmentVote="nightEvent"
      v-on:nightFinishEvent="nightResult"
      v-on:startVote="startVote"
      v-on:finishVote="finishVote"
      ref="timer"
      class="timerbox"
    >{{counter}}</Timer>

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
      <!-- <div class="videobox">
        <video
          id="myVideo"
          ref="myVideo"
          muted
          :src-object.prop.camel="publishStream.stream"
          autoplay
        ></video>
        <canvas
          :class="['aspect-video my_canvas']"
          width="1280"
          height="720"
        ></canvas>
        <div :class="['userInfo' + 9]">
          {{
            "level : " +
            userLevel[9] +
            "   " +
            userName[9] +
            " " +
            survivePlayer[9]
          }}
        </div>
      </div> -->
      <div class="videobox" v-for="(s, n) in roomMembers" :key="s.id">
        <div v-if="s.stream">
          <video
            v-if="s.nickname !== myInfo.profile.nickname"
            :class="['aspect-video usercam' + s.id]"
            :id="['usercam' + s.id]"
            :src-object.prop.camel="s.stream"
            autoplay
          >
            {{ s.id }}
          </video>
          <video
            v-else
            :class="['aspect-video usercam' + s.id]"
            :id="['usercam' + s.id]"
            :src-object.prop.camel="s.stream"
            autoplay
            muted
          ></video>
          <canvas
            :class="['aspect-video output_canvas' + s.id]"
            :id="['output_canvas' + n]"
            width="640"
            height="360"
          ></canvas>
          <div :class="['userInfo' + s.id]">
            {{
              "level : " +
              userLevel[s.id - 1] +
              "   " +
              userName[s.id - 1] +
              " " +
              survivePlayer[s.id - 1]
            }}
          </div>
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
import dayjs from 'dayjs';
import { GameEvent } from "@/api/mafiaAPI";
// import io from "socket.io-client";
export default {
  name: "App",
  props: {
    roomInfo: Object,
  },
  components: {
    Timer,
    Billboard,
    SideBar,
    Memo,
  },
  computed: {
    // subscribedStreams() {
    //   return this.$store.state.stream.subscribedStreams;
    // },
    // publishStream() {
    //   return this.$store.state.stream.publishStream;
    // },
    myInfo() {
      return this.$store.getters["user/getMyInfo"];
    },
    roomMembers() {
      return this.$store.state.stream.roomMembers;
    },
    roomId(){
      const value = this.$store.state.roomId
      console.log('this is nuxt vue', value)
      return value;
    }
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
      myNum : 0,
      myJob : '',
      mySocketId: '',
      userSocketInfo: [],
      myVote: 0,
      flag: false,
      counter: 60
    };
  },
  mounted() {
    this.socket = this.$nuxtSocket({
      channel: "/game",
      withCredentials: true,
      transports: ["websocket"],
    });
    this.gameSocketSet();

  },
  created() {
  },
  methods: {
    exitRoom() {
      this.socket.emit("exitRoom");
    },
    // 게임에 입장하는 즉시 실행되며, 유저의 소켓 정보 받아옴
    gameSocketSet() {
      const roomId = this.$store.state.roomId.roomId
      console.log('현재 방 번호', roomId)
      this.socket.emit('game:join', {roomId})
      this.flowMessage = "잠시 후 게임을 시작합니다.";
      // this.socket.emit('gamejoin')
      this.socket.on('game:join', (data)=> {
        console.log(data);
        // this.mySocketId = data.user
        // console.log(this.mySocketId)
      })
      // this.socket.on()

      // 입장 5초 후에 게임을 시작한다.
      setTimeout(()=> {
        this.gameStart()
      }, 1000)
    },
    gameStart() {
      this.flowMessage = "마피아 게임 시작";
      this.socket.emit(GameEvent.Start)
      this.socket.on(GameEvent.Start, (data)=> {
        console.log(data)
      })
      setTimeout(()=> {
        // this.socket.emit('gameMessage')
        // this.socket.on('gameMessage', (data)=> {
        //   console.log(data)
        // })
        this.grantPlayerJob();
      },1000)
    },

    grantPlayerJob() {
      this.flowMessage = '직업을 나누고 있습니다...'
      // setTimeout(() => {
      //   // this.flowMessage = '당신은 테스트입니다.'
      //   // setTimeout(()=> {
      //   //   this.flowMessage = '빨리 만드시기 바랍니다.'
      //   //   setTimeout(()=> {
      //   // this.morningEvent();
      //   //   }, 1000)
      //   // }, 1000)
      // },1000)
        // this.socket.emit(GameEvent.Job)
        // this.socket.on(GameEvent.Job, (data) => {
        //   console.log(data)
        // })

      // setTimeout(() => {
        // this.socket.emit("grantJob")
        // this.socket.on('grantJob', (data) => {
        //   console.log(data)
          // console.log(data2)
          // this.userSocketInfo = data2
          // this.myJob = data.jobs.job
          // console.log(this.myJob)
          // for(let i = 0 ; i < this.userSocketInfo.length; i++) {
          //   if (this.mySocketId == this.userSocketInfo[i]) {
          //     this.myNum = i+1
            // }
          // }
          // console.log(this.myNum);
          // for(let i = 0 ; i < this.userSocketInfo.length; i++) {
          //   if (i == this.myNum-1) {
          //     this.myJob = data.jobs[i].job
          //   }
          // }
          // console.log(this.myJob);
          // this.myJob = data.jobs[this.myNum].job
          // console.log(this.roomJob);
          // this.flowMessage = '당신은 ' + this.myJob + '입니다'
          // setTimeout(() => {
          //   if (this.myJob == 'MAFIA') {
          //     this.flowMessage = '시민들에게 들키지 않고 다른 마피아와 힘을 합쳐 시민을 제거하면 됩니다.'
          //   } else if (this.myJob == 'DOCTOR') {
          //     this.flowMessage = '당신은 매일 밤마다 1명의 유저를 선택하여 마피아의 공격으로부터 보호할 수 있습니다. 단, 자신은 보호할 수 없습니다. 다른 시민 유저와 힘을 합쳐 마피아를 찾아내어 제거하여야 합니다.'
          //   } else if (this.myJob == 'POLICE') {
          //     this.flowMessage = '당신은 매일 밤마다 1명의 유저를 선택하여 해당 유저의 직업을 알 수 있습니다. 단, 자신은 선택할 수 없습니다. 다른 시민 유저와 힘을 합쳐 마피아를 찾아내어 제거하여야 합니다.'
          //   } else {
          //     this.flowMessage = '당신은 다른 시민들과 힘을 합쳐 마피아를 찾아내어 제거하여야 합니다.'
          //   }
            setTimeout(() => {
              this.morningEvent();
            },3000)
          // },3000)
      //   })

      // }, 3000)
    },
    morningEvent() {
      this.flowMessage = '낮이 되었습니다.'
      this.flag = !this.flag
      const roomId = this.$store.state.roomId.roomId
      const dayjs = require("dayjs");
      console.log(this.roomId)

      this.socket.emit(GameEvent.Timer)
      this.$refs.timer.morningTimer();
      // while(this.counter == 0) {
      //   this.socket.on('game:timer', data)
      //   console.log(data)
      //   this.startVote();
      // }
      //   this.socket.on('game:timer', data => {
      //     console.log(data)
      // },3000)
      this.socket.on(GameEvent.Timer, (data)=> {
        console.log(data);
        // this.mySocketId = data.user
        // console.log(this.mySocketId)
      })
      console.log('타이머 실행')
      // 타이머에서 다음 메서드를 실행하게 한다!
    },
    startVote() {
      console.log('1')
      this.flowMessage =
        "해가 저물어갑니다. 밤이 되기 전, 마피아로 의심되는 유저를 지목합니다";
      setTimeout(()=> {
        this.$refs.timer.voteTimer();
      }, 3000)

      //여기서 유저 지목 값 받아올 수 있어야 함.
      // this.myVote = 1;
      // console.log(this.myVote);
      // let voteNum = 0;
      // setTimeout(()=> {
        // this.socket.emit(GameEvent.Vote, {
          // voteNum : this.myVote,
        // })
      //   // this.finishVote();

        // this.finishVote();
      // },3000)
      // this.finishVote();
    },
    finishVote() {
      console.log('adf')
      this.flowMessage =
        "투표 결과를 발표를 합니다";
        // this.socket.on(GameEvent.FinshV, (data) => {
        //   console.log(data)
        // })
        // this.finishPunishmentVote();
      // setTimeout(()=> {
      // //   this.socket.on('finishVote', (data) => {
      // //     console.log(data)
      // //     for(let i = 0; i < data.length; i++) {
      // //       if (data.voteSum[i]>this.electedPlayer) {
      // //         this.electedPlayer = data.voteSum[i]
      // //         this.electedPlayersNum = 0
      // //       } else if (data.voteSum[i] == this.electedPlayer) {
      // //         this.electedPlayer = 0
      // //         this.electedPlayersNum++
      // //       }
      // //     }
      // //     console.log(this.electedPlayer)
      // //   })
        this.PunishmentVote();
      // },3000)

    },
    PunishmentVote() {
      console.log('여기까지 개발')
            this.flowMessage =
        "지목된 유저의 사형 찬반투표를 진행합니다";
      setTimeout(()=> {
        this.$refs.timer.punishmentTimer();
      }, 3000)
      // setTimeout(() => {
        this.socket.emit(GameEvent.Punish)
        this.socket.on(GameEvent.FinshP, (data) => {
          console.log(data)
        })
        // this.nightEvent();
      // },3000)


    },

    nightEvent() {
      console.log('2')
      this.flag = !this.flag
      this.flowMessage = '밤이 되었습니다.'
      setTimeout(()=> {
        this.$refs.timer.nightEvent();
          if(this.myJob == 'MAFIA') {
          this.socket.emit(GameEvent.Mafia)
        } else if (this.myJob == 'DOCTOR') {
          this.socket.emit(GameEvent.Doctor)
        } else if (this.myJob == 'POLICE') {
          this.socket.emit(GameEvent.Police)
          this.socket.on(GameEvent.Police, (data)=> {
            console.log(data)
          })
        } else {

        }
        this.socket.emit(GameEvent.Punish)
        this.socket.on(GameEvent.FinshP, (data) => {
          console.log(data)
        })
      }, 3000)

      // setTimeout(() => {
        // this.nightResult();
      // },3000)
    },
    nightResult() {
      console.log('3')
      // this.$refs.billboard.finishAllVote();
      this.flowMessage = "능력 사용이 끝났습니다.";

      // this.killPlayer = prompt("마피아가 죽일 유저 선택!");
      // console.log(this.survivePlayer[this.killPlayer]);
      // console.log(this.killPlayer);
      // for (let i = 0; i < 10; i++) {
      //   if (this.playerJob[i] == "의사" && this.survivePlayer[i] == true) {
      //     this.doctorSelected = prompt("의사가 살릴 유저 선택");
      //   }
      // }
      // if (this.survivePlayer[this.killPlayer - 1] == false) {
      //   this.killPlayer = prompt("죽일 유저 다시 선택");
      // } else {
      //   if (
      //     this.doctorSelected == this.killPlayer &&
      //     this.killPlayer != this.survivePlayer[this.killPlayer - 1]
      //   ) {
      //     this.flowMessage =
      //       "마피아가 " +
      //       this.killPlayer +
      //       "를 공격하였으나 의사의 도움으로 플레이어는 생존하였습니다.";
      //     this.electedPlayersNum = 1;
      //     this.electedPlayerVote = 0;
      //     (this.electedPlayer = 0), // 지목된 플레이어
      //       (this.electedPlayerVote = 0), // 지목된 플레이어가 받은 득표
      //       (this.playerVote = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // 각 유저의 투표수
      //     setTimeout(() => {
      //       this.flowMessage = "아침이 되었습니다.";
      //       this.$refs.timer.morningEvent();
      //     }, 5000);
      //   } else {
      //     if (this.playerJob[this.killPlayer - 1] == "마피아") {
      //       this.mafiaNum = this.mafiaNum - 1;
      //     } else {
      //       this.citizenNum = this.citizenNum - 1;
      //     }
      //     console.log("마피아는" + this.mafiaNum);
      //     console.log("시민은" +this.citizenNum);
      //     this.survivePlayer.splce(this.killPlayer - 1, 1, false);
      //     console.log(this.surviePlayer);
      //     this.electedPlayersNum= 1;
      //     this.electedPlayerVote = 0;
      //     (this.electedPlayer = 0), // 지목된 플레이어
      //       (this.electedPlayerVote = 0), // 지목된 플레이어가 받은 득표
      //       (this.playerVote = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]); // 각 유저의 투표수

      //     if (
      //       this.mafiaNum == 0 ||
      //       this.citizenNum == 0 ||
      //       this.mafiaNum >= this.citizenNum
      //     ) {
      //       this.victorySearch();
      //     } else {
      //       setTimeout(() => {
      //         this.flowMessage = "아침이 되었습니다.";
      //         this.$refs.timer.morningEvent();
      //       }, 5000);
      //       // 낮 이벤트 진행
      //     }
        // }
      setTimeout(() => {
        this.morningEvent();
      },3000)
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

  // async asyncData({ params }) {
  //   const roomInfo = await getRoom(params.id);
  //   console.log('roomId : room ',params)
  //   return { roomInfo: roomInfo.data.data };
  // },
};
</script>

<style lang="scss" scoped="scoped">
@import "~assets/game.scss";
</style>
