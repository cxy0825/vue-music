// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import axios from "axios";

//引入vuex文件
import store from "../static/vuex.js";

// axios

Vue.prototype.$axios = axios.create({
  baseURL: "https://netease-cloud-music-api-six-delta.vercel.app/",
  timeout: 10000
});

Vue.config.productionTip = false;
//引入css
// require("./assets/css/base.css");

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  render: c => c(App),
  store: store
});
