<template lang="">
  <div
    ref="score"
    id="score"
    v-scroll:#score="scroll"
    class="profile6 grow text-white overflow-auto"
  >
    <div>
      <div v-for="oneRecord in record">
        <div
          v-for="members in oneRecord.members"
          v-if="members.user.userId === myInfo.id"
          class="p-3 border-2 border-zinc-400 m-3"
        >
          <table class="w-full text-center cursor-default">
            <tr class="p-3 h-12">
              <!-- <th>닉네임</th> -->
              <th class="border-2 border-zinc-600 w-24">모드</th>
              <th class="border-2 border-zinc-600 w-24">결과</th>
              <th class="border-2 border-zinc-600">날짜</th>
            </tr>
            <tr
              class="h-20 hover:bg-zinc-700"
              :class="[
                {
                  'bg-blue-600 hover:bg-blue-400/80': members.score === 'win',
                },
                { 'bg-red-600 hover:bg-red-400/80': members.score === 'lose' },
                {
                  'bg-stone-600 hover:bg-neutral-400/50':
                    members.score === 'escape',
                },
              ]"
            >
              <!-- <td>{{ members.user.nickname }}</td> -->
              <td>{{ oneRecord.mode }}</td>
              <td>{{ members.score }}</td>
              <td>
                {{
                  formatDate(oneRecord.updatedAt)
                    .split(" ")
                    .slice(0, 3)
                    .join(" ")
                }}<br />
                {{
                  formatDate(oneRecord.updatedAt)
                    .split(" ")
                    .slice(3, 5)
                    .join(" ")
                }}
              </td>
            </tr>
          </table>
          <RecordInfo :members="oneRecord.members"></RecordInfo>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RecordInfo from "./recordInformation.vue";
export default {
  props: {
    record: {
      type: Array,
      required: true,
      default: [],
    },
  },
  data() {
    return {
      page: 2,
      perPage: 10,
      date: null,
    };
  },
  components: {
    RecordInfo,
  },
  computed: {
    myInfo() {
      return this.$store.getters["user/getMyInfo"];
    },
  },
  methods: {
    formatDate(updatedAt) {
      const sqlDate = updatedAt;
      const newDate = new Date(sqlDate).toLocaleString("ko-kr");
      return newDate;
    },
    scroll() {
      let sHeight = this.$refs.score.scrollHeight;
      let cHeight = this.$refs.score.clientHeight;
      let sTop = this.$refs.score.scrollTop;
      if (sHeight - cHeight - sTop <= 0) {
        console.log("more page");
        this.$store.dispatch("user/getMoreRecords", {
          page: this.page,
          perPage: this.perPage,
        });

        this.page++;
      }
    },
  },
};
</script>
