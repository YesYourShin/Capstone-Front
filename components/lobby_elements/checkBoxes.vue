<template lang="">
  <div class="" ondragstart="return false" onselectstart="return false">
    <div class="flex flex-col gap-2">
      <label class="checkbox items-center">
        <input
          type="checkbox"
          class="form-checkbox h-5 w-5 text-gray-600"
          v-model="getFriendRooms"
        />
        <span class="icon"></span>
        <span class="text ml-2 text-gray-200">대기중인 방만 보기</span>
      </label>
      <label class="checkbox items-center">
        <input
          type="checkbox"
          class="form-checkbox h-5 w-5 text-gray-600"
          v-model="getPublicRooms"
        />
        <span class="icon"></span>
        <span class="text ml-2 text-gray-200">공개 방만 보기</span>
      </label>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      getPublicRooms: false,
      getFriendRooms: false,
    };
  },
};
</script>
<style lang="css" scoped>
@keyframes jelly {
  from {
    transform: scale(1, 1);
  }
  30% {
    transform: scale(1.25, 0.75);
  }
  40% {
    transform: scale(0.75, 1.25);
  }
  50% {
    transform: scale(1.15, 0.85);
  }
  65% {
    transform: scale(1.95, 1.05);
  }
  75% {
    transform: scale(1.05, 0.95);
  }
  to {
    transform: scale(1, 1);
  }
}

.checkbox input {
  display: none;
}

.checkbox input:checked ~ .icon {
  border-color: transparent;
  background: #fbbf24;
  animation: jelly 0.6s ease;
}

.checkbox input:checked ~ .icon::after {
  opacity: 1;
  transform: rotate(45deg) scale(1);
}

.checkbox span {
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
}

.checkbox .icon {
  position: relative;
  width: 17px;
  height: 17px;
  bottom: 1px solid #c8ccd4;
  background: #fff;
  border-radius: 3px;
  transition: background 0.1s ease;
}

.checkbox .icon::after {
  content: "";
  position: absolute;
  top: 1px;
  left: 5px;
  width: 5px;
  height: 11px;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  transform: rotate(45deg) scale(0);
  transition: all 0.3s ease;
  transition-delay: 0.15s;
  opacity: 0;
}

.checkbox .text {
  margin-left: 5px;
}
</style>
