<template lang="">
  <!-- <div class="p-2 w-40 justify-center items-center">
    <div
      class="flex items-center p-4 bg-green-400 rounded-lg shadow-xs cursor-pointer hover:bg-green-500 hover:text-gray-100 transition duration-300"
      @click="onClickExitButton"
    >
      <p class="text-lg font-bold mx-auto">나가기</p>
    </div>
  </div> -->
  <div class="buttonbox">
    <div class="buttonline1"></div>
    <div class="buttonline2"></div>
    <div class="buttonline3"></div>
    <div class="buttonline4"></div>
    <button class="gogame" @click="onClickExitButton">나가기</button>
  </div>
</template>
<script>
export default {
  props: {
    pathToGo: {
      type: String,
      default: "/",
    },
  },
  methods: {
    onClickExitButton() {
      document.exitFullscreen();
      this.$router.push(this.pathToGo);
    },
  },
};
</script>
<style lang="scss" scoped>
.buttonbox {
  width: 180px;
  height: 70px;
  margin: auto 75px auto auto;
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
    width: 150px;
    height: 40px;
    font-size: 20px;
    color: white;
    font-weight: bold;
    border: 3px solid rgb(255, 255, 255);

    &:active {
      width: 140px;
      height: 35px;
      font-size: 20px;
    }
    button {
      width: 140px;
      height: 34px;
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
    width: 170px;
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
    color: #000;
  }
}
@keyframes color2 {
  0% {
  }
  100% {
    color: #000;
  }
}
</style>
