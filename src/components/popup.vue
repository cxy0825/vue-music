<template>
  <div class="popup">
    <div class="top">
      <div class="img clear">
        <div class="pic" :style="{ 'animation-play-state': stop }">
          <img :src="playPic" alt="" />
        </div>
      </div>
      <div class="main clear">
        <div class="title">{{ playName }}</div>
        <div class="singer">
          <a href="#">{{ palyAuther }}</a>
          <a href="#" :title="playName">{{ playName }}</a>
        </div>
        <div class="geci" ref="lyric">
          <div class="loading" v-if="lyric_loading"></div>
          <div style="width: 100%;height: 140px;"></div>

          <p
            v-for="(item, index) in lyric"
            :key="'lyric' + index"
            :class="{ mark: lyricI == index }"
          >
            {{ item }}
          </p>
          <div style="width: 100%;height: 140px;"></div>
        </div>
      </div>
    </div>
    <div class="botton">
      <div class="title">最新评论({{ totalcom }})</div>
      <ul>
        <div class="loading" v-if="comment_loading"></div>
        <li v-for="(item, i) in comment" :key="'comment' + i">
          <div class="t">
            <img :src="item.user.avatarUrl" />
          </div>
          <div class="pl">
            <div class="nr">
              <span class="name">{{ item.user.nickname }}</span
              >：{{ item.content }}
            </div>
            <div class="time">{{ item.time | timeinit }}</div>
          </div>
        </li>
      </ul>
      <div class="page">
        <div class="page-box">
          <div
            class="page-item"
            @click="getcomment(playID, newpage, comment[19].time, 'left')"
          >
            &lt;
          </div>
          <div class="page-item">{{ newpage }}</div>
          <div
            class="page-item"
            @click="getcomment(playID, newpage, comment[19].time, 'right')"
          >
            &gt;
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";
export default {
  //控制唱片的动画zt
  props: ["zt", "time"],
  data() {
    return {
      //存放歌词
      lyric: [],
      //存放歌词的时间
      lyrictime: [],
      //记录歌词数据的索引
      lyricI: 0,
      //评论
      comment: [],
      //全部评论数
      totalcom: null,
      //评论当前的页数
      newpage: 1,
      //歌词是否在获取中
      lyric_loading: true,
      //歌曲评论是否在加载
      comment_loading: true
    };
  },
  methods: {
    //获取歌词
    getlyric(id) {
      this.lyric = [];
      this.$axios({
        method: "get",
        url: "/lyric",
        params: {
          id: id
        }
      }).then(res => {
        if (res.data.lrc == undefined) {
          return false;
        }
        //过滤其他信息，直接获取歌词
        res = res.data.lrc.lyric;
        //按照\n分割成数组
        res = res.split("\n");
        //对歌词进行处理分离出纯歌词和时间
        let lyrictime = [];
        let lyric = [];
        let regex = /\[(\d{2}):(\d{2}).(\d*)\]\s*(.+)/;
        res.forEach(item => {
          let result = regex.exec(item);
          if (result) {
            //分钟
            let m = parseFloat(result[1]);
            // 秒
            let s = parseFloat(result[2]);
            let time = m + ":" + s;
            let str_lyri = result[4];
            lyrictime.push(time);
            lyric.push(str_lyri);
          }
        });
        this.lyrictime = lyrictime;
        this.lyric = lyric;
        //取消加载动画
        this.lyric_loading = false;
      });
    },
    //获取歌曲评论
    getcomment(id, offset, before, zt) {
      //展示加载动画
      this.comment_loading = true;
      this.comment = [];
      if (zt == "left") {
        offset = offset - 1;
      } else if (zt == "right") {
        offset = offset + 1;
      }
      this.$axios({
        method: "get",
        url: "/comment/music",
        params: {
          id: id,
          offset: offset,
          before: before
        }
      }).then(res => {
        this.totalcom = res.data.total;
        res = res.data;
        this.comment = res.comments;
        this.newpage = offset;
        //取消加载动画
        this.comment_loading = false;
      });
    }
  },
  computed: {
    ...mapState(["playName", "palyAuther", "playPic", "playUrl", "playID"]),
    stop() {
      if (this.zt) {
        return "running";
      } else {
        return "paused";
      }
    }
  },
  watch: {
    playName(n, o) {
      if (n != o) {
        return true;
      }
    },
    palyAuther(n, o) {
      if (n != o) {
        return true;
      }
    },
    //当歌曲的id改变的时候判断，如果歌名和歌手两个都不一样就重新获取歌词
    //监听ID改变获取这首歌的评论
    playID(n) {
      //如果歌曲名字变了，歌手变了重新获取歌词
      if (this.playName && this.palyAuther) {
        this.getlyric(n);
      }
      //如果名字变了歌手没变重新获取歌词
      else if (this.playName && !this.palyAuther) {
        this.getlyric(n);
      }
      //获取歌曲的评论
      this.getcomment(n, 1);
    },
    //当歌曲的时间改变的时候同步变动歌词的位置
    //监听歌曲的timeupdata时间 由父组件传递过来
    time(n) {
      //对过来的数据进行处理变成 分:秒形式
      let m = Math.floor(n / 60);
      let s = Math.floor(n % 60);
      n = m + ":" + s;

      if (this.lyrictime.length > 0) {
        this.lyrictime.forEach((item, i) => {
          if (item == n) {
            this.lyricI = i;
            return true;
          }
        });

        //滚动动画
        this.$refs.lyric.scrollTop = this.lyricI * 32;
      }
    }
  },
  filters: {
    timeinit(value) {
      let oDate = new Date(value);
      let oYear = oDate.getFullYear();
      let oMonth = oDate.getMonth() + 1;
      let oDay = oDate.getDate();
      let oHour = oDate.getHours();
      let oMin = oDate.getMinutes();

      return oYear + "/" + oMonth + "/" + oDay + "   " + oHour + ":" + oMin;
    }
  }
};
</script>
<style lang="css">
.popup {
  position: absolute;
  top: 900px;
  width: 100%;
  height: 580px;
  overflow: hidden;
  overflow-y: auto;
  background-image: linear-gradient(rgb(219 219 219) 20%, #fff);
  background-attachment: fixed;
  z-index: 99;
}
.popup > .top {
  width: 100%;
  height: 460px;
  padding: 5% 0;
}
.top .img {
  width: 41%;
  float: left;
  user-select: none;
}
.top .img .pic {
  width: 310px;
  height: 310px;
  border-radius: 50%;
  background-color: rgb(33, 34, 36);
  border: 12px solid rgb(201, 202, 202);
  margin: 0 auto;
  animation: rotate 10s linear infinite;
}
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.top .img .pic img {
  width: 210px;
  height: 210px;
  border-radius: 50%;
  overflow: hidden;
  object-fit: cover;
  display: block;
  margin: 0 auto;
  margin-top: 36px;
}
.top .main {
  width: 50%;
  height: 420px;
  float: right;
  overflow: hidden;
}
.top .main .title {
  text-align: center;
  font-size: 28px;
}
.top .main .singer {
  width: 260px;
  margin: 0 auto;
  font-size: 14px;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.top .main .singer a {
  text-decoration: none;
  color: rgb(167 167 167);
}
.top .main .singer a:hover {
  color: rgb(35, 93, 157);
}
.top .main .geci {
  width: 480px;
  height: 320px;
  padding: 10px 0;
  overflow-x: hidden;
  scroll-behavior: smooth;
}
.top .main .geci .mark {
  color: var(--hover);
  font-size: 16px;
}
.top .main .geci p {
  width: 100%;
  text-align: center;
  line-height: 32px;
  font-size: 13px;
  color: rgb(97, 97, 97);
  transition: all 0.3s linear;
}
.botton {
  width: 100%;
}
.botton .title {
  width: 60%;
  height: 30px;
  line-height: 30px;
  text-align: left;
  margin: 0 auto;
  font-size: 18px;
  font-weight: 600;
}
.botton .title span {
  font-size: 22px;
  font-weight: 600;
}
.botton ul {
  width: 60%;
  margin: 6px auto 0;
}
.botton ul li {
  display: flex;
  padding: 20px 0 20px 0;
  border-top: 1px solid rgb(223, 223, 223);
  list-style: none;
}
.botton ul li:first-child {
  border-color: transparent;
}
.botton ul li .t {
  width: 40px;
  height: 40px;
  display: inline-block;
}
.botton ul li .t img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.botton ul li .pl {
  display: flex;
  flex: 1;
  padding-left: 5px;
  flex-flow: column;
}
.botton ul li .pl .nr {
  width: 100%;
  display: block;
  font-size: 14px;
}
.botton ul li .pl .nr .name {
  display: inline-block;
  font-size: 10px;
  color: rgb(35, 93, 157);
  cursor: pointer;
}
.botton ul li .pl .time {
  width: 100%;
  line-height: 15px;
  margin-top: 5px;
  font-size: 12px;
  color: rgb(133 133 133);
}
.botton .page {
  width: 100%;
  position: relative;
}
.botton .page .page-box {
  margin: 30px auto;
  position: absolute;
  left: 50%;
  transform: translateX(-85%);
}
.botton .page .page-item {
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  color: rgb(51, 51, 51);
  display: inline-block;
  font-weight: 600;
  font-size: 12px;
}
.botton .page .page-item:nth-child(2n-1) {
  font-size: 16px;
  cursor: pointer;
  color: rgb(190, 190, 190);
  user-select: none;
  border: none;
}
.botton .page .page-item:nth-child(2n-1):hover {
  background-color: var(--hover);
  color: #fff;
}
</style>
