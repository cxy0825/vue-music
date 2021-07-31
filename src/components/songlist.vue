<template>
  <div class="songlist">
    <!-- 歌曲列表 -->
    <div class="top clear">
      <div class="pic">
        <img :src="xxal.coverImgUrl" alt="" />
      </div>
      <div class="r">
        <div class="title">{{ xxal.name }}</div>
        <div class="btn">
          <button id="play" @click="playall(playlist)">播放全部</button>
        </div>
        <div class="count">
          <span class="songcount">歌曲：{{ xxal.trackCount | check }}</span>
          <span class="playcount">播放：{{ xxal.playCount | check }}</span>
        </div>
        <div
          class="read"
          :style="{ height: open }"
          @click="open == '40px' ? (open = 'auto') : (open = '40px')"
        >
          简介：{{ xxal.description }}
        </div>
      </div>
    </div>
    <div class="bottom">
      <ul>
        <li>
          <div class="stitle">歌曲名称</div>
          <div class="ssinger">歌手</div>
          <div class="sal">专辑</div>
          <div class="stime">时长</div>
        </li>
        <div class="loading" v-if="list_loading"></div>
        <li
          v-for="(item, index) in playlist"
          :key="'play' + index"
          @click="
            getsongUrl({ id: item.id, br: item.br.br }),
              (clickI = index),
              getsongxx({
                name: item.name,
                auther: item.ar[0].name,
                index: index,
                pic: item.al.picUrl
              })
          "
          :class="{ active: index == clickI }"
        >
          <div class="stitle">{{ item.name }}</div>
          <div class="ssinger">{{ item.ar[0].name }}</div>
          <div class="sal">{{ item.al.name }}</div>
          <div class="stime">{{ item.time | timeinit }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// vuex
import { mapState, mapActions, mapMutations } from "vuex";
export default {
  //获取al组件传递过来的歌单id
  props: ["id"],
  data() {
    return {
      xxal: [],
      playlistId: [],
      playlist: [],
      //简介打开的高度
      open: "40px",
      //点击的索引号
      clickI: null,
      //是否在加载中
      list_loading: true
    };
  },
  methods: {
    //vuex
    ...mapMutations(["csongUrl", "upplaylist", "getsongxx"]),
    ...mapActions(["getsongUrl"]),
    //获取歌单详情
    getxxal() {
      this.$axios({
        method: "get",
        url: "/playlist/detail",
        params: { id: this.id }
      })
        .then(res => {
          res = res.data.playlist;
          this.xxal = res;
          //提取结果中的歌曲ids
          this.playlistId = res.trackIds.map(item => {
            return item["id"];
          });
          //根据获取到ids去查询歌曲
          this.getsonglist();
        })
        .catch(err => {
          alert("获取失败，请稍后再试");
          console.log(err);
        });
    },
    //获取歌单中的歌曲详情
    getsonglist() {
      this.$axios({
        method: "post",
        url: "/song/detail?timestamp=" + new Date().getTime() + "",
        data: {
          ids: this.playlistId.join(",")
        }
      }).then(res => {
        this.playlist = res.data.songs.map(item => {
          //依次查找歌曲的码率
          let br;
          if (item.h != undefined) {
            br = item.h;
          } else if (item.m != undefined) {
            br = item.m;
          } else if (item.l != undefined) {
            br = item.l;
          }
          //返回歌曲名字 name； 专辑 al；歌手ar；时间长度码率 h m l
          return {
            id: item["id"],
            name: item["name"],
            al: item["al"],
            ar: item["ar"],
            br: br,
            time: ((br.size / br.br) * 8).toFixed(0)
          };
        });
        //取消加载动画
        this.list_loading = false;
      });
    },

    // 把歌单的列表添加到vuex的playlist中
    playall(list) {
      this.upplaylist(list);
    }
  },
  mounted() {
    //获取歌单的详细信息
    this.getxxal();
  },
  filters: {
    //把播放量的单位改成万
    check(n) {
      if (parseFloat(n) >= 9999) {
        return (n / 10000).toFixed(4) + "万";
      } else {
        return n;
      }
    },
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
<style lang="css" scoped>
.songlist {
  width: 100%;
  height: 100%;
}
.songlist .top {
  width: 100%;
  padding: 30px;
  background-color: #fff;
}
.songlist .top .pic {
  width: 20%;

  float: left;
}
.songlist .top .pic img {
  width: 100%;
  height: 100%;
  border-radius: 6px;
}
.songlist .top .r {
  float: right;
  width: 75%;
}
.songlist .top .r .title {
  font-size: 22px;
  font-weight: bold;
  line-height: 28px;
  padding-left: 40px;
  position: relative;
  color: rgb(86, 86, 86);
  margin-bottom: 10px;
}
.songlist .top .r .title::before {
  content: "歌单";
  position: absolute;
  top: 50%;
  left: 0px;
  transform: translateY(-50%);
  padding: 0 3px;
  color: rgb(255, 87, 87);
  border: 1px solid rgb(255, 87, 87);
  font-size: 10px;
  line-height: 16px;
  border-radius: 4px;
}
.songlist .top .r button {
  width: 130px;
  height: 30px;
  line-height: 30px;
  background-color: rgb(236, 65, 65);
  border: none;
  border-radius: 20px;
  color: azure;
}
.songlist .top .r button:hover {
  background-color: rgb(204, 50, 50);
  cursor: pointer;
}
.songlist .top .r .count {
  margin: 10px 0;
}
.songlist .top .r .count span {
  font-size: 10px;
  color: rgb(87, 87, 87);
}
.songlist .top .read {
  white-space: pre-line;
  font-size: 13px;
  color: rgb(121, 121, 121);
  line-height: 22px;
  margin-bottom: 10px;
  height: 18px;
  overflow: hidden;
  transform-origin: 0 50%;
  transition: all 0.5s ease-out;
}
.songlist .bottom {
  width: 100%;
  background-color: #fff;
}
.songlist .bottom ul li {
  display: flex;
  width: 100%;
  padding: 7px 20px;
  background-color: rgb(255, 255, 255);
  user-select: none;
}
.songlist .bottom ul .active {
  color: var(--hover) !important;
}
.songlist .bottom ul li:nth-child(2n) {
  background-color: rgb(249, 249, 249);
}
.songlist .bottom ul li:hover {
  background-color: rgb(240, 241, 242);
  color: var(--hover);
}
.songlist .bottom ul li > div {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  /* 解决字母和文字不在同一行 */
  word-break: break-all;
}
.songlist .bottom ul li .stitle {
  flex: 4;
  text-align: left;
  font-size: 13px;
  font-weight: 400;
  padding-right: 8px;
  overflow: hidden;
}
.songlist .bottom ul li .ssinger {
  flex: 2;
  text-align: left;
  color: rgb(101, 101, 101);
  font-size: 12px;
}
.songlist .bottom ul li .sal {
  flex: 3;
  text-align: left;
  color: rgb(101, 101, 101);
  font-size: 12px;
}
.songlist .bottom ul li .stime {
  flex: 2;
  text-align: left;
  color: rgb(141, 141, 141);
  font-size: 12px;
}
</style>
