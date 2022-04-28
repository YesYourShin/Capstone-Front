<template lang="">
  <div>
    <input type="checkbox" id="menuIcon" />
    <label for="menuIcon"> <span></span><span></span><span></span> </label>
    <div class="sideBar">
      <div class="">

      </div>
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="css" scoped>
input[id="menuIcon"] {
  display: none;
}
input[id="menuIcon"] + label {
  display: block;
  width: 60px;
  height: 50px;
  position: fixed;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
input[id="menuIcon"] + label span {
  display: block;
  position: absolute;
  width: 100%;
  height: 5px;
  border-radius: 30px;
  background: #fff;
  transition: all 0.35s;
}
input[id="menuIcon"] + label span:nth-child(1) {
  top: 0;
}
input[id="menuIcon"] + label span:nth-child(2) {
  top: 50%;
  transform: translateY(-50%);
}
input[id="menuIcon"] + label span:nth-child(3) {
  bottom: 0;
}
input[id="menuIcon"]:checked + label {
  z-index: 9999;
}
input[id="menuIcon"]:checked + label span {
  background: #000;
}
input[id="menuIcon"]:checked + label span:nth-child(1) {
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}
input[id="menuIcon"]:checked + label span:nth-child(2) {
  opacity: 0;
}
input[id="menuIcon"]:checked + label span:nth-child(3) {
  bottom: 50%;
  transform: translateY(50%) rotate(-45deg);
}

div[class="sideBar"] {
  width: 300px;
  height: 100%;
  background: #222;
  position: fixed;
  top: 0;
  right: -300px;
  z-index: 9998;
  transition: all 0.35s;
}
input[id="menuIcon"]:checked + label + div {
  right: 0;
}
</style>
