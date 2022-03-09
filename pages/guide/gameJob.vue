<template>
  <div class="jobBox">
    <Header/>
    <Banner/>
    <div class="jobMainBox">
          <div class="jobTitle">
              <div class="jobLabelBox">
                <label for="job1" class="jobLabel">마피아</label>
                <label for="job2" class="jobLabel">경찰</label>
                <label for="job3" class="jobLabel">의사</label>
              </div>
                <input type="radio" name="jobmenu" id="job1" checked>
                <input type="radio" id="job2" name="jobmenu">
                <input type="radio" id="job3" name="jobmenu">

              <div class="jobBox con1">컨텐츠 내용1</div>
              <div class="jobBox con2">컨텐츠 내용2</div>
              <div class="jobBox con3">컨텐츠 내용3</div>
          </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
export default {
  name: 'CapstoneGamejob',

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
@import '~assets/gamejob.scss'
</style>
