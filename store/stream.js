export const state = () => ({
  joinedRoom: null,
  publishStream: null,
  subscribedStreams: [],
  subscribedFeeds: [],
  mainFeed: null,
  janus: null,
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
  },
  removeSubscriber(state, rfid) {
    console.log(rfid);
    // let filtered = state.subscribedStreams.filter((e) => e.rfid !== rfid)
    // state.subscribedStreams = filtered;

    for (let i = 0; i<state.subscribedStreams.length; i++) {
      console.log('index: ', i, 'rfid: ', state.subscribedStreams[i].rfid);
      if (state.subscribedStreams[i].rfid == rfid) {
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
    state.subscribedStreams = [];
    console.log("deleted all subscStreams");
  },
  setPublishStream(state, data) {
    state.publishStream = data;
  },
  changeMainFeed(state, data) {
    state.mainFeed = data;
  },
  subscribeFeed(state, data) {
    state.subscribedFeeds.push(data);
  },
}

export const getters = {
  getJoinedRoom: state => state.joinedRoom,
  getSubscribedStreams: state => state.subscribedStreams,
  getSubscribedFeeds: state => state.subscribedFeeds,
  getPublishStream: state => state.publishStream,
  getMainFeed: state => state.mainFeed,
}


