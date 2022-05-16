<template lang="">
  <div class="buttonbox">
    <div class="buttonline1"></div>
    <div class="buttonline2"></div>
    <div class="buttonline3"></div>
    <div class="buttonline4"></div>
    <button class="gogame" v-on:click="escapeGame">이 게임에서 나가기</button>
  </div>

</template>
<script>
export default {
  props: {
    escape: {
      type: String,
      default: '/lobby',
    }
  },
  methods: {
    escapeGame() {
      this.$router.push(this.escape);
    }
  },
};
</script>
<style lang="scss" scoped>
.buttonbox {
  width: 270px;
  height: 70px;
  // margin-right: 1rem /* 16px */;
  //border: 3px solid rgb(255, 255, 255);
  display: flex;
  justify-content: center;
  position: relative;

  &:hover {
    .lilink {
      animation: color2 0.3s;
      animation-fill-mode: forwards;
    }
    .gogame {
      animation: color1 0.3s;
      animation-fill-mode: forwards;
    }
    .buttonline1 {
      animation: buttonlinew 0.3s;
      animation-fill-mode: forwards;
    }
    .buttonline3 {
      animation: buttonlinew 0.3s;
      animation-fill-mode: forwards;
    }
    .buttonline2 {
      animation: buttonlineh 0.3s;
      animation-fill-mode: forwards;
    }
    .buttonline4 {
      animation: buttonlineh 0.3s;
      animation-fill-mode: forwards;
    }
  }

  .gogame {
    margin: auto 0;
    width: 240px;
    height: 40px;
    font-size: 20px;
    color: white;
    font-weight: bold;
    border: 3px solid rgb(255, 255, 255);

    &:active {
      width: 240px;
      height: 40px;
      font-size: 20px;
    }
    button {
      width: 240px;
      height: 40px;
    }
  }

  .buttonline1 {
    width: 30px;
    height: 3px;
    top: 5px;
    left: 5px;
    position: absolute;
    background-color: #fff;
  }

  .buttonline2 {
    width: 4px;
    height: 25px;
    top: 5px;
    left: 5px;
    position: absolute;
    background-color: #fff;
  }

  .buttonline3 {
    width: 30px;
    height: 3px;
    bottom: 5px;
    right: 5px;
    position: absolute;
    background-color: #fff;
  }

  .buttonline4 {
    width: 3px;
    height: 25px;
    bottom: 5px;
    right: 5px;
    position: absolute;
    background-color: #fff;
  }
}

@keyframes buttonlinew {
  0% {
  }
  100% {
    /* --tw-bg-opacity: 1;
    background-color: rgb(74 222 128 / var(--tw-bg-opacity)); */
    width: 260px;
  }
}
@keyframes buttonlineh {
  0% {
  }
  100% {
    /* --tw-bg-opacity: 1;
    background-color: rgb(74 222 128 / var(--tw-bg-opacity)); */
    height: 60px;
  }
}
@keyframes color1 {
  0% {
  }
  100% {
    /* --tw-bg-opacity: 1;
    background-color: rgb(74 222 128 / var(--tw-bg-opacity));
    border-color: rgb(74 222 128 / var(--tw-bg-opacity)); */
    background-color: white;
    color: #171717;
  }
}
@keyframes color2 {
  0% {
  }
  100% {
    color: #171717;
  }
}
</style>
