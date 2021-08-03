<template>
  <div class="songUl">
    <div class="title">共找到 {{ songCount }} 首单曲</div>
    <ul>
      <li
        v-for="(item, index) in playlist"
        :key="'li' + index"
        :class="{
          addcolor: index % 2 != 0 ? true : false,
          active: clickI == index
        }"
        @dblclick="
          getsongUrl({ id: item.id, br: item.h.br }),
            getsongxx({
              name: item.name,
              auther: item.ar[0].name,
              index: index,
              pic: item.al.picUrl
            }),
            mark(index)
        "
      >
        <div class="sn">{{ item.name }}</div>
        <div class="singer">{{ item.ar[0].name }}</div>
        <div class="time">{{ ((item.l.size / item.l.br) * 8) | timeinit }}</div>
      </li>
    </ul>
    <div class="loading" v-if="loading"></div>
    <page :count="songCount" v-show="!loading" @go="getsearch"></page>
  </div>
</template>
<script>
import { mapActions, mapMutations } from "vuex";

//分页
import page from "../public/page.vue";
export default {
  props: ["kw"],
  data() {
    return {
      //点击项目的索引项
      clickI: null,
      playlist: [],
      loading: true,
      //总共有多少条
      songCount: 0
    };
  },
  methods: {
    ...mapActions(["getsongUrl"]),
    ...mapMutations(["getsongxx"]),
    mark(i) {
      this.clickI = i;
    },
    //获取关键词的搜索结果
    getsearch(page) {
      this.loading = true;
      this.playlist = [];
      this.$axios({
        method: "get",
        url: "/cloudsearch",
        params: {
          keywords: this.kw,
          type: 1,
          offset: page - 1
        }
      }).then(res => {
        res = res.data.result;
        this.playlist = res.songs;
        this.songCount = res.songCount;
        this.loading = false;
      });
    }
  },
  filters: {
    timeinit(n) {
      n = parseInt(n);
      let m = Math.floor(n / 60);

      let s = n % 60;
      if (m < 1) {
        if (s < 10) {
          return "0:0" + s;
        } else {
          return "0:" + s;
        }
      } else {
        if (s < 10) {
          return m + ":0" + s;
        } else {
          return m + ":" + s;
        }
      }
    }
  },
  watch: {
    //关键字发生变化时重新获取搜索结果
    kw(n) {
      this.getsearch(1);
    }
  },
  mounted() {
    //获取搜索结果
    this.getsearch(1);
  },
  components: {
    page
  }
};
</script>
<style lang="css" scoped>
.songUl ul {
  padding-top: 10px;
}
.songUl ul li {
  display: flex;
  padding: 10px 6px;
  font-size: 12px;
}
.songUl ul li.active {
  color: var(--hover) !important;
}
.songUl ul li:hover {
  background-color: rgb(212, 212, 212);
}
.songUl ul .addcolor {
  background-color: rgb(235, 235, 235);
}
.songUl ul li div {
  cursor: pointer;
}
.songUl ul li .sn {
  flex: 3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.songUl ul li .singer {
  flex: 2;
  overflow: hidden;
  color: rgb(178 178 178);
}

.songUl ul li .time {
  width: 120px;
  color: #b2bec08f;
  text-align: center;
}
</style>
