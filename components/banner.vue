<template>
  <div class="slidebox">
    <input type="radio" name="banner" id="banner1"  class="bannerradio" checked>
    <input type="radio" name="banner" id="banner2" class="bannerradio">
    <input type="radio" name="banner" id="banner3" class="bannerradio">
    <ul class="bannerul">
        <li class="bannerli">
          <div>
            <a><img src="@/assets/pageimg/b1.png" class="b1"></a>
          </div>
        </li>
        <li class="bannerli">
          <div>
            <a><img src="@/assets/pageimg/b2.png" class="b2"></a>
          </div>
        </li>
        <li class="bannerli">
          <div>
            <a><img src="@/assets/pageimg/b3.png" class="b3"></a>
          </div>
        </li>
        <div class="banner-control">
          <div class="control1">
            <label for="banner3" class="left"></label>
            <label for="banner2" class="right"></label>
          </div>
          <div class="control2">
            <label for="banner1" class="left"></label>
            <label for="banner3" class="right"></label>
          </div>
          <div class="control3">
            <label for="banner2" class="left"></label>
            <label for="banner1" class="right"></label>
          </div>
        </div>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CapstoneBanner',

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
@import '~assets/banner.scss';
</style>
