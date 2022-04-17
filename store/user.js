import { getMyInformation } from "../api/mafiaAPI"

export const state = () => ({
  myInfo: null,
})

export const mutations = {
  setMyInfo(state, data) {
    state.myInfo = data;
  }
}

export const actions = {
  async fetchMyInfo(context) {
    const response = await getMyInformation()
    return context.commit('setMyInfo', response.data.data);
  },
}

export const getters = {
  getMyInfo(state) {
    return state.myInfo;
  }
}
