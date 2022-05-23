<template>
  <div class="fullProfile h-screen flex flex-col">
    <div class="profileBox">
      <div class="profile1">
        <template v-if="myInfo">
          <img
            v-if="myInfo.profile.image"
            v-bind:src="myInfo.profile.image.location"
            class="profileImg"
          />
          <img v-else src="@/assets/pageimg/test.png" class="profileImg" />
        </template>
        <!-- <img src="@/assets/pageimg/test.png" class="profileimg" /> -->
      </div>

      <div class="profile2" v-if="myInfo">
        <button class="userlink">
          <NuxtLink to="/mypage" class="btnlink">MyPage</NuxtLink>
        </button>
        <button class="userlink" @click="logout">Logout</button>
        <p class="userlevel">
          Lv.{{ myInfo.profile.level }}
          <span class="username" v-if="myInfo.profile">
            {{ myInfo.profile.nickname }}
          </span>
          <span class="username" v-else> ID : {{ myInfo.id }} </span>
        </p>
        <p class="usertext" v-if="myInfo.profile">
          {{ myInfo.profile.selfIntroduction }}
        </p>
        <p class="usertext" v-else>상태메세지를 입력해주세요.</p>
      </div>

      <div class="profile3 w-full h-[50px] text-white text-2xl flex">
        <button
          class="profileButton h-full w-1/3 flex items-center justify-center"
          v-on:click="friend"
        >
          친구
        </button>
        <button
          class="profileButton h-full w-1/3 flex items-center justify-center relative"
          v-on:click="notification"
        >
          알림
          <div
            v-if="myNotifications.length"
            class="rounded-full bg-red-500 inline-block leading-6 text-center text-sm aspect-square w-6 absolute right-5 pr-0.5"
          >
            {{ myNotifications.length > 99 ? "99+" : myNotifications.length }}
          </div>
        </button>
        <button
          class="profileButton h-full w-1/3 flex items-center justify-center"
          v-on:click="record"
        >
          전적
        </button>
      </div>
    </div>
    <UserSearch v-if="show1"></UserSearch>
    <div class="h-full flex flex-col overflow-auto" v-if="show1">
      <div class="profile4 grow">
        <friend-bar @handleClick="handleClick"></friend-bar>
      </div>
    </div>

    <div class="h-full flex flex-col overflow-auto" v-if="show2">
      <div class="profileAlert grow">
        <Notifications :notifications="myNotifications"></Notifications>
      </div>
    </div>

    <!-- <div id="score" class="profile6 grow overflow-auto" v-if="show3">
      <p>전적</p>
      <Score :record="myRecord"></Score>
    </div> -->
    <Score :record="myRecord" v-if="show3"></Score>
  </div>
</template>

