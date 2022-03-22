<template>
  <div class="postMainBox">
    <Header/>
    <div class="mainPost">
      <div class="proFileBox">
        <Profile/>
        <div class="postTitle">
          <ul class="postTitleUl">
            <li class="postTitleLi1">공지 사항</li>
            <li class="postTitleLi">자유 게시판</li>
            <li class="postTitleLi">정보 게시판</li>
            <li class="postTitleLi">인기 게시판</li>
          </ul>
        </div>
      </div>
      <form class="postBox">

            <div class="postBoxbiv1">
              <p>글쓰기</p>
              <button v-on:submit="createBtn">등록</button>
            </div>

            <div class="postBoxbiv2">
              <select class="setBox" v-model="select">
                <option value="post1">공지 사항</option>
                <option value="post2">자유 게시판</option>
                <option value="post3">정보 게시판</option>
                <option value="post4">인기 게시판</option>
              </select>
            </div>

            <div class="postBoxbiv3">
              <textarea name="title" placeholder="제목을 입력해 주세요" v-model="title"></textarea>
            </div>

            <div class="postBoxbiv4">
              <textarea name="content" placeholder="내용을 입력해 주세요" v-model="content"></textarea>
            </div>
      </form>
    </div>
    <Footer/>
  </div>
</template>

<script>
import Header from '../../components/header.vue';
import Profile from '../../components/profile.vue';
import { getMyInformation } from '@/api/mafiaAPI'


export default {
  components: { Header, Profile },
  name: 'CapstonePost',
  data() {
    return {
      title: '',
      content: '',
      select:'',
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
    createBtn(){
      console.log(this.title, this.content);
    }
  },
};
</script>

<style lang="scss" scoped>
@import '~assets/makepost.scss';
</style>
