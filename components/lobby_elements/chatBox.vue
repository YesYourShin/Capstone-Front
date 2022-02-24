<template lang="">
  <div>
    <div class="h-fit flex flex-wrap-reverse group">
      <Tab
        v-for="(chat, index) in $store.state.chats"
        :key="index"
        class="group-hover:translate-y-0"
        >{{ chat }}</Tab
      >
    </div>
    <div class="h-52 bg-gray-300 flex flex-col">
      <div class="flex-grow z-[800]"></div>
      <input class="w-full outline-none z-[800]" type="text" />
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
  z-index: ${(props) => 50 - props.zIndex};
  transform: ${(props) => {
    return `translateY(${parseInt((props.zIndex - 1) / 8) * 3 * 0.25}rem);`;
  }};
`;

export default {
  components: {
    Tab,
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style lang=""></style>
