<style lang="scss" scoped>
  #map-scene {
    position: absolute;
    z-index: 0;
  }
  .zoom-box {
    width: 60px;
    position: absolute;
    right: 15px;
    bottom: 141px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    .position {
      width: 60px;
      height: 60px;
      margin-bottom: 10px;
    }
    .mode {
      width: 60px;
      height: 60px;
      margin-bottom: 10px;
    }
    .line {
      width: 100%;
      height: 4px;
      background: #404b51;
    }
    .img {
      width: 60px;
      height: 60px;
    }
    .v2v-show,
    .v2v-hide {
      margin-bottom: 10px;
    }
  }
</style>
<template>
  <div class="">
    <div class="scene" id="map-scene"></div>
    <div class="zoom-box">
      <img
        v-if="v2vWarningShow"
        src="../../assets/images/v2vShow.png"
        class="img v2v-show"
        @click="changeStatus(false)"
      />
      <img v-else src="../../assets/images/v2vHide.png" class="img v2v-hide" @click="changeStatus(true)" />

      <img src="../../assets/images/position.png" class="position" @click="setPosition" />
      <img :src="navigationImg" class="mode" @click="setMode" />
      <img class="img" @click="add" src="../../assets/images/amplification.png" />
      <div class="line"></div>
      <img class="img" @click="reduce" src="../../assets/images/zoom.png" />
    </div>
  </div>
</template>

