<template lang="">
  <div class="RoomBtn" @click="openModal">
    <a href="#">
        <p class="">방 만들기</p>
    </a>
  </div>
</template>
<script>
import { makeGame } from "@/api/mafiaAPI";

export default {
  data() {
    return {
      playerOptions: [6, 7, 8, 8, 9, 10],
    };
  },
  methods: {
    async openModal() {
      const { value: formValues } = await this.$swal({
        title: "Multiple inputs",
        html: `
        <div class="w-full">
          <div class="grid grid-cols-2 gap-6">
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700" for="room-name">방 제목</label>
              <input class="mt-1 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border-gray-300 rounded-md" type="text" name="room-name" id="room-name" placeholder="방 제목을 입력하세요" />
            </div>
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700" for="password">비밀번호</label>
              <input class="mt-1 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border-gray-300 rounded-md" type="password" name="password" id="password" />
            </div>
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700" for="mode">모드</label>
              <select class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" name="mode" id="mode">
                <option value="1">일반 모드</option>
                <option value="2">확장 모드</option>
              </select>
            </div>
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700" for="max-player">인원 수</label>
              <select class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" name="max-player" id="max-player">
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
          </div>
        </div>`,
        focusConfirm: false,
        preConfirm: () => {
          const roomName = document.getElementById("room-name").value;
          const password = document.getElementById("password").value;
          const mode = parseInt(document.getElementById("mode").value);
          const maxPlayer = parseInt(
            document.getElementById("max-player").value
          );

          if (!roomName) {
            return this.$swal.showValidationMessage(
              "you need to input room name"
            );
          }

          return { roomName, password, mode, maxPlayer };
        },
      });
      if (formValues) {
        // this.$swal(JSON.stringify(formValues));
        const req = {
          mode: formValues.mode,
          name: formValues.roomName,
          password: formValues?.password,
          limit: formValues.maxPlayer,
        };
        console.log(req);

        // axios
        //   .post(
        //     `${this.$store.state.api}/games`,
        //     req,
        //     this.$store.state.payload
        //   )
        //   .then((res) => {
        //     console.log(res);
        //     console.log("make room success");
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });

        makeGame(req)
          .then((res) => {
            console.log(res);
            this.$router.push(`/room/${res.data.data.gameNumber}`);
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    swalModal(component, props) {
      this.$swal({
        html: '<div id="VueSweetAlert2"></div>',
        onBeforeOpen: () => {
          let ComponentClass = Vue.extend(Vue.component(component));
          let instance = new ComponentClass({
            propsData: props,
          });
          instance.$mount();
          document.getElementById("VueSweetAlert2").appendChild(instance.$el);
        },
      });
    },
  },
};
</script>
<style lang="scss">
.RoomBtn{
  width: 150px;
  height: 80px;
  border: 1px solid white;
  color: white;
  font-size: 25px;
}
</style>
