<template>
  <div class="communitybox">
    <Header/>
    <div class="communitymain">
      <div class="communityProfile">
        <div class="communityTitle">
          <Profile/>
          <ul class="communityUl">
            <li class="communityLi1">
              <NuxtLink to="/community/allCommunity" class="Li1">전체 게시판</NuxtLink>
              </li>
            <li class="communityLi">
                <NuxtLink to="/community/cement" class="Li">공지 사항</NuxtLink>
            </li>
            <li class="communityLi">
                <NuxtLink to="/community/posta" class="Li">자유 게시판</NuxtLink>
            </li>
            <li class="communityLi">
                <NuxtLink to="/community/postb" class="Li">정보 게시판</NuxtLink>
            </li>
            <li class="communityLi">
                <NuxtLink to="/community/postc" class="Li">인기 게시판</NuxtLink>
            </li>
          </ul>
        </div>
      </div>
      <div class="communityPost">

        <div class="communityPostSerchBox">
          <div class="psb1">
            <p>전체 게시판</p>
          </div>
          <div class="psb2">
            <input type="text">
            <button>찾기</button>
            <button><NuxtLink to="/community/post">글쓰기</NuxtLink></button>
          </div>
        </div>

        <div class="communityPostTitle">
          <p class="mtb1"></p>
          <p class="mtb2">제목</p>
          <p class="mtb3">작성자</p>
          <p class="mtb4">작성일</p>
          <p class="mtb5">조회</p>
          <p class="mtb6">좋아요</p>
        </div>

      <NuxtLink to="/community/post">
        <div class="communityPostContent">
          <p class="mtb1">1</p>
          <p class="mtb2">[공지] 마피아 게임 일부 오류 안내(수정완료)</p>
          <p class="mtb3">관리자</p>
          <p class="mtb4">2022-02-28</p>
          <p class="mtb5">25</p>
          <p class="mtb6">58</p>
        </div>
      </NuxtLink>

      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
export default {
  name: 'CapstoneCommunity',

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
@import '~assets/community.scss';
</style>
