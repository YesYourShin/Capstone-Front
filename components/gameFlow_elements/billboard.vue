<template>
  <div class="messagebox">
    <!-- <ul> -->
      <h3>상태메세지 : {{ this.$parent.flowMessage }}</h3>
      <!-- <h3>선정 유저 : {{ this.$parent.electedPlayers+1 }}</h3> -->

      <!-- <li
        v-show="voteShow"
        v-for="indexs in this.$parent.playerVote"
        :key="'a' + indexs"
      >
        플레이어 : {{ indexs }}
      </li> -->
      <!-- <li v-show="" v-for="(c, index) in this.$parent.playerJob" :key="index">{{c}}</li> -->
      <!-- <li v-show="votePunishment">
        찬성 : + {{ this.$parent.punishmentPros }}
      </li>
      <li v-show="votePunishment">
        반대 : + {{ this.$parent.punishmentCons }}
      </li> -->
    <!-- </ul> -->
  </div>
</template>

<script>
export default {
  methods: {
    voteBillboard() {
      (this.votePunishment = false), (this.voteShow = true);
    },
    punishmentVoteBillboard() {
      (this.votePunishment = true), (this.voteShow = false);
    },
    finishAllVote() {
      (this.votePunishment = false), (this.voteShow = false);
    },
  },
  data() {
    return {
      votePunishment: false,
      voteShow: false,
    };
  },
};
</script>

<style lang="scss" scoped></style>
