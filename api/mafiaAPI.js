import axios from 'axios'

const instance = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? 'https://gjgjajaj.xyz/api' : 'http://localhost:3065/api',
  withCredentials: true,
})

// Socket
export const socketJoin = () => { // 게임 방 참가 이벤트
  return instance.post('/Socket/join')
}

export const socketUpdate = () => { // 게임 방 정보 수정 이벤트
  return instance.post('/Socket/update')
}

export const socketOnlinelist = () => { // 게임 방 멤버들 정보 최신화
  return instance.post('/Socket/onlinelist')
}

export const socketMessage = () => { // 게임 방 채팅 이벤트
  return instance.post('/Socket/message')
}

export const socketStart = () => { // 게임 시작 이벤트
  return instance.post('/Socket/start')
}

export const socketReady = () => { // 게임 준비 이벤트
  return instance.post('/Socket/ready')
}

export const socketUnready = () => { // 게임 준비 해제 이벤트
  return instance.post('/Socket/unready')
}

// Auth
export const loginWithGoogle = () => {
  return instance.get(`/auth/google/login`)
}

export const redirectWithGoogle = () => {
  return instance.get(`/auth/google/redirect`)
}

export const loginWithNaver = () => {
  return instance.get(`/auth/naver/login`)
}

export const redirectWithNaver = () => {
  return instance.get(`/auth/naver/redirect`)
}

export const loginWithKakao = () => {
  return instance.get(`/auth/kakao/login`)
}

export const redirectWithKakao = () => {
  return instance.get(`/auth/kakao/redirect`)
}

export const logout = () => {
  return instance.post(`/auth/logout`)
}


// Users
export const checkNicknameDuplication = (nickname) => { // 닉네임 중복확인
  return instance.get(`/users/profile/check-duplicate/nickname/${nickname}`)
}

export const getMyInformation = () => { // 내 정보 가져오기
  return instance.get(`/users`)
}

export const withdrawUser = () => { // 회원 탈퇴
  return instance.delete(`/users`)
}

export const getUserInformation = (userId) => { // 특정 유저 정보 불러오기
  return instance.get(`/users/profile/${userId}`)
}

export const storeProfileImage = (image) => { // 프로필 이미지 저장
  return instance.post(`/users/profile/image`, image)
}

export const destroyProfileImage = () => { // 프로필 이미지 삭제
  return instance.delete(`/users/profile/image`)
}

export const makeProfile = (data) => { // 프로필 생성
  return instance.post(`/users/profile`, data)
}

export const editProfile = (data) => { // 프로필 수정
  return instance.patch(`/users/profile`, data)
}

export const requestFriend = (userId) => { // 친구 신청
  return instance.patch(`/users/friend/${userId}`)
}

export const deleteFriend = (userId) => { // 친구 삭제
  return instance.delete(`/users/friend/${userId}`)
}

// Posts
export const getPosts = ({ category, page }) => { // 게시물들 불러오기
  return instance.get(`/posts?category=${category}&page=${page}`)
}

export const detailPost = (postId) => { // 게시물 자세히 보기
  return instance.get(`/posts/${postId}`)
}

export const savePost = (data) => { // 게시물 등록
  return instance.post(`/posts`, data)
}

export const editPost = (postId, data) => { // 게시물 수정
  return instance.post(`/posts/${postId}`, data)
}

export const deletePost = (postId) => { // 게시물 삭제
  return instance.delete(`/posts/${postId}`)
}

export const savePostImage = (data) => { // 게시물 이미지 저장
  return instance.post(`/posts/upload`, data)
}

export const deletePostImage = () => { // 게시물 이미지 삭제
  return instance.delete(`/posts/image`)
}

export const upVotePost = (postId) => { // 게시물 추천
  return instance.patch(`/posts/like/${postId}`)
}

export const downVotePost = (postId) => { // 게시물 추천 취소
  return instance.delete(`/posts/like/${postId}`)
}

// Comments
export const saveComment = (data) => { // 댓글 등록
  return instance.post(`/comments`, data)
}

export const editComment = (commentId, data) => { // 댓글 수정
  return instance.patch(`/comments/${commentId}`, data)
}

export const deleteComment = (commentId) => { // 댓글 삭제
  return instance.delete(`/comments/${commentId}`)
}

// Rooms
export const getRooms = () => { // 방들 불러오기
  return instance.get(`/games/rooms`)
}

export const makeRoom = (data) => { // 방 만들기
  return instance.post(`/games/rooms`, data)
}

export const refreshRooms = () => { // 5초마다 방들 불러오기
  return instance.get(`/games/rooms/sse`)
}

export const getRoom = (roomId) => { // 특정 방 정보 불러오기
  return instance.get(`/games/rooms/${roomId}`)
}

export const editRoom = (roomId, data) => { // 특정 방 정보 불러오기
  return instance.patch(`/games/rooms/${roomId}`, data)
}

export const joinRoom = (roomId) => { // 방 참가
  return instance.get(`/games/rooms/${roomId}/joinable-room`)
}

export const destroyRoom = (roomId) => { // 방 삭제
  return instance.delete(`/games/rooms/${roomId}`)
}

export const leaveRoom = (roomId) => { // 게임 나가기 (마지막 사람이 나가면 자동 방 삭제)
  return instance.delete(`/games/rooms/${roomId}/users/me`)
}

// Default
// axios.default.paramsSerializer = params => {
//   return qs.stringify(params);
// }
// const params = {
//   search:{
//     category : 'category',
//     page : 'page',
//   }
// }