<script>
import FriendBar from "./profile_elements/friendBar.vue";
import UserSearch from "./profile_elements/UserSearch.vue";
import Notifications from "./profile_elements/Notifications.vue";
import Score from "./profile_elements/score.vue";
import { logout, deleteFriend, roomInvite } from "@/api/mafiaAPI";
export default {
  name: "CapstoneProfile",

  components: {
    FriendBar,
    UserSearch,
    Notifications,
    Score,
  },

  data() {
    return {
      show1: true,
      show2: false,
      show3: false,
    };
  },

  mounted() {
    // console.log(
    //   "score clientHeight : " + document.getElementById("score").clientHeight
    // );
    // document.getElementById("score")
    // console.log("score height : " + this.$refs.score.height);
    // console.log("score scrollTop : " + this.$refs.score.scrollTop);
    // console.log("score offsetHeight : " + this.$refs.score.offsetHeight);
  },

  computed: {
    myInfo() {
      return this.$store.getters["user/getMyInfo"];
    },
    myNotifications() {
      return this.$store.getters["user/getMyNotifications"];
    },
    myRecord() {
      return this.$store.getters["user/getRecord"];
    },
  },
  methods: {
    friend() {
      this.show1 = true;
      this.show2 = false;
      this.show3 = false;
    },
    notification() {
      this.show1 = false;
      this.show2 = true;
      this.show3 = false;
    },
    record() {
      this.show1 = false;
      this.show2 = false;
      this.show3 = true;
    },
    logout() {
      logout().then((res) => {
        if (res.data.data.logout) {
          const link =
            process.env.NODE_ENV === "production"
              ? "https://gjgjajaj.xyz"
              : "http://localhost:7000";
          location.href = link;
        }
      });
    },
    handleClick(event, item) {
      this.$emit("handleClick", event, item);
    },
    optionClicked(event) {
      // window.alert(JSON.stringify(event.option.name));
      // window.alert(JSON.stringify(event));
      const showingUser = event.item;
      if (event.option.name == "See Details") {
        console.log(this.showingUser);
        // this.modal = true
        this.$swal({
          title: "User Information",
          // imageUrl: showingUser.image ? showingUser.image.location : "test.png",
          // imageHeight: "128",
          // imageWidth: "128",
          customClass: {
          container: "",
          },
          html: `
                <div>
                  <div>
                    <img class="aspect-square w-32 object-cover" src="${
                      showingUser.image
                        ? showingUser.image.location
                        : "/defaultProfile.png"
                    }">
                  </div>
                  <p>Nickname : ${showingUser.nickname}</p>
                  <p>Introduction : ${showingUser.selfIntroduction}</p>
                  <p>Level : ${showingUser.level}</p>
                  <p>Online Status : ${
                    showingUser.online ? "Online" : "Offline"
                  }</p>
                </div>`,
            customClass: {
              container: "userBox",
            },
          showCancelButton: true,
          showConfirmButton: !this.checkIsFriend(showingUser.userId),
          showDenyButton: this.checkIsFriend(showingUser.userId),
          confirmButtonText: "Add Friend",
          denyButtonText: "Delete Friend",
        }).then((result) => {
          if (result.isConfirmed) {
            requestFriend(showingUser.userId, this.myInfo.id)
              .then((res) => {
                console.log(res);
                this.$swal({
                  title: "ଘ(੭*ˊᵕˋ)੭* ੈ♡",
                  text: "Your friend request has been sent successfully!",
                  icon: "success",
                  customClass: {
                    container: "friendRe",
                  },
                });
              })
              .catch((err) => {
                console.log(err);
              });
          } else if (result.isDenied) {
            deleteFriend(this.myInfo.id, showingUser.userId)
              .then((res) => {
                console.log(res);
                this.$store.commit("user/deleteFriend", res.data.data.friendId);
                this.$store.commit("tabCloseByUserId", res.data.data.friendId);
                this.$swal({
                  title: "･ﾟﾟ･(>д<;)･ﾟﾟ･",
                  text: `You are no longer friends with ${showingUser.nickname}!`,
                  icon: "success",
                    customClass: {
                      container: "friendDe",
                    },
                });
              })
              .catch((err) => {
                console.log(err);
                this.$swal({
                  title: "Error",
                  text: "Something went wrong!",
                  icon: "error",
                });
              });
          }
        });
      } else if (event.option.name == "Send Message") {
        console.log(showingUser);
        this.$store.commit("newChat", showingUser);
      } else if (event.option.name == "Delete Friend") {
        deleteFriend(this.myInfo.id, showingUser.userId)
          .then((res) => {
            console.log(res);
            this.$store.commit("user/deleteFriend", res.data.data.friendId);
            this.$store.commit("tabCloseByUserId", res.data.data.friendId);
            this.$swal({
                title: "･ﾟﾟ･(>д<;)･ﾟﾟ･",
                text: `You are no longer friends with ${showingUser.nickname}!`,
                icon: "success",
                customClass: {
                  container: "friendDe",
                },
            });
          })
          .catch((err) => {
            console.log(err);
            this.$swal({
              title: "Error",
              text: "Something went wrong!",
              icon: "error",
            });
          });
      } else if (
        this.$route.name === "room-id" &&
        event.option.name == "Invite to Room"
      ) {
        roomInvite(this.$route.params.id, this.myInfo.id, showingUser.userId)
          .then((res) => {
            console.log(res);
            this.$swal({
              title: "Success",
              text: `You invited ${showingUser.nickname} to your room!`,
              icon: "success",
              customClass: {
                container: "goRoom",
              },
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    checkIsFriend(userId) {
      return this.$store.getters["user/getMyInfo"].friends.some(
        (friend) => friend.userId === userId
      );
    },
  },
};
</script>

<style lang="scss">
@import "~assets/profileInGame.scss";
  .userBox{
     .swal2-popup {
        width: 700px;
        height: 530px;
        border: 3px solid white;
        background-image: url("@/assets/profileimg/city.png");
        background-size: 900px;
        background-position: bottom;

      .aspect-square{
        margin: auto;
        width: 128px;
        height: 128px;
        border: 3px solid black;
        background-color: white;
        border-radius: 100%;
        margin-bottom: 10px;
      }

      p{
        border-left: 5px solid white;
        border-right: 5px solid white;
        width: 80%;
        height: 42px;
        line-height: 42px;
        background-color: rgba(0, 0, 0, 0.72);
        color: white;
        font-size: 25px;
        font-weight: bolder;
        margin: auto;
        padding-bottom: 5px;
      }
    .swal2-cancel{
      background-color: black;
      color: white;
      border: 2px solid white;
    }
    .swal2-confirm {
      background-color: black;
      color: white;
      border: 2px solid white;
    }
     }
    .swal2-title{
      background-color: black;
      color: white;
      padding: 0;
      height: 80px;
      line-height: 80px;
      font-size: 40px;
    }

  }
.friendRe{
  .swal2-popup {
    border: 5px solid white;
    background-color: rgba(0, 0, 0, 0.705);
    color: white;
    .swal2-confirm {
      background-color: black;
      color: white;
      border: 2px solid white;
    }
  }
}
.friendDe{
  .swal2-popup {
    border: 5px solid white;
    background-color: rgba(0, 0, 0, 0.705);
    color: white;
    .swal2-confirm {
      background-color: black;
      color: white;
      border: 2px solid white;
    }
  }
}
.goRoom{
    .swal2-popup {
    border: 5px solid white;
    background-color: rgba(0, 0, 0, 0.705);
    color: white;
    .swal2-confirm {
      background-color: black;
      color: white;
      border: 2px solid white;
    }
  }
}
</style>
