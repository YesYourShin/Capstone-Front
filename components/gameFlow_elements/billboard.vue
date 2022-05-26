<template>
  <div class="messagebox overflow-y-auto">
    <div
      v-show="punishmentCam === false"
      class="flex flex-col-reverse h-full justify-center items-center p-5"
    >
      <p v-for="(logs, key) in reversedMessageLogs" :key="key">{{ logs }}</p>
    </div>
    <div
      v-show="punishmentCam === true"
      class="flex h-full justify-center items-center"
    >
      <div v-for="s in roomMembers" :key="s.userId">
        <div v-if="s.stream" class="videoCut">
          <video
            v-if="s.nickname === punishmentBillboard"
            :ref="'remote' + s.userId"
            :id="'remote' + s.userId"
            :src-object.prop.camel="s.stream"
            autoplay
            muted
          ></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { GameEvent } from "@/api/mafiaAPI";
const punishmentBgm = require("@/assets/ingameBgm/punishment.mp3").default;
export default {
  data() {
    return {
      messageLogs: [],
      newMessage: null,
      resultMessage: null,
      dayCount: 0,
      highVote: 0,
      equalVote: 1,
      highPlayer: null,
      punishmentBgm,
      punishmentCam: false,
      punishmentBillboard: null,
    };
  },
  props: {
    escape: {
      type: String,
      default: "/lobby",
    },
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
    reversedMessageLogs() {
      return this.messageLogs.slice().reverse();
    },
  },
  created() {
    this.messageLogs = ["Fafia Start"];
  },
  mounted() {
    // 유저의 vote 결과를 빌보드에 알려준다.
    this.$root.gameSocket.on(GameEvent.FINISHV, (data) => {
      console.log(data);
      if (data == null) {
        this.newMessage = `아무도 투표하지 않았습니다.`;
        this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
        this.$forceUpdate();
        // setTimeout(() => {
          this.$emit("victorySearch");
        // }, 3000);
      } else {
        for (let i = 0; i < data.length; i++) {
          if (data[i].userNum === null) {
            this.newMessage = `무효표 : ${data[i].voteNum} 표`;
          } else {
            this.newMessage = `${this.$store.state.stream.roomMembers[i].nickname} : ${data[i].voteNum} 표`;
          }
          this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
          this.$forceUpdate();
          if (data[i].voteNum > this.highVote) {
            this.highVote = data[i].voteNum;
            this.equalVote = 1;
            this.highPlayer = data[i].userNum;
          } else if (data[i].voteNum === this.highVote) {
            this.equalVote++;
          }
        }
        this.finishVoteBoard();
        if (this.equalVote === 1 && this.highVote !== 0) {
          // setTimeout(() => {
            this.$emit("punishmentVote");
          // }, 3000);
        } else {
          this.newMessage = `동률 발생으로 투표 무효`;
          this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
          this.$forceUpdate();
          // setTimeout(() => {
            this.$emit("victorySearch");
            // night가 두개 간다. 이거 내일 즉시 수정
          // }, 3000);
        }
      }
    });
    // 유저의 punishment 결과를 빌보드에 알려준다.
    this.$root.gameSocket.on(GameEvent.FINISHP, (data) => {
      console.log("합산결과" + data);
      console.log(this.$store.state.stream.surviveMembers);
      if (data >= this.$store.state.stream.surviveMembers / 2) {
        this.finishPunishmentVoteBoard();
        this.newMessage = `찬성 : ${data} 표`;
        this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
        this.$forceUpdate();
        this.$root.gameSocket.on(GameEvent.DEATH, (data) => {
          console.log(data);
          this.punishmentEvent();
          this.newMessage = `${data.nickname}은 ${data.job}이었습니다.`;
          this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
          this.$forceUpdate();
          // ! 죽은 유저의 정보를 출력한다. punishment, usejobs
          // setTimeout(() => {
            this.$store.commit('stream/killMember', data.nickname);
            this.$store.commit('stream/surviveMemberCheck');
            console.log('캠 끄기')
          // }, 2000)
        });
      } else {
        this.finishPunishmentVoteFalseBoard();
      }
      // setTimeout(() => {
        this.$emit("victorySearch");
        console.log('빌보드 밤 이벤트 시작')
      // }, 2000)
    });
    this.$root.gameSocket.on(GameEvent.USEJOBS, (data) => {
      // data은 유저 정보, data2는 텍스트
      // ! 죽은 유저의 정보를 출력한다.punishment, usejobs
      console.log('USEJOBS ' + data.userNum);
      console.log("직업사용 결과 받음");
      console.log(data.message);
      if (data.userNum !== null && data.userNum.die === true) {
        this.$store.commit("stream/killMember", data.userNum - 1);
        this.$store.commit("stream/surviveMemberCheck");
      }

      // if (data.userNum === null) {
      //   console.log(data.message);
      // } else if (data.userNum !== null && data.userNum.die === false) {
      //   console.log(data.message);
      // } else if (data.userNum !== null && data.userNum.die === true) {
      //   console.log(data);
      //   console.log(`${this.$store.state.stream.roomMembers[data.userNum - 1].nickname}의 직업은 ${this.$store.state.stream.roomMembers[data.userNum - 1].job}입니다.`)
      //   this.$store.commit("stream/killMember", data.userNum - 1);
      //   this.$store.commit("stream/surviveMemberCheck");
      // }
      this.$emit("victorySearch");
      // 만약 마피아 != 의사일 경우, killMember를 불러온다.
      // 만약 마피아 == 의사일 경우, 빌보드만 출력한다.
      // 그리고 surviveMemberCheck을 불러오며 결과를 도출한다.
    });
  },
  methods: {
    gameStartBoard() {
      // 게임 시작 메세지를 저장한다.
      // 지금부터 마피아 게임을 시작합니다.
      const roomId = this.$route.params.roomInfo.id;
      this.newMessage = `방 정보 : ${roomId} 번`;
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.newMessage = "지금부터 마피아 게임을 시작하겠습니다.";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.$forceUpdate();
    },
    grantPlayerJobBeforeBoard() {
      this.newMessage = "직업을 부여하고 있습니다...";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.$forceUpdate();
    },
    grantMafia() {
      this.newMessage =
        "당신은 마피아입니다. 오른쪽의 사이드 바에서 자신의 능력과 목표를 확인하세요.";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.$forceUpdate();
    },
    grantPolice() {
      this.newMessage =
        "당신은 경찰입니다. 오른쪽의 사이드 바에서 자신의 능력과 목표를 확인하세요.";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.$forceUpdate();
    },
    grantDoctor() {
      this.newMessage =
        "당신은 의사입니다. 오른쪽의 사이드 바에서 자신의 능력과 목표를 확인하세요.";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.$forceUpdate();
    },
    grantCitizen() {
      this.newMessage =
        "당신은 시민입니다. 오른쪽의 사이드 바에서 자신의 목표를 확인하세요.";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.$forceUpdate();
    },
    morningEventBoard() {
      this.newMessage = "===========================";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.dayCount++;
      this.newMessage = `${this.dayCount}일차`;
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.newMessage = "아침이 되었습니다.";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.newMessage = "===========================";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.$forceUpdate();
    },
    startVoteBoard() {
      // 유저 지목 투표를 시작하는 메세지를 남김
      this.newMessage = "마피아로 의심되는 유저를 지목합니다.";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.$forceUpdate();
    },
    finishVoteBoard() {
      // 유저 지목 결과를 알리는 메세지를 남김
      this.newMessage = "의심 투표 결과를 발표 완료!";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.$forceUpdate();
      // * 만약 유저가 특정되었을 경우
      this.newMessage = `${
        this.$store.state.stream.roomMembers[this.highPlayer - 1].nickname
      }이(가) 마피아 의심 대상으로 지목되었습니다.`;
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.$forceUpdate();
      // ! 만약 유저가 특정되지 않았을 경우
    },
    startPunishmentVoteBoard() {
      this.newMessage = `${
        this.$store.state.stream.roomMembers[this.highPlayer - 1].nickname
      }의 사형 찬반투표를 실시합니다.`;
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.punishmentCam = true;
      this.punishmentBillboard =
        this.$store.state.stream.roomMembers[this.highPlayer - 1].nickname;
      this.$forceUpdate();
    },
    finishPunishmentVoteBoard() {
      // 찬반 투표 결과를 알리는 메세지를 남김
      this.punishmentCam = false;
      this.newMessage = `투표 결과 ${
        this.$store.state.stream.roomMembers[this.highPlayer - 1].nickname
      }를 사형합니다.`;
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      // 플레이어 수 만큼 for문이 돈다. 그리고 모든 유저의 득표수를 보여준다.
      this.$forceUpdate();
    },
    finishPunishmentVoteFalseBoard() {
      this.newMessage = `투표 결과 ${
        this.$store.state.stream.roomMembers[this.highPlayer - 1].nickname
      }를 사형하지 않습니다.`;
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.$forceUpdate();
    },
    nightEventBoard() {
      // 밤이 되었음을 알리는 메세지와
      // 자신의 직업에 따라 다른 메세지를 남김
      this.punishmentCam = false;
      this.newMessage = "===========================";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.newMessage = "밤이 되었습니다. 자신의 능력을 사용할 수 있습니다.";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.newMessage = "===========================";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.$forceUpdate();
      // 만약 경찰일 경우에는 능력의 결과를 지금 출력한다.
    },
    nightResultBoard() {
      // 밤의 능력 사용 결과를 알림
      this.newMessage = "밤 능력사용 종료";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.$forceUpdate();
    },
    mafiaWin() {
      this.newMessage = "===========================";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.newMessage = "마피아의 승리입니다.";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.newMessage = "===========================";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.$forceUpdate();
    },
    citizenWin() {
      this.newMessage = "===========================";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.newMessage = "시민 팀의 승리입니다.";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.newMessage = "===========================";
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage);
      this.$forceUpdate();
    },

    punishmentEvent() {
      var audio3 = new Audio(this.punishmentBgm);
      audio3.play();
      console.log(audio3);
    },
  },
};
</script>

<style lang="scss" scoped></style>
