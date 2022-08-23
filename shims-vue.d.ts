// import Vue from "vue";
// import VueRouter, { Route } from "vue-router";

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Vue {
    // $router: VueRouter; // 这表示this下有这个东西
    // $route: Route;
    // $https: any;
    // $urls: any;
    // $Message: any;
    // $Modal: any;
  }
  // eslint-disable-next-line @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, Vue, any>
  export default component
}
