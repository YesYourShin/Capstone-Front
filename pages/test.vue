<template>
  <div class="container">
    <input v-model="msg" />
    <button @click="socket.emit('msg', msg)">send</button>
    <br />
    <textarea v-model="resps"></textarea>
  </div>
</template>

<script>
import axios from "axios";

export default {
  head: {
    script: [
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.0.4/socket.io.js",
      },
    ],
  },
  data() {
    return {
      socket: null,
      msg: "wwJd",
      resps: "",
    };
  },
  mounted() {
    axios.get("/ws/init").then((resp) => {
      this.socket = io();
      this.socket.on("msg", (msg) => (this.resps += `${msg}\n`));
    });
  },
};
</script>
