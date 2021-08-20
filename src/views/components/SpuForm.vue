<template>
  <div>
    <el-form :model="spuForm">
      <el-form-item label="SPU名稱" label-width="100px">
        <el-input v-model="spuForm.spuName" placeholder="SPU名稱" />
      </el-form-item>
      <el-form-item label="品牌" label-width="100px">
        <el-select v-model="spuForm.tmId" placeholder="請選擇品牌">
          <el-option
            v-for="(tm,index) in trademarkList"
            :key="tm.id"
            :label="tm.tmName"
            :value="tm.id"
          />
        </el-select>
      </el-form-item>

      <!-- element-ui裡面沒有textarea，是使用input去做 -->
      <el-form-item label="SPU描述" label-width="100px">
        <el-input
          v-model="spuForm.description"
          placeholder="SPU描述"
          type="textarea"
          rows="4"
        />
      </el-form-item>

      <!-- :file-list="fileList" 指定圖片展示哪個數組-->

      <el-form-item label="SPU圖片" label-width="100px">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="handlePictureSuccess"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>

      <el-form-item label="銷售屬性" label-width="100px">
        <el-select
          v-model="unUseSaleAttrIdName "
          :placeholder="unUseSaleAttrList.length> 0
            ? `還有${unUseSaleAttrList.length}個銷售屬性未選擇`
            :'無銷售屬性可選'"
        >
          <el-option
            v-for="(unUseSaleAttr, index) in unUseSaleAttrList"
            :key="unUseSaleAttr.id"
            :label="unUseSaleAttr.name"
            :value="`${unUseSaleAttr.id}:${unUseSaleAttr.name}`"
          />
        </el-select>
        <el-button
          type="primary"
          iocn="el-icon-plus"
          :disabled="!unUseSaleAttrIdName"
          @click="addSaleAttr"
        >新增銷售屬性</el-button>
        <el-table
          border
          style="width: 100%"
          :data="spuForm.spuSaleAttrList"
        >
          <el-table-column
            type="index"
            align="center"
            label="序號"
            width="80"
          />
          <el-table-column
            prop="saleAttrName"
            label="屬性名"
            width="150"
          />
          <el-table-column
            prop="prop"
            label="屬性值名稱列表"
            width="width"
          >

            <!--    @close="handleClose(tag)" 點擊X的回調-->
            <template slot-scope="{row,$index}">
              <el-tag
                v-for="(saleAttrValue, index) in row.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index,1)"
              >
                {{ saleAttrValue.saleAttrValueName }}
              </el-tag>

              <!--  @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"
                -->
              <!--
                  v-model="row.inputValue"
                inputValue必須是輸入了數據，row身上才有這個屬性，
                如果用戶沒有輸入數據，那麼row身上開始是不存在這個屬性的。
              -->
              <el-input
                v-if="row.inputVisible"
                ref="saveTagInput"
                v-model="row.inputValue"
                class="input-new-tag"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              />

              <!--    @click="showInput" -->
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="showInput(row)"
              > + 新增
              </el-button>
            </template>
          </el-table-column>

          <el-table-column
            prop="prop"
            label="操作"
            width="150"
          >
            <template slot-scope="{row,$index}">
              <HintButton
                type="danger"
                icon="el-icon-delete"
                title="刪除銷售屬性"
                @click="spuForm.spuSaleAttrList.splice($index,1)"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item label-width="100px">
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SpuForm',
  props: ['visible'],
  data() {
    return {
      // 和upload相關的動態數據
      dialogImageUrl: '',
      dialogVisible: false,

      category3Id: '',

      // 請求初始化的spu詳情數據，這個spuForm也是後面添加要收集的對象，
      // 內部和修改請求回來的數據結構是一樣的
      spuForm: {
        category3Id: '',
        description: '',
        // id: 0,
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: 'string',
          //   imgUrl: 'string',
          //   spuId: 0
          // }
        ],
        spuName: '',
        spuSaleAttrList: [
          // {
          //   baseSaleAttrId: 0,
          //   id: 0,
          //   saleAttrName: 'string',
          //   spuId: 0,
          //   spuSaleAttrValueList: [
          //     {
          //       baseSaleAttrId: 0,
          //       id: 0,
          //       isChecked: 'string',
          //       saleAttrName: 'string',
          //       saleAttrValueName: 'string',
          //       spuId: 0
          //     }
          //   ]
          // }
        ],
        tmid: ''
      }, // 這個spuForm我們內部初始化屬性都是空的，為了添加spu的時候收集數據用

      // 修改spu的時候，這個spuForm就會被賦值為請求回來有數據的對象
      // spuForm: {
      //   category3Id: 61,
      //   description: 'Apple iPhone 12',
      //   id: 3,
      //   spuImageList: null,
      //   spuName: 'Apple iPhone 12',
      //   spuSaleAttrList: Array[2],
      //   tmId: 2
      // },

      spuImageList: [], // 請求初始化的spu圖片列表
      trademarkList: [], // 請求初始化的所有品牌列表
      saleAttrList: [], // 請求初始化的所有銷售屬性列表

      unUseSaleAttrIdName: '' // 收集選擇未使用的銷售屬性id和name
    }
  },

  computed: {
  // 根據請求獲取所有的銷售屬性列表saleAttrList和spu詳情當中自己的銷售屬性列表spuForm.spuSaleAttrList，計算得到未選擇的銷售屬性列表
    unUseSaleAttrList() {
    // 從所有的銷售屬性列表當中過濾，不再spu自己的銷售屬性列表當中的，所有銷售屬性
      // return this.saleAttrList.filter(saleAttr => {
      //   return this.spuForm.spuSaleAttrList.every(spuSaleAttr => {
      //     return spuSaleAttr.saleAttrName !== saleAttr.name
      //   })
      return this.saleAttrList.filter(saleAttr =>
        this.spuForm.spuSaleAttrList.every(spuSaleAttr =>
          spuSaleAttr.saleAttrName !== saleAttr.name
        )
      )
    }
  },

  methods: {
    // 和upload相關的回調函數，對應刪除圖片成功後的回調，就是圖片的垃圾桶
    handleRemove(file, fileList) {
      // 刪除圖片的時候我們需要收集新的圖片列表
      // console.log(file, fileList)
      this.spuImageList = fileList
    },

    // 上傳成功的回調
    handlePictureSuccess(res, file, fileList) {
      // 上傳成功也得把圖片收集起來
      console.log(file, fileList)
      this.spuImageList = fileList
    },

    // 預覽大圖，複製下來已經寫好，不用改
    // 對應的是圖片的放大鏡
    handlePictureCardPreview(file) {
      // 把需要放大的圖片src賦值到對話框當中的圖片
      this.dialogImageUrl = file.url
      // 彈出放大圖片的對話框
      this.dialogVisible = true
    },

    // 請求獲取修改spu的初始化數據
    // spu就是父組件傳過來的row
    async  getUpdateInitData(spu, category3Id) {
      this.category3Id = category3Id
      // 發4個請求
      // 根據spu的id獲取spu的詳情
      // http://localhost:9529/dev-api/admin/product/getSpuById/4
      const result = await this.$API.spu.get(spu.id)
      if (result.code === 200) {
        this.spuForm = result.data
      }

      // 根據spu的id獲取spu的圖片列表
      // http://localhost:9529/dev-api/admin/product/spuImageList/4
      const imageResult = await this.$API.sku.getSpuImageList(spu.id)
      if (imageResult.code === 200) {
        const spuImageList = imageResult.data
        spuImageList.forEach(item => {
          item.name = item.imgName
          item.url = item.imgUrl
        })
        this.spuImageList = spuImageList
      }

      // 獲取所有的品牌列表
      // http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
      const trademarkResult = await this.$API.trademark.getList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }

      // 獲取所有的銷售屬性列表
      // http://localhost:9529/dev-api/admin/product/baseSaleAttrList
      const saleAttrResult = await this.$API.spu.getSaleAttrList()
      if (saleAttrResult.code === 200) {
        this.saleAttrList = saleAttrResult.data
      }
    },

    // 請求獲取添加spu的初始化數據
    async getAddInitData(category3Id) {
      this.category3Id = category3Id

      // 發2個請求
      // 獲取所有的品牌列表
      // http://localhost:9529/dev-api/admin/product/baseTrademark/getTrademarkList
      const trademarkResult = await this.$API.trademark.getList()
      if (trademarkResult.code === 200) {
        this.trademarkList = trademarkResult.data
      }

      // 獲取所有的銷售屬性列表
      // http://localhost:9529/dev-api/admin/product/baseSaleAttrList
      const saleAttrResult = await this.$API.spu.getSaleAttrList()
      if (saleAttrResult.code === 200) {
        this.saleAttrList = saleAttrResult.data
      }
    },

    // 點擊添加銷售屬性
    addSaleAttr() {
      // 點擊按鈕，通過剛才選擇select收集到的數據，獲取收集到的銷售屬性id和name
      const [baseSaleAttrId, saleAttrName] = this.unUseSaleAttrIdName.split(':')

      // 把收集到的數據變成要添加的對象格式
      const obj = {
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: []
      }

      // 把銷售屬性對象添加到spu的銷售屬性列表當中
      this.spuForm.spuSaleAttrList.push(obj)

      // 清空收集的數據
      this.unUseSaleAttrIdName = ''
    },

    // 點擊銷售屬性值列表當中的添加按鈕
    showInput(row) {
      // row.inputVisible = true
      this.$set(row, 'inputVisible', true)

      // 點擊切換input的時候，保證row身上有inputValue屬性，不至於拿到undefined
      this.$set(row, 'inputValue', '')

      // 自動獲取焦點
      this.$nextTick(() => {
        this.$refs.saveTagInput.focus()
      })
    },

    // input失去焦点或者回车之后的回调
    handleInputConfirm(row) {
      // 从当前行也就是当前的这个属性对象身上，把刚才input输入的数据给获取到
      const saleAttrValueName = row.inputValue
      const baseSaleAttrId = row.baseSaleAttrId // 属性的id也得带上

      // 判断这个值是否为空
      if (saleAttrValueName.trim() === '') {
        row.inputValue = ''
        row.inputVisible = false // 想让输入框再变回按钮，添加这行，不要也无所谓
        return
      }

      // 判断这个值不能和已经存在的属性值名称重复
      // 上次在平台属性内部，我们判断重复是需要除去自身
      // 这次不需要，因为这次我们并没有提前添加进去占位
      const isRepeat = row.spuSaleAttrValueList.some(
        item => item.saleAttrValueName === saleAttrValueName
      )
      if (isRepeat) {
        this.$message.info('输入的属性值名称不能重复')
        row.inputValue = ''
        return
      }

      // 把数据变为想要的结构
      const obj = {
        saleAttrValueName,
        baseSaleAttrId
      }

      // 把结构数据添加到对应的属性值列表当中
      row.spuSaleAttrValueList.push(obj)

      // 把原来input内输入的数据清空
      row.inputValue = ''

      // 再让input变为按钮
      row.inputVisible = false
    },

    // 添加spu或者修改spu的保存操作
    async save() {
      // 1、獲取參數數據
      let { spuForm, spuImageList, category3Id } = this
      // 2、整理參數
      // 整理 category3Id
      spuForm.category3Id = category3Id

      // 整理圖片列表
      // 圖片列表當中的圖片必須是這樣的結構
      //   {
      //    imgName: 'string',
      //    imgUrl: 'string',
      //   }
      // 目前我們的圖片列表數據結構，前面有說過，包含之前已經有的和自己最近上船的差異
      // 之前已經有的圖片都有imgName和imgUrl，也有name和url，而自己上傳的只有name和url(需要更改)
      // map方法：根據老的數組生成一個新的數組，新的數組內部每一項和對應的老數組每一項有關
      spuImageList = spuImageList.map(item =>
        ({
          imgName: item.name,
          imgUrl: item.imgUrl || item.response.data
        })
      )
      spuForm.spuImageList = spuImageList

      // 整理銷售屬性，去除銷售屬性身上不需要的數據
      spuForm.spuSaleAttrList.forEach(item => {
        delete item.inputVisible
        delete item.inputValue
      })

      // 3、發請求
      try {
        // 4、成功幹啥
        await this.$API.spu.addUpdate(spuForm)
        // 提示
        this.$message.success('保存spu成功')
        // 返回到列表頁
        this.$emit('update:visible', false)
        // 通知返回列表頁成功，在列表頁發請求重新獲取列表數據
        this.$emit('backSuccess')
        // 返回成功後把當前spuForm頁面的數據清空
        this.resetData()
      } catch (error) {
        // 5、失敗幹啥
        this.$message.error('保存spu失敗')
      }
    },

    // 清空data当中数据
    resetData() {
      this.spuForm = {
        // 这个里面初始化的所有数据，都是为了添加的时候收集所需要的
        // 如果修改spu,是将获取到的spu详情数据，直接覆盖这里面的所有
        category3Id: 0,
        spuName: '',
        description: '',
        tmId: '',
        spuImageList: [],
        spuSaleAttrList: []
      }

      this.category3Id = ''

      this.spuImageList = [] // 获取图片列表到时候存在这个里面，最后再把这个图片列表整理完成放到spuForm里面
      this.trademarkList = [] // 获取所有的品牌列表存在这里面
      this.baseSaleAttrList = [] // 获取所有的spu销售属性存在这里面

      this.spuSaleAttrIdName = ''// 准备选择select之后收集销售id，但是最后是不是要这个id，不一定，先假设是

      // 这两个数据是上传图片用的
      this.dialogImageUrl = ''
      this.dialogVisible = false
    },

    // 點擊取消
    cancel() {
      // 返回到列表頁
      this.$emit('update:visible', false)
      // 通知父組件回來
      this.$emit('cancelSuccess')
      // 清空收集的數據
      this.resetData()
    }
  }
}
</script>

<style>
  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
