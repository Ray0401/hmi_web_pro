<template>
  <Modal>
    <div :class="`continue-dialog ${state.submit && 'contiune-none'}`">
      <div class="wrapper">
        <div class="title">即将进行自动驾驶接续，请确认作业状态</div>
        <div class="content">
          <div class="row position">
            <span class="label">当前位置</span>
            <span class="value">{{ workArea }}</span>
          </div>
          <div class="row status">
            <span class="label">作业状态</span>
            <div class="value">
              <radio-dialog
                class="radio"
                :radio-list="state.statusList[workArea] || []"
                :value.sync="state.status"
                @radiochange="changeRadio"
              />
            </div>
          </div>
        </div>
        <div class="footer">
          <button-dialog type="orange" class="confirm" @click="handleConfirm">{{ toLang('confirm') }}</button-dialog>
          <button-dialog type="grey" class="cancel" @click="handleCancel">{{ toLang('cancel') }}</button-dialog>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup>
  import { reactive, onMounted } from 'vue';
  import Modal from '@/components/components/modal.vue';
  import { sendSocket } from '@/utils/utils';

  const props = defineProps({
    workArea: {
      type: String,
      default: '',
    },
  });

  const state = reactive({
    statusList: {
      道路行驶区: [
        {
          label: '去装载',
          value: '去装载',
        },
        {
          label: '去卸料',
          value: '去卸料',
        },
      ],
      装载区: [
        {
          label: '待停靠',
          value: '待停靠',
        },
        {
          label: '可开装',
          value: '可开装',
        },
        {
          label: '要驶离',
          value: '要驶离',
        },
      ],
      卸载区: [
        {
          label: '待卸载',
          value: '待卸载',
        },
        {
          label: '要驶离',
          value: '要驶离',
        },
      ],
    },
    status: '待停靠',
    submit: false,
  });
  state.status = state.statusList[props.workArea][0].value;
  const $emit = defineEmits(['close', 'submit']);

  const changeRadio = value => {
    state.status = value;
  };

  const handleConfirm = () => {
    sendSocket({
      type: 'confirmContinue',
      data: {
        position: props.workArea,
        status: state.status,
      },
    });
    state.submit = true;
    $emit('submit');
  };

  const handleCancel = () => {
    $emit('close');
  };
</script>

<style scoped lang="scss">
  .continue-dialog {
    // background-image: url('../../assets/images/messagebg.png');
    border: 0px solid;
    border-image-source: url('../../assets/images/messagebg.png');
    border-image-slice: 40 10 60 20 fill;
    border-image-width: 25px 10px;
    border-image-repeat: stretch;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 99;
    transform: translate(-50%, -50%);
    margin: auto;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 480px;
    height: 320px;
    display: flex;
    flex-direction: column;

    .wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 40px 25px;
      box-sizing: border-box;

      .title {
        color: #fff;
        font-size: 24px;
        white-space: nowrap;
      }

      .content {
        flex: 1;
        padding: 33px 0 0 25px;
        box-sizing: border-box;

        .label {
          font-size: 20px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          color: #70a7b3;
          margin-right: 20px;
        }

        .row {
          display: flex;
          align-items: center;
          font-size: 20px;
          font-family: PingFang SC, PingFang SC-Regular;
          font-weight: 400;
          color: #f2f2f2;

          &.position {
            margin-bottom: 30px;
          }

          &.status {
            ::v-deep .radio-span {
              margin-bottom: 0;
              width: 90px;
              padding: 0;
              line-height: 40px;
              height: 40px;
              cursor: pointer;
              &:not(:last-child) {
                margin-right: 10px;
              }
            }
          }
        }
      }

      .footer {
        display: flex;
        justify-content: center;

        .confirm {
          margin-right: 20px;
        }
      }
    }
  }
  .contiune-none {
    opacity: 0.5;
    pointer-events: none;
  }
</style>
