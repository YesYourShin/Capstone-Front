<template>
  <div>hello</div>
</template>

<script>
import Janus from "@/plugins/janus";

export default {
  data() {
    return {};
  },
  mounted() {
    const ServerWS = "ws://13.125.132.255:8188/janus";
    let janus = null;
    const opaqueId = "videoroomtest-" + Janus.randomString(12); //opaqueId 값을 통해서 유저 구분
    let videoHandlerGame = null; //Handle 객체

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
        janus = new Janus({
          server: ServerWS,
          opaqueId: opaqueId,
          success: function () {
            Janus.log("플러그 추가하세엽");
            janus.attach({
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

                if (pin) {
                  var register = {
                    request: "create",
                    room: roomId,
                    description: "room no.1",
                    publishers: 6,
                    is_private: false,
                    pin: pin,
                  };
                } else {
                  var register = {
                    request: "create",
                    room: roomId,
                    description: "room no.1",
                    publishers: 6,
                    is_private: false,
                  };
                }

                storePlugin.send({
                  message: register,
                  success: function (res) {
                    console.log(res);
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
              onmessage: function (msg, jsep) {
                console.log(msg);
                if (event === "joined") {
                  // Publisher가 Join시 WebRTC와 협상하거나 존재하는 피드에 연결
                  dispatch(
                    joinRoom({
                      room: msg["room"],
                      publisherId: msg["id"],
                      display: username,
                      publisherPvtId: msg["private_id"],
                    })
                  );

                  Janus.log(
                    "Successfully joined room " + msg["room"] + " with ID " + id
                  );

                  // SDP offer과 Publisher로 등록 진행
                  publishOwnFeed(true);

                  // 다른 Publisher들이 존재할시
                  if (msg["publishers"]) {
                    var list = msg["publishers"];
                    Janus.debug(
                      "Got a list of available publishers/feeds:",
                      list
                    );
                    for (var f in list) {
                      var id = list[f]["id"];
                      var display = list[f]["display"];
                      var audio = list[f]["audio_codec"];
                      var video = list[f]["video_codec"];
                      Janus.debug(
                        "  >> [" +
                          id +
                          "] " +
                          display +
                          " (audio: " +
                          audio +
                          ", video: " +
                          video +
                          ")"
                      );
                      // 모두 Subscribe 진행
                      newRemoteFeed(id, display, audio, video);
                    }
                  }
                } else if (event == "register") {
                  console.log(msg);
                }
              },
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
  methods: {},
};
</script>
