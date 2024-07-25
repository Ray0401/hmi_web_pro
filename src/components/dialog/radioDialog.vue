<!-- 组件说明：
props：
 radioList——单选列表 
 radioList:[{
	  label:'',
	 value:''
 }],
 value:单选按钮默认值
 $emit：
 radiochange 切换单选按钮之后的值-->
<template>
  <div class="radio-btn">
    <span
      v-for="item in radioList"
      :key="item[values]"
      class="radio-span"
      :class="{ 'radio-span-active': value === item[values] }"
      @click="updateValue(item[values])"
    >
      {{ toLang(item[label]) }}
    </span>
  </div>
</template>

<script>
  export default {
    name: 'radioDialog',
    props: {
      radioList: Array,
      value: [String, Number],
      //支持自定义label,values名称
      label: {
        type: String,
        default: 'label',
      },
      values: {
        type: String,
        default: 'value',
      },
    },
    mounted() {
      console.log('单选框组件渲染', this.label, this.values);
    },
    methods: {
      // 改变value的值
      updateValue(val) {
        this.$emit('radiochange', val);
      },
    },
  };
</script>

<style scoped>
  /*按钮组的布局*/
  .radio-btn {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 100%;
  }

  /*按钮的文字大小样式*/
  .radio-span {
    width: 100px;
    text-align: center;
    margin-bottom: 15px;
    color: rgba(242, 242, 242, 1);
    border: rgba(69, 85, 106, 1) solid 1px;
    padding: 8px 0;
    font-size: 16px;
    background-color: rgba(0, 0, 0, 0);
    white-space: nowrap;
    /* margin-right: 5px; */
  }

  /*按钮选中样式*/
  .radio-span-active {
    cursor: pointer;
    color: #f2f2f2;
    background-color: rgba(255, 91, 0, 0.2);
    border: 1px solid rgba(255, 91, 0, 1);
  }
</style>
