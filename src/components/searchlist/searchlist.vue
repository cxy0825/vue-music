<template>
  <div class="s">
    <div class="itemsbox">
      <div
        v-for="(item, index) in items"
        :key="index"
        @click="linkto(item.type), mark(index)"
        :class="{ item: true, active: clickI == index }"
      >
        {{ item.name }}
      </div>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  props: ["kw"],
  data() {
    return {
      clickI: 0,
      items: [
        { name: "单曲", type: "song/" },
        { name: "专辑", type: "al/" },
        { name: "视频", type: "mv/" },
        { name: "歌单", type: "playlists/" }
      ]
    };
  },
  methods: {
    //路由跳转
    linkto(type) {
      this.$router.push({ path: "/searchlist/" + type + this.kw });
    },
    //当前点击的路由
    mark(i) {
      this.clickI = i;
    }
  },

  mounted() {},
  components: {}
};
</script>
<style lang="css" scoped>
.s {
  padding: 20px 0 10px 10px;
  background-color: #fff;
}
.s .itemsbox {
  width: 100%;
  margin-top: 20px;
}
.s .itemsbox div {
  width: 60px;
  display: inline-block;
  text-align: center;
  font-size: 14px;
  color: rgb(58, 58, 58);
  cursor: pointer;
}
.s .itemsbox div.active {
  font-weight: 600;
  border-bottom: 3px solid var(--hover);
  font-size: 15px;
}
</style>
