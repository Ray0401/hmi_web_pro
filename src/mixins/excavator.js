import { EXCAVATOR_SOCKET_MESSAGE } from '@/constant/socketMessage/excavatorSocketMessage';
import { PUBLIC_SOCKET_MESSAGE } from '@/constant/socketMessage/publicSocketMessage';
export default {
  created() {
    let publicMessage = PUBLIC_SOCKET_MESSAGE(this);
    let excavatorMessage = EXCAVATOR_SOCKET_MESSAGE(this);
    this.$bus.$on('websocketMessage', data => {
      if (publicMessage[data.type]) return publicMessage[data.type](data);
      if (excavatorMessage[data.type]) return excavatorMessage[data.type](data);
    });
  },
};
