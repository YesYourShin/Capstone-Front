<template lang="">
  <div class="p-2 w-40 mr-[70px]" @click="openModal">
    <a
      href="#"
      class="flex items-center p-4 bg-blue-200 rounded-lg shadow-xs cursor-pointer hover:bg-blue-500 hover:text-gray-100"
    >
      <svg
        class="h-6 fill-current hover:text-gray-100"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>PHP icon</title>
        <path
          d="M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174H11.46l-.704 3.625H9.388l1.23-6.327h1.367l-.327 1.682h1.218c.767 0 1.295.134 1.586.401s.378.7.263 1.299l-.572 2.944h-1.389zm7.597-2.265a2.782 2.782 0 0 1-.305.847c-.143.255-.33.49-.561.703a2.44 2.44 0 0 1-.917.551c-.336.108-.765.164-1.286.164h-1.18l-.327 1.682h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.417.477 1.001.331 1.751zM17.766 10.207h-.943l-.516 2.648h.838c.557 0 .971-.105 1.242-.314.272-.21.455-.559.551-1.049.092-.47.049-.802-.125-.995s-.524-.29-1.047-.29z"
        />
      </svg>
      <div>
        <p class="text-xs font-medium ml-2">방 만들기</p>
      </div>
    </a>
  </div>
</template>
<script>
import axios from "axios";

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
        //     "http://localhost:3065/api/users/profile",
        //     {
        //       nickname: "player1",
        //     },
        //     { withCredentials: true }
        //   )
        //   .then((res) => {
        //     console.log(res);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });

        axios
          .post("http://localhost:3065/api/games", req, {
            withCredentials: true,
          })
          .then((res) => {
            console.log(res);
            console.log("make room success");
          })
          .catch((err) => {
            console.log(err);
          });
      }
      // this.$swal({
      //   title: "방 만들기",
      //   html: `
      //   <div class="w-full">
      //     <div class="grid grid-cols-6 gap-6">
      //       <div class="col-span-3">
      //         <label class="block text-sm font-medium text-gray-700" for="room-name">방 제목</label>
      //         <input class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" type="text" name="room-name" placeholder="방 제목을 입력하세요" />
      //       </div>
      //       <div class="col-span-3">
      //         <label class="block text-sm font-medium text-gray-700" for="room-name">비밀번호</label>
      //         <input class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" type="password" name="password" />
      //       </div>
      //       <div class="col-span-3">
      //         <label class="block text-sm font-medium text-gray-700" for="mode">모드</label>
      //         <select class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" name="mode" id="mode">
      //           <option value="normal">일반 모드</option>
      //           <option value="extended">확장 모드</option>
      //         </select>
      //       </div>
      //       <div class="col-span-3">
      //         <label class="block text-sm font-medium text-gray-700" for="max-player">인원 수</label>
      //         <select class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" name="max-player" id="max-player">
      //           <option value="6">6</option>
      //           <option value="7">7</option>
      //           <option value="8">8</option>
      //           <option value="9">9</option>
      //           <option value="10">10</option>
      //         </select>
      //       </div>
      //     </div>
      //   </div>`,
      // });

      // this.swalModal("create-room-modal", {});
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
<style lang=""></style>
