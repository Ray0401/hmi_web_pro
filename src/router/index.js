import Vue from 'vue';
import VueRouter from 'vue-router';

// 解决ncaught (in promise) NavigationDuplicated 问题
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch(err => err);
};
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalReplace.call(this, location, onResolve, onReject);
  }
  return originalReplace.call(this, location).catch(err => err);
};

Vue.use(VueRouter);

export const constantRoutes = [
  {
    path: '/',
    name: 'Index',
    component: () => import('../views/index.vue'),
  },
];

const createRouter = () =>
  new VueRouter({
    routes: constantRoutes,
  });

const router = createRouter();

export default router;
