<template>
  <div>

  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    citizenWin() {
      this.$swal({
        title: '시민의 승리입니다.',
        html: '잠시 후 게임을 종료하고 로비로 돌아갑니다.',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        backdrop: `
          rgba(130,202,250,0.4)
        `
      }).then((result) => {
        if (result.dismiss === this.$swal.DismissReason.timer) {
          this.$emit('gameFinish')
          console.log('I was closed by the timer')
        }
      })
    },
    mafiaWin() {
      this.$swal({
        title: '마피아의 승리입니다.',
        html: '잠시 후 게임을 종료하고 로비로 돌아갑니다.',
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        backdrop: `
          rgba(219,0,0,0.4)
        `
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === this.$swal.DismissReason.timer) {
          this.$emit('gameFinish')
          console.log('I was closed by the timer')
        }
      })
    }
    }

}
</script>

<style>

</style>
