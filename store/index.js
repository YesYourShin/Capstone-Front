import Vue from 'vue'

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
  // socket: io("ws://localhost:3065/game", {
  //   transports: ["websocket"],
  //   withCredentials: true,
  // }),
});

export const mutations = {
  mainChatInit(state, chatName) {
    if (state.chats.length) {
      state.chats[0] = {
        name: chatName,
        messages: [],
        closable: false,
      }
    } else {
      state.chats = [{
        name: chatName,
        messages: [],
        closable: false,
      }]
      state.selectedIndex = 0;
    }
  },
  newChat(state, user) {
    function find(arr, user) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].name === user.social_id) {
          return arr[i];
        }
      }
      return null;
    }
    let chat = find(state.chats, user);
    if (!chat) {
      let newChat = {
        name: user.social_id,
        messages: [],
        closable: true,
      }
      state.chats.push(newChat);
      state.selectedIndex = state.chats.length - 1;
    } else {
      state.selectedIndex = state.chats.indexOf(chat);
    }
  },
  newMessageOnMain(state, data) {
    if (state.chats.length) {
      // state.chats[0].messages.unshift(`${data.member.name}: ${data.message}`);
      let newChat = {...state.chats[0]};
      newChat.messages.unshift(`${data.member.name}: ${data.message}`);
      // state.chats[0] = newChats;
      Vue.set(state.chats, 0, newChat);
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
};

// export const getters = {
//   getSocket(state) {
//     return state.socket;
//   }
// }
