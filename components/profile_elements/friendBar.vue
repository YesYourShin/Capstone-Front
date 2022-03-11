<template>
  <div class="friendMainBox">
    <div
      class="friendBox"
      v-for="user in $store.state.friends"
      :key="user.id"
      @click.prevent.stop="handleClick($event, user)"
    >
        <div class="friendImg">
          <img
            src="@/assets/pageimg/test.jpg"
            alt=""
            class="aspect-square friendImg rounded-full object-cover"
          />
        </div>
        <div class="friendStatus">
          <p class="userId">{{ user.social_id }}</p>
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
          <img class="" src="@/assets/pageimg/test.jpg">
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
<style lang="scss" scoped>
@import '~assets/friend.scss'
</style>
