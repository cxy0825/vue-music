<template>
  <div id="app">
    <div class="contain">
      <div
        id="header"
        @mousedown="mousedown($event)"
        @mouseup="mouseup($event)"
      >
        <div class="logo">
          <router-link to="/">
            <img src="./assets/images/logo.png" alt=""
          /></router-link>
        </div>
        <search></search>
      </div>
      <div id="main">
        <div class="left">
          <a @click.stop="linkal('al', true)">推荐歌单</a>
          <a @click.stop="linkal('newsong', false)">新歌速递</a>
          <a @click.stop="linkal('devlist', false)">本地列表</a>
        </div>
        <div class="right">
          <keep-alive :include="keepalive">
            <router-view></router-view>
          </keep-alive>
        </div>
        <!-- 个人列表组件 -->
        <mylist v-show="show" :ii="playIndex"></mylist>
      </div>
      <div id="footer">
        <div class="pic" @click="oPopup">
          <img :src="playPic" />
        </div>
        <div class="song">
          <p class="title">{{ playName }}</p>
          <p class="singer">{{ palyAuther }}</p>
        </div>
        <div class="control">
          <div class="btns">
            <div class="zt" @click="ch">{{ zt }}</div>
            <div class="back" @click="back"></div>
            <div class="play" @click="handleClick">
              <div :class="{ p: isplay, stop: isstop }"></div>
            </div>
            <div class="rotate180 back" @click="next"></div>
          </div>
          <div class="proglass clear">
            <div class="ntime">{{ ntime | initTime }}</div>
            <div class="glass" @click="ctime($event)" ref="glass">
              <div :style="{ width: w }">
                <audio
                  muted
                  ref="audio"
                  @canplay="getDuration"
                  @timeupdate="updataTime"
                  @ended="onend"
                  @error="onerr"
                  @playing="onplaying"
                  :src="playUrl"
                ></audio>
              </div>
            </div>
            <div class="alltime">{{ alltime | initTime }}</div>
          </div>
        </div>
        <div class="power">
          <div class="cpower clear">
            <div class="volume">
              <div class="icon">
                <svg
                  class="icon"
                  style="width: 1em;height: 1em;vertical-align: middle;fill: currentColor;overflow: hidden;"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="1719"
                >
                  <path
                    d="M563.021395 976.372093a28.576744 28.576744 0 0 1-16.300651-5.108093l-2.381395-1.92893L253.618605 702.213953H64.071442A28.195721 28.195721 0 0 1 35.72093 674.232558V349.707907a28.195721 28.195721 0 0 1 28.350512-27.981395H253.618605l293.125953-269.097675a28.576744 28.576744 0 0 1 29.362605-1.92893 27.838512 27.838512 0 0 1 15.276651 24.826046v872.876652a27.838512 27.838512 0 0 1-15.288558 24.826046 28.576744 28.576744 0 0 1-13.073861 3.143442zM81.086512 657.443721h179.211907a28.43386 28.43386 0 0 1 19.360744 7.537116l266.35907 244.783628V114.164093L279.611535 358.983442a28.350512 28.350512 0 0 1-19.313116 7.501395H81.086512v290.958884zM248.689116 697.748837h0.071442z m0-371.497674l-0.142883 0.130977z"
                    fill="#3751F9"
                    p-id="1720"
                  ></path>
                  <path
                    d="M662.13507 791.266233a22.28986 22.28986 0 0 1-4.762791-44.055814 240.258977 240.258977 0 0 0 0-470.408931 22.313674 22.313674 0 1 1 9.525581-43.603348 284.779163 284.779163 0 0 1 0 557.60372 22.623256 22.623256 0 0 1-4.76279 0.464373z m0 95.493953a22.28986 22.28986 0 0 1-3.453023-44.341581 334.145488 334.145488 0 0 0 0-660.932465 22.301767 22.301767 0 1 1 6.989395-44.055814 378.64186 378.64186 0 0 1 0 749.056 22.623256 22.623256 0 0 1-3.548279 0.27386z m0-213.063442a22.492279 22.492279 0 0 1-20.861023-14.050232 22.230326 22.230326 0 0 1 12.526139-28.993489 127.404651 127.404651 0 0 0 0-237.460837 22.230326 22.230326 0 0 1-12.526139-28.993488 22.551814 22.551814 0 0 1 29.243534-12.418977 171.877209 171.877209 0 0 1 0 320.297674 22.623256 22.623256 0 0 1-8.34679 1.619349z"
                    fill="#E9611E"
                    p-id="1721"
                  ></path>
                </svg>
              </div>
              <div class="range">
                <input type="range" v-model="range" />
              </div>
            </div>
            <div class="list" title="列表" @click="show = !show">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
      <!-- 弹出框组件 -->
      <popup :time="ntime" :zt="play" :class="{ open: open }"></popup>
    </div>
  </div>
