
export const state = () => ({
  roomId:undefined
});

export const mutations = {
  setRoomId(state,roomId){
    state.roomId = roomId
  }
};

export const getters = {
  getRoomId: state => state.roomId,
}
