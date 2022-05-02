<template>
  <div>
    <div>
      <div class="text-lg" v-show="countStart">Day {{dayCount}}</div>
    </div>
  </div>
</template>

<script>
// 현재 유저들의 날짜를 보여준다.
export default {
  name: "dayCount",
  data() {
    return {
      dayCount: 0,
      countStart: false
    }
  },
  methods: {
    nextDay() {
      this.dayCount++
      console.log(this.dayCount)
      if (this.dayCount > 0) {
        this.countStart = true;
      }
    }
  }
}
</script>

<style>

</style>