</template>

<script>
//储存音频dom
let audio;
//vuex
import { mapActions, mapMutations, mapState } from "vuex";

import popup from "./components/popup.vue";
import mylist from "./components/mylist.vue";
import search from "./components/search.vue";
export default {
  data() {
    return {
      isplay: false,
      isstop: true,
      zt: "顺序",
      //是否在加载
      loading: true,
      //当前播放的时间
      ntime: 0,
      //总时间
      alltime: 0,
      //进度条长度
      w: "0%",
      //音量大小
      range: 50,
      //判断播放还是暂停 true是播放 false是暂停
      play: false,
      //是否打开popup页面
      open: false,
      //是否打开播放列表
      show: false,
      //缓存路由
      keepalive: []
    };
  },
  methods: {
    ...mapMutations(["getsongxx"]),
    ...mapActions(["getsongUrl"]),
    //拖拽事件
    mousedown(e) {
      //console.log("鼠标点击了");
    },
    mouseup(e) {
      //console.log("鼠标松开了");
    },
    //点击play按钮事件
    handleClick() {
      this.isplay = !this.isplay;
      this.isstop = !this.isstop;
      //是否播放
      if (this.isplay) {
        this.play = true;
        //淡入
        audio.volume = 0;
        audio.play();
        let once = parseFloat(this.range / 400);
        let time = setInterval(() => {
          if (this.range / 100 - audio.volume < once) {
            audio.volume = this.range / 100;
            clearInterval(time);
            console.log("开始播放");
          } else {
            audio.volume += once;
          }
        }, 150);
      } else {
        this.play = false;
        //淡出
        let once = parseFloat(this.range / 400);
        let time = setInterval(() => {
          if (audio.volume - once < 0) {
            audio.volume = 0;
            audio.pause();
            clearInterval(time);
            console.log("停止播放");
            audio.volume = this.range / 100;
          } else {
            audio.volume -= once;
          }
        }, 150);
      }
    },
    //修改播放的方式 随机还是顺序
    ch() {
      if (this.zt == "顺序") {
        this.zt = "随机";
      } else {
        this.zt = "顺序";
      }
    },
    //上一首
    back() {
      console.log("上一首");
    },
    //下一首
    next() {
      console.log("下一首");
      this.onend();
    },
    //单击进度条
    ctime(e) {
      //获取点击的位置
      let x = e.clientX;
      //获取进度条的位置
      let glass = this.$refs.glass;
      let objX = glass.getBoundingClientRect().left;
      //计算点击位置占总长度的百分比保留两位小数
      let width = ((x - objX) / 320).toFixed(2);
      this.w = width * 100 + "%";
      audio.currentTime = this.alltime * width;
      audio.volume = this.range / 100;
      audio.play();
      this.isstop = false;
      this.isplay = true;
    },
    //audio事件
    onend() {
      if (this.playlist.length == 0) {
        audio.pause();
        return true;
      }
      if (this.zt == "顺序") {
        let i = this.playIndex + 1;
        if (i >= this.playlist.length) {
          i = 0;
        }
        //获得歌曲的url
        this.getsongUrl({
          id: this.playlist[i].id,
          br: this.playlist[i].br.br
        });
        //获得歌曲的信息
        this.getsongxx({
          name: this.playlist[i].name,
          auther: this.playlist[i].ar[0].name,
          index: i,
          pic: this.playlist[i].al.picUrl
        });
      } else if (this.zt == "随机") {
        //随机生成一个i 向下取整
        let i = Math.floor(Math.random() * this.playlist.length + 1);
        if (i == this.playIndex && this.playIndex == this.playIndex.length) {
          i = 0;
        }
        //获得歌曲的url
        this.getsongUrl({
          id: this.playlist[i].id,
          br: this.playlist[i].br.br
        });
        //获得歌曲的信息
        this.getsongxx({
          name: this.playlist[i].name,
          auther: this.playlist[i].ar[0].name,
          index: i,
          pic: this.playlist[i].al.picUrl
        });
      }
    },
    //获取音频总时长
    getDuration() {
      this.alltime = audio.duration;
    },
    //监听视频播放时间
    updataTime(e) {
      this.ntime = e.target.currentTime;
    },
    //发生错误
    onerr() {
      if (this.playUrl != "") {
        alert("播放出错，请稍后再试");
      }
    },
    //当音频被播放时
    onplaying() {
      this.isplay = true;
      this.isstop = false;
      this.play = true;
    },
    //audio事件结束
    //弹出框
    oPopup() {
      this.open = !this.open;
    },
    //跳转歌单,动态决定是否保留页面
    linkal(name, t) {
      //点击后在keepalive数组中加入要保留数据的组件名字
      //5分钟后删除这个名字实现5s缓存
      //第二个是要不要缓存这个页面 true为缓存，false为不缓存
      if (t) {
        this.keepalive.push(name);
        setTimeout(() => {
          this.keepalive.forEach((v, i) => {
            if (v == name) {
              this.keepalive.splice(i, 1);
              return;
            }
          });
        }, 300000);
      }

      this.$router.push({ path: "/" + name });
    }
  },
  mounted() {
    // 自动播放
    // document.querySelector(".play").click();
    audio = this.$refs.audio;
    this.currentTime = audio.currentTime;
  },
  watch: {
    //监听音乐的变化的时间，每当时间改变就计算进度条的长度
    ntime: {
      handler(n) {
        this.w = (n / this.alltime).toFixed(2) * 100 + "%";
      },
      deep: true
    },
    //监听音乐的音量
    range(v) {
      audio.volume = v / 100;
    },
    //监听音乐的url变化，变化后自动播放
    playUrl() {
      //canplay 音频能播放的时候触发
      audio.oncanplay = () => {
        audio.play();
      };
    }
  },
  computed: {
    ...mapState([
      "playlist",
      "playUrl",
      "playName",
      "palyAuther",
      "playIndex",
      "playPic"
    ])
  },
  filters: {
    initTime(value) {
      let time = value.toFixed(0);
      //分钟
      let min = Math.floor(time / 60);
      let s = time % 60;
      if (s < 10) {
        s = "0" + s;
      }
      return min + ":" + s;
    }
  },
  components: {
    popup,
    mylist,
    search
  }
};
</script>

