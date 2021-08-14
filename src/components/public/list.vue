<template>
  <div class="l">
    <div class="loading" v-if="loading"></div>
    <ul>
      <li
        class="item"
        v-for="(item, index) in ids"
        :key="'li' + index"
        @click="golink(ids[index])"
      >
        <div class="picbox">
          <img :src="picurl[index]" />
        </div>
        <div class="name">
          {{ name[index] }}
        </div>
        <template v-if="count.length > 0">
          <div class="count">{{ count[index] }}</div>
        </template>
        <template v-if="user.length > 0">
          <div class="user">{{ user[index] }}</div>
        </template>
      </li>
    </ul>
  </div>
</template>
<script>
//储存路径的数组
let ar_path;

export default {
  data() {
    return {
      ids: [],
      name: [],
      picurl: [],
      count: [],
      user: [],
      loading: true
    };
  },
  props: ["kw"],
  methods: {
    //获取数据
    getData(type, page) {
      //初始化数组
      this.ids = [];
      this.name = [];
      this.picurl = [];
      this.count = [];
      this.user = [];
      this.loading = true;
      this.$axios({
        method: "get",
        url: "/search",
        params: {
          keywords: this.kw,
          page: page,
          type: type
        }
      }).then(res => {
        this.loading = false;
        res = res.data.result;
        console.log(res);
        //获取结果中的数组
        let type;
        for (let i in res) {
          if (res[i] instanceof Array) {
            type = i;
          }
        }
        res[type].forEach(item => {
          //歌手
          if (type == "artists") {
            this.ids.push(item.id);
            this.name.push(item.name);
            this.picurl.push(item.img1v1Url);
          }
          //专辑
          else if (type == "albums") {
            this.ids.push(item.id);
            this.name.push(item.name);
            this.picurl.push(item.picUrl);
            this.user.push(item.artist.name);
          }
          //歌单
          else if (type == "playlists") {
            this.ids.push(item.id);
            this.name.push(item.name);
            this.count.push(item.trackCount);
            this.picurl.push(item.coverImgUrl);
          }
        });
      });
    },
    //跳转到对应的页面
    /*
    如果是singer就跳转到歌手页面
    如果是al就跳转到专辑
    如果是playlists就跳转到歌单
    */
    golink(id) {
      if (ar_path[1] == "singer") {
        this.$router.push({ path: `/singer/${id}` });
      } else if (ar_path[1] == "al") {
        this.$router.push({ path: `/al/${id}` });
      } else if (ar_path[1] == "playlists") {
        this.$router.push({ path: `/playlists/${id}` });
      }
    }
  },
  mounted() {
    let path = this.$route.path;
    //去除最前面的 “/”
    path = path.substr(1, path.length - 1);
    // 变成数组
    ar_path = path.split("/");
    if (ar_path[1] == "singer") {
      this.getData(100, 1);
    } else if (ar_path[1] == "al") {
      this.getData(10, 1);
    } else if (ar_path[1] == "playlists") {
      this.getData(1000, 1);
    }
  },
  watch: {
    "$route.path": function(n, o) {
      let path = n.split("/");
      if (path[2] == "singer") {
        this.getData(100, 1);
        ar_path[1] = "singer";
      } else if (path[2] == "al") {
        this.getData(10, 1);
        ar_path[1] = "al";
      } else if (path[2] == "playlists") {
        this.getData(1000, 1);
        ar_path[1] = "playlists";
      }
    }
  }
};
</script>
<style lang="css" scoped>
.l {
  width: 100%;
  background-color: #fff;
}
.l ul {
  width: 100%;
}
.l ul li {
  width: 100%;
  height: 90px;
  display: flex;
  flex-flow: row;
  align-content: center;
  cursor: pointer;
  padding: 5px 10px;
}
.l ul li:nth-child(2n) {
  background-color: rgb(249, 249, 249);
}
.l ul li:hover {
  background-color: rgb(240, 241, 242);
}
.l ul li > div {
  line-height: 80px;
  overflow: hidden;
  white-space: nowrap;
}
.l ul li .picbox {
  width: 60px;
  height: 60px;
  align-self: center;
}
.l ul li .picbox img {
  width: 100%;
  object-fit: cover;
  border-radius: 6px;
}
.l ul li .name {
  flex: 3;
  padding-left: 3%;
  font-size: 13px;
}
.l ul li .count {
  flex: 1;
  font-size: 11px;
  color: slategray;
}
.l ul li .user {
  flex: 2;
  font-size: 12px;
  color: slategray;
}
</style>
