<style lang="scss" scoped>
  .page-content {
    position: relative;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    overflow: hidden;
  }
</style>

<template>
  <div class="page-content">
    <Load v-if="!terminalType" />
    <Excavator v-if="terminalType == ADOPT" />
    <MineCard v-if="terminalType == MINE_CARD" />
    <Bulldozer v-if="terminalType == SOIL" />
    <MapCollectTerminal v-if="terminalType == MAP_COLLECT" />
    <CurrencyTerminal v-if="terminalType == CURRENCY" />

    <MessageModal
      v-if="showModal"
      :message="message"
      :showCancel="false"
      :confirmText="toLang('reload')"
      @confirm="confirm"
    />
  </div>
</template>

<script setup>
  import axios from 'axios';
  import { ref, getCurrentInstance } from 'vue';
  import { useStore } from '@/hooks/useStore';
  import Load from '@/components/components/load.vue';
  import MineCard from './mineCard.vue';
  import Excavator from './excavator.vue';
  import Bulldozer from './bulldozer.vue';
  import CurrencyTerminal from './currencyTerminal.vue';
  import MapCollectTerminal from './mapCollectTerminal.vue';
  import { BUILD_ID, BUILD_DATE } from '../../buildId';
  import { MINE_CARD, ADOPT, SOIL, MAP_COLLECT, CURRENCY } from '../constant/index';
  import { matchVehicleTerminal, getQueryString, setHTMLFontSize, getLocalStorage } from '@/utils/utils';

  setHTMLFontSize();
  const { socket, $bus } = getCurrentInstance().proxy;

  const store = useStore();

  //亮度
  try {
    axios.get(`http://127.0.0.1:3333?val=${store.state.brightness / 100}`);
  } catch (error) {
    console.log('error', error);
  }

  const terminalType = ref(null);
  const showNum = ref(0);
  const showModal = ref(false);
  const message = ref('网络链接不稳定,请刷新重试');

  $bus.$on('socketError', () => {
    if (!showModal.value) {
      showModal.value = true;
    }
    confirm();
  });
  $bus.$on('closeSocket', () => {
    showNum.value = 0;
    showModal.value = true;
  });
  $bus.$on('openSocket', () => {
    if (showNum.value == 0) {
      showNum.value = 1;
      init();
    }
  });

  $bus.$on('websocketMessage', data => {
    if (data.type == 'VehicleType') {
      showModal.value = false;
      terminalType.value = matchVehicleTerminal(data.vehicleNo);
      data['terminalType'] = terminalType.value;
      store.commit('setCarInfo', data);
      store.commit('setVehicleData', data);
    }
  });

  const init = () => {
    store.commit('setHmiVersion', BUILD_ID);
    let str = getQueryString('from') || 'hmi';
    socket.send(JSON.stringify({ type: 'registerClient', name: str }));
    socket.send(JSON.stringify({ type: 'getVehicleType' }));
    socket.send(JSON.stringify({ type: 'SyncBuildId', buildId: BUILD_ID, buildTime: BUILD_DATE }));
    if (getLocalStorage('loggedFlag')) {
      const userInfo = getLocalStorage('userInfo');
      socket.send(
        JSON.stringify({
          type: '0F10',
          id: userInfo.driveNum,
          password: userInfo.passWord,
        })
      );
    }
  };

  const confirm = () => {
    let img = new Image();
    img.src = `http://192.168.20.20/assets/images/loadlogo.png?time=${new Date().getTime()}`;
    img.onload = img => {
      window.location.reload();
      showModal.value = false;
    };
    img.onerror = err => {
      message.value = '网关错误，请稍后重试';
    };
  };
</script>