<style>
@import "../static/base.css";
#app {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.contain {
  display: flex;
  flex-flow: column;
  width: 1024px;
  height: 720px;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 0px 20px 0px rgb(192 192 192);
}
#header {
  width: 100%;
  height: 60px;
  line-height: 60px;
  background-color: var(--header);
}
#header .logo {
  width: 40px;
  height: 60px;
  margin-left: 20px;
  position: relative;
  float: left;
}
#header .logo a {
  width: 40px;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
#header .logo img {
  width: 100%;
  object-fit: cover;
}
#main {
  width: 100%;
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
}
#main > div {
  display: flex;
  flex-flow: row;
  overflow: hidden;
  overflow-y: auto;
}
#main div.left {
  flex-flow: column;
  flex: 2;
  height: 100%;
  border-right: 1px solid rgb(225, 225, 225);
  overflow: hidden;
}
#main div.left a {
  width: 100%;
  height: 30px;
  line-height: 30px;
  padding: 5px 20px;
  box-sizing: content-box;
  cursor: pointer;
}
#main div.left a:hover {
  background-color: rgb(216, 216, 216);
}

#main .right {
  display: block;
  width: 83%;
  height: 100%;
  background-color: rgb(243, 243, 243);
}
#main div.right h1 {
  height: 30px;
  display: block;
}
#footer {
  width: 100%;
  height: 80px;
  line-height: 80px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0px -6px 8px 0px rgba(0, 0, 0, 0.15);
  border-top: 1px solid #ccc;
  z-index: 9999;
  background-color: #fff;
}
#footer .pic {
  width: 50px;
  height: 50px;
  display: inline-block;
  cursor: pointer;
}

