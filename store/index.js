import { UserModule } from "./user";

export const state = () => ({
  friends: Array(6)
    .fill()
    .map((arr, i) => {
      return {
        id: i,
        social_id: `user_id_${i}`,
        provider: "KAKAO",
        role: 1,
        createdAt: 0,
        updatedAt: 0,
        deletedAt: 0,
      };
    }),
  chats: [],
  selectedIndex: -1,
  joinedRoom: null,
  publishedStream: null,
  subscribedStreams: [],
  subscribedFeeds: [],
  mainFeed: null,
  janus: null,
});

export const mutations = {
  newChat(state, user) {
    if (!state.chats.includes(user)) {
      state.chats.push(user);
      state.selectedIndex = state.chats.length - 1;
    }
  },
  tabClicked(state, index) {
    state.selectedIndex = index;
  },
  tabClose(state, index) {
    console.log(state.chats);
    console.log("catched index: ", index);
    state.chats.splice(index, 1);
    if (index <= state.selectedIndex) {
      state.selectedIndex = state.selectedIndex - 1;
    }
  },
  joinRoom(state, data) {
    state.joinedRoom = data;
  },
  addSubscribeStream(state, data) {
    function findrfid(element) {
      if (element.rfid === data.rfid) {
        return true;
      }
    }
    if (state.subscribedStreams.some(findrfid)) return;
    state.subscribedStreams.push(data);
  },
  removeSubscriber(state, rfid) {
    state.subscribedStreams = state.subscribedStreams.filter(function (data) {
      return data.rfid != rfid;
    });

    // state.subscribedFeeds.forEach(e => {
    //   if (e.rfid == rfid) {
    //     e.detach
    //   }
    // });
  },
  removeAllSubscribers(state) {
    state.subscribedStreams = [];
  },
  addPublishStream(state, data) {
    state.publishedStream = data;
  },
  changeMainFeed(state, data) {
    state.mainFeed = data;
  },
  subscribeFeed(state, data) {
    state.subscribedFeeds.push(data);
  },
};

export const getters = {
  getJoinedRoom: (state) => state.joinedRoom,
  getSubscribedStreams: (state) => state.subscribedStreams,
  getSubscribedFeeds: (state) => state.subscribedFeeds,
  getPublishedStream: (state) => state.addPublishStream,
  getMainFeed: (state) => state.mainFeed,
};
