<template>
  <div>
      <editor :initialValue="text" ref="editor" align="left" class="edt" height="500px"></editor>
      <viewer v-if="toggle" :initialValue="text"></viewer>
  </div>
</template>
<script>
  export default {
      data() {
          return {
            text: '오른쪽은 미리보기입니다.',
            toggle: false
          }
      }
  };
</script>
<style scoped="scoped">
.edt{
  background-color: white;

}
</style>
