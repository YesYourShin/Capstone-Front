<template lang="">
  <div>
    <div class="h-fit flex flex-wrap-reverse group">
      <Tab
        v-for="(chat, index) in chats"
        :key="index"
        class="group-hover:translate-y-0"
        :zIndex="index"
        >{{ chat.userName }}</Tab
      >
      <!-- <div
        v-for="n in 26"
        :class="`w-[12.5%] rounded-t-lg bg-gray-300 border relative z-[${
          9999 - n
        }] group-hover:translate-y-0 transition duration-300 translate-y-${
          parseInt((n - 1) / 8) * 3
        }`"
      >
        hihi
      </div> -->
    </div>
    <!-- <div ></div> -->
    <div class="h-52 bg-gray-300 flex flex-col z-[9999]">
      <div class="flex-grow"></div>
      <input class="w-full outline-none" type="text" />
    </div>
  </div>
</template>
<script>
import styled from "vue-styled-components";
const tapProps = { zIndex: Number };
const Tab = styled("div", tapProps)`
  width: 12.5%;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
  background-color: ${(props) => {
    return `${props.zIndex >= 10 ? "#FFF" : "#CCC"}`;
  }};
  border-width: 1px;
  position: relative;
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
  z-index: ${(props) => 9999 - props.zIndex};
  transform: ${(props) => {
    return `translateY(${parseInt((props.zIndex - 1) / 8) * 3 * 0.25}rem);`;
  }};
`;

export default {
  components: {
    Tab,
  },
  data() {
    return {
      chats: [
        {
          userId: "1",
          userName: "player1",
        },
        {
          userId: "2",
          userName: "player2",
        },
      ],
    };
  },
  methods: {},
};
</script>
<style lang=""></style>
