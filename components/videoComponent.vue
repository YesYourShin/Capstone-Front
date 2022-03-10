<template lang="">
  <div></div>
</template>
<script>
import Janus from "@/plugins/janus";

export default {
  methods: {
    newRemoteFeed(id, display, audio, video) {
      console.log("newRemoteFeed 발동");
      let remoteFeed = null;
      janus.attach({
        plugin: "janus.plugin.videoroom",
        success: function (pluginHandle) {
          remoteFeed = pluginHandle;
          Janus.log(
            "Plugin attached! (" +
              remoteFeed.getPlugin() +
              ", id=" +
              remoteFeed.getId() +
              ")"
          );

          let subscribe = null;
          if (pin) {
            subscribe = {
              request: "join",
              room: roomId,
              ptype: "subscriber",
              feed: id,
              pin: pin,
              private_id: vrc.$store.state.joinedRoom.publisherPvtId,
            };
          } else {
            subscribe = {
              request: "join",
              room: roomId,
              ptype: "subscriber",
              feed: id,
              private_id: vrc.$store.state.joinedRoom.publisherPvtId,
            };
          }

          remoteFeed.videoCodec = video;
          remoteFeed.send({ message: subscribe });
        },
        error: function (err) {
          Janus.error(" -- Error attaching plugin...", err);
        },
        onmessage: function (msg, jsep) {
          Janus.debug(" ::: Got a message (subscriber) :::", msg);
          var event = msg["videoroom"];
          Janus.debug("Event: " + event);

          if (msg["error"]) {
            console.log(msg["error"], "에러메시지 입니다");
          } else if (event) {
            if (event === "attached") {
              remoteFeed.rfid = msg["id"];
              remoteFeed.rfdisplay = msg["display"];
              // dispatch(
              //   subscribeFeed({
              //     id: msg["id"],
              //     display: msg["display"],
              //   })
              // );
              Janus.log(
                "Successfully attached to feed " +
                  remoteFeed.rfid +
                  " (" +
                  remoteFeed.rfdisplay +
                  ") in room " +
                  msg["room"]
              );
            } else if (event === "event") {
              // publisher로부터의 동시캐스트를 사용할 시 사용 (현재 사용 X)
            } else {
              // What has just happened?
            }
          }
          if (jsep) {
            Janus.debug("Handling SDP as well...", jsep);
            // Answer and attach
            remoteFeed.createAnswer({
              jsep: jsep,
              // Audio와 Video를 보내지 않는다.(전송은 Publisher)
              media: {
                data: true,
                audioSend: false,
                videoSend: false,
              },
              success: function (jsep) {
                Janus.debug("Got SDP!", jsep);
                var body = { request: "start", room: roomId };
                remoteFeed.send({ message: body, jsep: jsep });
              },
              error: function (error) {
                Janus.error("WebRTC error:", error);
              },
            });
          }
        },
        iceState: function (state) {
          // ICE 상태 변화시
          Janus.log(
            "ICE state of this WebRTC PeerConnection (feed #" +
              remoteFeed.rfindex +
              ") changed to " +
              state
          );
        },
        webrtcState: function (on) {
          // WebRETC PeerConnection 연결시 혹은 중단시
          Janus.log(
            "Janus says this WebRTC PeerConnection (feed #" +
              remoteFeed.rfindex +
              ") is " +
              (on ? "up" : "down") +
              " now"
          );
        },
        onlocalstream: function (stream) {
          // Subscriber는 오직 수신만
        },
        onremotestream: function (stream) {
          Janus.debug("Remote feed #" + remoteFeed.rfid + ", stream: ", stream);

          vrc.$store.commit("addSubscribeStream", {
            rfid: remoteFeed.rfid,
            stream: stream,
          });
        },
        oncleanup: function () {
          // 퇴장시 Subscriber Feed에서 제거
          vrc.$store.commit("removeSubscriber", remoteFeed.rfid);
        },
        ondataopen: function () {
          console.log("remote datachannel opened");
        },
      });
    },
  },
  mounted() {
    const ServerWS = "ws://13.125.132.255:8188/janus";
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
        janus = new Janus({
          server: ServerWS,
          opaqueId: opaqueId,
          success: function () {
            Janus.log("플러그 추가하세엽");
            janus.attach({
              plugin: "janus.plugin.videoroom",
              success: function (pluginHandle) {
                storePlugin = pluginHandle;

                if (pin) {
                  var register = {
                    request: "join",
                    room: roomId,
                    ptype: "publisher",
                    display: username,
                    pin: pin,
                  };
                } else {
                  var register = {
                    request: "join",
                    room: roomId,
                    ptype: "publisher",
                    display: username,
                  };
                }

                // var register = {
                //   request: "list",
                // };

                storePlugin.send({
                  message: register,
                  success: function (res) {
                    Janus.log(res, "플러그인 success 메시지");
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
                var event = msg["videoroom"];
                Janus.log("현재 event: " + event);
                Janus.debug("Event: " + event);
                if (event === "joined") {
                  // Publisher가 Join시 WebRTC와 협상하거나 존재하는 피드에 연결
                  // dispatch(
                  //   joinRoom({
                  //     room: msg["room"],
                  //     publisherId: msg["id"],
                  //     display: username,
                  //     publisherPvtId: msg["private_id"],
                  //   })
                  // );

                  vrc.$store.commit("joinRoom", {
                    room: msg["room"],
                    publisherId: msg["id"],
                    display: username,
                    publisherPvtId: msg["private_id"],
                  });

                  Janus.log(
                    "Successfully joined room " +
                      msg["room"] +
                      " with ID " +
                      msg["id"]
                  );

                  // SDP offer과 Publisher로 등록 진행
                  const publishOwnFeed = (useAudio) => {
                    storePlugin.createOffer({
                      // DataChannel 사용, Publisher는 전송만 진행하고 수신은 Subscriber에서 진행
                      media: {
                        data: true,
                        audioRecv: false,
                        videoRecv: false,
                        audioSend: useAudio,
                        videoSend: true,
                      },

                      success: function (jsep) {
                        Janus.debug("Got publisher SDP!", jsep);
                        var publish = {
                          request: "configure",
                          audio: useAudio,
                          video: true,
                        };

                        // SDP Offer 생성 완료 후, Publish 메세지와 jsep를 담아 Plugin에 전송
                        storePlugin.send({ message: publish, jsep: jsep });
                      },
                      error: function (error) {
                        // 에러 발생시 재시도
                        Janus.error("WebRTC error:", error);
                        publishOwnFeed(useAudio);
                      },
                    });
                  };

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
                      vrc.newRemoteFeed(id, display, audio, video);
                    }
                  }
                } else if (event === "destroyed") {
                  // 방 삭제
                  Janus.warn("The room has been destroyed!");
                  vrc.$router.push("/lobby");
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
};
</script>
<style lang=""></style>
