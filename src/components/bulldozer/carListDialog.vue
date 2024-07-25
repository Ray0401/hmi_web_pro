<style scoped lang="scss">
  .car-list-dialog {
    position: fixed;
    top: 56px;
    left: 16px;

    .menu-icon {
      width: 68px;
      height: 69px;
    }

    .car-icon {
      width: 25px;
      height: 15px;
    }

    .wrapper {
      width: 298px;
      height: 188px;
      background: url('@/assets/images/bulldozer/carListBg.png') 100% / cover no-repeat;
      position: relative;
      color: #fff;
      display: flex;
      .list {
        height: 140px;
        overflow: scroll;
        padding: 10px 20px;
        margin-top: 18px;
        box-sizing: border-box;
        .list-item {
          width: 173px;
          height: 31px;
          display: flex;
          align-items: center;
          padding: 0px 10px;
          box-sizing: border-box;
          &.active {
            background: url('@/assets/images/bulldozer/currentCarBg.png') 100% / cover no-repeat;
          }

          .model {
            margin: 0 29px 0 10px;
          }
        }
      }

      .pagination {
        height: 140px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 20px;
        margin-left: 10px;
        .up {
          margin-bottom: 10px;
          cursor: pointer;
          width: 40px;
          height: 60px;
        }
        .down {
          width: 40px;
          height: 60px;
          cursor: pointer;
        }
      }

      .close-btn {
        width: 45px;
        height: 50px;
        position: absolute;
        top: 20px;
        right: -36px;
        cursor: pointer;
      }
    }
  }
</style>

<template>
  <div class="car-list-dialog" v-if="visible">
    <img
      v-if="isShowMenu"
      mode="scaleToFill"
      src="../../assets/images/bulldozer/carMenuButton.png"
      @click="changeStatus"
      class="menu-icon"
    />
    <div class="wrapper" v-else>
      <div class="list">
        <div
          :class="{ 'list-item': true, active: currentIndex == index }"
          v-for="(carItem, index) in carList"
          :key="carItem.id"
        >
          <img class="car-icon" v-show="currentIndex !== index" src="../../assets/images/bulldozer/darkCar.png" />
          <img class="car-icon" v-show="currentIndex === index" src="../../assets/images/bulldozer/lightCar.png" />
          <span class="model">{{ carItem.model }}</span>
          <span class="distance">{{ carItem.distance }}</span>
        </div>
      </div>
      <img
        mode="scaleToFill"
        class="close-btn"
        src="../../assets/images/bulldozer/closeButton.png"
        @click="changeStatus"
      />
      <!-- 选中 -->
      <div class="pagination">
        <img class="up" src="../../assets/images/bulldozer/up.png" @click="handleClick('up')" />
        <img class="down" src="../../assets/images/bulldozer/down.png" @click="handleClick('down')" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    components: {},
    props: {
      visible: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {
        isShowMenu: true,
        carList: [
          {
            id: 1,
            model: 'T1705',
            distance: '16m',
          },
          {
            id: 2,
            model: 'T1706',
            distance: '17m',
          },
          {
            id: 3,
            model: 'T1707',
            distance: '18m',
          },
          {
            id: 4,
            model: 'T1708',
            distance: '30m',
          },
          {
            id: 5,
            model: 'T1709',
            distance: '30m',
          },
        ],
        currentIndex: 0,
      };
    },
    mounted() {},
    methods: {
      // 切换显示状态
      changeStatus() {
        this.isShowMenu = !this.isShowMenu;
      },
      handleClick(type) {
        type == 'up' ? this.currentIndex-- : this.currentIndex++;
      },
    },
    computed: {},
    watch: {},
  };
</script>
