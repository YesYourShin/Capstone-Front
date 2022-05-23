<template lang="">
  <!-- <div class="w-40" @click="openModal">
    <div
      class="flex items-center justify-center p-4 bg-blue-200 rounded-lg shadow-xs cursor-pointer hover:bg-blue-500 hover:text-gray-100 transition duration-300"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
        <path
          d="M7.01 10.207h-.944l-.515 2.648h.838c.556 0 .97-.105 1.242-.314.272-.21.455-.559.55-1.049.092-.47.05-.802-.124-.995-.175-.193-.523-.29-1.047-.29zM12 5.688C5.373 5.688 0 8.514 0 12s5.373 6.313 12 6.313S24 15.486 24 12c0-3.486-5.373-6.312-12-6.312zm-3.26 7.451c-.261.25-.575.438-.917.551-.336.108-.765.164-1.285.164H5.357l-.327 1.681H3.652l1.23-6.326h2.65c.797 0 1.378.209 1.744.628.366.418.476 1.002.33 1.752a2.836 2.836 0 0 1-.305.847c-.143.255-.33.49-.561.703zm4.024.715l.543-2.799c.063-.318.039-.536-.068-.651-.107-.116-.336-.174-.687-.174H11.46l-.704 3.625H9.388l1.23-6.327h1.367l-.327 1.682h1.218c.767 0 1.295.134 1.586.401s.378.7.263 1.299l-.572 2.944h-1.389zm7.597-2.265a2.782 2.782 0 0 1-.305.847c-.143.255-.33.49-.561.703a2.44 2.44 0 0 1-.917.551c-.336.108-.765.164-1.286.164h-1.18l-.327 1.682h-1.378l1.23-6.326h2.649c.797 0 1.378.209 1.744.628.366.417.477 1.001.331 1.751zM17.766 10.207h-.943l-.516 2.648h.838c.557 0 .971-.105 1.242-.314.272-.21.455-.559.551-1.049.092-.47.049-.802-.125-.995s-.524-.29-1.047-.29z"
        />
      </svg>
      <div>
        <p class="text-lg font-bold ml-2">방 만들기</p>
      </div>
    </div>
  </div> -->
  <div class="buttonbox" >
    <div class="buttonline1"></div>
    <div class="buttonline2"></div>
    <div class="buttonline3"></div>
    <div class="buttonline4"></div>
    <button class="gogame" @click="openModal">방 만들기</button>
  </div>
</template>
<script>
import { makeRoom } from "@/api/mafiaAPI";

