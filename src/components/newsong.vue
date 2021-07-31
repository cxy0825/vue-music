<template>
<<<<<<< HEAD
  <div class="newsong">
    <div class="loading" v-if="loading"></div>
    <div class="list">
      <ul>
        <li
          v-for="(item, index) in songlist"
          :key="'list' + index"
          @dblclick="Xplaysong(item)"
        >
          <div class="pic">
            <img :src="item.picUrl" alt="" />
          </div>
          <div class="songname">
            {{ item.song.name }} <span>{{ item.song.alias[0] }}</span>
          </div>
          <div class="singer">{{ item.song.artists[0].name }}</div>
          <div class="al">{{ item.song.album.name }}</div>
          <div class="time">{{ item.song.bMusic.playTime | timeinit }}</div>
        </li>
=======
  <div>
    <div class="loading" v-if="loading"></div>
    <div class="list">
      <ul>
        <li></li>
>>>>>>> e78f96d (test)
      </ul>
    </div>
  </div>
</template>
<script>
<<<<<<< HEAD
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  data() {
    return {
      loading: true,
=======
export default {
  data() {
    return {
      loading: false,
>>>>>>> e78f96d (test)
      songlist: []
    };
  },
  methods: {
<<<<<<< HEAD
    ...mapActions(["Xplaysong"]),
=======
>>>>>>> e78f96d (test)
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
<<<<<<< HEAD
        console.log(this.songlist);
        this.loading = false;
=======
>>>>>>> e78f96d (test)
      });
    }
  },
  mounted() {
    this.getnewsong();
<<<<<<< HEAD
  },
  filters: {
    timeinit(num) {
      num = (num / 1000).toFixed(0);
      let m = Math.floor(num / 60);
      let s = num % 60;
      return "0" + m + ":" + s;
    }
  }
};
</script>
<style lang="css" scoped>
.newsong {
  background-color: #fff;
}
.newsong ul li {
  width: 100%;
  height: 90px;
  line-height: 90px;
  display: flex;
  flex-flow: row;
  padding: 0 20px;
}
.newsong ul li:hover {
  background-color: rgb(240, 241, 242);
}
.newsong ul li.bgc {
  background-color: rgb(249, 249, 249);
}
.newsong ul li div {
  font-size: 13px;
  user-select: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.newsong ul li .pic {
  width: 60px;
  height: 60px;
  border-radius: 5px;
  align-self: center;
}
.newsong ul li .pic img {
  width: 100%;
}
.newsong ul li .songname {
  padding-left: 10px;
  flex: 3;
}
.newsong ul li .songname span {
  font-size: 12px;
  color: rgb(154, 154, 154);
}
.newsong ul li .singer {
  flex: 2;
  padding: 0;
  color: rgb(154 154 154);
  cursor: pointer;
}
.newsong ul li .singer:hover {
  color: rgb(53, 53, 53);
}
.newsong ul li .al {
  flex: 2;
  color: rgb(154 154 154);
  cursor: pointer;
}
.newsong ul li .al:hover {
  color: rgb(53, 53, 53);
}
.newsong ul li .time {
  flex: 1;
  color: rgb(154 154 154);
}
</style>
=======
  }
};
</script>
<style lang="css" scoped></style>
>>>>>>> e78f96d (test)
