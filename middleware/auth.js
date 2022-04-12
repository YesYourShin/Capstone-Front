// import axios from 'axios';
// export default function ({ req, store, redirect }) {
//   if(!store.state.user.myInfo){
//     const headers = req && req.headers
//     axios.get('http://localhost:3065/api/users', { headers ,withCredentials: true })
//       .then((res) => store.commit('user/setMyInfo', res.data.data))
//       .then(() => console.log(store.state.user.myInfo))
//       .catch((err) => {
//         console.error(err);
//         return redirect('/')
//       })
//   }
// }
