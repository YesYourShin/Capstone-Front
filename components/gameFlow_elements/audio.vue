<template>
  <div>
    <!-- <audio :src="require('@/assets/ingameBgm/night.mp3')" controls></audio> -->
    <!-- <audio :src="require('@/assets/ingameBgm/night.mp3')" controls></audio> -->
  </div>
</template>

<script>
const nightBgm = require('@/assets/ingameBgm/night.wav').default
const morningBgm = require('@/assets/ingameBgm/morning.wav').default
const punishmentBgm = require('@/assets/ingameBgm/punishment.mp3').default
export default {

  data() {
    return {
      nightBgm,
      morningBgm,
      punishmentBgm
    }
  },
  methods: {
    // // 아침 배경 전환시 발생
    morningBgmEvent() {
      var audio = new Audio(this.morningBgm);
      audio.play();
      console.log(audio);
    },

    // // 저녁 배경 전환시 발생..
    nightBgmEvent() {
      var audio2 = new Audio(this.nightBgm);
      audio2.play();
      console.log(audio2);
    },

    // // 유저 심판 투표 찬성 후 사형시 발생
    // ! 퍼니시는 빌보드로 이동시켜놨음
    // punishmentEvent() {
    //   var audio3 = new Audio(this.punishmentBgm);
    //   audio3.play();
    //   console.log(audio3);
    // },

    // this.nightAudio = document.querySelector('.nightAudio')
    // this.morningAudio = document.querySelector('.morningAudio')
    // this.nightAudio.volumne = 0.1
    // this.morningAudio.volumne = 0.1
  }

}
</script>

<style lang="scss" scoped="scoped">
@import "~assets/audio.scss";
</style>