#footer .pic img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

#footer > .song {
  width: 180px;
  overflow: hidden;
  margin-left: 10px;
}
#footer > .song p {
  overflow: hidden;
  width: 100%;
  line-height: 25px;
  display: block;
  font-size: 14px;
}
#footer > .song .singer {
  font-size: 12px;
}
#footer .control {
  margin-left: 20px;
  flex: 2;
  user-select: none;
}
#footer .control .btns {
  display: block;
  width: 80%;
  height: 40px;
  margin: 0 auto;
}
#footer .control .btns > div {
  float: left;
  cursor: pointer;

  margin-right: 40px;
}
#footer .control .btns .zt {
  line-height: 40px;
  font-size: 12px;
}
#footer .control .btns .zt:hover {
  color: var(--hover);
}
#footer .control .back {
  width: 20px;
  height: 20px;
  position: relative;
  transform: translateY(12px);
}
#footer .control .back::after {
  content: "";
  display: block;
  position: absolute;
  width: 0px;
  height: 0px;
  border: 8px solid;
  border-color: transparent;
  border-right-color: rgb(51, 51, 51);
}
#footer .control .back::before {
  content: "";
  position: absolute;
  width: 1px;
  height: 12px;
  border-right: 2px solid rgb(51, 51, 51);
  left: 5px;
  top: 2px;
}
#footer .control .back:hover::after,
#footer .control .back:hover::before {
  border-right-color: var(--hover);
}
/* 翻转按钮 */
#footer .control .rotate180 {
  transform: rotate(180deg);
  margin-top: 7px;
}
#footer .control .play {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgb(244, 244, 244);
}
#footer .control .play:hover {
  background-color: rgb(229, 229, 229);
}
#footer .control .play div.p {
  width: 12px;
  height: 16px;
  border: none;
  border-left: 3px solid rgb(51, 51, 51);
  border-right: 3px solid rgb(51, 51, 51);
  margin: 12px auto;
}
#footer .control .play div.stop {
  width: 0;
  height: 0;
  border: 12px solid transparent;
  border-left-color: rgb(51, 51, 51);
  margin-left: 16px;
  margin-top: 7px;
}
#footer .control .proglass {
  width: 80%;
  line-height: 40px;
}
#footer .control .proglass > div {
  width: 42px;
  float: left;
  font-size: 13px;
  color: rgb(205, 205, 205);
}
#footer .control .proglass .glass {
  width: 320px;
  height: 3px;
  background: rgb(205, 205, 205);
  margin: 19px 8px 0 8px;
  cursor: pointer;
  position: relative;
}
#footer .control .proglass .glass:hover {
  padding: 2px;
}
#footer .control .proglass .glass > div {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 9999;
  background-color: rgb(239, 103, 103);
  width: 40px;
  height: 100%;
  max-width: 100%;
}
#footer .power {
  width: 180px;
}
#footer .power .volume > div {
  line-height: 30px;
  float: left;
}
#footer .power .volume > div.range {
  margin-left: 5px;
  margin-top: -2px;
}
#footer .power .list {
  width: 30px;
  height: 30px;
  text-align: right;
  float: right;
  cursor: pointer;
}
#footer .power .list span {
  width: 25px;
  height: 3px;
  background: rgb(239, 103, 103);
  display: block;
  border-radius: 3px;
}
#footer .power .list span:nth-child(1) {
  margin-top: 9px;
  width: 20px;
}
#footer .power .list span:nth-child(2) {
  margin-top: 5px;
  width: 15px;
  margin-bottom: 5px;
}
.popup {
  transition: all 0.6s ease-out;
}
.open {
  top: 60px !important;
}
</style>
