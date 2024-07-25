<template>
  <Modal @warpClick="close">
    <div class="output-table">
      <div class="title">{{ toLang('doubtfulProductionRecords') }}</div>
      <table class="table">
        <tr class="tr-th">
          <th v-for="(item, index) in thList" :key="index">{{ item }}</th>
        </tr>
        <tr
          v-for="(item, index) in outPutList"
          :key="index"
          :class="{ 'tr-empty': !(index >= scopeMin[0] && index < scopeMin[1]) }"
        >
          <template v-if="index >= scopeMin[0] && index < scopeMin[1]">
            <td>{{ index + 1 }}</td>
            <td>{{ item[1] }}</td>
            <td>{{ formatTime(item[2]) }}</td>
            <td>{{ formatTime(item[3]) }}</td>
            <td width="120">{{ item[4] }}</td>
            <td width="200" class="operate">
              <div class="confirm" @click="operateConfirm(item, index)">{{ toLang('yes') }}</div>
              <div class="cancel" @click="operateCancel(item, index)">{{ toLang('no') }}</div>
            </td>
          </template>
        </tr>
      </table>
      <div class="pagination">
        <div @click="activeIndex = 1" class="first">{{ toLang('homePage') }}</div>
        <div @click="prev" class="prev">{{ '<' }}</div>
        <div class="pagination-body">
          <div class="pagination-content">
            <div
              @click="activeIndex = item"
              :class="`text ${activeIndex == item && 'active'}`"
              v-for="item in total"
              :key="item"
            >
              {{ item }}
            </div>
          </div>
        </div>
        <div @click="next" class="next">></div>
        <div @click="activeIndex = total" class="last">{{ toLang('lastPage') }}</div>
      </div>
      <div class="close-btn" @click="close"></div>
    </div>
    <MessageModal
      v-if="showModal"
      :message="toLang('loadStatus')"
      :confirmText="toLang('fullLoad')"
      :cancelText="toLang('halfLoad')"
      :cancelType="'grey'"
      @confirm="confirm"
      @cancel="cancel"
      :showClose="true"
    />
  </Modal>
</template>

<script>
  import { formatTime } from '@/utils/format.js';
  export default {
    name: 'outputTable',
    props: {
      outPutList: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        thList: [
          this.toLang('id'),
          this.toLang('truckName'),
          this.toLang('driveInTime'),
          this.toLang('driveOutTime'),
          this.toLang('materials'),
          this.toLang('IsItrealOutput'),
        ],
        activeIndex: 1,
        showModal: false,
        itemObj: {}, //记录当前点击的数据
        clickIndex: null,
      };
    },
    watch: {
      activeIndex(val) {
        if (this.total > 7) {
          let mwidth = document.querySelector('.pagination-body').offsetWidth;
          let page = document.querySelector('.pagination-content');
          let width = document.querySelector('.pagination-body').offsetWidth;
          let cwidth = document.querySelector('.pagination-content .text').offsetWidth;
          let x = val * (cwidth + cwidth / 2.4) - mwidth / 2 - (cwidth + cwidth / 2.4) / 2 - 10;
          if (x < 0) x = 0;
          if (x > page.offsetWidth - width) {
            x = page.offsetWidth - width;
          }
          console.log(x);
          page.style.transform = `translateX(${-x}px)`;
        }
      },
    },
    computed: {
      scopeMin() {
        return [(this.activeIndex - 1) * 4, this.activeIndex * 4];
      },
      total() {
        if (this.activeIndex > Math.ceil(this.outPutList.length / 4))
          this.activeIndex = Math.ceil(this.outPutList.length / 4);
        return Math.ceil(this.outPutList.length / 4) < 1 ? 1 : Math.ceil(this.outPutList.length / 4);
      },
    },
    methods: {
      formatTime(time) {
        if (time == 0) return '';
        time = parseInt(time) * 1000;
        return formatTime(time);
      },
      prev() {
        if (this.activeIndex > 1) {
          this.activeIndex -= 1;
        }
      },
      next() {
        if (this.activeIndex < this.total) this.activeIndex += 1;
      },
      close() {
        this.$emit('setOutPutModal');
      },
      cancel(data) {
        this.showModal = false;
        if (data?.data) {
          this.socket.send(
            JSON.stringify({
              type: '8303',
              vailid: 1,
              load_state: 2,
              record: this.outPutList[this.clickIndex][0],
            })
          );
        }
      },
      confirm() {
        this.showModal = false;
        this.socket.send(
          JSON.stringify({
            type: '8303',
            vailid: 1,
            load_state: 1,
            record: this.outPutList[this.clickIndex][0],
          })
        );
      },
      operateConfirm(item, index) {
        this.clickIndex = index;
        this.showModal = true;
      },
      operateCancel(item, index) {
        this.socket.send(
          JSON.stringify({
            type: '8303',
            vailid: 2,
            load_state: 0,
            record: item[0],
          })
        );
      },
    },
  };
