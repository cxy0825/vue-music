<template>
  <div class="songUl">
    <ul>
      <li
        v-for="(item, index) in mylist"
        :key="'li' + index"
        :class="{
          addcolor: index % 2 != 0 ? true : false,
          active: clickI == index
        }"
        @click="
          getsongUrl({ id: item.id, br: item.br.br }),
            getsongxx({
              name: item.name,
              auther: item.ar[0].name,
              index: index,
              pic: item.al.picUrl
            }),
            mark(index),
            upplaylist(mylist)
        "
      >
        <div class="sn">{{ item.name }}</div>
        <div class="singer">{{ item.ar[0].name }}</div>
        <div class="time">{{ item.time | timeinit }}</div>
      </li>
    </ul>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  data() {
    return {
      clickI: null
    };
  },
  methods: {
    ...mapMutations(["getsongxx", "upplaylist"]),
    ...mapActions(["getsongUrl"]),
    mark(i) {
      this.clickI = i;
    }
  },
  computed: {
    ...mapState(["mylist", "playlist"])
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
  }
};
</script>
<style lang="css" scoped>
.songUl ul li {
  display: flex;
  padding: 10px 6px;
  font-size: 12px;
}
.songUl ul li.active {
  color: var(--hover) !important;
}
.songUl ul li:hover {
  background-color: rgb(241, 241, 241);
}
.songUl ul .addcolor {
  background-color: rgb(247, 247, 247);
}
.songUl ul li div {
  cursor: pointer;
}
.songUl ul li .sn {
  flex: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.songUl ul li .singer {
  flex: 1;
  overflow: hidden;
  color: rgb(178 178 178);
}

.songUl ul li .time {
  width: 40px;
  color: #b2bec08f;
}
</style>
