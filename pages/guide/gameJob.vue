<template>
  <div class="jobBox">
    <Header/>
    <div class="jobMainBox">
          <div class="jobTitle">
              <div class="jobLabelBox">
                <label for="job1" class="jobLabel" :style="picked === 'job1' ? {color: 'orange',background:'rgb(92, 92, 92)'} : {}">마피아</label>
                <label for="job2" class="jobLabel" :style="picked === 'job2' ? {color: 'orange',background:'rgb(92, 92, 92)'} : {}">경찰</label>
                <label for="job3" class="jobLabel" :style="picked === 'job3' ? {color: 'orange',background:'rgb(92, 92, 92)'} : {}">의사</label>
              </div>
              <input type="radio" name="jobmenu" id="job1" value="job1" v-model="picked">
              <input type="radio" id="job2" name="jobmenu" value="job2" v-model="picked">
              <input type="radio" id="job3" name="jobmenu" value="job3" v-model="picked">

              <div v-if="picked === 'job1'" class="jobBox"  id="con1">
                <img src="@/assets/pageimg/y3.png" class="mimg1">
                <p class="mp1">MAFIA</p>
                <p class="mp2">마피아</p>
                <div class="ctentBox1">
                  <p class="p1">" 행운은 미소지은 뒤에 배신하는 법이지..."</p>
                  <p class="p2">[ 저격 ] 밤이되면 한명의 플레이어를 죽일수있다.</p>
                </div>
              </div>
              <div v-else-if="picked === 'job2'" class="jobBox"  id="con2">
                <img src="@/assets/pageimg/y1.png" class="mimg2">
                <p class="mp1">POLICE</p>
                <p class="mp2">경찰</p>
                <div class="ctentBox2">
                  <p>"변호인 선임할 수 있고, 진술 거부할 수 있고, 무비권을 행사할수있어."</p>
                  <p>[ 수사 ] 밤이되면 한명의 플레이어를 선택해 마피아 여부를 알아낼수있다.</p>
                </div>
              </div>
              <div v-else-if="picked === 'job3'" class="jobBox"  id="con3">
                <img src="@/assets/pageimg/y2.png" class="mimg3">
                <p class="mp1">DOCTOR</p>
                <p class="mp2">의사</p>
                <div class="ctentBox3">
                  <p>나는 알게된 환자의 비밀을 사망한 이후에라도 누설하지 않을 것 이다
                    <br>- 히포크라테스 선서 -</p>
                  <p>[ 수술 ] 밤이되면 한명의 플레이어를 마피아로부터 지킬수있다.</p>
                </div>
              </div>
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
      picked: 'job1'
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
