import Vue from 'vue'

export const state = () => ({
  joinedRoom: null,
  currentRoomInfo: null,
  roomMembers: [],
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
    function findnick(array, goal) {
      if (array === null) return;
      for (const val of array) {
        if (val.nickname === goal.nickname) return val;
      }
    }
    // if (state.subscribedStreams.some(findrfid)) return;
    // state.subscribedStreams.push(data)
    // console.log("added subscStream: (rfid)", data.rfid);
    // state.entered = data.nickname;

    let target = findnick(state.roomMembers, data);
    if (target) {
      if (target.stream) return;
      // let d = state.roomMembers.find(e => e.nickname === data.nickname);

      // Object.assign(target, data);
      console.log("여기까지 왔냐");
      // target = { ...target, ...{stream: data["stream"], rfid: data["rfid"]} };
      // target.stream = data.stream;
      // target.rfid = data.rfid;
      Vue.set(target, "stream", data.stream);
      Vue.set(target, "rfid", data.rfid);
      // target = d;
    }
  },
  removeSubscriber(state, rfid) {
    console.log(rfid);

    for (let i = 0; i<state.subscribedStreams.length; i++) {
      console.log('index: ', i, 'rfid: ', state.subscribedStreams[i].rfid);
      if (state.subscribedStreams[i].rfid == rfid) {
        state.left = state.subscribedStreams[i].nickname;
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
    function kill_own_feed() {
      for (let mediaStream of state.roomMembers) {
        stopMediaStream(mediaStream.stream)
      }

      // if (state.publishStream) {
      //   stopMediaStream(state.publishStream.stream)
      // }
    }

    kill_own_feed();

    // state.subscribedStreams = [];
    state.roomMembers = [];
    state.joinedRoom = null;
    state.entered = null;
    state.left = null;

    console.log("deleted all subscStreams");
  },
  // setPublishStream(state, data) {

  //   function findnick(array, goal) {
  //     if (array === null) return;
  //     for (const val of array) {
  //       if (val.nickname === goal.nickname) return val;
  //     }
  //   }
  //   let target = findnick(state.roomMembers, data);
  //   if (target) {
  //     if (target.stream) return;
  //     Object.assign(target, data);
  //   }


  //   // state.publishStream = data;
  // },
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
            // member.stream = null;
            state.roomMembers = [...state.roomMembers, member];
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
    data.speaking = false;
    if (!state.roomMembers.length) {
      // data.stream = null;
      state.roomMembers = [data];
    } else {
      state.roomMembers = [...state.roomMembers, data];
    }
  },
  removeRoomMember(state, data) {
    if (!state.roomMembers.length) {
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
    state.roomMembers = [];
  },
  setRoomMembersDie(state, data) {
    for (let member of state.roomMembers) {
      if (member.nickname === data.nickname) {
        member.die = data.die;
        break;
      }
    }
  },
  setRoomMembersJob(state, data) {
    for (let member of state.roomMembers) {
      if (member.nickname === data.nickname) {
        member.job = data.job;
        break;
      }
    }
  },
  killMember(state, data) {
    for (let member of state.roomMembers) {
      if (member.nickname === data.nickname) {
        member.die = true;
        stopMediaStream(member.stream);
        break;
      }
    }
  },
  readySubscriber(state, data) {
    for (let i=0; i<state.subscribedStreams.length; i++) {
      let sub = state.subscribedStreams[i];
      if (sub.nickname === data.nickname) {
        sub.ready = data.ready;
        break;
      }
    }
  },
  setSpeaker(state, data) {
    function find(arr, data) {
      for (const val of arr) {
        if (val.nickname === data.nickname) return val;
      }
      return null;
    }
    const target = find(state.roomMembers, data);
    if (target) {
      target.speaking = data.speaking;
    }
  }
}

export const getters = {
  getJoinedRoom: state => state.joinedRoom,
  getSubscribedStreams: state => state.subscribedStreams,
  getSubscribedFeeds: state => state.subscribedFeeds,
  getPublishStream: state => state.publishStream,
}



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
