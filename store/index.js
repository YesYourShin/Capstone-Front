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
  chats: ['player1', 'player2'],
})

export const mutations = {
  newChat(state, user) {
    state.chats.push(user.social_id)
  }
}
