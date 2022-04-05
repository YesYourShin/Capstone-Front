<template lang="">
  <div class="flex flex-col min-h-screen w-full">
    <div class="px-5 flex-grow">
      <div class="flex items-center py-2">
        <!--로비 위쪽 검색창 및 체크박스 등-->

        <roomSearch></roomSearch>
        <!--검색 창-->

        <checkBoxes></checkBoxes>
        <!--체크박스-->

        <createRoomButton></createRoomButton>
        <!--방만들기 버튼-->

        <leaveButton :pathToGo="'/'"></leaveButton>
        <!-- 나가기 버튼 -->
      </div>
      <div class="grid grid-cols-2 gap-2">
        <!--방 목록-->
        <template v-for="room in rooms">
          <roomButton :room="room"></roomButton>
        </template>
      </div>

      <pageNavigator></pageNavigator>
      <!-- 페이지네이션 (임시)-->
    </div>
    <chatBox></chatBox>
  </div>
</template>
<script>
import roomButton from "@/components/lobby_elements/roomButton.vue";
import roomSearch from "@/components/lobby_elements/roomSearch.vue";
import checkBoxes from "@/components/lobby_elements/checkBoxes.vue";
import createRoomButton from "@/components/lobby_elements/createRoomButton.vue";
import chatBox from "@/components/lobby_elements/chatBox.vue";
import leaveButton from "@/components/lobby_elements/leaveButton.vue";
import pageNavigator from "@/components/lobby_elements/pageNavigator.vue";
import Janus from "@/plugins/janus";
// import videoComponent from '@/components/videoComponent.vue';
import { getGames } from "@/api/mafiaAPI";

export default {
  components: {
    roomButton,
    roomSearch,
    checkBoxes,
    createRoomButton,
    chatBox,
    leaveButton,
    pageNavigator,
  },
  data() {
    return {
      evtSource: null,
      rooms: [],
      janus: null,
    };
  },
  computed: {
    subscribedStreams() {
      return this.$store.state.stream.subscribedStreams;
    },
  },
  methods: {
    showAlert() {
      // this.$swal('Hello Vue world')
      this.$swal({
        title: "Error!",
        text: "Do you want to continue",
        icon: "error",
        confirmButtonText: "Cool",
      });
    },
  },
  mounted() {
    const ServerWS =
      process.env.NODE_ENV === "production"
        ? "wss://gjgjajaj.xyz/janus"
        : "ws://13.125.132.255:8188/janus";
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
                };

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
    this.janus.destroy();
  },
  watch: {
    subscribedStreams(newVal, oldVal) {
      if (this.subscribedStreams.length) {
        this.$store.commit("stream/removeAllSubscribers");
      }
    },
  },
};
</script>
<style lang="" scoped></style>
