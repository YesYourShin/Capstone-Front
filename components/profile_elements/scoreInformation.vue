<template lang="">
  <div>
    <button v-on:click="moreRecordOnOff()">더보기</button>
    <div v-if="onOff">
      <table>
        <tr>
          <th>번호</th>
          <th>닉네임</th>
          <th>직업</th>
          <th>결과</th>
        </tr>
        <tr v-for="member in members">
          <td>{{ member.playNumber }}</td>
          <td>{{ member.user.nickname }}</td>
          <td>{{ member.gameRoleName }}</td>
          <td>{{ member.score }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    members: {
      type: Array,
      required: true,
      default: [],
    },
  },
  data() {
    return {
      onOff: false,
    };
  },
  methods: {
    moreRecordOnOff() {
      console.log(this.onOff);
      this.onOff = !this.onOff;
    },
  },
};
</script>
