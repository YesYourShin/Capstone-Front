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

    created() {
      let timerInterval
      this.$nuxt.$on('myVoteResult', (voteNum) => {
        console.log(voteNum)
        this.$swal({
          // icon: 'success',
          title: voteNum + '번에게 투표',
          html: 'OX 표시로 투표 값을 서버로 전송합니다.',
          timer: 1000,
          timerProgressBar: true,
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === this.$swal.DismissReason.timer) {
            console.log('vote 결과 출력')
          }
        })
      })
    },

    methods: {
      voteModal() {

      },
      punishModal() {

      },

    }

  }

</script>
<style scoped>


</style>
