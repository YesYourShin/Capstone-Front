<template lang="">
  <div>
    <Nuxt />
  </div>
</template>
<script>
export default {
  name: "InGameLayout",
  components: {},
  watch: {
    $route: (to, from) => {
      console.log("페이지를 이동하였습니다.");
      console.log(to, from);
    },
  },
};
</script>
<style lang=""></style>
