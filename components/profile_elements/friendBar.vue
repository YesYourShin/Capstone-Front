<template>
  <div class="friendMainBox">
    <template v-for="user in friends">
      <div
        class="friendBox flex px-4 py-4 transition duration-200 ease-in hover:bg-amber-400 text-white hover:text-black cursor-pointer"
        @click.prevent.stop="handleClick($event, user)"
        :key="user.id"
      >
        <div class="friendImg">
          <img
            :src="
              user.image ? user.image.location : '@/assets/pageimg/test.png'
            "
            alt=""
            class="aspect-square friendImg rounded-full object-cover w-20"
          />
        </div>
        <div class="friendStatus ml-3 flex flex-col justify-center gap-1">
          <p class="userId font-bold text-2xl">{{ user.nickname }}</p>
          <p>{{ user.selfIntroduction }}</p>
        </div>
      </div>
    </template>

    <vue-simple-context-menu
      :elementId="'myUniqueId'"
      :options="options"
      :ref="'vueSimpleContextMenu'"
      @option-clicked="optionClicked"
    />
  </div>
</template>
<script>
import { deleteFriend } from "@/api/mafiaAPI";

export default {
  data() {
    return {
      options: [
        {
          name: "Send Message",
        },
        {
          name: "",
          type: "divider",
        },
        {
          name: "See Details",
        },
        {
          name: "Delete Friend",
        },
      ],
      modal: false,
    };
  },
  computed: {
    friends() {
      if (this.$store.state.user.myInfo) {
        return this.$store.state.user.myInfo.friends;
      } else {
        return [];
      }
    },
    myInfo() {
      return this.$store.state.user.myInfo;
    },
  },
  methods: {
    handleClick(event, item) {
      this.$refs.vueSimpleContextMenu.showMenu(event, item);
    },

    optionClicked(event) {
      // window.alert(JSON.stringify(event.option.name));
      // window.alert(JSON.stringify(event));
      const showingUser = event.item;
      if (event.option.name == "See Details") {
        console.log(this.showingUser);
        // this.modal = true
        this.$swal({
          title: "유저 정보",
          imageUrl: showingUser.image ? showingUser.image.location : "test.png",
          imageHeight: "128",
          imageWidth: "128",
          html: `
                <div>
                  <p>닉네임 : ${showingUser.nickname}</p>
                  <p>상태메시지 : ${showingUser.selfIntroduction}</p>
                  <p>레벨 : ${showingUser.level}</p>
                  <p>접속상태 :</p>
                </div>`,
        });
      } else if (event.option.name == "Send Message") {
        console.log(event.item);
        this.$store.commit("newChat", event.item);
      } else if (event.option.name == "Delete Friend") {
        deleteFriend(this.myInfo.id, event.item.userId)
          .then((res) => {
            console.log(res);
            this.$swal({
              title: "Success",
              text: `You are no longer friends with ${showingUser.nickname}!`,
              icon: "success",
            });
            this.$store.dispatch("user/fetchMyInfo");
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
    },
  },
};
</script>
<style lang="scss" scoped>
/* @import '~assets/friend.scss' */
</style>
