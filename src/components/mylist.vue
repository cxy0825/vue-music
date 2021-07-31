<template>
  <div class="mylist">
    <div class="title">当前播放</div>
    <div class="cz">
      <span class="left">总{{ playlist.length }}首</span>
      <span class="r" @click="clearList">清空列表</span>
      <span class="add" @click="upmylist(playlist)">添加收藏</span>
    </div>
    <div class="songUl">
      <ul>
        <li
          v-for="(item, index) in playlist"
          :key="'li' + index"
          :class="{
            addcolor: index % 2 != 0 ? true : false,
            active: clickI == index || iii == index
          }"
          @click="
            getsongUrl({ id: item.id, br: item.br.br }),
              mark(index),
              getsongxx({
                name: item.name,
                auther: item.ar[0].name,
                index: index,
                pic: item.al.picUrl
              })
          "
        >
          <div class="sn">{{ item.name }}</div>
          <div class="singer">{{ item.ar[0].name }}</div>
          <div class="time">{{ item.time | timeinit }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  props: ["ii"],
  data() {
    return {
      //点击后的index值
      clickI: null,
      //自动下一首播放的index的值 因为不能直接更改父组件传过来的值所以先储存在自己的变量里面
      iii: null
    };
  },
  methods: {
    ...mapMutations(["clearList", "csongUrl", "getsongxx", "upmylist"]),
    ...mapActions(["getsongUrl"]),
    //改变正在播放歌曲的文字颜色
    mark(index) {
      this.clickI = index;
      this.iii = index;
    }
  },
  computed: {
    ...mapState(["playlist"])
  },
  watch: {
    ii(n) {
      //修改
      this.iii = n;
      this.clickI = null;
    }
  },

  filters: {
    //把时间改成分
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
  }
};
</script>
<style lang="css" scope>
.mylist {
  width: 35%;
  height: 100%;
  background-color: #fff;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 99999;
  flex-flow: column !important;
}
.mylist .title {
  width: 100%;
  font-size: 20px;
  font-weight: 600;
  padding: 12px 8px;
}
.mylist .cz {
  width: 100%;
  padding: 5px 12px 18px;
  font-size: 14px;
  border-bottom: 1px solid rgb(178 190 192 / 22%);
}
.mylist .cz .left {
  float: left;
  font-size: 12px;
  color: #b2bec08f;
}
.mylist .cz .add {
  float: right;
  margin-right: 15px;
  cursor: pointer;
}
.mylist .cz .r {
  float: right;
  cursor: pointer;
  color: rgb(69, 150, 226);
}
.mylist .songUl ul li {
  display: flex;
  padding: 10px 6px;
  font-size: 12px;
}
.mylist .songUl ul li.active {
  color: var(--hover) !important;
}
.mylist .songUl ul li:hover {
  background-color: rgb(241, 241, 241);
}
.mylist .songUl ul .addcolor {
  background-color: rgb(247, 247, 247);
}
.mylist .songUl ul li div {
  cursor: pointer;
}
.mylist .songUl ul li .sn {
  flex: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.mylist .songUl ul li .singer {
  flex: 1;
  overflow: hidden;
  color: rgb(178 178 178);
}

.mylist .songUl ul li .time {
  width: 40px;
  color: #b2bec08f;
}
</style>
