<template>
  <div class="postMainBox">
    <Header />
    <div class="mainPost">
      <div class="proFileBox">
        <Profile />
        <div class="postTitle">
          <ul class="postTitleUl">
            <li class="postTitleLi1">공지 사항</li>
            <li class="postTitleLi">자유 게시판</li>
            <li class="postTitleLi">정보 게시판</li>
            <li class="postTitleLi">인기 게시판</li>
          </ul>
        </div>
      </div>
      <form class="postBox" @submit.prevent="submitPost">

            <div class="postBoxbiv1">
              <p>글쓰기</p>
              <input type="submit" class="gobtn" value="등록">
              <!-- onclick="document.location.href='/community/allCommunity'"               -->
            </div>

            <div class="postBoxbiv2">
              <select class="setBox" v-model="post.postCategoryId">
                <option :value="1">공지 사항</option>
                <option :value="2">자유 게시판</option>
                <option :value="3">정보 게시판</option>
              </select>
            </div>

            <div class="postBoxbiv3">
              <textarea name="title" placeholder="제목을 입력해 주세요" v-model="post.title"></textarea>
            </div>

            <div class="postBoxbiv4">
              <textarea name="content" placeholder="내용을 입력해 주세요" v-model="post.content"></textarea>
            </div>
      </form>
    </div>
    <Footer />
  </div>
</template>

<script>
import Header from '../../components/header.vue';
import Profile from '../../components/profile.vue';
import { savePost,getMyInformation } from '@/api/mafiaAPI';


export default {
  components: { Header, Profile },
  name: "CapstonePost",
  data() {
    return {
      post: {
        title: null,
        content: null,
        postCategoryId: 1,
        },
      data:{
          data:[],
          }
    };
  },

  async mounted() {
    const response = await getMyInformation()
    this.data = response.data
  },

  methods: {
    submitPost() {
      console.log(this.post);
      // this.post.postCategoryId = parseInt(this.)
      savePost(this.post)
        .then((res)=>{
        })
        .catch((err)=>{
          console.log(error)
        })
    },
  },

};
</script>

<style lang="scss" scoped>
@import "~assets/makePost.scss";
</style>
