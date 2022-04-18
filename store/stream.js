export const state = () => ({
  joinedRoom: null,
  currentRoomInfo: null,
  roomMembers: null,
  publishStream: null,
  subscribedStreams: [],
  subscribedFeeds: [],
  storePlugin: null,
  janus: null,
  isRoomOut: false,
  entered: null,
  left: null,
})

export const mutations = {
  joinRoom(state, data) {
    state.joinedRoom = data
  },
  addSubscribeStream(state, data) {
    function findrfid(element) {
      if (element.rfid === data.rfid) {
        return true;
      }
    }
    if (state.subscribedStreams.some(findrfid)) return;
    state.subscribedStreams.push(data)
    console.log("added subscStream: (rfid)", data.rfid);
    state.entered = data.display;
  },
  removeSubscriber(state, rfid) {
    console.log(rfid);
    // let filtered = state.subscribedStreams.filter((e) => e.rfid !== rfid)
    // state.subscribedStreams = filtered;

    for (let i = 0; i<state.subscribedStreams.length; i++) {
      console.log('index: ', i, 'rfid: ', state.subscribedStreams[i].rfid);
      if (state.subscribedStreams[i].rfid == rfid) {
        state.left = state.subscribedStreams[i].display;
        state.subscribedStreams.splice(i, 1);
        console.log("deleted rfid: ", rfid);
        i--;
      }
    }
    // console.log("filtered", filtered);
    console.log("subscribedStreams", state.subscribedStreams);
    // state.subscribedFeeds.forEach(e => {
    //   if (e.rfid == rfid) {
    //     e.detach
    //   }
    // });
  },
  removeAllSubscribers(state) {
    // state.subscribedStreams = [];
    function stopAndRemoveTrack(mediaStream) {
      return function(track) {
        track.stop();
        mediaStream.removeTrack(track);
      };
    };

    function stopMediaStream(mediaStream) {
      if (!mediaStream) {
        return
      }

      mediaStream.getTracks().forEach(stopAndRemoveTrack(mediaStream));
    }

    function kill_own_feed() {
      // for (const [key, value] of Object.entries(localTracks)) {
      //   stopMediaStream(localTracks[key]);
      // }

      for (let mediaStream in state.subscribedStreams) {
        stopMediaStream(mediaStream.stream)
      }

      if (state.publishStream) {
        stopMediaStream(state.publishStream.stream)
      }
    }

    kill_own_feed();

    state.subscribedStreams = [];
    state.joinedRoom = null;
    state.entered = null;
    state.left = null;

    console.log("deleted all subscStreams");
  },
  setPublishStream(state, data) {
    state.publishStream = data;
  },
  subscribeFeed(state, data) {
    state.subscribedFeeds.push(data);
  },
  onRoomOut(state) {
    state.isRoomOut = true;
  },
  offRoomOut(state) {
    state.isRoomOut = false;
  },
  resetEntered(state) {
    state.entered = null;
  },
  resetLeft(state) {
    state.left = null;
  },
  setCurrentRoomInfo(state, data) {
    state.currentRoomInfo = data;
  },
  setCurrentRoomMember(state, data) {
    state.currentRoomInfo.members = data;
  },
  setRoomMembers(state, data) {
    function find(array, goal) {
      for (const val of array) {
        if (val.id === goal.id) return val;
      }
    }
    console.log("setRoomMembers", data);
    if (state.roomMembers === null) {
      state.roomMembers = data;
    } else {
      if (data.length >= state.roomMembers.length) {
        for (let i = 0; i < data.length; i++) {
          const member = data[i];

          const found = find(state.roomMembers, member);
          if (found) {
            Object.assign(found, member);
          } else {
            state.roomMembers.push(member);
          }
          // if (!state.roomMembers.filter(e => e.id === member.id).length) {
          //   state.roomMembers.push(member);
          // } else {
          //   Object.assign(state.roomMembers.find(e => e.id === member.id), member);
          // }
        }
      } else {
        for (let i = 0; i < state.roomMembers.length; i++) {
          let member = state.roomMembers[i];
          if (data.filter(e => e.id === member.id).length === 0) {
            state.roomMembers.splice(i, 1);
            i--;
          }
        }
      }
    }
  },
  addRoomMember(state, data) {
    if (state.roomMembers === null) {
      state.roomMembers = [data];
    } else {
      state.roomMembers.push(data);
    }
  },
  removeRoomMember(state, data) {
    if (state.roomMembers === null) {
      return;
    }
    for (let i = 0; i < state.roomMembers.length; i++) {
      let member = state.roomMembers[i];
      if (member.id === data.id) {
        state.roomMembers.splice(i, 1);
        i--;
      }
    }
  },
  destroyRoomMembers(state) {
    state.roomMembers = null;
  },
  readySubscriber(state, data) {
    for (let i=0; i<state.subscribedStreams.length; i++) {
      let sub = state.subscribedStreams[i];
      if (sub.display === data.nickname) {
        sub.ready = data.ready;
        break;
      }
    }
  }
}

export const getters = {
  getJoinedRoom: state => state.joinedRoom,
  getSubscribedStreams: state => state.subscribedStreams,
  getSubscribedFeeds: state => state.subscribedFeeds,
  getPublishStream: state => state.publishStream,
}


