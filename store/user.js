import { getMyInformation, getNotifications } from "../api/mafiaAPI"
import Vue from 'vue'

export const state = () => ({
  myInfo: null,
  myNotifications: {},
})

export const mutations = {
  setMyInfo(state, data) {
    state.myInfo = data;
  },
  addFriend(state, data) {
    if (!state.myInfo) return;
    if (state.myInfo.friends) {
      Vue.set(state.myInfo, 'friends', [...state.myInfo.friends, data]);
    } else {
      Vue.set(state.myInfo, 'friends', [data]);
    }
  },
  deleteFriend(state, id) {
    if (!state.myInfo) return;
    if (state.myInfo.friends) {
      Vue.set(state.myInfo, 'friends', state.myInfo.friends.filter(friend => friend.userId !== id));
    }
  },
  setOnline(state, data) {
    if (!state.myInfo) return;
    if (state.myInfo.friends) {
      for (let friend of state.myInfo.friends) {
        if (friend.userId === data.userId) {
          friend.online = data.online;
        }
      }
      Vue.set(state.myInfo, 'friends', [...state.myInfo.friends]);
    }
  },
  setMyNotifications(state, data) {
    state.myNotifications = data;
  },
  addNotification(state, data) {
    Vue.set(state.myNotifications, 'items', [data, ...state.myNotifications.items]);
  },
  readNotification(state, data) {
    console.log('readNotification 발동', data);
    let temp = state.myNotifications.items;
    for (let i = 0; i < temp.length; i++) {
      if (temp[i].uuid === data.data.data.uuid) {
        temp.splice(i, 1);
        break
      }
    }
    console.log('temp 결과: ', temp);
    Vue.set(state.myNotifications, "items", temp);
  }
}

export const actions = {
  async fetchMyInfo(context) {
    try {
      const response = await getMyInformation()
      context.commit('setMyInfo', response.data.data);
    } catch (error) {
      console.log(error);
    }
    try {
      if (context.state.myInfo) {
        const response = await getNotifications(context.state.myInfo.id, 1, 10);
        context.commit('setMyNotifications', response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  },
}

export const getters = {
  getMyInfo(state) {
    return state.myInfo;
  },
  getMyNotifications(state) {
    return state.myNotifications;
  }
}
