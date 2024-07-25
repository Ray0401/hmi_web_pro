import Vue from 'vue';
import store from '@/store';
import dayjs from 'dayjs';
class websocketUtil {
  constructor(url, time) {
    // if (websocketUtil.instance) {
    //   return websocketUtil.instance;
    // }

    this.is_open_socket = false; //避免重复连接
    this.url = url; //地址
    this.data = null;
    this.timeout = time; //多少秒执行检测
    this.heartbeatInterval = null; //检测服务器端是否还活着
    this.reconnectTimeOut = null; //重连之后多久再次重连
    this.reconnectNum = 0;
    this.timer = null;
    this.socketTask = null;
    this.messageHandlers = [];
    // websocketUtil.instance = this;

    try {
      this.connectSocketInit();
    } catch (e) {
      console.log('catch');
      this.is_open_socket = false;
      this.reconnect();
    }
  }

  // 进入这个页面的时候创建websocket连接【整个页面随时使用】
  connectSocketInit() {
    this.socketTask = new WebSocket(this.url);
    this.socketTask.onopen = this.onopen.bind(this);
    this.socketTask.onmessage = this.onmessage.bind(this);
    this.socketTask.onclose = this.onclose.bind(this);
    // this.socketTask.onerror = this.onError.bind(this);
  }

  onopen() {
    console.log('WebSocket连接正常！');
    store.commit('setWsSuccessTimestamp', +dayjs());
    this.reconnectNum = 0;
    clearTimeout(this.timer);
    clearTimeout(this.reconnectTimeOut);
    clearTimeout(this.heartbeatInterval);
    this.is_open_socket = true;
    Vue && Vue.prototype.$bus.$emit('openSocket');
    // this.start();
  }

  onclose() {
    clearTimeout(this.timer);
    console.log('已经被关闭了');
    this.is_open_socket = false;
    this.reconnect();
  }

  onmessage(data) {
    if (this.socketTask.readyState !== WebSocket.OPEN) return;
    data = JSON.parse(data.data.replaceAll('\n', ''));
    if (data.type === 'Heart') {
      clearTimeout(this.heartbeatInterval);
      this.send(JSON.stringify({ type: 'Heart' }));
      this.heartbeatInterval = setTimeout(() => {
        this.reconnect();
        this.is_open_socket = false;
      }, this.timeout);
    } else {
      Vue.prototype.$bus.$emit('websocketMessage', data);
    }
  }

  //发送消息
  send(value) {
    this.socketTask && this.socketTask.send(value);
  }
  reset() {
    // 清除定时器重新发送一个心跳信息
    clearTimeout(this.heartbeatInterval);
    this.start();
  }
  //开启心跳检测
  start() {
    this.onmessage();
  }
  //重新连接
  reconnect() {
    console.log('reconnect');
    // console.log(this.socketTask);
    this.socketTask?.close();
    this.socketTask = null;
    setTimeout(() => {
      //停止发送心跳
      clearInterval(this.heartbeatInterval);
      //如果不是人为关闭的话，进行重连
      if (!this.is_open_socket) {
        Vue.prototype.$bus.$emit('closeSocket');
        this.reconnectNum++;
        //重连次数达到5次，提醒刷新页面
        if (this.reconnectNum > 3) {
          Vue.prototype.$bus.$emit('socketError');
          this.reconnectNum = 0;
        }
        this.reconnectTimeOut = setTimeout(() => {
          this.connectSocketInit();
        }, 2000);
      }
    }, 100);
  }
}

export default websocketUtil;
