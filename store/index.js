export const state = () => ({
  friends: Array(12)
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
  subscribedStreams: [],
})

export const mutations = {
  newChat(state, user) {
    if (!state.chats.includes(user)) {
      state.chats.push(user)
      state.selectedIndex = state.chats.length - 1
    }
  },
  tabClicked(state, index) {
    state.selectedIndex = index
  },
  tabClose(state, index) {
    console.log(state.chats);
    console.log('catched index: ', index);
    state.chats.splice(index, 1)
    if (index <= state.selectedIndex) {
      state.selectedIndex = state.selectedIndex - 1
    }
  },
  joinRoom(state, data) {
    state.joinedRoom = data
  },
  addSubscribeStream(state, data) {
    state.subscribedStreams.push(data)
  },
  removeSubscriber(state, rfid) {
    state.subscribedStreams = state.subscribedStreams.filter(function (data) {
      return data.rfid != rfid;
    })
  }
}

