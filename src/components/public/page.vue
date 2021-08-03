<template>
  <div class="page">
    <div class="pagebox">
      <div class="first hover" @click="go(1)">首页</div>
      <div class="g hover" @click="g(npage)">上一页</div>
      <div class="set">
        <input type="text" v-model="npage" @keypress.enter="go(npage)" />
        <div class="go hover" @click="go(npage)">GO</div>
      </div>
      <div class="b hover" @click="b(npage)">下一页</div>
      <div class="end hover" @click="go(num)">尾页</div>
    </div>
  </div>
</template>
<script>
export default {
  props: ["count"],
  data() {
    return {
      //默认为30个一页，如果需要更改在父组件添加传入limit
      limit: 30,
      //分成多少页
      num: NaN,
      //现在是多少页
      npage: 1
    };
  },
  methods: {
    go(page) {
      if (page >= 1 && page <= this.num) {
        this.$emit("go", page);
        this.npage = page;
      } else {
        alert("跳转的页数不对");
      }
    },
    //上一页
    g(page) {
      if (page == 1) {
        alert("已经是第一页了");
      } else {
        page = page - 1;
        this.go(page);
        this.npage = page;
      }
    },
    //下一页
    b(page) {
      if (page == this.num) {
        alert("已经是最后一页了");
      } else {
        page = page + 1;
        this.go(page);
        this.npage = page;
      }
    }
  },
  watch: {
    count: {
      handler(n) {
        if (n / this.limit != NaN) {
          this.num = Math.ceil(n / this.limit);
        }
      },
      immediate: true
    }
  },
  mounted() {}
};
</script>
<style lang="css" scoped>
.page {
  width: 100%;
  position: relative;
  margin: 20px 0 10px 0;
  bottom: 10px;
}
.page::after {
  content: "";
  width: 100%;
  height: 60px;
  display: block;
}
.page .pagebox {
  position: absolute;
  top: 0;
  left: 45%;
  transform: translateX(-50%);
}
.page .pagebox div {
  display: inline-block;
  cursor: pointer;
  font-size: 14px;
  color: rgb(144, 144, 144);
  padding: 5px 10px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 2px 2px 5px rgb(207 207 207);
  margin-right: 6px;
  transition: all 0.2s linear;
}
.page .pagebox .hover:hover {
  background-color: var(--hover);
  color: #fff;
}
.page .pagebox .set {
  background-color: transparent;
  box-shadow: none;
  cursor: auto;
}
.page .pagebox .set input {
  display: inline-block;
  width: 95px;
  line-height: 30px;
  border: none;
  border-radius: 6px;
  text-align: center;
  margin-right: 6px;
  outline: none;
}
</style>
