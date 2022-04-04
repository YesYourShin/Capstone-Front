<template lang="">
  <div class="flex flex-col min-h-screen w-full">
    <div class="flex-grow">
      <div class="flex">
        <div
          class="bg-gradient-to-r via-gray-300 from-transparent flex justify-center items-center"
        >
          <p>{{ game.name }}</p>
        </div>
        <sideBar></sideBar>
      </div>
      <div class="px-2 mt-10">
        <div class="grid grid-cols-5 justify-evenly">
          <!-- <template v-for="user in game.members">
            <div class="justify-self-center px-2 pb-3 w-full">
              <div
                class="aspect-video bg-fuchsia-400 border border-red-600"
              >
              </div>
              <p class="bg-white rounded-b-lg">{{user ? user.nickname : ''}}</p>
            </div>
          </template> -->
          <div class="justify-self-center px-2 pb-3 w-full">
            <div class="aspect-video bg-fuchsia-400 border border-red-600">
              <video id="myVideo" ref="myVideo" muted></video>
            </div>
            <!-- <p class="bg-white rounded-b-lg">{{user ? user.nickname : ''}}</p> -->
          </div>
          <template v-for="s in subscribedStreams">
            <div class="justify-self-center px-2 pb-3 w-full">
              <div class="aspect-video bg-fuchsia-400 border border-red-600">
                <video
                  :ref="'remote' + s.rfid"
                  :id="'remote' + s.rfid"
                  :src-object.prop.camel="s.stream"
                  autoplay
                ></video>
              </div>
              <p class="bg-white rounded-b-lg">{{ s.display }}</p>
            </div>
          </template>
        </div>
      </div>
      <div class="flex flex-row-reverse px-2">
        <div
          class="p-2 w-40 justify-center items-center"
          @click="$router.replace('/lobby')"
        >
          <div
            class="flex items-center p-4 bg-yellow-200 rounded-lg shadow-xs cursor-pointer hover:bg-yellow-500 hover:text-gray-100 transition duration-300"
          >
            <p class="text-lg font-bold mx-auto">나가기</p>
          </div>
        </div>
        <div class="p-2 md:w-40">
          <div
            class="flex items-center p-4 bg-green-200 rounded-lg shadow-xs cursor-pointer hover:bg-green-500 hover:text-gray-100 transition duration-300"
          >
            <p class="text-lg font-bold mx-auto">준비하기</p>
          </div>
        </div>
      </div>
    </div>
    <chatBox></chatBox>
  </div>
</template>
<script>
import chatBox from "@/components/lobby_elements/chatBox.vue";
import sideBar from "@/components/lobby_elements/sideBar.vue";
import Janus from "@/plugins/janus";
import { mapState } from "vuex";
import { leaveGame, getGame } from "@/api/mafiaAPI";

