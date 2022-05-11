<template>
  <div class="friendMainBox">
    <div v-for="user in friends" class="p-2" :key="user.id">
      <div
        class="friendBox flex px-4 py-4 rounded-lg hover:bg-zinc-700 group text-white cursor-pointer"
        @click.prevent.stop="handleClick($event, user)"
      >
        <div class="friendImg relative">
          <img
            :src="user.image ? user.image.location : 'test.png'"
            alt=""
            class="aspect-square w-24 p-[5px] friendImg rounded-full object-cover bg-zinc-800 group-hover:bg-zinc-700"
          />
          <div
            v-if="user.online"
            class="w-8 h-8 absolute bottom-0 right-0 rounded-full bg-emerald-500 border-[5px] border-zinc-800 group-hover:border-zinc-700"
          ></div>
        </div>
        <div class="friendStatus ml-3 flex flex-col justify-center gap-1">
          <p class="userId text-2xl">{{ user.nickname }}</p>
          <p class="font-thin text-lg">{{ user.selfIntroduction }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
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
  },
  methods: {
    handleClick(event, item) {
      this.$emit("handleClick", event, item);
    },
  },
};
</script>
<style lang="scss" scoped>
/* @import '~assets/friend.scss' */
</style>
