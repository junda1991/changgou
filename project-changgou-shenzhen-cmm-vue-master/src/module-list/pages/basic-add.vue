<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="box">
        <div class="main">
          <div class="activePublic">
            <el-steps :space="200" :active="step" finish-status="success">
              <el-step icon="none" class="iconStep1" style="flex-basis: 33%">
                <div slot="title">
                  <!-- <h2>第1步</h2> -->
                  <p>选择商品分类</p>
                  <span class="stepImg">
                    <img src="../../assets/stepN.jpg" />
                  </span>
                </div>
              </el-step>

              <el-step icon="none" class="iconStep2" style="flex-basis: 33%">
                <div slot="title">
                  <!-- <h2>第2步</h2> -->
                  <p>填写商品信息</p>
                  <span class="stepImg">
                    <img src="../../assets/stepN.jpg" />
                  </span>
                </div>
              </el-step>
              <el-step icon="none" class="iconStep3" style="flex-basis: 33%">
                <div slot="title">
                  <!-- <h2>第3步</h2> -->
                  <p>填写商品属性</p>
                </div>
              </el-step>
            </el-steps>
            <!-- 第一步 选择商品分类-->
            <div class="basicInfo" v-show="commodityType">
              <h3 class="goodTit">
                <i></i>选择分类
              </h3>
              <template>
                <div>
                  <el-form>
                    <el-form-item class="tranfList">
                      <!-- 一级分类 -->
                      <transf-item
                        :title-id="0"
                        v-if="handleclassType.length>0"
                        :districtList="classaData"
                        @check-district="handleclassType"
                        ref="oneType"
                      ></transf-item>
                      <span class="tranicon"></span>
                      <!-- 二级分类 -->
                      <transf-item
                        :title-id="1"
                        v-show="twoShow"
                        ref="twoType"
                        :districtList="twoData"
                        @check-district="handleTwoType"
                      ></transf-item>
                      <span class="tranicon traniconR" v-show="twoShow"></span>
                      <!-- 三级分类 -->
                      <transf-item
                        :title-id="2"
                        v-show="threeShow"
                        ref="threeType"
                        :districtList="threeData"
                        @check-district="handleThreeType"
                      ></transf-item>
                    </el-form-item>
                    <div
                      class="seleInfo"
                    >您当前选择的商品类别是：{{conInfo.firstInfo.name}}{{conInfo.twoInfo.name}}{{conInfo.threeInfo.name}}</div>
                  </el-form>
                </div>
              </template>
            </div>
            <!-- end -->
            <!-- 第二步 选择商品信息-->
            <div class="basicInfo" v-show="commodityInfo">
              <commod-Info
                :goods="goods"
                :rules="rules"
                :conInfo="conInfo"
                v-on:handleEdit="handleEdit"
                @message="receiveInitall"
                @handTemplate="handTemplate"
                ref="commodityInfo"
              ></commod-Info>
            </div>
            <!-- end -->
            <!-- 第三步 选择商品属性-->
            <div class="basicInfo" v-show="commodityAttr">
              <commod-Attr
                :goods="goods"
                :rules="rules"
                :conInfo="conInfo"
                :spuImageList='spuImageList'
                v-on:handleEdit="handleEdit"
                :templateData="templateData"
                ref="commodityAttr"
              ></commod-Attr>
            </div>
            <!-- end -->
            <div class="but-group butBox">
              <el-button
                @click.native.prevent="handleNextStep"
                type="primary"
                v-if="step==0"
              >下一步，填写商品信息</el-button>
              <el-button
                @click.native.prevent="handlePreStep"
                class="el-button-pre"
                v-if="step==1"
              >上一步，填写商品分类</el-button>
              <el-button
                @click.native.prevent="handleNextStep"
                type="primary"
                v-if="step==1"
              >下一步，填写商品属性</el-button>
              <el-button
                @click.native.prevent="handlePreStep"
                class="el-button-pre"
                v-if="step==2"
              >上一步，填写商品信息</el-button>
              <el-button @click.native.prevent="handleNextStep" type="primary" v-if="step==2">提交审核</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  category,
  categoryId,
  parameter,
  commoditySpec,
  save,
  detail,
  savemodify
} from "@/api/base/commodity";
import transfItem from "./../components/select";
import commodInfo from "./../components/commodInfo";
import commodAttr from "./../components/commodAttr";
import { unique1 } from "@/utils/index";
export default {
  name: "basic-list",
  components: {
    transfItem,
    commodInfo,
    commodAttr
  },
  data() {
    return {
      active: 0,
      actives: "1",
      activeData: [],
      preStep: false,
      nextStep: true,
      step: 0,
      commodityType: true,
      commodityInfo: false,
      commodityAttr: false,
      preInfo: "",
      nextInfo: "下一步，填写商品信息",
      titInfo: "选择商品分类",
      // 第一步
      flag: false, // 分仓对应的省id变量的监听器的锁，第一次触发不执行，数据还未初始化
      classaData: [], // 一级级数据
      twoData: [], // 二级数据
      threeData: [], // 区级数据
      twoShow: false,
      threeShow: false,
      conInfo: {
        firstInfo: {
          name: "",
          id: ""
        },
        twoInfo: {
          name: "",
          id: ""
        },
        threeInfo: {
          name: "",
          id: ""
        },
        paraItems: [],
        nameInfo: "",
        properties: [],
        proper: [],
        goodsImages: [],
        skus: [],
        commodityId: "",
        content: "请填写信息",
        photoList: [],
        specItems: [],
        aciveIndex:-1
      },

      stepTip: null,
      // 第二步

      rules: {
        //表单验证
        name: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        caption: [{ required: true, message: "请输入副标题", trigger: "blur" }],
        brandId: [{ required: true, message: "请选择品牌", trigger: "change" }],
        freightId: [
          { required: true, message: "请选择模板", trigger: "change" }
        ],
        introduction: [
          { required: true, message: "请输入介绍信息", trigger: "blur" }
        ],
        sn: [{ required: true, message: "请输入货号", trigger: "blur" }]
      },

      // 第三步
      spec: "",
      ishow: null,
      addName: "",

      // skus: skus,
      checked: true,
      disabled: false,
      vals: [],
      upVisible: false,
      photoInfo: {
        select: 1
      },
      upPhotoData: [],
      selectVisible: false,
      imageItems: [],
      imageList: [],
      photoItems: [],
      // imagesLength: [],
      value8: "",
      total: null,
      requestParameters: {
        page: 1,
        size: 10
      },
      attachments: [],
      // paraItems:[],
      paraOption: null,
      // content: '请填写信息',
      editorOption: {
        theme: "snow"
      },
      goods: {
        spu: {
          name: "", // 名称
          caption: "", // 副标题
          brandId: "", // 品牌ID
          category1Id: "", // 一级分类
          category2Id: "", // 二级分类
          category3Id: "", // 三级分类
          introduction: "", // 商品介绍
          freightId: "", // 运费模板
          saleService: [], //售后服务
          sn: "", //货号
          specItems: []
        },
        skuList: []
      },
      imagesList: [],
      imageData: [],
      parname: [],
      selectNum: "",
      imagesD: [],
      imageObj: {},
      spuImages: [],
      photoInfoInfo: "设为主图",
      linkId: "",
      // tableDate:[],
      templateData: [],
      spuImageList: [],
      specItemsData: [],
      specNum: "",
      stiems: [],
      songs: [
        { name: "羽根", artist: "air" },
        { name: "羽根", artist: "air" },
        { name: "晴天", artist: "周杰伦" },
        { name: "晴天", artist: "周杰伦" },
        { artist: "周杰伦", name: "晴天" }
      ]
    };
  },
  methods: {
    // 业务方法
    // 商品参数
    paraList(id) {
      parameter({'id':id}).then(res => {
        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].options = res.data.data[i].options.split(",");
        }
        this.conInfo.paraItems = res.data.data;

        if (this.conInfo.commodityId !== undefined) {
          var obj = {};
          obj = JSON.parse(this.goods.spu.paraItems);
          // console.log(obj)
          for (let i in obj) {
            for (var n in this.conInfo.paraItems) {
              if (i == this.conInfo.paraItems[n].name) {
                this.conInfo.paraItems[n].parameterInfo = obj[i];
              }
            }
          }
        }
      });
    },
    handlePreStep() {
      this.step--;
      this.goStep(this.step);
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },

    // UI方法
    // 下一步按钮
    handleNextStep(e) {
      if (
        this.conInfo.firstInfo.name !== "" &&
        this.conInfo.twoInfo.name !== "" &&
        this.conInfo.threeInfo.name !== ""
      ) {
        var _this = this;
        setTimeout(function() {
          _this.step++;
          // console.log(_this.step)
          _this.goStep(_this.step);
        });
      } else {
        this.$message({
          showClose: true,
          message: "请选择分类",
          type: "error"
        });
      }
      document.body.scrollTop = document.documentElement.scrollTop = 0;
    },
    goStep(n, formName) {
      // console.log(n)
      switch (n) {
        case 0:
          this.preStep = false;
          this.nextStep = true;
          this.commodityType = true;
          this.commodityInfo = false;
          this.commodityAttr = false;
          this.nextInfo = "下一步，填写商品信息";
          break;

        case 1:
          this.preStep = true;
          this.nextStep = true;
          this.commodityType = false;
          this.commodityInfo = true;
          this.commodityAttr = false;
          this.preInfo = "上一步，填写商品分类";
          this.nextInfo = "下一步，填写商品属性";

          // this.$refs.commodityInfo.getBrandData();
          // this.$refs.commodityInfo.getTemplateData();
          // this.paraList(); //商品参数
          // this.getPhoto() //获取商品相册

          break;
        case 2:
          this.$refs.commodityInfo.$refs.ruleForm.validate(valid => {
            console.log(valid)
            if (valid) {
              var _this = this;
              this.preStep = true;
              this.nextStep = true;
              this.preInfo = "上一步，填写商品信息";
              this.nextInfo = "提交审核";
              this.titInfo = "下一步，填写商品属性";
              this.commodityType = false;
              this.commodityInfo = false;
              this.commodityAttr = true;
              this.conInfo.nameInfo = this.goods.spu.name;
              

              if (this.conInfo.commodityId !== undefined) {
                var data = [];
                var obj = {};
                // 规格默认列表
                // 筛选出要显示的规格
                for (var i = 0; i < this.goods.skuList.length; i++) {
                  this.goods.skuList[i].spec = JSON.parse(
                    this.goods.skuList[i].spec
                  );

                  data.push(this.goods.skuList[i].spec);
                }

                // 加键值对
                for (var k = 0; k < data.length; k++) {
                  for (var i in data[k]) {
                    for (var n = 0; n < this.conInfo.properties.length; n++) {
                      if (i == this.conInfo.properties[n].name) {
                        obj = {
                          Id: k,
                          PropertyId: this.conInfo.properties[n].id,
                          PropertyName: this.conInfo.properties[n].name,
                          name: data[k][i]
                        };

                        this.conInfo.properties[n].selectedValues.push(obj);
                      }
                    }
                  }
                }
                //
                var proper = this.conInfo.properties;
                proper.forEach(obj => {
                  obj.selectedValues = _this.dupRepeat(obj.selectedValues);
                  for (var z = 0; z < obj.selectedValues.length; z++) {
                    obj.options.forEach((item, index) => {
                      if (obj.selectedValues[z].name === item.name) {
                        obj.selectedValues[z].Id = item.Id;
                      }
                    });
                  }
                });
                this.conInfo.properties = proper;
              }
            } else {
              // this.stepTip=false
              this.step=0
              this.step=1
              return false;
            }
          });
          break;
        case 3:
          this.preStep = true;
          this.nextStep = true;
          this.preInfo = "上一步，填写商品信息";
          this.nextInfo = "提交审核";
          this.titInfo = "下一步，填写商品属性";
          // 获取spu图片
          var obj = [];
          var data = {};
          var imgsdata = this.$refs.commodityAttr.conInfo.photoList;
          for (var n = 0; n < imgsdata.length; n++) {
            this.spuImageList.push(imgsdata[n].url);
          }
          if (this.goods.spu.image === undefined) {
            this.goods.spu.image = this.spuImageList[0];
          }
          this.$refs.commodityAttr.handleAdd();

          // 处理服务保证
          this.goods.spu.saleService = this.goods.spu.saleService.join(",");
          // this.goods.spu.id=new Date().getTime()
          // 处理详情描述
          this.goods.spu.introduction = this.$refs.commodityAttr.$refs.myQuillEditor.quill.container.firstChild.innerHTML;
          console.log(this.goods);
          // // 判断是否编辑
          if (this.conInfo.commodityId !== undefined) {
            this.goods.id = this.conInfo.commodityId;
            savemodify(this.goods).then(response => {
              this.$router.push(`/commodity/list`);
            });
          } else {
            save(this.goods).then(response => {
              this.$router.push(`/commodity/list`);
            });
          }
          
          break;
      }
    },
    //**********************第一步**********************
    // 获取列表详情
    getDetails() {
      var _this = this;
      var imgobj = {};
      var imgdata = [];
      if (this.conInfo.commodityId !== undefined) {
        detail({ id: this.conInfo.commodityId }).then(res => {
          var responseData=res.data.data
          this.goods.spu = responseData.spu;
          this.goods.skuList = responseData.skuList;
          this.conInfo.skus = responseData.skuList;
           this.tableDate=res.data.data.skuList
          this.conInfo.content = this.goods.spu.caption;
          if (responseData.spu.saleService !== null) {
            this.goods.spu.saleService = responseData.spu.saleService.split(
              ","
            );
          }
          // 处理商品相册数据
          if(responseData.spu.images!==null){
            var goodsImages = this.goods.spu.images.split(",");
              goodsImages.forEach((item,index) => {
                if(responseData.spu.image===item){
                    this.aciveIndex=index
                }
                imgobj = {
                  url: item
                };
                imgdata.push(imgobj);
              });

              this.conInfo.photoList = imgdata;
              }
          // 获取参数
          this.getParameterData(responseData.spu.templateId);
          this.specItemsData = responseData.spu.specItems;
          if (
            this.goods.spu.category1Id !== "" ||
            this.goods.spu.category2Id !== "" ||
            this.goods.spu.category3Id !== ""
          ) {
            this.twoShow = true;
            this.threeShow = true;
            var data = [];
            // 获取一级菜单
            category({ id: 0 }).then(res => {
              this.classaData = res.data.data;
              this.activeStyle = true;
              // 当前选择的一级类别
              for (var i = 0; i < this.classaData.length; i++) {
                if (this.goods.spu.category1Id == this.classaData[i].id) {
                  this.$refs.oneType.active=i
                  this.conInfo.firstInfo.name = this.classaData[i].name + ">";
                  data.push(i);
                  this.activeData = data;
                }
              }
            });
            // 获取二级菜单
            category({ id: this.goods.spu.category1Id }).then(res => {
              this.twoData = res.data.data;
              // 当前选择的二级类别

              for (var i = 0; i < this.twoData.length; i++) {
                if (this.goods.spu.category2Id == this.twoData[i].id) {
                  this.$refs.twoType.active=i
                  this.conInfo.twoInfo.name = this.twoData[i].name + ">";
                  data.push(i);
                }
              }
            });
            // 获取三级菜单
            category({ id: this.goods.spu.category2Id }).then(res => {
              this.threeData = res.data.data;
              // 当前选择的三级类别
              for (var i = 0; i < this.threeData.length; i++) {
                if (this.goods.spu.category3Id == this.threeData[i].id) {
                  this.$refs.threeType.active=i
                  this.conInfo.threeInfo.name = this.threeData[i].name;
                  // this.conInfo.threeInfo.id = this.threeData[i].id;
                  this.paraList(this.threeData[i].id)
                  this.$refs.commodityInfo.getBrandData(this.threeData[i].id);
                  data.push(i);
                }
              }
            });
          }
        });
      }
    },
    // 获取数据
    getAll() {
      // 从后台传回经过处理的数据
      this.flag = true; // 数据加载完成，解锁
      this.handleClassA();
    },
    // 获取一级数据
    handleClassA() {
      this.classaData = []; // 首先清空
      category({ id: 0 }).then(res => {
        this.classaData = res.data.data;
        this.preInfo = true;
      });
    },
    // 获取二级数据，子组件自定义的穿梭框传回的数据，val：[区域obj, 区域obj,...]
    handleclassType(val) {
      // console.log(val)
      this.conInfo.firstInfo = {
        name: val.name,
        id: val.id
      };
      this.goods.spu.category1Id = val.id;
      let flag = true;
      if (val !== undefined) {
        category({ id: val.id }).then(res => {
          
          this.twoData = res.data.data;
          if (this.twoData.length > 0) {
            this.twoShow = true;
            this.threeShow = false;
          } else {
            this.twoShow = false;
            this.threeShow = false;
          }
          // 再清空上一次的数据
          this.threeData = [];
          // 将父级对象放进组件
          this.$refs.twoType.father = {
            id: val.id,
            name: val.name
          };
          flag = false;
        });
      }
      // 如果没有匹配到，都显示为空
      if (flag) {
        this.twoData = [];
        this.threeData = [];
      }
    },
    // 获取三级数据，子组件自定义的穿梭框传回的数据，val：[区域obj, 区域obj,...]
    handleTwoType(val) {
      this.conInfo.twoInfo = {
        name: ">" + val.name,
        id: val.id
      };
      this.goods.spu.category2Id = val.id;
      let flag = true;
      if (val !== undefined) {
        category({ id: val.id }).then(res => {
          this.threeData = res.data.data;
          
          if (this.threeData.length > 0) {
            this.threeShow = true;
          } else {
            this.threeShow = false;
          }
          // 获取数据
          let fatherId = this.$refs.twoType.father.id;
          let fatherText = this.$refs.twoType.father.name;
          this.$refs.threeType.father = {
            id: fatherId + "-" + val.id,
            name: fatherText + "-" + val.name
          };
          flag = false;
        });
      }
      // 区级没有匹配到，显示为空
      if (flag) {
        this.threeData = [];
      }
    },
    // 获取三级数据
    handleThreeType(val) {
      this.conInfo.threeInfo = {
        name: ">" + val.name,
        id: val.id
      };
      this.goods.spu.category3Id = val.id;
      this.paraList(val.id)
      this.$refs.commodityInfo.getBrandData(val.id);
      this.getParameterData(val.templateId);
      this.goods.spu.freightId = val.id;
    },
    receiveInitall(res) {
      this.templateData = res;
    },

    handTemplate(id, num) {
      // this.getParameterData(id, num);
    },
    //**********************第二步**********************
    handleEdit() {
      this.step--;
      this.goStep(this.step);
    },
    // 商品规格
    getParameterData(id) {
      // this.specNum = num;
      commoditySpec({ templateId: id})
        .then(res => {
          for (var i = 0; i < res.data.data.length; i++) {
            this.$set(res.data.data[i], "selectedValues", []);
            this.$set(res.data.data[i], "spec", {});
            res.data.data[i].options = res.data.data[i].options.split(",");
            var values = [];
            for (var k = 0; k < res.data.data[i].options.length; k++) {
              var datas = {
                PropertyId: res.data.data[i].id,
                PropertyName: res.data.data[i].name,
                name: res.data.data[i].options[k],
                Id: k
              };
              values.push(datas);
            }

            res.data.data[i].options = values;
          }

          this.conInfo.properties = res.data.data;
          // this.goods.spu.specItems=JSON.stringify(data)    //数据类型
          this.conInfo.proper = res.data.data;
        })
        .catch(err => {
          this.$message.error("获取信息失败");
        });
    },
    dupRepeat(songs) {
      let result = {};
      let finalResult = [];
      for (let i = 0; i < songs.length; i++) {
        result[songs[i].name] = songs[i]; //因为songs[i].name不能重复,达到去重效果,且这里必须知晓"name"或是其他键名
      }
      // console.log(result)//现在result内部都是不重复的对象了，只需要将其键值取出来转为数组即可
      for (var ta in result) {
        finalResult.push(result[ta]);
      }

      return finalResult;
    }
  },
  created() {
    var _this = this;
    this.conInfo.commodityId = this.$route.query.id;
    this.getAll();
    this.getDetails();
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
</style>
