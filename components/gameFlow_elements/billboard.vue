<template>
  <div class="messagebox">
    <ul>
      <h3>상태메세지 : {{ this.$parent.flowMessage }}</h3>
      <h3>최다 선정 유저 : {{ this.$parent.electedPlayers+1 }}</h3>
      <li v-show="dd" v-for="index in this.$parent.playerVote" :key="index"
      >{{index}}</li>
      <li v-show="ss" v-for="(c, index) in this.$parent.playerJob" :key="index">{{c}}</li>
      <li v-show="aa" v-for="index in this.$parent.playerPros" :key="index">{{index}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    // billboardVote: {
    //   type: Array,
    // }
  },
  data() {
    return {
      aa: false,
      ss: false,
      dd: true,
    }
  }
}
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
</style>
