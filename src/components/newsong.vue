<template>
  <div>
    <div class="loading" v-if="loading"></div>
    <div class="list">
      <ul>
        <li></li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      loading: false,
      songlist: []
    };
  },
  methods: {
    //获取最新的歌曲
    getnewsong() {
      this.$axios({
        methods: "get",
        url: "/personalized/newsong",
        params: {
          limit: 50
        }
      }).then(res => {
        res = res.data.result;
        this.songlist = res;
      });
    }
  },
  mounted() {
    this.getnewsong();
  }
};
</script>
<style lang="css" scoped></style>
