<template lang="">
    <button v-on:click="escapeGame" class="tses">나가기</button>
</template>
<script>
export default {
  props: {
    escape: {
      type: String,
      default: '/lobby',
    }
  },
  methods: {
    escapeGame() {
      this.$router.push(this.escape);
    }
  },
};
</script>
<style lang="scss" scoped>
.tses{
  width: 100%;
  height: 100%;
  text-align: center;
  color: orange;
  font-size: 25px;
  background-color: rgba(255, 255, 255, 0.801);
  border: 4px solid orange;
  padding-top: 5px;
  &:hover{
    animation: color1 0.3s;
    animation-fill-mode: forwards;
  }
}

@keyframes color1{
  0%{

  }
  100%{
    border: 4px solid red;
    color: red;
  }
  }
</style>
