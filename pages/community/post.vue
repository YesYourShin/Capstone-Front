<template>
  <div class="postMainBox">
    <Header/>
    <div class="mainPost">
      <div>
        <Profile/>
      </div>
      <div class="postBox">
        <div class="postBoxContent1">
          <NuxtLink to="/community/cement"><p>공지사항 ></p></NuxtLink>
        </div>
        <div class="postBoxContent2">
          <p>[점검] 2/24(목) 임시 점검 안내</p>
        </div>
        <div class="postBoxContent3">
          <img src="@/assets/pageimg/test.jpg">
        </div>
        <div class="postBoxContent4">
          <p class="PBC1">관리자</p>
          <div>2022.02.23 11:32 조회 199</div>
          <div>댓글 3&nbsp;&nbsp;좋아요 5</div>
        </div>
        <div class="postBoxContent5">
          <img src="@/assets/pageimg/test.jpg">
        </div>
        <div class="postBoxContent6">
          <p>
            서버 최적화를 위해 일부 서버를 대상으로 임시 점검을 진행할 예정이니<br>
            자세한 사항은 아래 내용을 확인해주시길 바랍니다.<br>
            감사합니다.
          </p>
        </div>
        <div class="postBoxContent7">
          <p class="PBC1">관리자</p><p class="PBC2">님의 게시글더보기 ></p>
        </div>
        <div class="postBoxContent8">
          <p>좋아요 5 댓글 3</p>
        </div>
        <div class="commentBox">
          <div class="commentBox1">
            <div>댓글</div>
            <div>등록순&nbsp;&nbsp;&nbsp;최신순</div>
          </div>
          <div class="commentBox2">
            <img src="@/assets/pageimg/test.jpg">
            <div class="commentBox3">
              <p class="PBC1">Mirai</p>
              <p class="PBC2">점검 언제끝남?</p>
              <p class="PBC3">2022.02.23 11:41</p>
            </div>
          </div>
          <div class="commentBox2">
            <img src="@/assets/pageimg/test.jpg">
            <div class="commentBox3">
              <p class="PBC1">NOA</p>
              <p class="PBC2">오류 해결 부탁합니다.</p>
              <p class="PBC3">2022.02.23 11:41</p>
            </div>
          </div>
          <div class="commentBox4">
            <label for="commentBox"  class="PBC1">Mirai</label>
            <input type="text" id="commentBox" class="PBC2">
            <div class="flex justify-end px-5 my-1">
              <button class="PBC3">등록</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Header from '../../components/header.vue';
import Profile from '../../components/profile.vue';
export default {
  components: { Header, Profile },
  name: 'CapstonePost',
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
@import '~assets/post.scss';
</style>
