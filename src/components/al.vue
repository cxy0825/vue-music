<template>
  <div class="al">
    <div class="loading" v-if="loading"></div>
    <div class="al-item" v-for="(item, index) in alList" :key="'al' + index">
      <div class="alpic" @click="link(item.id)">
        <img :src="item.picUrl" alt="图片无法显示" />
        <!-- <img :src="item.picUrl" alt="图片无法显示" /> -->
        <div class="playCount">
          {{ item.playCount | check }}
        </div>
      </div>
      <div class="name" :title="item.name">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  name: "al",
  data() {
    return {
      alList: {},
      //是否在加载
      loading: true
    };
  },

  methods: {
    //图片资源加载事件

    //获取歌单列表
    getlist() {
      this.$axios({
        method: "get",
        url: "personalized",
        params: {
          limit: 30
        }
      })
        .then(response => {
          //获取到歌单列表后赋值给alList
          this.alList = response.data.result;
          //返回结果后取消动画
          this.loading = false;
        })
        .catch(error => {
          alert("获取失败，请稍后再试");
        });
    },
    //点击跳转songlist组件传递歌单id
    link(id) {
      this.$router.push({ path: `/al/songlist/${id}` });
    }
  },

  mounted() {
    //axios获取歌单
    //请求的事件超过一分钟才重新请求
    this.getlist();
  },
  filters: {
    check(n) {
      if (parseFloat(n) >= 9999) {
        return (n / 10000).toFixed(4) + "万";
      } else {
        return n;
      }
    }
  }
};
</script>
<style scope>
.al {
  width: 100%;
  height: 100%;
  padding: 20px 5px;
}

.al-item {
  width: 20%;
  margin: 0 2%;
  display: inline-block;
  position: relative;
}
.al-item .alpic {
  width: 100%;
  user-select: none;
  cursor: pointer;
}
.al-item .alpic img {
  width: 100%;
  border-radius: 6px;
}
.al-item .alpic .playCount {
  position: absolute;
  right: 6px;
  top: 3px;
  color: #fff;
  font-size: 10px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: 1px;
  line-height: 16px;
  font-weight: 400;
}
.al-item .alpic .playCount::before {
  border: 6px transparent solid;
  content: "";
  width: 0;
  height: 0;
  border-left-color: rgba(255, 255, 255, 0.75);
  position: absolute;
  margin-left: -10px;
  top: 50%;
  transform: translateY(-50%);
}
.al-item .name {
  width: 100%;
  height: 38px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