<script>
  import Base3d from '@/utils/base3d/index';
  import mapApi from '@/api/map';
  import { SCENE_SOCKET_MESSAGE } from './socketMessage';
  import { MINE_CARD, ADOPT, SOIL } from '@/constant/index';
  import { getAssetsFile, sendMsgToBackend } from '@/utils/utils';
  let _base3d;

  export default {
    props: ['collectList', 'collectFileListPoint'],
    data() {
      return {
        // base3d: {},
        mode: 0, //0 三人称 1 一人称
        excavatorType: [],
        pointList: [],
        MINE_CARD: MINE_CARD,
      };
    },
    computed: {
      navigationImg() {
        return this.mode == 0 ? getAssetsFile('images/navigation.png') : getAssetsFile('images/navigationClick.png');
      },
      vehicleData() {
        // console.log('this.$store.state.vehicleData', this.$store.state.vehicleData.terminalType);
        return this.$store.state.vehicleData;
      },
      collectConfig() {
        return this.$store.state.bulldozer.collectConfig;
      },

      v2vWarningShow() {
        return this.$store.state.v2vWarningShow;
      },

      pointItem() {
        return this.$store.state.excavator.pointItem;
      },
    },
    created() {
      let sceneMessage = SCENE_SOCKET_MESSAGE(this);
      this.$bus.$on('websocketMessage', data => {
        if (sceneMessage[data.type]) return sceneMessage[data.type](data);
      });

      this.$bus.$on('setPointType', data => (this.excavatorType = data || []));
      this.$bus.$on('MapcuReview', () => {
        this.getMapcuReview();
      });
      this.$bus.$on('maptaskInfo1', () => this.mapTaskInfo('ADOPT'));
      this.$bus.$on('maptaskInfo', () => this.mapTaskInfo());
      this.$bus.$on('deleteSensorCollect', () => {
        _base3d.setLanes([], 'reviewSensorCollectLeft');
        _base3d.setLanes([], 'reviewSensorCollectRight');
      });
      // 展示预览数据
      this.$bus.$on('showPreviewData', () => {
        this.loadAreaPreviewData();
      });
    },
    mounted() {
      localStorage.removeItem('workareaTaskInfo');
      this.getData();
      _base3d = new Base3d('#map-scene');
      _base3d.setAroundCar([]);
    },
    methods: {
      changeStatus(value) {
        this.$store.commit('setV2VWarningShow', value);
        this.$bus.$emit('updateV2VWarningShow', value);
      },
      setPosition() {
        this.$bus.$emit('setPosition');
      },
      setMode() {
        let mode = this.mode == 0 ? 1 : 0;
        this.mode = mode;
        this.$bus.$emit('setMode', { data: mode });
      },
      add() {
        _base3d.setCamera2Y(-100);
      },
      reduce() {
        _base3d.setCamera2Y(100);
      },
      getData() {
        this.$nextTick(() => {
          this.getStaticMapData(true);
          this.stringline();
          this.getElectricFence();
          // this.roadTask();
          if ([MINE_CARD].includes(this.vehicleData.terminalType)) this.mapTaskInfo();
        });
      },

      // 静态地图的全量/增量更新
      getStaticMapData(bool) {
        if (this.vehicleData.terminalType === ADOPT) {
          this.roadLane(bool);
          this.boundary();
          this.rgnLoad();
          return;
        }

        this.roadLane(bool);
        this.roadCenter();
        this.roadBoundary();
        this.rgnUnload();
        this.rgnLoad();
        this.rgnJunction();
        this.roadIsolation();
        this.rgnAuxiliary();
      },

      // 获取装载区预览数据
      async loadAreaPreviewData() {
        const res = (await mapApi.getPreviewData()) || {};
        res.data && _base3d.setBoudarys([{ gps_list: res.data }], 'previewLoadArea');
      },

      // 车道路径
      async roadLane(bool) {
        const res = (await mapApi.getMapInfoLane()) ?? [];
        res?.data && _base3d.setLanes(res.data, 'mapline');
        // 只有第一次绘制模型
        if (bool) {
          _base3d.setPerspectiveCamera();
          _base3d.loadCar2(this.vehicleData.vehicleNo);
        }
      },
      // 车道封闭区域
      async roadBoundary() {
        const res = (await mapApi.getMapInfoRoadBoundary()) || [];
        res?.data && _base3d.setRoads(res.data);

        this.boundary();
      },
      // 车道中心线
      async roadCenter() {
        const res = (await mapApi.getMapInfoRoadCenterline()) || [];
        res?.data && _base3d.setLanes(res.data, 'RoadCenter');
      },
      // 卸载区数据
      async rgnUnload() {
        const res = (await mapApi.getMapInfoRgnUnload()) || [];
        res?.data && _base3d.setBoudarys(res.data, 'unloadArea');
      },
      // 装载区数据
      async rgnLoad() {
        _base3d.setBoudarys([], 'previewLoadArea');
        const res = (await mapApi.getMapInfoRgnLoad()) || [];
        // 电铲需显示区域名称
        if (this.vehicleData.terminalType == ADOPT) this.$bus.$emit('rgnLoadData', res.data);
        if (res?.data) {
          _base3d.setBoudarys(res.data, 'loadArea');
          // _base3d.setLanes(res.data, 'loadAreaLine');
        }
      },
      // 辅助作业区
      async rgnAuxiliary() {
        const res = (await mapApi.getMapInfoRgnAuxiliary()) || [];
        res?.data && _base3d.setBoudarys(res.data, 'auxiliaryArea');
      },
      // 路口数据
      async rgnJunction() {
        const res = (await mapApi.getMapInfoJunction()) || [];
        res?.data && _base3d.setBoudarys(res.data, 'junctionArea');
      },
      // 隔离带数据
      async roadIsolation() {
        const res = (await mapApi.getMapInfoRoadIsolation()) || [];
        res?.data && _base3d.setBoudarys(res.data, 'isolationArea');
      },
      // 边界数据
      async boundary(bool) {
        if (![ADOPT, SOIL].includes(this.vehicleData.terminalType)) return;
        const res = (await mapApi.getBoundaryMapInfo()) || {};
        if (this.vehicleData.terminalType == SOIL) _base3d.setWorkGroups(res.group_list); //推土机终端中的停靠组(排土块)
        if (res?.dock_point_list?.length) {
          this.pointList = res.dock_point_list || [];
          this.setMapPoint(bool);
        }
        if (res?.boud_list) {
          _base3d.setWorkBouds(res.boud_list);
          this.$emit('boudName', res?.boud_list?.[0].boundary_name);
        }
      },
      // 矿卡任务路径
      async mapTaskInfo(type) {
        if (!type) {
          const res = await mapApi.getMapTaskInfo();
          // 锚点
          res?.lat && _base3d.setPoints({ lat: res.lat, lon: res.lon, heading: res.heading, index: 0 }, 'maodian');
          // 路径
          res?.data && _base3d.setLanes([res.data], this.vehicleData.terminalType == ADOPT ? 'exTaskLane' : 'taskLane');
        } else {
          const res = await mapApi.getMapTaskInfo1();
          // 锚点
          res?.lat && _base3d.setPoints({ lat: res.lat, lon: res.lon, heading: res.heading, index: 1 }, 'maodian');
          // 路径
          res?.data && _base3d.setLanes([res.data], 'exTaskLane1');
        }
      },
      // 作业区内的矿卡任务路径
      async roadTask() {
        if (this.vehicleData.terminalType == MINE_CARD) return;

        const res = (await mapApi.getMapInfoTaskData()) || [];
        const carInDumpPosition = this.$store.state.carInDumpPosition;
        if (!res.data) return;
        const target = res.data.find(
          item => item.type == carInDumpPosition.map_type && item.id == carInDumpPosition.object_id
        );
        if (!target) return;
        let groups = target.data.reduce((result, item) => {
          (result[item[1]] = result[item[1]] || []).push(item);
          return result;
        }, {});

        try {
          // 将所有路径信息保存起来
          // localStorage.setItem('workareaTaskInfo', JSON.stringify(groups));
          _base3d.workareaTaskInfo = groups;
        } catch (e) {
          if (e instanceof DOMException && e.name === 'QuotaExceededError') {
            // 处理存储达到上限的情况
            this.$store.commit('setMessageList', 'LocalStorage存储任务路线达到上限');
            sendMsgToBackend('LocalStorage存储任务路线达到上限');
          } else {
            // 处理其他异常
            console.error('保存采集文件发生错误: ', e);
          }
        }
      },
      // 动态地图全量更新
      async stringline() {
        const res = (await mapApi.getMapInfoStringlineData()) || [];
        _base3d.setLanes(res.data, 'obstaclesLine');
      },
      // 动态地图增量更新
      async addStringline() {
        const res = (await mapApi.getMapInfoAddStringlineData()) || [];
        res?.data && this.$bus.$emit('updateObstaclesLine', res.data, 'add');
      },

      setMapPoint(bool) {
        if (this.vehicleData.terminalType == SOIL) {
          let list = [...this.pointList];
          if (list.length) {
            let obj = {};
            let info = {};
            for (let i = 0; i < list.length; i++) {
              let dock = list[i].dock_group_index;
              let index = obj[dock];
              if (index) {
                list[i].point_name = `DP#${index}`;
                info[list[i].point_index] = `DP#${index}`;
                obj[dock] = ++index;
              } else {
                list[i].point_name = `DP#1`;
                info[list[i].point_index] = `DP#1`;
                obj[dock] = 2;
              }
            }
            this.$bus.$emit('ComparisonTable', info);
          }
          _base3d.setPoints(list); //  推土机终端中的卡车停靠点(排土点)
          return;
        }

        // 8b01结合boundarymapinfo过滤当前停靠组的数据
        let _pointList = this.pointList.filter(point => point.dock_group_index == this.pointItem.group_num) || [];
        // console.log('_pointList', _pointList);
        if (this.excavatorType?.length && _pointList.length) {
          let list = [];
          let list1 = [];
          for (let i = 0; i < _pointList.length; i++) {
            if (this.excavatorType.includes(_pointList[i].point_index) && !list1.includes(_pointList[i].point_index)) {
              list.push(_pointList[i]);
              list1.push(_pointList[i].point_index);
            }
          }
          if (bool) {
            this.$store.commit('setMessageList', '停靠位更新已完成');
            sendMsgToBackend('停靠位更新已完成');
          }
          // console.log('list', list);
          _base3d.setPoints(list);
        }
      },
      getElectricFence() {
        mapApi.getElectricFence().then(res => {
          if (res.data) _base3d.setBoudarys(res.data, 'electricFence');
        });
      },
      getMapcuReview() {
        mapApi.getMapcuReview().then(res => {
          let data = {
            left_list: res.left_boundary || [],
            right_list: res.right_boundary || [],
          };
          if (data.left_list) _base3d.setLanes([data.left_list], 'reviewSensorCollectLeft');
          if (data.right_list) _base3d.setLanes([data.right_list], 'reviewSensorCollectRight');
        });
      },
      collectFun(val) {
        const obj = {
          roadBoundary: 'boundary',
          loadBoundary: 'boundary',
          unloadBoundary: 'boundary',
          obstacleBoundary: 'obstacle',
          soil: 'soil',
        };
        const laneType = obj[this.collectConfig.type] || 'bulldozerCollect';
        if (laneType == 'obstacle') {
          let target = [];
          let temp = [];
          val.forEach((item, index) => {
            const isEmpty = Object.keys(item).length == 0;
            if (isEmpty) {
              temp.length && target.push(temp);
              temp = [];
            } else {
              temp.push(item);

              if (index == val.length - 1) {
                temp.length && target.push(temp);
                temp = [];
              }
            }
          });

          if (target.length) {
            target.forEach((item, index) => {
              // last 确认为最后一个
              _base3d.setLanes(
                [{ lane_name: `obstacle_${index}`, list: item, last: index == target.length - 1 }],
                laneType
              );
            });
          } else {
            _base3d.setLanes([{ lane_name: '', list: val }], 'bulldozerCollect');
          }
        } else {
          _base3d.setLanes([{ lane_name: '', list: val }], laneType);
        }
      },
    },
    watch: {
      collectList: {
        handler: function (val) {
          _base3d.setLanes([{ lane_name: '', list: val }], 'collect');
        },
        deep: true,
      },
      collectFileListPoint: {
        handler: function (val) {
          this.collectFun(val);
        },
        deep: true,
      },
      excavatorType: {
        handler: function (val, oldval) {
          if (JSON.stringify(val) != JSON.stringify(oldval)) {
            let _val = val
              .filter(
                item => item !== undefined && item != this.pointItem.stop_num && item != this.pointItem.child_stop_num
              )
              .map(item => `point_${item}`);
            _base3d.collisionDetectionList = _val;
            setTimeout(() => {
              this.setMapPoint();
            }, 100);
          }
        },
        deep: true,
      },
      pointItem: {
        handler: function (val) {
          let _val = this.excavatorType
            .filter(item => item !== undefined && item != val.stop_num && item != val.child_stop_num)
            .map(item => `point_${item}`);
          _base3d.collisionDetectionList = _val;
        },
        deep: true,
      },
    },
    destroyed() {
      // this.$bus.$off('websocketMessage');
    },
  };
</script>