</script>

<style lang="scss" scoped>
  .fixed-modal {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 9;
  }
  .output-table {
    width: 864px;
    position: absolute;
    top: 50%;
    // background: url('../../assets/images/messagebg.png') no-repeat;
    // background-size: 100% 100%;
    border: 0px solid;
    border-image-source: url('../../assets/images/messagebg.png');
    border-image-slice: 40 20 40 20 fill;
    border-image-width: 30px 15px;
    border-image-repeat: stretch;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    .title {
      font-size: 24px;
      font-weight: normal;
      text-align: left;
      color: #70a7b3;
      margin: 20px 0 0 20px;
    }
    .table {
      color: #70a7b3;
      width: 100%;
      padding: 0 20px;
      text-align: left;
      font-size: 14px;
      margin-top: 16px;
      .tr-th th {
        &:last-child {
          width: 200px;
        }
      }
      tr td {
        height: 60px;
        line-height: 60px;
      }
      .tr-empty {
        display: none;
      }
      th {
        font-size: 18px;
      }
      .operate {
        display: flex;
        align-items: center;
        height: 60px;
        justify-content: flex-end;
        .confirm {
          width: 90px;
          height: 40px;
          background: rgba(255, 89, 0, 0.3);
          border: 2px solid #ff5900;
          border-radius: 3px;
          text-align: center;
          line-height: 40px;
          color: #fff;
        }
        .cancel {
          width: 90px;
          height: 40px;
          border-radius: 3px;
          margin-left: 20px;
          text-align: center;
          line-height: 40px;
          background: rgba(53, 58, 74, 0.3);
          border: 2px solid #353a4a;
        }
      }
    }
    .pagination {
      display: flex;
      color: #ff5900;
      font-size: 16px;
      align-items: center;
      justify-content: center;
      margin-top: 40px;
      margin-bottom: 40px;
      .prev,
      .next {
        font-size: 24px;
        line-height: 16px;
        margin-left: 20px;
        margin-right: 20px;
      }
      .pagination-body {
        display: flex;
        max-width: 238px;
        overflow-x: scroll;
        .pagination-content {
          display: flex;
          transition: transform 0.3s linear;
          transform: translateX(0px);
        }
        .text {
          width: 24px;
          height: 24px;
          flex-shrink: 0;
          border-radius: 3px;
          background: rgba(53, 58, 74, 0.3);
          border: 2px solid #353a4a;
          text-align: center;
          margin-left: 10px;
          color: #70a7b3;
          box-sizing: border-box;
          &:first-child {
            margin-left: 0px;
          }
        }
        .active {
          background: rgba(255, 89, 0, 0.3);
          border: 2px solid #ff5900;
          color: #fff;
        }
      }
      .pagination-body::-webkit-scrollbar {
        display: none;
      }
    }
    .close-btn {
      width: 30px;
      height: 30px;
      position: absolute;
      right: 20px;
      top: 20px;
      background: url('../../assets/images/closebtn.png') no-repeat;
      background-size: 100% 100%;
    }
  }
</style>
