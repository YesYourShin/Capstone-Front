<template>
  <div class="communitybox">
    <Header/>
    <div class="communitymain">

      <div class="communityProfile">

        <div class="community1">

          <div v-if="this.myInfo">
            <Profile/>
          </div>
          <div v-else>
            <LoginProfile/>
          </div>

        </div>

        <div class="community2">
          <ul class="communityUl">
            <li class="communityLi">
              <NuxtLink to="/community/allCommunity" class="Li">전체 게시판</NuxtLink>
              </li>
            <li class="communityLi1">
                <NuxtLink to="/community/cement" class="Li1">공지 사항</NuxtLink>
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
            <p>공지 사항</p>
          </div>
          <div class="psb2">
            <input type="text">
            <button>찾기</button>
            <button v-if="this.myInfo"><NuxtLink to="/community/makePost">글쓰기</NuxtLink></button>
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

        <ul class="communityPostContent" v-for="item in posts.items" :key="item.id" @click="$router.push('/post/' + item.id)">
          <li class="mtb1">{{ item.id }}</li>
          <li class="mtb2">{{ item.title }}</li>
          <li class="mtb3">{{ item.profile.nickname }}</li>
          <li class="mtb4">{{ item.updatedAt }}</li>
          <li class="mtb5">{{ item.views }}</li>
          <li class="mtb6">{{ item.likeCount }}</li>
        </ul>

        <div class="pagebox">
          <div class="pageNextBox" v-if="posts.meta.totalPages >=1">이전</div>
          <ul v-for="page in posts.meta.totalPages" :key="page.totalPages" class="pageul">
            <li class="pageli">{{ page }}</li>
          </ul>
          <div class="pageNextBox" v-if="posts.meta.totalPages >=1">다음</div>
        </div>


      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import { getPosts } from '@/api/mafiaAPI';

export default {
  name: 'CapstoneCommunity',
  data() {
    return {
      posts: {
        items: {
        },
        links: [],
        meta: {
          itemCount: 0,
          totalItems: 0,
          totalPages: 0,
          currentPage: 0,
        }
      }
    };
  },
  async created (){
   this.$store.dispatch('user/fetchMyInfo')
    try {
      let res = await getPosts({
        category: "공지사항",
        page: this.posts.meta.currentPage + 1})
      // console.log(res.data.data)
      this.posts = res.data.data
    } catch (err) {
     console.log(err)
    }
  },
  computed:{
    myInfo(){
      return this.$store.getters['user/getMyInfo']
    }
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/community.scss';
</style>
