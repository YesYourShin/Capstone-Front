<template lang="">
    <button v-on:click="escapeGame" class="tses">나가기</button>
</template>
<script>
export default {
  methods: {
    escapeGame() {
      this.$swal({
        icon: 'warning',
        title: '게임에서 나가시겠습니까?',
        html: '지금 나가면 패배 처리 되며 이 게임에 다시 들어올 수 없습니다.',
        showDenyButton: true,
        showCancelButton: true,
        denyButtonText: '나가기',
        cancelButtonText: '취소',
        showConfirmButton: false,
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isDenied) {
          // this.$Swal('Changes are not saved', '', 'info')
          this.$router.push('/lobby');
        }
      })
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
