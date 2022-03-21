<template>
    <div class="guideBox">
      <Header/>
      <div class="mainGuideBox">
        <NuxtLink to="/guide/gameGuide" class="giudeCard1">
        <div>
          <p>게임 설명</p>
        </div>
        </NuxtLink>
        <NuxtLink to="/guide/gameJob" class="giudeCard2">
        <div>
          <p>직업 소개</p>
        </div>
        </NuxtLink>
        <NuxtLink to="/guide/tutorialGuide" class="giudeCard3">
        <div>
          <p>튜토리얼 가이드</p>
        </div>
        </NuxtLink>
      </div>
      <Footer/>
    </div>
</template>

<script>
export default {
  name: 'CapstoneAllguide',

  data() {
    return {

    };
  },

  mounted() {

  },

  methods: {

  },
};
</script>

<style lang="scss" scoped>
@import '~assets/allGuide.scss'
</style>
