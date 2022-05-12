<template>
  <div class="postMainBox">
    <Header/>
    <div class="mainPost" v-if="this.myInfo">
      <Banner/>
      <div class="allbox">
        <div class="proFileBox">
          <div class="linebox1">
            <Profile/>
          </div>
          <div class="linebox2">
            <ul>
              <NuxtLink to="/community/allCommunity">
                <li>전체 게시판</li>
              </NuxtLink>
              <NuxtLink to="/community/cement">
                <li>공지 사항</li>
              </NuxtLink>
              <NuxtLink to="/community/posta">
                <li>자유 게시판</li>
              </NuxtLink>
              <NuxtLink to="/community/postb">
                <li>정보 게시판</li>
              </NuxtLink>
              <NuxtLink to="/community/postc">
                <li>인기 게시판</li>
              </NuxtLink>
            </ul>
          </div>
        </div>
      <div class="postBox">
        <div class="postBoxContent1">
          <p>{{ post.categoryName }}</p>
          <div class="userbtn" v-if="post.profile && this.post.profile.id === this.myInfo.id">
            <button  @click="$router.push('/repost/' + post.id)">수정</button>
            <button @click="delet"
            onclick="document.location.href='/community/allCommunity'">삭제</button>
          </div>
          <div class="userbtn" v-else>
          </div>
        </div>
        <div class="postBoxContent2">
          <p>{{ post.title }}</p>
        </div>
        <div class="postBoxContent3">
          <img src="@/assets/pageimg/test.jpg">
        </div>
        <div class="postBoxContent4">
          <p class="PBC1" v-if="post.profile">{{ post.profile.nickname }}</p>
          <div>{{ post.updatedAt }} 조회 199</div>
          <div>댓글 3&nbsp;&nbsp;좋아요 {{ post.likeCount }}</div>
        </div>
        <div class="postBoxContent5">
            <!-- {{ post.img }} -->
        </div>
        <div class="postBoxContent6">
          <p>
            {{ post.content }}
          </p>
        </div>
        <div class="postBoxContent7">
          <p class="PBC1" v-if="post.profile">{{ post.profile.nickname }}</p><p class="PBC2">님의 게시글더보기 ></p>
        </div>
        <div class="postBoxContent8">
          <p>좋아요 {{ post.likeCount }} 댓글 3</p>
        </div>
        <div class="commentBox">
          <div class="commentBox1">
            <div>댓글</div>
            <div>등록순&nbsp;&nbsp;&nbsp;최신순</div>
          </div>
          <div class="commentBox2" v-for="item in comment" :key="item">
            <img src="@/assets/pageimg/test.png">
            <div class="commentBox3">
              <p class="PBC1">Mirai</p>
              <p class="PBC2">{{ item }}</p>
              <p class="PBC3">2022.02.23 11:41</p>
          </div>
          </div>
            <div class="commentBox4" v-if="this.myInfo">
              <label for="commentBox"  class="PBC1" v-if="this.myInfo.profile">{{ this.myInfo.profile.nickname }}</label>
              <label for="commentBox"  class="PBC1" v-else>{{this.myInfo.id}}</label>
              <form @submit.prevent="submitComment">
                  <div>
                    <input type="text" id="commentBox" class="PBC2" v-model="comment.content">
                  </div>
                  <div>
                    <input type="submit" class="PBC3" value="등록">
                    <!-- onclick="window.location.reload()" -->
                  </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
</template>

<script>
import dayjs from "dayjs";
import Header from '../../components/header.vue';
import Profile from '../../components/profile.vue';
import { detailPost,deletePost,saveComment } from '@/api/mafiaAPI';

export default {
  components: { Header, Profile },
  name: 'CapstonePost',
  data() {
    return {
      post:{
        id: '',
        title: '',
        content: '',
        updatedAt: '',
      },
      comment:{
        content:'',
      }
    };
  },
  async created (){
   this.$store.dispatch('user/fetchMyInfo')
    try {
      let res = await detailPost(this.$route.params.id)
      this.post = res.data.data
        }catch (err) {
      console.log(err)
        }
    this.post.updatedAt = dayjs(this.post.updatedAt).format("YYYY-MM-DD")
  },
  computed:{
    myInfo(){
      return this.$store.getters['user/getMyInfo']
    }
  },
  mounted(){
  },
  methods: {
    delet(){
      try {
      deletePost(this.$route.params.id)
      }catch(err){
        console.log(err)
      }
    },
    submitComment() {
      saveComment(this.post.id, this.comment)
        .then((res)=>{
          console.log(this.comment)
        })
        .catch((err)=>{
          console.log(error)
        })
    },
  }
};
</script>

<style lang="scss" scoped>
@import '~assets/post.scss';
</style>
