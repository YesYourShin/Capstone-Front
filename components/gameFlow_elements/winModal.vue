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
      let timerInterval
      this.$swal({
        title: '시민의 승리입니다.',
        html: '잠시 후 게임을 종료하고<b></b> 로비로 돌아갑니다.',
        timer: 2000,
        timerProgressBar: true,
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === this.$swal.DismissReason.timer) {
          this.$emit('escapeGame')
          console.log('I was closed by the timer')
        }
      })
    },
    mafiaWin() {
      let timerInterval
      this.$swal({
        title: '마피아의 승리입니다.',
        html: '잠시 후 게임을 종료하고 로비로 돌아갑니다.',
        timer: 2000,
        timerProgressBar: true,
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === this.$swal.DismissReason.timer) {
          this.$emit('escapeGame')
          console.log('I was closed by the timer')
        }
      })
    }
    }

}
</script>

<style>

</style>
