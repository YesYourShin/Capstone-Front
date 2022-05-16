<template lang="">
  <div
    ref="score"
    id="score"
    v-scroll:#score="test"
    class="profile6 grow overflow-auto"
  >
    <p>전적</p>

    <div>
      <div v-for="oneRecord in record">
        <div
          v-for="members in oneRecord.members"
          v-if="members.user.userId === myInfo.id"
        >
          <table>
            <tr>
              <!-- <th>닉네임</th> -->
              <th>모드</th>
              <th>결과</th>
              <th>날짜</th>
            </tr>
            <tr>
              <!-- <td>{{ members.user.nickname }}</td> -->
              <td>{{ oneRecord.mode }}</td>
              <td>{{ members.score }}</td>
              <td>{{ formatDate(oneRecord.updatedAt) }}</td>
            </tr>
          </table>
          <ScoreInfo :members="oneRecord.members"></ScoreInfo>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ScoreInfo from "./scoreInformation.vue";
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
    };
  },
  components: {
    ScoreInfo,
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
    test() {
      let sHeight = this.$refs.score.scrollHeight;
      let cHeight = this.$refs.score.clientHeight;
      let sTop = this.$refs.score.scrollTop;
      if (sHeight - cHeight - sTop === 0) {
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
