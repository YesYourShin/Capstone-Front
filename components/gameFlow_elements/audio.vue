<template>
  <div class="audioBox">
    <audio class="nightAudio" :src="require('@/assets/ingameBgm/night.wav')" controls></audio>
    <audio class="morningAudio" :src="require('@/assets/ingameBgm/morning.wav')" controls></audio>
  </div>

</template>

<script>
export default {

  data() {
    return {

    }
  },
  methods: {
    // // 아침 배경 전환시 발생
    // morningTimeEvent() {

    // },

    // // 저녁 배경 전환시 발생..
    // nightTimeEvent() {

    // },

    // // 유저 심판 투표 찬성 후 사형시 발생
    // punishmentEvent() {

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