export default {
  data() {
    return {
      playerOptions: [6, 7, 8, 8, 9, 10],
    };
  },
  methods: {
    async openModal() {
      const { value: formValues } = await this.$swal({
        title: "방 만들기",
        // html: `
        // <div class="w-full">
        //   <div class="grid grid-cols-2 gap-6">
        //     <div class="col-span-1">
        //       <label class="block text-sm font-medium text-gray-700" for="room-name">방 제목</label>
        //       <input class="mt-1 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border-gray-300 rounded-md" type="text" name="room-name" id="room-name" placeholder="방 제목을 입력하세요" />
        //     </div>
        //     <div class="col-span-1">
        //       <label class="block text-sm font-medium text-gray-700" for="password">비밀번호</label>
        //       <input class="mt-1 p-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm border-gray-300 rounded-md" type="password" name="password" id="password" />
        //     </div>
        //     <div class="col-span-1">
        //       <label class="block text-sm font-medium text-gray-700" for="mode">모드</label>
        //       <select class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" name="mode" id="mode">
        //         <option value="classic">일반 모드</option>
        //         <option value="expanded">확장 모드</option>
        //       </select>
        //     </div>
        //     <div class="col-span-1">
        //       <label class="block text-sm font-medium text-gray-700" for="max-player">인원 수</label>
        //       <select class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" name="max-player" id="max-player">
        //         <option value="6">6</option>
        //         <option value="7">7</option>
        //         <option value="8">8</option>
        //         <option value="9">9</option>
        //         <option value="10">10</option>
        //       </select>
        //     </div>
        //   </div>
        // </div>`,
        html:
            `<div class="test">`+
                `<div>`+
                  `<label>방 제목</label>`+
                  `<input type="text" name="room-name" id="room-name" placeholder="방 제목을 입력하세요" />`+
                `</div>`+
                `<div>`+
                  `<label for="password">비밀번호</label>`+
                  `<input type="password" name="password" id="password" />`+
                `</div>`+
                `<div>`+
                  `<label for="mode" class="test2">모드</label>`+
                  `<select name="mode" id="mode">`+
                    `<option value="classic">일반 모드</option>`+
                    `<option value="expanded">확장 모드</option>`+
                  `</select>`+
                `</div>`+
                `<div>`+
                  `<label for="max-player">인원 수</label>`+
                  `<select name="max-player" id="max-player">`+
                    `<option value="6">6</option>`+
                    `<option value="7">7</option>`+
                    `<option value="8">8</option>`+
                    `<option value="9">9</option>`+
                    `<option value="10">10</option>`+
                  `</select>`+
                `</div>`+
            `</div>`,
        customClass: {
          container: "createRoom",
        },
        focusConfirm: false,
        preConfirm: () => {
          const roomName = document.getElementById("room-name").value;
          const password = document.getElementById("password").value;
          const mode = document.getElementById("mode").value;
          const maxPlayer = parseInt(
            document.getElementById("max-player").value
          );

          if (!roomName) {
            return this.$swal.showValidationMessage(
              "방 제목을 입력해주세요."
            );
          }

          return { roomName, password, mode, maxPlayer };
        },
      });
      if (formValues) {
        // this.$swal(JSON.stringify(formValues));
        const req = {
          mode: formValues.mode,
          description: formValues.roomName,
          publishers: formValues.maxPlayer,
          pin: formValues?.password,
        };
        // console.log(req);

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

        makeRoom(req)
          .then((res) => {
            console.log(res);
            this.$router.push({
              name: "room-id",
              params: {
                id: res.data.data.id,
                room: res.data.data.room,
                pin: formValues?.password,
              },
            });
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
.createRoom{

  .swal2-popup{
      // border: 15px solid orange;
      width: 730px;
      height: 600px;
      background-image: url("@/assets/post.png");
      background-position: bottom;
      background-size: 900px 530px;


      .swal2-title{
        font-size: 40px;
        height: 80px;
        line-height: 80px;
        padding: 0;
        margin-top: 20px;
        background-color: rgba(0, 0, 0, 0.776);
        color: white;
      }
      .test{
        height: 250px;
        font-size: 25px;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        font-weight: bolder;
        text-align: left;

        div{
          display: flex;
          justify-content: space-between;
          width: 100%;
          margin: 10px 0;
          background-color: rgba(0, 0, 0, 0.88);
          height: 50px;
          line-height: 50px;
          color: white;
          border-top: 2px solid white;
          border-bottom: 2px solid white;

          label{
            margin: 0 20px;
            margin-right: 50px;
          }
          input{
            text-align: center;
            border-right: 2px solid white;
            border-left: 2px solid white;
            margin-right: 30px;
          }
          select{
            width: 318px;
            margin-right: 30px;
            text-align: center;
            background-color: black;
          }
        }

      }
      .swal2-confirm{
        background-color: black;
        color: white;
        width: 150px;
      }

      .swal2-validation-message{
        margin: 0;

      }
  }

}


.buttonbox {
  width: 180px;
  height: 70px;
  margin-right: 1rem /* 16px */;
  //border: 3px solid rgb(255, 255, 255);
  display: flex;
  justify-content: center;
  position: relative;

  &:hover {
    .lilink {
      animation: color2 0.3s;
      animation-fill-mode: forwards;
    }
    .gogame {
      animation: color1 0.3s;
      animation-fill-mode: forwards;
    }
    .buttonline1 {
      animation: buttonlinew 0.3s;
      animation-fill-mode: forwards;
    }
    .buttonline3 {
      animation: buttonlinew 0.3s;
      animation-fill-mode: forwards;
    }
    .buttonline2 {
      animation: buttonlineh 0.3s;
      animation-fill-mode: forwards;
    }
    .buttonline4 {
      animation: buttonlineh 0.3s;
      animation-fill-mode: forwards;
    }
  }

  .gogame {
    margin: auto 0;
    width: 150px;
    height: 40px;
    font-size: 20px;
    color: white;
    font-weight: bold;
    border: 3px solid rgb(255, 255, 255);

    &:active {
      width: 140px;
      height: 35px;
      font-size: 20px;
    }
    button {
      width: 140px;
      height: 34px;
    }
  }

  .buttonline1 {
    width: 30px;
    height: 3px;
    top: 5px;
    left: 5px;
    position: absolute;
    background-color: #fff;
  }

  .buttonline2 {
    width: 4px;
    height: 25px;
    top: 5px;
    left: 5px;
    position: absolute;
    background-color: #fff;
  }

  .buttonline3 {
    width: 30px;
    height: 3px;
    bottom: 5px;
    right: 5px;
    position: absolute;
    background-color: #fff;
  }

  .buttonline4 {
    width: 3px;
    height: 25px;
    bottom: 5px;
    right: 5px;
    position: absolute;
    background-color: #fff;
  }
}
@keyframes buttonlinew {
  0% {
  }
  100% {
    width: 170px;
  }
}
@keyframes buttonlineh {
  0% {
  }
  100% {
    height: 60px;
  }
}
@keyframes color1 {
  0% {
  }
  100% {
    /* --tw-bg-opacity: 1;
    background-color: rgb(252 211 77 / var(--tw-bg-opacity));
    border-color: rgb(252 211 77 / var(--tw-bg-opacity)); */
    background-color: white;
    color: #000;
  }
}
@keyframes color2 {
  0% {
  }
  100% {
    color: #000;
  }
}
</style>
