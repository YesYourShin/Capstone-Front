<template>
<div>
  <div class="messagebox">
    <ul>
      <p >결과 : {{ voteResult }}</p>
      <li>1플레이어 : {{ player1count }}</li>
      <li>2플레이어 : {{ player2count }}</li>
      <li>3플레이어 : {{ player3count }}</li>
      <li>4플레이어 : {{ player4count }}</li>
      <li>5플레이어 : {{ player5count }}</li>
      <li>6플레이어 : {{ player6count }}</li>
      <li>7플레이어 : {{ player7count }}</li>
      <li>8플레이어 : {{ player8count }}</li>
      <li>9플레이어 : {{ player9count }}</li>
      <li>10플레이어 : {{ player10count }}</li>
    </ul>
  </div>
  <div class="videobox" >
    <script language="javascript">

    </script>
    <video class="usercam1">1</video>
    <video class="usercam2">2</video>
    <video class="usercam3">3</video>
    <video class="usercam4">4</video>
    <video class="usercam5">5</video>
    <video class="usercam6">6</video>
    <video class="usercam7">7</video>
    <video class="usercam8">8</video>
    <video class="usercam9">9</video>
    <video class="usercam10">10</video>
  </div>
  <div class="settingbox">
    <div class="sound_setting">사운드 설정</div>
    <div class="cam_setting">카메라 설정</div>
  </div>
  <div class="timebox">
    <Timer v-on:timeoutEvent="finishVote"></Timer>
  </div>
    <div class="home bg-purple-400 w-full">

  </div>
</div>
</template>

<script>
import Timer from '../components/Timer.vue';
export default {
  name: "App",
  components: {
    Timer
  },

  data() {
    return {
      voteResult: '투',
      player1count : 0,
      player2count : 0,
      player3count : 0,
            player4count : 0,
      player5count : 0,
      player6count : 0,
            player7count : 0,
      player8count : 0,
      player9count : 0,
            player10count : 0,
    };
  },

  mounted() {

  },

  methods: {
    finishVote() {
      this.voteResult = '투표종료'
      this.player1count = Math.floor(Math.random()*10);
      this.player2count = Math.floor(Math.random()*10);
      this.player3count = Math.floor(Math.random()*10);
      this.player4count = Math.floor(Math.random()*10);
      this.player5count = Math.floor(Math.random()*10);
      this.player6count = Math.floor(Math.random()*10);
      this.player7count = Math.floor(Math.random()*10);
      this.player8count = Math.floor(Math.random()*10);
      this.player9count = Math.floor(Math.random()*10);
      this.player10count = Math.floor(Math.random()*10);
    },
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
        .usercam8 {
		position: absolute;
		overflow: visible;
		width: 320px;
		height: 180px;
		left: 610px;
		top: 587px;
    background-color: #ff00ff;
  }
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
