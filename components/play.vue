<template>
  <div :class="{ 'gamebox-first': this.flag, 'gamebox-second': !this.flag }">
    <div class="dayTimeBox">
      <DayCount ref="dayCount" class="chatbox"></DayCount>
      <Timer
        v-on:nightFinishEvent="nightResult"
        v-on:startVote="startVote"
        v-on:finishVote="finishVote"
        v-on:finishPunishmentVote="finishPunishmentVote"
        ref="timer"
        class="timerbox"
        >{{ counter }}</Timer
      >
    </div>
    <!-- 능력 결과 데이터는 전부 billboard로 보내야 한다! -->
    <!-- userVideo에도 유저 데이터를 보내고, 화면이 꺼지게 해야 함.  -->
    <Billboard ref="billboard" />
    <div class="videomainbox px-2 mt-10">
      <UserVideo ref="userVideo"
      v-on:startVoteMotion="startVote"
      v-on:punishmentVoteMotion="punishmentVote"
      v-on:skillMotion="nightEvent"
      @voteNumEmit="voteNumCheck"
      @punishmentEmit="punishmentVoteCheck"
      @skillNumEmit="skillNumCheck"
      />
    </div>
    <sideBar
      ref="sideBarSet"
    ></sideBar>
    <!-- <Audio /> -->
  </div>
</template>

