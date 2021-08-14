import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);
//解决路由重复报错问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
//专辑组件
import al from "../components/al.vue";
//歌曲列表组件
import songlist from "../components/songlist.vue";
//我的列表组件
import devlist from "../components/devlist.vue";
//新歌速递组件
import newsong from "../components/newsong.vue";
//搜索结果列表
import searchlist from "../components/searchlist/searchlist.vue";
import playlist from "../components/searchlist/playlist.vue";
import baselist from "../components/public/list.vue";
//专辑列表组件
import allist from "../components/allist.vue";
export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/al"
    },
    {
      path: "/al",
      name: "al",
      component: al
    },
    {
      path: "/al/songlist/:id",
      name: "songlist",
      component: songlist,
      props: true
    },
    {
      path: "/devlist",
      name: "devlist",
      component: devlist
    },
    {
      path: "/newsong",
      name: "newsong",
      component: newsong
    },
    {
      path: "/searchlist",
      name: "searchlist",
      component: searchlist,
      props: true,
      children: [
        //搜索单曲
        { path: "song/:kw", component: playlist, props: true },
        { path: "singer/:kw", component: baselist, props: true },
        { path: "al/:kw", component: baselist, props: true },
        { path: "playlists/:kw", component: baselist, props: true }
      ]
    },
    {
      path: "/al/:id",
      component: allist,
      props: true
    },
    {
      path: "/playlists/:id",
      component: songlist,
      props: true
    }
  ]
});
