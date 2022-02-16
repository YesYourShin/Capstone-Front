<template lang="">
  <div class="">
    <div class="friendBar h-24 w-full bg-slate-300 flex items-center">
      <div class="aspect-square h-full p-3">
        <img
          src="@/assets/pageimg/normal.png"
          alt=""
          class="aspect-square friendImg rounded-full object-cover"
        />
      </div>
      <div class="p-3 flex-col justify-center items-center">
        <p>이름</p>
        <p>상태 메시지</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="css" scoped>
.friendBar {
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 500ms;
}

.friendBar:hover {
  box-shadow: inset 0 0 5px 5px rgb(190 242 100 / 0.8);
}

.friendImg {
  clip-path: circle();
}
</style>
