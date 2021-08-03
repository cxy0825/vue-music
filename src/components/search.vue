<template>
  <div class="searchbox clear">
    <div class="leftbtn">
      <div class="btn">&lt;</div>
      <div class="btn">&gt;</div>
    </div>
    <div class="search">
      <input
        type="text"
        autocomplete="off"
        v-model="str_search"
        @focus="Focus"
        @blur="Blur"
        @keypress.enter="linkto('song', str_search)"
      />
      <div class="fousebox" v-show="focus">
        <ul class="hsearch" v-show="hsearch">
          <li
            v-for="(item, index) in hot_search"
            :key="'hot' + index"
            :class="{ B: index < 3 }"
            @mousedown="linkto('song', item.first)"
          >
            <span>{{ index + 1 }}</span> {{ item.first }}
          </li>
        </ul>
        <ul class="keysearch" v-show="!hsearch">
          <div class="name" v-if="key.songs">单曲</div>
          <li
            v-for="(item, i) in key.songs"
            :key="'song' + i"
            @mousedown="linkto('song', item.name)"
          >
            <div class="item">{{ item.name }} - {{ item.artists[0].name }}</div>
          </li>
          <div class="name" v-if="key.artists">歌手</div>
          <li
            v-for="(item, i) in key.artists"
            :key="'artists' + i"
            @mousedown="linkto('singer', item.name)"
          >
            <div class="item">{{ item.name }}</div>
          </li>
          <div class="name" v-if="key.albums">专辑</div>
          <li
            v-for="(item, i) in key.albums"
            :key="'albums' + i"
            @mousedown="linkto('al', item.name)"
          >
            <div class="item">{{ item.name }} - {{ item.artist.name }}</div>
          </li>
          <div class="name" v-if="key.playlists">歌单</div>
          <li
            v-for="(item, i) in key.playlists"
            :key="'playlist' + i"
            @mousedown="linkto('playlists', item.name)"
          >
            <div class="item">{{ item.name }}</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //搜索框内容
      str_search: "",
      //搜索框是否成为焦点
      focus: false,
      //热搜榜是否隐藏
      hsearch: true,
      //热搜榜数据
      hot_search: [],
      //搜索关键词返回的结果
      key: [],
      //发送搜索关键词的间隔
      timetemp: ""
    };
  },
  methods: {
    //搜索框成为焦点
    Focus() {
      this.focus = true;
    },
    //搜索框失去焦点
    Blur() {
      this.focus = false;
    },
    //获取热搜榜
    gethotsearch() {
      this.$axios({
        method: "get",
        url: "/search/hot"
      }).then(res => {
        res = res.data;
        this.hot_search = res.result.hots;
      });
    },
    //获取关键词搜索
    getkeysearch(str) {
      //获取时间戳，发送间隔为1s
      let date = new Date().getTime();
      if (this.timetemp === "" || date - this.timetemp >= 1000) {
        //修改时间戳
        this.timetemp = date;
        this.$axios({
          method: "get",
          url: "/search/suggest",
          params: {
            keywords: str.trim()
          }
        }).then(res => {
          res = res.data.result;
          this.key = res;
        });
      }
    },
    //跳转到搜索列表组件
    linkto(p, kw) {
      this.$router.push({ path: "/searchlist" + "/" + p + "/" + kw });
    }
  },
  mounted() {
    //获取热搜榜
    this.gethotsearch();
  },
  watch: {
    str_search(n) {
      if (n.trim() == "") {
        this.hsearch = true;
      } else {
        this.getkeysearch(n);
        if (this.hsearch) {
          this.hsearch = false;
        }
      }
    }
  }
};
</script>
<style lang="css" scoped>
.searchbox {
  width: 60%;
  min-width: 300px;
  float: left;
  margin-left: 120px;
}
.searchbox .leftbtn {
  width: 80px;
  float: left;
}
.searchbox .leftbtn .btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgb(219, 56, 56);
  color: #ffb199;
  display: inline-block;
  line-height: 30px;
  text-align: center;
  cursor: pointer;
}
.searchbox .leftbtn .btn:hover {
  color: #fff;
}
.searchbox .search {
  float: left;
  position: relative;
}
.searchbox .search input {
  width: 160px;
  line-height: 26px;
  outline: none;
  background-color: rgb(219, 56, 56);
  border: none;
  border-radius: 13px;
  padding: 0 12px;
  caret-color: #fff;
  color: #fff;
  font-size: 12px;
}
.searchbox .search .fousebox {
  width: 340px;
  background-color: #fff;
  z-index: 99;
  overflow-y: auto;
  border-radius: 6px;
  position: absolute;
  left: -50%;
  top: 48px;
  box-shadow: 0px 5px 13px#c4c4c4;
  transition: height 0.5s;
}
.searchbox .search .fousebox ul {
  width: 100%;
  margin: 15px 0;
}
.searchbox .search .fousebox .hsearch li {
  width: 100%;
  line-height: 50px;
  font-size: 10px;
  cursor: pointer;
  background-color: #fff;
}
.searchbox .search .fousebox .hsearch li:hover {
  background-color: rgb(242, 242, 242);
}
.searchbox .search .fousebox .hsearch li span {
  width: 40px;
  font-size: 14px;
  display: inline-block;
  text-align: center;
  color: rgb(204, 204, 204);
}
.searchbox .search .fousebox .hsearch .B {
  font-weight: 600;
}
.searchbox .search .fousebox .hsearch .B > span {
  color: var(--hover);
}
.searchbox .search .fousebox .keysearch li {
  width: 100%;
}
.searchbox .search .fousebox .keysearch .name {
  font-size: 12px;
  color: rgb(49, 49, 50);
  line-height: 28px;
  background-color: rgb(245, 245, 247);
  padding-left: 20px;
}
.searchbox .search .fousebox .keysearch li .item {
  font-size: 12px;
  line-height: 26px;
  padding-left: 20px;
  cursor: pointer;
}
.searchbox .search .fousebox .keysearch li .item:hover {
  background-color: rgb(242, 242, 242);
}
</style>
