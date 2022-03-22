<template lang="">
  <div class="flex flex-col min-h-screen w-full">
    <sideBar></sideBar>
    <div class="px-5 flex-grow">
      <div class="flex items-center py-2">
        <!--로비 위쪽 검색창 및 체크박스 등-->

        <roomSearch></roomSearch>
        <!--검색 창-->

        <checkBoxes></checkBoxes>
        <!--체크박스-->

        <createRoomButton></createRoomButton>
        <!--방만들기 버튼-->
      </div>
      <div class="grid grid-cols-2 gap-2">
        <!--방 목록-->
        <template v-for="room in rooms">
          <roomButton :room="room"></roomButton>
        </template>
      </div>
      <div class="h-20 w-60 rounded-lg bg-slate-400 cursor-pointer" @click="$router.push('/')">메인으로</div>
      <!-- <div class="" @click="showAlert">
      </div> -->
      <div class="">
        <ul class="flex list-none rounded my-2 justify-end">
          <li class="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 ml-0 rounded-l hover:bg-gray-200"><a class="page-link" href="#">Previous</a></li>
          <li class="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 hover:bg-gray-200"><a class="page-link" href="#">1</a></li>
          <li class="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 hover:bg-gray-200"><a class="page-link" href="#">2</a></li>
          <li class="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 border-r-0 hover:bg-gray-200"><a class="page-link" href="#">3</a></li>
          <li class="relative block py-2 px-3 leading-tight bg-white border border-gray-300 text-blue-700 rounded-r hover:bg-gray-200"><a class="page-link" href="#">Next</a></li>
        </ul>
      </div>
    </div>
    <chatBox></chatBox>
    <!-- <videoComponent></videoComponent> -->
  </div>
</template>
<script>
import roomButton from "@/components/lobby_elements/roomButton.vue";
import roomSearch from "@/components/lobby_elements/roomSearch.vue";
import checkBoxes from "@/components/lobby_elements/checkBoxes.vue";
import sideBar from "@/components/lobby_elements/sideBar.vue";
import createRoomButton from "@/components/lobby_elements/createRoomButton.vue";
import chatBox from "@/components/lobby_elements/chatBox.vue";
import Janus from "@/plugins/janus";
// import videoComponent from '@/components/videoComponent.vue';
import { getGames } from '@/api/mafiaAPI'

export default {
  components: {
    roomButton,
    roomSearch,
    checkBoxes,
    sideBar,
    createRoomButton,
    chatBox,
  },
  data() {
    return {
      evtSource: null,
      rooms: [
      ],
      janus: null,
    };
  },
  methods: {
    showAlert() {
      // this.$swal('Hello Vue world')
      this.$swal({
        title: 'Error!',
        text: 'Do you want to continue',
        icon: 'error',
        confirmButtonText: 'Cool',
      })
    },
  },
  mounted() {
    const ServerWS = process.env.NODE_ENV === 'production' ? "wss://gjgjajaj.xyz/janus" : "ws://13.125.132.255:8188/janus";
    let janus = null;
    const opaqueId = "videoroomtest-" + Janus.randomString(12); //opaqueId 값을 통해서 유저 구분
    let videoHandlerGame = null; //Handle 객체

    let vrc = this;
    let storePlugin = null;
    let pin = null;
    let username = "Yuuto";
    let roomId = 16121235;
    Janus.init({
      debug: "all",
      callback: function () {
        Janus.log("janus 초기화 부분");
        // 서버 초기화 완료, 추가하면 됨.
        // Create session
        vrc.janus = new Janus({
          server: ServerWS,
          opaqueId: opaqueId,
          success: function () {
            Janus.log("플러그 추가하세엽");
            vrc.janus.attach({
              plugin: "janus.plugin.videoroom",
              success: function (pluginHandle) {
                storePlugin = pluginHandle;

                // if (pin) {
                //   var register = {
                //     request: "join",
                //     room: roomId,
                //     ptype: "publisher",
                //     display: username,
                //     pin: pin,
                //   };
                // } else {
                //   var register = {
                //     request: "join",
                //     room: roomId,
                //     ptype: "publisher",
                //     display: username,
                //   };
                // }

                var register = {
                  request: "list",
                }

                storePlugin.send({
                  message: register,
                  success: function (res) {
                    console.log(res);
                    vrc.rooms = res.list;
                  },
                });
              },
              error: function (error) {
                // 에러 발생시
                Janus.error("  -- Error attaching plugin...", error);
                Janus.log("Error attaching plugin... " + error);
              },
              consentDialog: function (on) {
                Janus.debug(
                  "Consent dialog should be " + (on ? "on" : "off") + " now"
                );
                if (on) {
                  // getUserMedia 호출되기 전
                } else {
                  // getUserMedia 호출되기 후
                }
              },
              iceState: function (state) {
                // ICE 상태 변화시
                Janus.log("ICE state changed to " + state);
              },
              mediaState: function (media, on) {
                // Media 정보를 받기 시작하거나 중지할시
                Janus.log(
                  "Janus " +
                    (on ? "started" : "stopped") +
                    " receiving our " +
                    media
                );
              },
              webrtcState: function (on) {
                // ICE, DTLS를 포함한 모든 것이 성공하여 PeerConnection이 활성화 => true
                //PeerConnection이 죽는다면 파라미터가 false
                Janus.log(
                  "Janus says our WebRTC PeerConnection is " +
                    (on ? "up" : "down") +
                    " now"
                );
                if (!on) {
                  return;
                }
              },
              onmessage: function (msg, jsep) {},
              onlocaltrack: function (track, added) {},
              onremotetrack: function (track, mid, added) {},
              oncleanup: function () {},
              detached: function () {},
            });
          },
          error: function () {
            Janus.log("세션 실패");
          },
          destroyed: function () {
            Janus.log("세션 파괴");
          },
        });
      },
    });
  },
  beforeDestroy() {
    this.janus.destroy()
  }
};
</script>
<style lang="" scoped>

</style>
