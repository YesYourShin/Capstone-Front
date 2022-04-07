<template>
  <div class="chatBox">
    <transition-group
      name="list"
      tag="div"
      class="h-fit flex flex-wrap-reverse group"
    >
      <Tab
        v-for="(chat, index) in $store.state.chats"
        :key="chat.id"
        class="group-hover:translate-y-0 hover:bg-blue-500"
        :index="index"
        :selectedIndex="$store.state.selectedIndex"
      >
        <div class="flex justify-between items-center px-1">
          <p class="font-bold inline-block w-full" @click="tabClicked(index)">
            {{ chat.social_id }}
          </p>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 hidden group-hover:inline-block text-red-600/50 hover:text-red-600"
            viewBox="0 0 20 20"
            fill="currentColor"
            @click="tabClose(index)"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
      </Tab>
    </transition-group>
    <div class="h-52 bg-gray-300 flex flex-col overflow-auto">
      <div class="grow">
        <div class="">
          <!-- <p v-for="message in currentMessages">{{ message }}</p> -->
        </div>
      </div>
    </div>
    <!-- <label class="inline" for="chatInput">:</label>
    <input
      class="outline-none"
      v-model="input"
      @keyup.enter="sendMessage"
      type="text"
      name="chatInput"
    /> -->
    <div class="bg-gray-400 flex align-center py-2 px-3">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 hover:cursor-pointer hover:text-blue-700"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <div class="grow mx-3">
        <input
          type="text"
          class="w-full bg-white rounded-lg px-2 outline-none"
          placeholder="Type your message here..."
          v-model="input"
          @keyup.enter="sendMessage"
        />
      </div>
      <v-icon>mdi-send</v-icon>
    </div>
  </div>
</template>
<script>
import styled from "vue-styled-components";
import axios from "axios";

const tapProps = { index: Number, selectedIndex: Number };
const Tab = styled("div", tapProps)`
  width: 12.5%;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-color: ${(props) => {
    return `${props.index == props.selectedIndex ? "#f2f2f2" : "#1c51ff"}`;
  }};
  border-width: 2px;
  position: relative;
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  z-index: ${(props) => 50 - props.index};
  transform: ${(props) => {
    return `translateY(${parseInt(props.index / 8) * 3 * 0.25}rem);`;
  }};
  cursor: pointer;
  &:hover {
    background-color: ${(props) => {
      return `${props.index == props.selectedIndex ? "#f2f2f2" : "#4773ff"}`;
    }};
    color: black;
  }
`;

export default {
  components: {
    Tab,
  },
  head: {
    script: [
      {
        src: "https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.4.1/socket.io.js",
      },
    ],
  },
  data() {
    return {
      currentMessages: [],
      input: "",
    };
  },
  methods: {
    tabClicked(index) {
      console.log("tab Clicked!!");
      this.$store.commit("tabClicked", index);
    },
    tabClose(index) {
      console.log("tab Closed!");
      this.$store.commit("tabClose", index);
    },
    sendMessage() {
      this.socket.emit("msg", this.input);
      this.input = "";
    },
  },
  // async mounted() {
  //   await axios.get("/ws/init").then((resp) => {
  //     this.socket = io();
  //     this.socket.on("msg", (msg) => this.currentMessages.push(msg));
  //   });
  // },
};
</script>
<style lang="css" scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
