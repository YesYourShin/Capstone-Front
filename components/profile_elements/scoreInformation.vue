<template lang="">
  <div>
    <div>
      <button
        class="w-full m-auto hover:bg-zinc-700 p-2"
        v-on:click="moreRecordOnOff()"
      >
        상제 정보 보기
      </button>
    </div>
    <div v-if="onOff">
      <table
        class="text-center m-4 w-[19rem] table-fixed break-all cursor-default"
      >
        <tr class="p-3 h-12">
          <th class="border-2 border-zinc-600">번호</th>
          <th class="border-2 border-zinc-600">닉네임</th>
          <th class="border-2 border-zinc-600">직업</th>
          <th class="border-2 border-zinc-600">결과</th>
        </tr>
        <tr
          class="h-12"
          :class="[
            {
              'bg-red-400 hover:bg-red-400/70':
                member.score !== 'escape' && member.gameRoleName === 'mafia',
            },
            {
              'bg-blue-400 hover:bg-blue-400/70':
                member.score !== 'escape' && member.gameRoleName !== 'mafia',
            },
            {
              'bg-red-400/50 hover:bg-red-400/30 text-stone-400 ':
                member.score === 'escape' && member.gameRoleName === 'mafia',
            },
            {
              'bg-blue-400/50 hover:bg-blue-400/30 text-stone-400 ':
                member.score === 'escape' && member.gameRoleName !== 'mafia',
            },
            {
              'border-4 border-green-600':
                member.user.nickname === myInfo.profile.nickname,
            },
          ]"
          v-for="member in members"
        >
          <td>{{ member.playNumber }}</td>
          <td class="text-clip">{{ member.user.nickname }}</td>
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
  computed: {
    myInfo() {
      return this.$store.getters["user/getMyInfo"];
    },
  },
  methods: {
    moreRecordOnOff() {
      console.log(this.myInfo);
      this.onOff = !this.onOff;
    },
  },
};
</script>
