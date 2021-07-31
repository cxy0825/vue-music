import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);
import axios from "axios";
let instence = axios.create({
  baseURL: "https://netease-cloud-music-api-six-delta.vercel.app/",
  timeout: 8000
});
const store = new Vuex.Store({
  state: {
    //用来存放我的列表音乐
    mylist: sessionStorage.getItem("mylist")
      ? JSON.parse(sessionStorage.getItem("mylist"))
      : [],

    playlist: [],
    //正在播放音乐的url
    playUrl: "",
    //正在播放音乐的名字
    playName: "",
    //正在播放音乐的作者
    palyAuther: "",
    //正在播放音乐在数组中的索引以便于实现上一首下一首功能
    playIndex: "",
    //正在播放音乐的歌曲封面
    playPic: "../static/logo.png",
    //正在播放音乐的id
    playID: ""
  },
  mutations: {
    //把state数据保存在session中
    saveMylist(state) {
      sessionStorage.setItem("mylist", JSON.stringify(state.mylist));
    },
    clearList(state) {
      state.playlist = [];
    },
    //获得专辑列表中的歌曲加入playlist
    upplaylist(state, list) {
      //添加进数组
      state.playlist = list;
    },
    //更新我的列表
    upmylist(state, list) {
      let obj = {};
      let result = [];
      //添加进数组
      state.mylist.push(...list);
      //数组去重
      for (let i of state.mylist) {
        if (!obj[i.id]) {
          result.push(i);
          obj[i.id] = 1;
        }
      }
      state.mylist = result;

      //保存进session中
      store.commit("saveMylist");
    },
    //修改正在播放歌曲的url
    csongUrl(state, data) {
      state.playUrl = data.url;
      state.playID = data.id;
    },
    //获取歌曲的url
    getsongUrl(state, data) {
      if (data.id == state.playID) {
        return false;
      }
      instence({
        method: "get",
        url: "/song/url",
        params: {
          id: data.id,
          br: data.br
        }
      })
        .then(res => {
          //取得歌曲的url
          res = res.data.data[0].url;
          store.commit("csongUrl", { url: res, id: data.id });
        })
        .catch(err => {
          alert("对不起无法播放，请稍后再试");
          console.log(err);
        });
    },
    //获得歌曲信息
    getsongxx(state, data) {
      state.playName = data.name;
      state.palyAuther = data.auther;
      state.playIndex = data.index;
      state.playPic = data.pic;
<<<<<<< HEAD
    },
    //播放音乐
    Xplaysong(state, data) {
      //正在播放音乐的名字
      state.playName = data.name;
      //正在播放音乐的作者
      state.palyAuther = data.song.artists[0].name;
      // 正在播放音乐的歌曲封面;
      state.playPic = data.picUrl;
      state.playID = data.id;
      //发送请求
      instence({
        method: "get",
        url: "/song/url",
        params: {
          id: data.id,
          br: data.song.hMusic.bitrate
        }
      })
        .then(res => {
          res = res.data;
          state.playUrl = res.data[0].url;
        })
        .catch(err => {
          alert("无法获取歌曲地址请重试");
        });
=======
>>>>>>> e78f96d (test)
    }
  },
  actions: {
    getsongUrl({ commit }, data) {
      commit("getsongUrl", data);
<<<<<<< HEAD
    },
    Xplaysong({ commit }, data) {
      commit("Xplaysong", data);
=======
>>>>>>> e78f96d (test)
    }
  }
});
export default store;
