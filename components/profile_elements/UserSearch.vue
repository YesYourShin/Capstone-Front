<template lang="">
  <div class="w-full p-1 border-r-[3px] border-black">
    <div class="text-sm text-gray-400">Search User</div>
    <form
      class="h-12 flex items-center justify-center"
      action=""
      @submit.prevent="search"
    >
      <input
        class="w-5/6 outline-none p-1 text-white"
        style="background-color: rgb(48, 48, 48)"
        type="text"
        v-model="input"
      />
      <button class="w-1/6 bg-gray-400 p-1">Search</button>
    </form>
  </div>
</template>
<script>
import { getUserInformationByNickname } from "@/api/mafiaAPI";

export default {
  data() {
    return {
      input: "",
    };
  },
  methods: {
    search() {
      getUserInformationByNickname(this.input)
        .then((res) => {
          console.log(res);

          const showingUser = res.data.data;
          // this.modal = true
          this.$swal({
            title: "유저 정보",
            imageUrl: showingUser.image
              ? showingUser.image.location
              : "test.png",
            imageHeight: "128",
            imageWidth: "128",
            html: `
                <div>
                  <p>닉네임 : ${showingUser.nickname}</p>
                  <p>상태 메시지 : ${showingUser.selfIntroduction}</p>
                  <p>레벨 : ${showingUser.level}</p>
                  <p>접속 상태 :</p>
                </div>`,
            showCancelButton: true,
            confirmButtonText: "Add Friend",
          }).then((result) => {
            if (result.isConfirmed) {
              this.$swal({
                text: "Your friend request has been sent successfully!",
                icon: "success",
              });
            }
          });
        })
        .catch((err) => {
          console.log(err);

          this.$swal({
            icon: "error",
            title: "There is no such user...",
            text: "Please enter a valid nickname!",
            // footer: '<a href="">Why do I have this issue?</a>'
          });
        });
    },
  },
};
</script>
<style lang=""></style>