<script>
import Timer from "@/components/Timer.vue";
import Billboard from "@/components/gameFlow_elements/billboard.vue";
import SideBar from "@/components/gameFlow_elements/sideBar.vue";
import UserVideo from "@/components/gameFlow_elements/userVideo.vue"
import dayjs from "dayjs";
import { GameEvent } from "@/api/mafiaAPI";
import DayCount from "@/components/gameFlow_elements/dayCountView.vue";
// import Audio from "@/components/gameFlow_elements/audio.vue";
export default {
  name: "App",
  props: {
    roomInfo: Object,
  },
  components: {
    Timer,
    Billboard,
    SideBar,
    DayCount,
    UserVideo,
    // Audio,
    dayjs,
  },
  computed: {
    myInfo() {
      return this.$store.getters["user/getMyInfo"];
    },
    roomMembers() {
      return this.$store.state.stream.roomMembers;
    },
  },
  data() {
    return {
      electedPlayer: 0, // 마피아로 의심되는 유저 투표
      punishmentPlayer: false, // 찬반 투표, 디폴트는 반대
      selectedUser: false, // 자신의 선택 확정, 디폴트는 미승인 (true가 되야 선택값 넘어감)
      mafiaSelected: 0, // 마피아일 경우 유저 지목
      doctorSelected: 0, // 의사일 경우 유저 지목
      policeSelected: 0, // 경찰일 경우 유저 지목
      flag: false,
      day: false,
      counter: 60,
      morningAudio: null,
      nightAudio: null,
      startTime: null,
      endTime: null,
      // 플레이엉 넘을 이용 n 번째 플레이어를 날린다.
    };
  },

  //새로고침 방지 위해서 추가 뒤로가기 하면 로비에서도 적용됨.
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.unLoadEvent);
  },

  mounted() {
    window.addEventListener('beforeunload', this.unLoadEvent);

    // let newRemoteFeed = null;
    this.gameSocketSet();

    // 여기서부터는 백엔드의 emit을 받아 처리

    // 게임 시작과 동시에, 유저 정보를 받아오고, 게임 시작 메서드 실행
    this.$root.gameSocket.on(GameEvent.JOIN, (data) => {
      console.log(data)
      setTimeout(() => {
        this.gameStart();
      }, 5000);
    });

    // 인게임에서 활용하기 위한 데이터를 가져오고, 직업 배분을 시작함
    this.$root.gameSocket.on(GameEvent.START, (data) => {
      for (let item of data) {
        this.$store.commit('stream/setRoomMembersDie', item);
      }
      setTimeout(() => {
        this.grantPlayerJob();
      }, 5000);
    });

    // 유저의 직업을 배분하고, 배분된 직업에 따라 다른 이벤트 부여
    // 달라지는 것 - 빌보드 메세지, 사이드바 UI 내용
    this.$root.gameSocket.on(GameEvent.JOB, (data) => {
      for (let item of data) {
        this.$store.commit('stream/setRoomMembersJob', item);
        if (item == "MAFIA") {
          this.$refs.sideBarSet.myJobMafia();
          this.$refs.billboard.grantMafia();
        } else if (item == "POLICE") {
          this.$refs.sideBarSet.myJobPolice();
          this.$refs.billboard.grantPolice();
        } else if (item == "DOCTOR") {
          this.$refs.sideBarSet.myJobDoctor();
          this.$refs.billboard.grantDoctor();
        } else {
          this.$refs.sideBarSet.myJobCitizen();
          this.$refs.billboard.grantCitizen();
        }
      }
      setTimeout(() => {
        this.morningEvent();
      }, 5000);
    });

    // 낮밤 변경
    this.$root.gameSocket.on(GameEvent.DAY, (data) => {
      this.flag = data.day;
    });

    // 타이머의 시간을 기준으로 60초 환산 (지금은 클라이언트 기준 60초)
    this.$root.gameSocket.on(GameEvent.TIMER, (start, end) => {
      // const dayjs = require("dayjs");
      // this.ss = start.get('y')
      // console.log(this.ss)
      // console.log(this.startTime);
      // console.log(this.endTime);
      // console.log(typeof start) //object
      // console.log(typeof end)
    });

    // 투표 결과 종합
    this.$root.gameSocket.on(GameEvent.FINISHV, (data) => {
      console.log(data);
      for (let i = 0; i < data.length; i++) {
        console.log(data[i].userNum + ' ' + data[i].voteNum)
      }
      this.$refs.billboard.finishVoteBoard();
      setTimeout(()=> {
        this.punishmentVote();
      }, 3000)
    });

    // 심판 결과 종합
    this.$root.gameSocket.on(GameEvent.FINISHP, (data) => {
      console.log(data);
      // 경우에 따라서는 유저 정보를 다시 받아서 클라이언트에서 처리
      // if 받아온 값이 true 일 경우, 클라이언트에서 유저 제거 처리후
      // nightEvent로 넘어간다.
      // else 일 경우, nightEvent로 넘어간다.
      this.$refs.billboard.finishPunishmentVoteBoard();
      setTimeout(()=> {
        this.nightEvent();
      }, 3000)
    });

    this.$root.gameSocket.on(GameEvent.POLICE, (data) => {
      console.log(data.userNum, user);
      this.$refs.billboard.policeResult();
    })

    this.$root.gameSocket.on(GameEvent.DOCTOR, (data) => {
      // 의사는 백엔드로 전송 후 다시 받는다.
      console.log(data);
    })

    this.$root.gameSocket.on(GameEvent.MAFIA, (data) => {
      // 마피아는 백엔드로 전송 후 다시 받는다.
      // 1. 모든 마피아가 한명의 유저를 지목했을 경우
      // 2. 마피아와 의사가 능력이 겹치지 않았을 경우
      // 위 조건에 만족하면 유저를 죽인다.
      console.log(data);
    })

  },

  created() {},
  methods: {
    // 게임에 입장하는 즉시 실행되며, 유저의 소켓 정보 받아옴
    gameSocketSet() {
      this.$root.gameSocket.emit(GameEvent.JOIN, {
        roomId: this.$route.params.roomInfo.id
      });
      this.$refs.billboard.gameStartBoard();
    },

    // 게임 스타트, 게임 스타트 관련 데이터
    gameStart() {
      this.$root.gameSocket.emit(GameEvent.START);
      this.$refs.billboard.grantPlayerJobBeforeBoard();
    },

    // 직업 배분 결과 통지, 지금 빌보드에 뜨는건 더미라서 마피아라고 뜬다.
    grantPlayerJob() {
      this.$root.gameSocket.emit(GameEvent.JOB);
    },

    // 아침 이벤트 발생,
    morningEvent() {
      this.$refs.billboard.morningEventBoard();
      // this.morningAudio.play()
      const dayjs = require("dayjs");
      const morningStart = dayjs();
      morningStart.format();
      console.log(morningStart);
      console.log(this.flag)
      this.$root.gameSocket.emit(GameEvent.DAY, {
        day: this.flag,
      });
      console.log(this.flag)
      this.$root.gameSocket.emit(GameEvent.TIMER);

      this.$refs.timer.morningTimer();
      // dayCount에서는 빌보드 상단에 표기되는 day의 숫자를 +1
      this.$refs.dayCount.nextDay();
      // 타이머에서 다음 메서드를 실행하게 한다!
    },

    // 투표 시작
    startVote() {
      this.$refs.billboard.startVoteBoard();
      setTimeout(() => {
        this.$refs.timer.voteTimer();
        this.$refs.userVideo.startVoteMotion();
      }, 3000);
      //여기서 유저 지목 값 받아올 수 있어야 함.
    },
    // 투표값 전송을 위한 메서드로, 집계는 startVote에서 한다.
    // 자신의 투표값을 저장한다.

    // userVideo.vue에서 얻어낸 유저 지목 값을 백엔드로 전송
    voteNumCheck(voteNum) {
      this.electedPlayer = voteNum;
      console.log(this.electedPlayer);
      this.$root.gameSocket.emit(GameEvent.VOTE, {
        vote: this.electedPlayer,
      })
    },

    // 타이머 끝나면 이게 실행되고, 집계된 결과값을 가져온다.
    finishVote() {
      if(this.electedPlayer != 0) {
        console.log(this.electedPlayer)
        this.$root.gameSocket.emit(GameEvent.FINISHV);
      } else {
          this.$root.gameSocket.emit(GameEvent.VOTE, {
          vote: 1,
          })
          this.$root.gameSocket.emit(GameEvent.FINISHV);
      }
    },

    // 사형시킬 유저가 특정되면 심판 투표를 진행
    punishmentVote() {
      this.$refs.billboard.startPunishmentVoteBoard();
      setTimeout(() => {
        this.$refs.timer.punishmentTimer();
        this.$refs.userVideo.punishmentVoteMotion();
      }, 3000);
    },

    // userVideo.vue에서 얻어낸 심판투표 찬반여부를 백엔드로 전송
    // true가 엄지손가락을 내린 형태로 사형 찬성이고
    // false가 엄지손가락을 올린 형태로 사형 반대이다.
    punishmentVoteCheck(punishmentNum) {
      // punishmentNum 은 boolean
      this.punishmentPlayer = punishmentNum;
      console.log(this.punishmentPlayer)
      this.$root.gameSocket.emit(
        GameEvent.PUNISH,
        {
          punish: this.punishmentPlayer,
        },
      );
    },

    // 심판 투표 결과값을 가져온다.
    finishPunishmentVote() {
      this.$root.gameSocket.emit(GameEvent.FINISHP);
    },

    nightEvent() {
      // 밤으로 배경 변경
      // this.nightAudio.play()
      this.$root.gameSocket.emit(GameEvent.DAY, {
        day: this.flag,
      });
      this.$root.gameSocket.emit(GameEvent.TIMER);
      this.$refs.billboard.nightEventBoard();
      setTimeout(() => {
        this.$refs.timer.nightEvent();
        if (this.myJob == "MAFIA") {
          // select를 추가해야 할듯
          this.$refs.userVideo.skillMotion();
        } else if (this.myJob == "DOCTOR") {
          // select를 추가해야 할듯
          this.$refs.userVideo.skillMotion();
        } else if (this.myJob == "POLICE") {
          // select를 추가해야 할듯
          this.$refs.userVideo.skillMotion();
        }
      }, 3000);
    },

    skillNumCheck(voteNum) {
      if (this.myJob == "MAFIA") {
        this.$root.gameSocket.emit(GameEvent.MAFIA, {
          userNum : voteNum
        });
      } else if (this.myJob == 'DOCTOR') {
        this.$root.gameSocket.emit(GameEvent.DOCTOR, {
          userNum : voteNum
        });
      } else if (this.myJob == 'POLICE') {
        this.$root.gameSocket.emit(GameEvent.POLICE, {
          userNum : voteNum
        });
      }
    },

    nightResult() {
      console.log("3");
      this.$refs.billboard.nightResultBoard();
      // 만약 승리조건을 on 할 경우에는
      setTimeout(() => {
        this.morningEvent();
      }, 3000);
    },

    victorySearch() {

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

