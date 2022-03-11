<template lang="">
  <div class="">
    <div
      class="friendBar h-24 w-full bg-slate-300 flex items-center"
      v-for="user in $store.state.friends"
      :key="user.id"
      @click.prevent.stop="handleClick($event, user)"
    >
      <div class="aspect-square h-full p-3">
        <img
          src="@/assets/pageimg/normal.png"
          alt=""
          class="aspect-square friendImg rounded-full object-cover"
        />
      </div>
      <div class="p-3 flex-col justify-center items-center">
        <p>{{ user.social_id }}</p>
        <p>{{ user.provider }}</p>
      </div>
    </div>
      <vue-simple-context-menu
        :elementId="'myUniqueId'"
        :options="options"
        :ref="'vueSimpleContextMenu'"
        @option-clicked="optionClicked"
      />
    <!-- 컴포넌트 MyModal -->
    <MyModal @close="modal = false" v-if="modal">
      <!-- default 슬롯 콘텐츠 -->
      <p>Vue.js Modal Window!</p>
      <div class="flex">
        <div class="aspect-square w-8">
          <img class="" src="@/assets/pageimg/normal.png" alt="">
        </div>
        <div>
          <p>닉네임 : {{showingUser.social_id}}</p>
          <p>접속상태 :</p>
          <p>상태메시지 : {{showingUser.provider}}</p>
          <p>전적 : </p>
        </div>
      </div>
      <!-- /default -->
      <!-- footer 슬롯 콘텐츠 -->
      <template slot="footer">
        <button>제출</button>
      </template>
      <!-- /footer -->
    </MyModal>
  </div>
</template>
<script>
import MyModal from '@/components/myModal.vue';

export default {
  components: {
    MyModal
  },
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
        this.showingUser = event.item
        // this.modal = true
        this.$swal({
          title: '유저 정보',
          imageUrl: '@/assets/pageimg/normal.png',
          imageHeight: '128',
          imageWidth: '128',
          html: `
                <div>
                  <p>닉네임 : ${this.showingUser.social_id}</p>
                  <p>접속상태 :</p>
                  <p>상태메시지 : ${this.showingUser.provider}</p>
                  <p>전적 : </p>
                </div>`,
        })
      }
      else if (event.option.name == "DirectMessage") {
        console.log(event.item);
        this.$store.commit('newChat', event.item)
      }
    },
  },
};
</script>
<style lang="css" scoped>
.friendBar {
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.friendBar:hover {
  box-shadow: inset 0 0 5px 5px rgb(190 242 100 / 0.8);
}

.friendImg {
  clip-path: circle();
}
</style>
