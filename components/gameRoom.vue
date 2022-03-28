<template lang="">
  <div class="flex flex-col min-h-screen w-full">
    <div class="flex-grow">
      <div class="flex">
        <div class=" bg-gradient-to-r via-gray-300 from-transparent flex justify-center items-center">
          <p>{{game.name}}</p>
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
            <div
              class="aspect-video bg-fuchsia-400 border border-red-600"
            >
              <video id="myVideo" ref="myVideo" muted></video>
            </div>
            <!-- <p class="bg-white rounded-b-lg">{{user ? user.nickname : ''}}</p> -->
          </div>
          <template v-if="subscribedStreams.length" v-for="s in subscribedStreams">
            <div class="justify-self-center px-2 pb-3 w-full">
              <div
                class="aspect-video bg-fuchsia-400 border border-red-600"
              >
                <video :ref="'remote'+s.rfid" :id="'remote'+s.rfid" muted></video>
              </div>
              <!-- <p class="bg-white rounded-b-lg">{{user ? user.nickname : ''}}</p> -->
            </div>
          </template>
        </div>
      </div>
      <div class="flex flex-row-reverse px-2">
        <div class="p-2 w-40 justify-center items-center" @click="exit()">
          <div class="flex items-center p-4 bg-yellow-200 rounded-lg shadow-xs cursor-pointer hover:bg-yellow-500 hover:text-gray-100 transition duration-300">
            <p class=" text-lg font-bold mx-auto">
              나가기
            </p>
          </div>
        </div>
        <div class="p-2 md:w-40 ">
          <div class="flex items-center p-4 bg-green-200 rounded-lg shadow-xs cursor-pointer hover:bg-green-500 hover:text-gray-100 transition duration-300">
            <p class=" text-lg font-bold mx-auto">
              준비하기
            </p>
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
import Janus from "@/plugins/janus"
import { leaveGame, getGame } from '@/api/mafiaAPI'

