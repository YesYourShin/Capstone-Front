<template>
  <div id="headermainbox">
    <NuxtLink to="/">
    <img src="@/assets/Logow.png" class="logoimg">
    </NuxtLink>
    <ul id="headerulbox">
      <div class="ulbox">
        <p class="headerlitilte">게임 가이드</p>
        <p class="headerlitilte">랭킹</p>
        <p class="headerlitilte">
          <NuxtLink to="/community/allCommunity" class="lilink">커뮤니티</NuxtLink>
        </p>
        <p class="headerlitilte">고객지원</p>
        <div class="buttonbox">
          <div class="buttonline1"></div>
          <div class="buttonline2"></div>
          <div class="buttonline3"></div>
          <div class="buttonline4"></div>
          <button class="gogame">
                <NuxtLink to="/lobby" class="lilink">게임 하기</NuxtLink>
            </button>
        </div>
      </div>

      <div class="libox">
          <ul class="tilteulbox">
          <li><NuxtLink to="/test" class="lilink">게임 설명</NuxtLink></li>
          <li><NuxtLink to="/" class="lilink">직업 소개</NuxtLink></li>
          <li><NuxtLink to="/" class="lilink">튜토리얼 가이드</NuxtLink></li>
          </ul>

        <ul class="tilteulbox">
          <li><NuxtLink to="/" class="lilink">레벨 랭킹</NuxtLink></li>
          <li><NuxtLink to="/" class="lilink">신뢰도 랭킹</NuxtLink></li>
        </ul>

        <ul class="tilteulbox">
          <li><NuxtLink to="/community/cement" class="lilink">공지 사항</NuxtLink></li>
          <li><NuxtLink to="/community/posta" class="lilink">자유 게시판</NuxtLink></li>
          <li><NuxtLink to="/community/postb" class="lilink">정보 게시판</NuxtLink></li>
          <li><NuxtLink to="/community/postc" class="lilink">인기 게시판</NuxtLink></li>
        </ul>

        <ul class="tilteulbox">
          <li><NuxtLink to="/" class="lilink">문의 하기</NuxtLink></li>
          <li><NuxtLink to="/" class="lilink">신고 하기</NuxtLink></li>
        </ul>
      </div>
    </ul>

  </div>
</template>

<script>
export default {
  name: 'CapstoneHeader',

  data() {
    return {

    };
  },

  methods: {

  },
};
</script>

<style lang="scss" scoped>
@import '~assets/header.scss'
</style>
