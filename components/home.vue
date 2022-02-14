<template>
  <div class="homeBox">
    <div class="bannerBox">
      <Banner/>
    </div>
    <div class="homeProFile">
      <Profile/>
      <div class="guideBox">
        <div class="guides1">
          <img src="@/assets/homeimg/ny1.png" class="yimg1">
          <div class="gpBox">
            <p class="gp1">게임 가이드</p>
            <p class="gp2">초심자를 위한 가이드</p>
          </div>
        </div>
        <div class="guides2">
          <img src="@/assets/homeimg/ny2.png" class="yimg2">
          <div class="gpBox">
            <p class="gp1">직업&능력</p>
            <p class="gp2">모든 직업 정보 확인하기</p>
          </div>
        </div>
        <div class="guides3">
          <img src="@/assets/homeimg/ny3.png" class="yimg3">
          <div class="gpBox">
            <p class="gp1">고객 서비스</p>
            <p class="gp2">문의 및 신고</p>
          </div>
        </div>
      </div>
    </div>

    <div class="rankUserBox">
      <p class="rankUser">주간 랭크 순위</p>
      <ul class="rankNumbers">
        <li class="rankNumber">4</li>
        <li class="rankNumber">2</li>
        <li class="rankNumber1">1</li>
        <li class="rankNumber">3</li>
        <li class="rankNumber">5</li>
      </ul>

      <ul class="rankUserImges">
        <li class="rankUserImg">
          <img src="@/assets/pageimg/test.jpg">
        </li>
        <li class="rankUserImg">
          <img src="@/assets/pageimg/test.jpg">
        </li>
        <li class="rankUserImg">
          <img src="@/assets/pageimg/test.jpg" class="rankUserImg1">
        </li>
        <li class="rankUserImg">
          <img src="@/assets/pageimg/test.jpg">
        </li>
        <li class="rankUserImg">
          <img src="@/assets/pageimg/test.jpg">
        </li>
      </ul>

      <ul class="rankUserNames">
        <li class="rankUserName">MIRAI0625</li>
        <li class="rankUserName">MIRAI0625</li>
        <li class="rankUserName1">MIRAI0625</li>
        <li class="rankUserName">MIRAI0625</li>
        <li class="rankUserName">MIRAI0625</li>
      </ul>

    </div>

    <div class="readBox">
      <input type="radio" name="readtab" id="tab2" checked>
      <label for="tab2">자유 게시판</label>
      <input type="radio" name="readtab" id="tab1"  >
      <label for="tab1">공지 사항</label>
      <input type="radio" name="readtab" id="tab3" >
      <label for="tab3" >인기 게시판</label>

      <div class="tabcontent box1">
        <div class="tabtitlebox">
          <p class="mtb1"></p>
          <p class="mtb2">제목</p>
          <p class="mtb3">작성자</p>
          <p class="mtb4">작성일</p>
          <p class="mtb5">조회</p>
          <p class="mtb6">좋아요</p>
        </div>
        <div class="montpostbox">
          <p class="mtb1">3</p>
          <p class="mtb2">[공지] 1.2.21 버전 업데이트 안내</p>
          <p class="mtb3">관리자</p>
          <p class="mtb4">2022-02-15</p>
          <p class="mtb5">44</p>
          <p class="mtb6">28</p>
        </div>

        <div class="montpostbox">
          <p class="mtb1">2</p>
          <p class="mtb2">신규 모드 추가 안내</p>
          <p class="mtb3">관리자</p>
          <p class="mtb4">2022-02-010</p>
          <p class="mtb5">535</p>
          <p class="mtb6">105</p>
        </div>

        <div class="montpostbox">
          <p class="mtb1">1</p>
          <p class="mtb2">[공지] 마피아 게임 일부 오류 안내(수정완료)</p>
          <p class="mtb3">관리자</p>
          <p class="mtb4">2022-02-08</p>
          <p class="mtb5">145</p>
          <p class="mtb6">58</p>
        </div>

      </div>
      <div class="tabcontent box2">
        <div class="tabtitlebox">
          <p class="mtb1"></p>
          <p class="mtb2">제목</p>
          <p class="mtb3">작성자</p>
          <p class="mtb4">작성일</p>
          <p class="mtb5">조회</p>
          <p class="mtb6">좋아요</p>
        </div>
        <div class="montpostbox">
          <p class="mtb1">14</p>
          <p class="mtb2">빠른 대전 인원 3명구합니다.</p>
          <p class="mtb3">마피아84</p>
          <p class="mtb4">2022-02-18</p>
          <p class="mtb5">25</p>
          <p class="mtb6">8</p>
        </div>
        <div class="montpostbox">
          <p class="mtb1">15</p>
          <p class="mtb2">[공지] 마피아 게임 일부 오류 안내(수정완료)</p>
          <p class="mtb3">관리자</p>
          <p class="mtb4">2022-02-08</p>
          <p class="mtb5">145</p>
          <p class="mtb6">58</p>
        </div>
        <div class="montpostbox">
          <p class="mtb1">1</p>
          <p class="mtb2">[공지] 마피아 게임 일부 오류 안내(수정완료)</p>
          <p class="mtb3">관리자</p>
          <p class="mtb4">2022-02-08</p>
          <p class="mtb5">145</p>
          <p class="mtb6">58</p>
        </div>
        <div class="montpostbox">
          <p class="mtb1">15</p>
          <p class="mtb2">[공지] 마피아 게임 일부 오류 안내(수정완료)</p>
          <p class="mtb3">관리자</p>
          <p class="mtb4">2022-02-08</p>
          <p class="mtb5">145</p>
          <p class="mtb6">58</p>
        </div>
        <div class="montpostbox">
          <p class="mtb1">31</p>
          <p class="mtb2">[공지] 마피아 게임 일부 오류 안내(수정완료)</p>
          <p class="mtb3">관리자</p>
          <p class="mtb4">2022-02-08</p>
          <p class="mtb5">145</p>
          <p class="mtb6">58</p>
        </div>
      </div>
      <div class="tabcontent box3">
        <div class="tabtitlebox">
          <p class="mtb1"></p>
          <p class="mtb2">제목</p>
          <p class="mtb3">작성자</p>
          <p class="mtb4">작성일</p>
          <p class="mtb5">조회</p>
          <p class="mtb6">좋아요</p>
        </div>
        <div class="montpostbox">
          <p class="mtb1">5</p>
          <p class="mtb2">마피아 공략법 15.4.1</p>
          <p class="mtb3">형사</p>
          <p class="mtb4">2022-02-08</p>
          <p class="mtb5">135</p>
          <p class="mtb6">64</p>
        </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  name: 'CapstoneHome',

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
@import '~assets/home.scss';
</style>
