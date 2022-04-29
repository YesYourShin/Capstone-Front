<template>
  <div class="friendMainBox">
    <template v-for="user in $store.state.friends">
      <div
        class="friendBox flex px-4 py-4 transition duration-200 ease-in hover:bg-gray-200 text-white hover:text-black cursor-pointer"
        @click.prevent.stop="handleClick($event, user)"
        :key="user.id"
      >
        <div class="friendImg">
          <img
            src="@/assets/pageimg/test.jpg"
            alt=""
            class="aspect-square friendImg rounded-full object-cover w-20"
          />
        </div>
        <div class="friendStatus ml-3 flex flex-col justify-center gap-1">
          <p class="userId font-bold text-2xl">{{ user.social_id }}</p>
          <p>{{ user.provider }}</p>
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
export default {
  data() {
    return {
      options: [
        {
          name: "DirectMessage",
        },
        {
          name: "",
          type: "divider",
        },
        {
          name: "See Details",
        },
      ],
      modal: false,
      showingUser: {},
    };
  },
  methods: {
    handleClick(event, item) {
      this.$refs.vueSimpleContextMenu.showMenu(event, item);
    },

    optionClicked(event) {
      // window.alert(JSON.stringify(event.option.name));
      // window.alert(JSON.stringify(event));
      if (event.option.name == "See Details") {
        this.showingUser = event.item;
        // this.modal = true
        this.$swal({
          title: "유저 정보",
          imageUrl: "@/assets/pageimg/normal.png",
          imageHeight: "128",
          imageWidth: "128",
          html: `
                <div>
                  <p>닉네임 : ${this.showingUser.social_id}</p>
                  <p>접속상태 :</p>
                  <p>상태메시지 : ${this.showingUser.provider}</p>
                  <p>전적 : </p>
                </div>`,
        });
      } else if (event.option.name == "DirectMessage") {
        console.log(event.item);
        this.$store.commit("newChat", event.item);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
/* @import '~assets/friend.scss' */
</style>
