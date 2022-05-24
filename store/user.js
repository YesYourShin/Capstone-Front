import {
  getMyInformation,
  getNotifications,
  getRecord,
  getScore,
} from "../api/mafiaAPI";
import Vue from "vue";

export const state = () => ({
  myInfo: null,
  myNotifications: [],
  myRecord: [],
  myScore: null,
});

export const mutations = {
  setMyInfo(state, data) {
    state.myInfo = data;
  },
  addFriend(state, data) {
    if (!state.myInfo) return;
    if (state.myInfo.friends) {
      Vue.set(state.myInfo, "friends", [...state.myInfo.friends, data]);
    } else {
      Vue.set(state.myInfo, "friends", [data]);
    }
  },
  deleteFriend(state, id) {
    if (!state.myInfo) return;
    if (state.myInfo.friends) {
      Vue.set(
        state.myInfo,
        "friends",
        state.myInfo.friends.filter((friend) => friend.userId !== id)
      );
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
      Vue.set(state.myInfo, "friends", [...state.myInfo.friends]);
    }
  },
  setMyNotifications(state, data) {
    state.myNotifications = data;
  },
  addNotification(state, data) {
    state.myNotifications = [data, ...state.myNotifications];
  },
  readNotification(state, data) {
    for (let i = 0; i < state.myNotifications.length; i++) {
      if (state.myNotifications[i].uuid === data.data.data.uuid) {
        state.myNotifications.splice(i, 1);
        break;
      }
    }
  },
  setRecord(state, data) {
    console.log("setRecord", data);
    state.myRecord = data;
  },
  addRecord(state, data) {
    for (let record of data) state.myRecord.push(record);
  },
  setScore(state, data) {
    console.log("setScore", data);
    state.myScore = data;
  },
};

export const actions = {
  async fetchMyInfo(context) {
    try {
      const response = await getMyInformation();
      context.commit("setMyInfo", response.data.data);
    } catch (error) {
      console.log(error);
    }
    try {
      if (context.state.myInfo) {
        const response = await getNotifications(context.state.myInfo.id);
        context.commit("setMyNotifications", response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
    try {
      const response = await getRecord(
        context.state.myInfo.profile.nickname,
        1,
        10
      );
      console.log(context);
      context.commit("setRecord", response.data.data);
    } catch (error) {
      console.log(error);
    }
    try {
      const response = await getScore(context.state.myInfo.profile.id);
      context.commit("setScore", response.data.data);
    } catch (error) {
      console.log(error);
    }
  },
  async getMoreRecords(context, { page, perPage }) {
    try {
      const response = await getRecord(
        context.state.myInfo.profile.nickname,
        page,
        perPage
      );

      context.commit("addRecord", response.data.data);
    } catch (err) {
      console.log(err);
    }
  },
};

export const getters = {
  getMyInfo(state) {
    return state.myInfo;
  },
  getMyNotifications(state) {
    return state.myNotifications;
  },
  getRecord(state) {
    return state.myRecord;
  },
  getScore(state) {
    return state.myScore;
  },
};
