<template>
  <div class="messagebox overflow-y-auto">
    <div class="">
      <ul>
        <li v-for="(logs, key) in messageLogs" :key="key">{{
          logs }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      messageLogs : [],
      newMessage: null,
      dayCount: 0,
    }
  },
  props: {

  },
  created() {
    this.messageLogs = ['Fafia Start']
  },
  methods: {
    gameStartBoard() {
      // 게임 시작 메세지를 저장한다.
      // 지금부터 마피아 게임을 시작합니다.
      const roomId = this.$route.params.roomInfo.id
      this.newMessage = `방 정보 : ${roomId} 번`
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.newMessage = '지금부터 마피아 게임을 시작하겠습니다.'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
      console.log(this.messageLogs)
    },
    grantPlayerJobBeforeBoard() {
      this.newMessage = '직업을 부여하고 있습니다...'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
      console.log(this.messageLogs)
    },
    grantMafia() {
      this.newMessage = '당신은 마피아입니다. 오른쪽의 사이드 바에서 자신의 능력과 목표를 확인하세요.'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
      console.log(this.messageLogs)
    },
    grantPolice() {
      this.newMessage = '당신은 경찰입니다. 오른쪽의 사이드 바에서 자신의 능력과 목표를 확인하세요.'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
      console.log(this.messageLogs)
    },
    grantDoctor() {
      this.newMessage = '당신은 의사입니다. 오른쪽의 사이드 바에서 자신의 능력과 목표를 확인하세요.'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
      console.log(this.messageLogs)
    },
    grantCitizen() {
      this.newMessage = '당신은 시민입니다. 오른쪽의 사이드 바에서 자신의 목표를 확인하세요.'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
      console.log(this.messageLogs)
    },
    morningEventBoard() {
      this.newMessage = '==========================='
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.dayCount++
      this.newMessage = `${this.dayCount}일차`
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.newMessage = '아침이 되었습니다.'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.newMessage = '==========================='
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
    },
    startVoteBoard() {
      // 유저 지목 투표를 시작하는 메세지를 남김
      this.newMessage = '마피아로 의심되는 유저를 지목합니다.'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
    },
    finishVoteBoard() {
      // 유저 지목 결과를 알리는 메세지를 남김
      this.newMessage = '의심 투표 결과를 발표합니다.'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
      this.newMessage = '목공풀 -> 임채환, 임채환 -> 목공풀, 17시간코딩법 -> 목공풀'
      // 이거 만드려면, 방 안에 있는 모든 유저의 닉네임 정보가 필요함
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
      this.newMessage = '목공풀이(가) 마피아 의심 대상으로 지목되었습니다.'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
    },
    startPunishmentVoteBoard() {
      this.newMessage = '목공풀의 사형 찬반투표를 실시합니다.'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
    },
    finishPunishmentVoteBoard() {
      // 찬반 투표 결과를 알리는 메세지를 남김
      this.newMessage = '투표 결과'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      // 플레이어 수 만큼 for문이 돈다. 그리고 모든 유저의 득표수를 보여준다.
      this.newMessage = '1플레이어 : 1'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
    },
    nightEventBoard() {
      // 밤이 되었음을 알리는 메세지와
      // 자신의 직업에 따라 다른 메세지를 남김
      this.newMessage = '==========================='
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.newMessage = '밤이 되었습니다. 자신의 능력을 사용할 수 있습니다.'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.newMessage = '==========================='
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
      // 만약 경찰일 경우에는 능력의 결과를 지금 출력한다.
    },
    nightResultBoard() {
      // 밤의 능력 사용 결과를 알림
      this.newMessage = '밤 능력사용 종료'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
    },
    mafiaWin() {
      this.newMessage = '==========================='
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.newMessage = '마피아의 승리입니다.'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.newMessage = '==========================='
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
    },
    citizenWin() {
      this.newMessage = '==========================='
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.newMessage = '시민 팀의 승리입니다.'
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.newMessage = '==========================='
      this.messageLogs.splice(this.messageLogs.length, 0, this.newMessage)
      this.$forceUpdate();
    }
  },
};
</script>

<style lang="scss" scoped></style>
