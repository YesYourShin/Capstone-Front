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
        read: true,
      }
    } else {
      state.chats = [{
        name: chatName,
        messages: [],
        closable: false,
        read: true,
      }]
      state.selectedIndex = 0;
    }
  },
  newChat(state, user) {

    let chat = find(state.chats, user);
    if (!chat) {
      let newChat = {
        name: user.nickname,
        userId: user.userId,
        messages: [],
        closable: true,
        read: true,
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
  newMessage(state, data) {
    let user;
    if (state.user.myInfo.profile) {
      user = state.user.myInfo.profile.nickname === data.sender.nickname ? data.receiver : data.sender;
    } else {
      return
    }
    let chat = find(state.chats, user);
    if (!chat) {
      let newChat = {
        name: user.nickname,
        userId: user.userId,
        messages: [`${data.sender.nickname}: ${data.message}`],
        closable: true,
        read: false,
      }
      state.chats.push(newChat);
    } else {
      let newChat = chat;
      const newIndex = state.chats.indexOf(chat);
      newChat.messages.unshift(`${data.sender.nickname}: ${data.message}`);
      newChat.read = state.selectedIndex === newIndex ? true : false;
      Vue.set(state.chats, newIndex, newChat);
    }

  },
  tabClicked(state, index) {
    state.selectedIndex = index;
    state.chats[index].read = true;
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

function find(arr, user) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].name === user.nickname) {
      return arr[i];
    }
  }
  return null;
}

// export const getters = {
//   getSocket(state) {
//     return state.socket;
//   }
// }