export default {
  components: {
    chatBox,
    sideBar,
  },
  data() {
    return {
      game: {},
      storePlugin: null,
      myStream: null,
      janus: null,
    }
  },
  computed: {
    subscribedStreams() {
      return this.$store.getters.getSubscribedStreams;
    },
    mainFeed() {
      return this.$store.getters.getMainFeed;
    }
  },
  methods: {
    // async exit() {
    //   const res = await leaveGame(this.$route.params.id)
    //   console.log(res);
    //   this.$router.push(`/lobby`)
    // }
    exit() {
      this.$router.push('/lobby')
      this.janus.destroy()
      this.$store.commit('removeAllSubscribers')
    }
  },
  mounted() {
    const ServerWS = process.env.NODE_ENV === 'production' ? "wss://gjgjajaj.xyz/janus" : "ws://13.125.132.255:8188/janus";
    let janus = null;
    // const opaqueId = "videoroomtest-" + Janus.randomString(12); //opaqueId 값을 통해서 유저 구분
    const opaqueId = "videoroomtest-" + "dong"; //opaqueId 값을 통해서 유저 구분
    let videoHandlerGame = null; //Handle 객체

    let vrc = this;
    let pin = null;
    let username = "Yuuto";
    let roomId = 16121235;
    let newRemoteFeed = null;

    Janus.init({
      debug: "all",
      callback: function () {
        // WebRTC 지원안할시
        if (!Janus.isWebrtcSupported()) {
          Janus.log("No WebRTC support... ");
          return;
        }
        // 세션 생성
        vrc.janus = new Janus({
          server: ServerWS,
          success: function () {
            // VideoRoom Plugin 연결
            vrc.janus.attach({
              plugin: "janus.plugin.videoroom",
              opaqueId: opaqueId,
              success: function (pluginHandle) {
                vrc.storePlugin = pluginHandle;
                Janus.log(
                  "Plugin attached! (" +
                    vrc.storePlugin.getPlugin() +
                    ", id=" +
                    vrc.storePlugin.getId() +
                    ")"
                );
                Janus.log("  -- This is a publisher/manager");
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

                vrc.storePlugin.send({ message: register });
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
                // Plugin으로부터 Message/Event 수신 (Join시 발생)
                Janus.log(" ::: Got a message (publisher) :::", msg);
                Janus.debug(" ::: Got a message (publisher) :::", msg);
                var event = msg["videoroom"];
                Janus.debug("Event: " + event);

                if (event) {
                  newRemoteFeed = (id, display, audio, video) => {
                    // 새로운 피드가 Publish되면, 새로운 피드를 생성해 Subscribe한다.
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
                        Janus.log("  -- This is a subscriber");

                        let subscribe = null;
                        if (pin) {
                          subscribe = {
                            request: "join",
                            room: roomId,
                            ptype: "subscriber",
                            feed: id,
                            pin: pin,
                            private_id:
                              vrc.$store.state.joinedRoom.publisherPvtId,
                          };
                        } else {
                          subscribe = {
                            request: "join",
                            room: roomId,
                            ptype: "subscriber",
                            feed: id,
                            private_id:
                              vrc.$store.state.joinedRoom.publisherPvtId,
                          };
                        }

                        // Subscribe 메세지를 담아 Plugin에 전송 (Plugin 측에서 Offer를 생성하여 전송해줌)
                        remoteFeed.videoCodec = video;
                        remoteFeed.send({ message: subscribe });
                      },
                      error: function (error) {
                        Janus.error("  -- Error attaching plugin...", error);
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

                            vrc.$store.commit("subscribeFeed", {
                              id: msg["id"],
                              display: msg["display"],
                            });
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
                        Janus.debug(
                          "Remote feed #" + remoteFeed.rfid + ", stream:",
                          stream
                        );

                        vrc.$store.commit("addSubscribeStream", {
                          rfid: remoteFeed.rfid,
                          display: remoteFeed.rfdisplay,
                          stream: stream,
                        });

                        var vid = document.getElementById(`remote${remoteFeed.rfid}`)
                        console.log(vid);
                        // vid.pause()
                        vid.load()
                        vid.play()


                        console.log(stream, "ㅇㅎ! 이게 리모트 스트림이군요!");
                      },
                      oncleanup: function () {
                        // 퇴장시 Subscriber Feed에서 제거

                        vrc.$store.commit('removeSubscriber', remoteFeed.rfid);
                      },
                      ondataopen: function () {
                        console.log("remote datachannel opened");
                      },
                      ondata: function (data) {
                        let json = JSON.parse(data);
                        let what = json["textroom"];
                        if (what === "message") {
                          let whisper = json["to"];
                          console.log(whisper, username);
                          if (whisper) {
                            if (whisper === username) {
                              // dispatch(
                              //   receiveChat({
                              //     display: json["display"],
                              //     text: json["text"],
                              //     time: moment().format("HH:mm"),
                              //     isPrivateMessage: true,
                              //   })
                              // );
                            }
                          } else {
                            // dispatch(
                            //   receiveChat({
                            //     display: json["display"],
                            //     text: json["text"],
                            //     time: moment().format("HH:mm"),
                            //     isPrivateMessage: false,
                            //   })
                            // );
                          }
                        }
                      },
                    });
                  };
                  if (event === "joined") {
                    // Publisher가 Join시 WebRTC와 협상하거나 존재하는 피드에 연결

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
                    const publishOwnFeed = () => {
                      vrc.storePlugin.createOffer({
                        media: {
                          data: true,
                          audioRecv: false,
                          videoRecv: false,
                          audioSend: true,
                          videoSend: true,
                          video: "lowres-16:9",
                        },
                        success: function (jsep) {
                          Janus.log("publishing own feed success!!");
                          Janus.debug("Got publisher SDP!", jsep);
                          var publish = {
                            request: "configure",
                            audio: true,
                            video: true,
                          };
                          vrc.storePlugin.send({
                            message: publish,
                            jsep: jsep,
                            success: function (res) {
                              console.log(res);
                            },
                          });
                        },
                        error: function (error) {
                          Janus.error("WebRTC error:", error);
                          publishOwnFeed();
                        },
                      });
                    };
                    publishOwnFeed();

                    // 다른 Publisher들이 존재할시
                    if (msg["publishers"]) {
                      var list = msg["publishers"];
                      Janus.debug(
                        "Got a list of available publishers/feeds:",
                        list
                      );
                      Janus.log(
                        "Got a list of available publishers/feeds:",
                        list
                      );
                      for (var f in list) {
                        var id = list[f]["id"];
                        var display = list[f]["display"];
                        var audio = list[f]["audio_codec"];
                        var video = list[f]["video_codec"];
                        Janus.log(
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
                    // 방 삭제
                    Janus.warn("The room has been destroyed!");
                    vrc.$router.push("/");
                  } else if (event === "event") {
                    // 새로운 Publisher 접속시
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
                        // 모두 Subscribe 진행unpublish
                        newRemoteFeed(id, display, audio, video);
                      }
                    } else if (msg["leaving"]) {
                      // One of the publishers has gone away?
                      var leaving = msg["leaving"];
                      if (msg["leaving"] === "ok") {
                        return;
                      }

                      vrc.$store.commit("removeSubscriber", leaving);

                    } else if (msg["unpublished"]) {
                      var unpublished = msg["unpublished"];
                      if (unpublished === "ok") {
                        return;
                      }

                      vrc.$store.commit("removeSubscriber", unpublished);
                    } else if (msg["error"]) {
                      if (msg["error_code"] === 433) {
                        vrc.$router.push("/");
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
                  // Audio가 거절당할시
                  var audio = msg["audio_codec"];
                  if (
                    vrc.myStream &&
                    vrc.myStream.getAudioTracks() &&
                    vrc.myStream.getAudioTracks().length > 0 &&
                    !audio
                  ) {
                    Janus.log(
                      "Our audio stream has been rejected, viewers won't hear us"
                    );
                  }

                  // Video가 거절당할시
                  var video = msg["video_codec"];
                  if (
                    vrc.myStream &&
                    vrc.myStream.getVideoTracks() &&
                    vrc.myStream.getVideoTracks().length > 0 &&
                    !video
                  ) {
                    Janus.log(
                      "Our video stream has been rejected, viewers won't see us"
                    );
                  }
                }
              },
              onlocalstream: function (stream) {
                Janus.debug(" ::: Got a local stream :::", stream);
                vrc.myStream = stream;
                console.log(vrc.myStream, "이게 로컬 스트림이다 이말이야!");
                console.log(vrc.$refs.myVideo);
                // Janus.attachMediaStream(
                //   document.getElementById("myVideo"),
                //   stream
                // );
                // vrc.$refs.myStream.srcObject = stream;

                vrc.$store.commit("addPublishStream", stream);
                vrc.$store.commit("changeMainFeed", {
                  stream: stream,
                  display: username,
                });
                // Video 존재 여부에 따른 처리
                // var videoTracks = stream.getVideoTracks();
                // if (!videoTracks || videoTracks.length === 0) {

                // } else {

                // }
                if (vrc.mainFeed) {
                  vrc.$refs.myVideo.pause();
                  Janus.attachMediaStream(vrc.$refs.myVideo, stream);
                  vrc.$refs.myVideo.load();
                  vrc.$refs.myVideo.play();

                }
              },
              onremotestream: function (stream) {
                // 오직 Publish에서만 전송
              },
              ondataopen: function (data) {
                console.log("data channel opened");
              },
              ondata: function (data) {
                Janus.log("Receive Data: ", data);
              },
              oncleanup: function () {
                Janus.log(
                  " ::: Got a cleanup notification: we are unpublished now :::"
                );
                vrc.myStream = null;
              },
            });
          },
          error: function (error) {
            Janus.error(error);
          },
          destroyed: function () {
            Janus.log("Janus Destroyed!");
          },
        });
      },
    });
  },
  beforeDestroy() {
  }
};
</script>
<style lang=""></style>