export default {
  components: {
    chatBox,
    sideBar,
  },
  data() {
    return {
      game: {},
      storePlugin: null,
      janus: null,
    };
  },
  computed: {
    subscribedStreams() {
      return this.$store.state.stream.subscribedStreams;
    },
    mainFeed() {
      return this.$store.state.stream.mainFeed;
    },
    publishStream() {
      return this.$store.state.stream.publishStream;
    },
    joinedRoom() {
      return this.$store.state.stream.joinedRoom;
    },
    isRoomOut() {
      return this.$store.state.stream.isRoomOut;
    },
    // ...mapState([
    //   "subscribedStreams",
    //   "mainFeed",
    //   "publishStream",
    //   "joinedRoom",
    // ]),
  },
  methods: {
    // async exit() {
    //   const res = await leaveGame(this.$route.params.id)
    //   console.log(res);
    //   this.$router.push(`/lobby`)
    // }
    exit() {
      var unpublish = { request: "unpublish" };
      var leave = { request: "leave" };
      let vrc = this;
      this.storePlugin.send({
        message: unpublish,
        success: function () {
          vrc.$store.commit("stream/removeAllSubscribers");
          vrc.$store.commit("stream/setPublishStream", null);
        },
        error: function (error) {
          console.log("unpublish failed:", error);
        },
      });
      this.storePlugin.send({
        message: leave,
        success: function () {
          vrc.janus.destroy();
        },
        error: function (error) {
          console.log("leave failed:", error);
        },
      });
    },
  },
  mounted() {
    const ServerWS =
      process.env.NODE_ENV === "production"
        ? "wss://gjgjajaj.xyz/janus"
        : "ws://13.125.132.255:8188/janus";
    let janus = null;
    // const opaqueId = "videoroomtest-" + Janus.randomString(12); //opaqueId 값을 통해서 유저 구분
    const opaqueId = "videoroomtest-" + "dong"; //opaqueId 값을 통해서 유저 구분
    let videoHandlerGame = null; //Handle 객체

    let vrc = this;
    let pin = null;
    let username = "Yuuto";
    let roomId = 16121235;
    // let newRemoteFeed = null;

    Janus.init({
      debut: "all",
      callback: function () {
        if (!Janus.isWebrtcSupported()) {
          Janus.log("No WebRTC support...");
          return;
        }

        // 세션 생성
        vrc.janus = new Janus({
          server: ServerWS,
          opaqueId: opaqueId,
          success: function () {
            vrc.janus.attach({
              plugin: "janus.plugin.videoroom",
              success: function (pluginHandle) {
                vrc.storePlugin = pluginHandle;

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

                vrc.storePlugin.send({
                  message: register,
                });
              },
              error: function (e) {
                Janus.error(" -- Error attaching plugin...", e);
              },
              consentDialog: function (on) {
                Janus.debug(
                  "Consent dialog should be " + (on ? "on" : "off") + " now"
                );

                if (on) {
                  // getUserMedia 호출 전
                } else {
                  // getUserMedia 호출 후
                }
              },
              iceState: function (state) {
                // ICE 상태 변화시
                Janus.log("ICE state changed to " + state);
              },
              mediaState: function (medium, on) {
                // Media 정보를 받기 시작하거나 중지할시
                Janus.log(
                  "Janus " +
                    (on ? "started" : "stopped") +
                    " receiving our " +
                    medium
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
                Janus.debug(" ::: Got a message (publisher) :::", msg);
                Janus.log(" ::: Got a message (publisher) :::", msg);

                var event = msg["videoroom"];

                if (event) {
                  function newRemoteFeed(id, display, audio, video) {
                    let remoteFeed = null;
                    vrc.janus.attach({
                      plugin: "janus.plugin.videoroom",
                      opaqueId: opaqueId,
                      success: function (pluginHandle) {
                        remoteFeed = pluginHandle;
                        Janus.log(
                          "Plugin attached! (" +
                            remoteFeed.getPlugin() +
                            ", id=" +
                            remoteFeed.getId() +
                            ")"
                        );
                        Janus.log(" -- This is a subscriber");

                        let subscribe = null;
                        if (pin) {
                          subscribe = {
                            request: "join",
                            room: roomId,
                            ptype: "subscriber",
                            feed: id,
                            pin: pin,
                            private_id: vrc.joinedRoom.publisherPvtId,
                          };
                        } else {
                          subscribe = {
                            request: "join",
                            room: roomId,
                            ptype: "subscriber",
                            feed: id,
                            private_id: vrc.joinedRoom.publisherPvtId,
                          };
                        }

                        remoteFeed.videoCodec = video;
                        remoteFeed.send({ message: subscribe });
                      },
                      error: function (error) {
                        Janus.error(" -- Error attaching plugin...", error);
                      },
                      onmessage: function (msg, jsep) {
                        Janus.debug(" ::: Got a message (subscriber) :::", msg);
                        Janus.log(" ::: Got a message (subscriber) :::", msg);

                        var event = msg["videoroom"];
                        Janus.debug("Event: " + event);

                        if (msg["error"]) {
                          console.log(msg["error"]);
                        } else if (event) {
                          if (event === "attached") {
                            remoteFeed.rfid = msg["id"];
                            remoteFeed.rfdisplay = msg["display"];
                            // vrc.$store.commit("stream/subscribeFeed", {
                            //   id: msg["id"],
                            //   display: msg["display"],
                            // });

                            Janus.log(
                              "Successfully attached to feed" +
                                remoteFeed.rfid +
                                " (" +
                                remoteFeed.rfdisplay +
                                ") in room " +
                                msg["room"]
                            );
                          } else if (event === "event") {
                            // publisher로부터의 동시 캐스트를 사용할 시 사용 (현재 사용 x)
                          } else {
                            // What just happened?
                          }
                        }
                        if (jsep) {
                          Janus.debug("Handling SDP as well...", jsep);
                          // Answer and attach

                          remoteFeed.createAnswer({
                            jsep: jsep,
                            media: {
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
                        // subscriber는 오직 수신만
                      },
                      onremotestream: function (stream) {
                        Janus.debug(
                          "Remote feed #" + remoteFeed.rfid + ", stream:",
                          stream
                        );
                        console.log("if 전 active:", stream.active);
                        if (stream.active) {
                          console.log("if 후 active:", stream.active);
                          console.log("리모트 스트림 입니다:", stream);
                          vrc.$store.commit("stream/addSubscribeStream", {
                            rfid: remoteFeed.rfid,
                            display: remoteFeed.rfdisplay,
                            stream: stream,
                          });
                        } else {
                          vrc.$store.commit(
                            "stream/removeSubscriber",
                            remoteFeed.rfid
                          );
                        }
                      },
                      oncleanup: function () {
                        // 퇴장시 Subscriber Feed에서 제거
                        console.log("clean user rfid: ", remoteFeed.rfid);
                        vrc.$store.commit(
                          "stream/removeSubscriber",
                          remoteFeed.rfid
                        );
                      },
                    });
                  }
                  if (event === "joined") {
                    vrc.$store.commit("stream/joinRoom", {
                      room: msg["room"],
                      publisherId: msg["id"],
                      display: username,
                      publisherPvtId: msg["private_id"],
                    });

                    Janus.log(
                      `Successfully joined room ${msg["room"]} with Id ${msg["id"]}`
                    );

                    const publishOwnFeed = () => {
                      vrc.storePlugin.createOffer({
                        // DataChannel 사용안함, Publisher는 전송만 진행하고 수신은 Subscriber에서 진행
                        media: {
                          audioRecv: false,
                          videoRecv: false,
                          audioSend: true,
                          videoSend: true,
                          video: "lowres-16:9",
                        },

                        success: function (jsep) {
                          Janus.debug("Got publisher SDP!", jsep);
                          var publish = {
                            request: "configure",
                            audio: true,
                            video: true,
                          };

                          // SDP Offer 생성 완료 후, Publish 메세지와 jsep를 담아 Plugin에 전송
                          vrc.storePlugin.send({
                            message: publish,
                            jsep: jsep,
                          });
                        },
                        error: function (error) {
                          // 에러 발생시 재시도
                          Janus.error("WebRTC error:", error);
                          publishOwnFeed(useAudio);
                        },
                      });
                    };
                    publishOwnFeed();

                    if (msg["publishers"]) {
                      var list = msg["publishers"];
                      Janus.debug(
                        "Got a list of available publishers/feeds: ",
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
                  } else if (event === "destroyed") {
                    Janus.warn("The room hs been destroyed!");
                    vrc.$router.push("/lobby");
                  } else if (event === "event") {
                    // 새로운 publisher 접속
                    if (msg["publishers"]) {
                      var list = msg["publishers"];
                      Janus.debug(
                        "Got a list of available publishers/feeds: ",
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
                    } else if (msg["leaving"]) {
                      var leaving = msg["leaving"];
                      if (leaving === "ok") {
                        return;
                      }

                      vrc.$store.commit("stream/removeSubscriber", leaving);
                    } else if (msg["unpublished"]) {
                      var unpublished = msg["unpublished"];
                      if (unpublished === "ok") {
                        return;
                      }

                      vrc.$store.commit("stream/removeSubscriber", unpublished);
                    } else if (msg["error"]) {
                      if (msg["error_code"] === 433) {
                        vrc.$router.push("/lobby");
                        alert(`잘못된 비밀번호입니다!`);
                      } else if (msg["error_code"] === 426) {
                        // This is a "no such room" error: give a more meaningful description
                      } else {
                        Janus.error(msg["error"]);
                      }
                    }
                  }
                }
                if (jsep) {
                  Janus.debug("Handling SDP as well...", jsep);
                  vrc.storePlugin.handleRemoteJsep({ jsep: jsep });
                  // Audio가 거절당할 시
                  var audio = msg["audio_codec"];
                  if (
                    vrc.publishStream &&
                    vrc.publishStream.stream.getAudioTracks() &&
                    vrc.publishStream.stream.getAudioTracks().length > 0 &&
                    !audio
                  ) {
                    Janus.log(
                      "우리의 오디오 스트림이 거절되었습니다. viewer들은 우리를 들을 수 없습니다."
                    );
                  }

                  // Video가 거절당할 시
                  var video = msg["video_codec"];
                  if (
                    vrc.publishStream &&
                    vrc.publishStream.stream.getVideoTracks() &&
                    vrc.publishStream.stream.getVideoTracks().length > 0 &&
                    !video
                  ) {
                    Janus.log(
                      "우리의 비디오 스트림이 거절되었습니다. viewer들은 우리를 볼 수 없습니다."
                    );
                  }
                }
              },
              onlocalstream: function (stream) {
                Janus.debug(" ::: Got a local stream :::", stream);
                if (stream.active) {
                  vrc.$store.commit("stream/setPublishStream", {
                    stream: stream,
                    display: username,
                  });

                  if (vrc.publishStream) {
                    vrc.$refs.myVideo.pause();
                    Janus.attachMediaStream(vrc.$refs.myVideo, stream);
                    vrc.$refs.myVideo.load();
                    vrc.$refs.myVideo.play();
                  }
                }
              },
              // onlocaltrack: function (track, on) {
              //   console.log("온 로컬 스트림 ㄱㄱ");
              //   console.log("track is :", track);
              //   console.log("on is :", on);
              //   Janus.debug(
              //     "Local track " + (on ? "added" : "removed") + ":",
              //     track
              //   );
              //   var trackId = track.id.replace(/[{}]/g, "");

              //   if (!on) {
              //     // 트랙 제거됨
              //     return;
              //   }
              //   if (track.kind === "audio") {
              //   } else {
              //     let stream = new MediaStream();
              //     stream.addTrack(track.clone());
              //     vrc.$store.commit("stream/setPublishStream", {
              //       stream: stream,
              //       display: username,
              //     });
              //     Janus.log("로컬 스트림 생성됨: ", stream);
              //     if (vrc.publishStream) {
              //       vrc.$refs.myVideo.pause();
              //       Janus.attachMediaStream(vrc.$refs.myVideo, stream);
              //       vrc.$refs.myVideo.load();
              //       vrc.$refs.myVideo.play();
              //     }
              //   }
              // },
              onremotestream: function (stream) {
                // 오직 Publish에서만 전송
              },
              oncleanup: function () {
                Janus.log(
                  " ::: Got a cleanup notification: we are unpublished now :::"
                );
              },
              detached: function () {},
            });
          },
          error: function (err) {
            Janus.error(err);
          },
          destroyed: function () {
            Janus.log("Janus Destroyed");
          },
        });
      },
    });
  },
  beforeDestroy() {
    if (this.isRoomOut) {
      this.exit();
    }
  },
};
</script>
<style lang=""></style>
