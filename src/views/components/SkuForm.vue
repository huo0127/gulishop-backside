<template>
  <div>
    <el-form label-width="100px" :model="skuForm">
      <el-form-item label="SPU 名稱" label-width="100px">
        {{ spu.spuName }}
      </el-form-item>

      <el-form-item label="SKU 名稱" label-width="100px">
        <el-input v-model="skuForm.skuName" placeholder="SKU 名稱" />
      </el-form-item>

      <el-form-item label="價格(元)" label-width="100px">
        <el-input v-model="skuForm.price" placeholder="價格(元)" type="number" />
      </el-form-item>

      <el-form-item label="重量(公克)" label-width="100px">
        <el-input v-model="skuForm.weight" placeholder="重量(公克)" type="number" />
      </el-form-item>

      <el-form-item label="規格描述" label-width="100px">
        <el-input v-model="skuForm.skuDesc" placeholder="規格描述" type="textarea" rows="4" />
      </el-form-item>

      <el-form-item label="平台屬性" label-width="100px">
        <el-form :inline="true">
          <el-form-item
            v-for="(attr,index) in attrList"
            :key="attr.id"
            :label="attr.attrName"
            label-width="100px"
          >
            <el-select v-model="attr.attrIdValueId" placeholder="請選擇">
              <el-option
                v-for="(attrValue,index) in attr.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="銷售屬性" label-width="100px">
        <el-form :inline="true">
          <el-form-item
            v-for="(saleAttr,index) in spuSaleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.saleAttrName"
            label-width="100px"
          >
            <el-select v-model="saleAttr.saleAttrIdValueId" placeholder="請選擇">
              <el-option
                v-for="(saleAttrValue,index) in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="圖片列表" label-width="100px">
        <el-table
          :data="spuImageList"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column
            type="selection"
            width="55"
          />
          <el-table-column
            prop="prop"
            label="圖片"
            width="width"
          >
            <template slot-scope="{row,$index}">
              <img :src="row.imgUrl" alt="" style="width:100px;height:100px">
            </template>
          </el-table-column>

          <el-table-column
            prop="imgName"
            label="名稱"
            width="width"
          />

          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >
            <template slot-scope="{row,$index}">
              <el-button
                v-if="row.isDefault ==='0'"
                type="primary"
                @click="setDefaultImg(row,spuImageList)"
              >設為默認</el-button>
              <el-tag v-else type="success">默認</el-tag>
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
  name: 'SkuForm',
  data() {
    return {
      spu: {},
      attrList: [],
      spuSaleAttrList: [],
      spuImageList: [], // 請求獲取的spu的圖片列表

      skuImageList: [], // 我們選擇了spu的圖瑱列表後組成的sku圖片列表，收集到這

      skuForm: {
        // 到時從父組件傳過來
        tmId: '',
        category3Id: '',
        spuId: '', // 这个id是告诉后台给哪个spu添加sku

        // createTime: "2021-03-03T07:17:36.281Z",
        // id:0,
        // isSale:0,

        // v-model直接收集
        price: '',
        weight: '',
        skuName: '',
        skuDesc: '',

        // 要通过代码去收集的
        skuDefaultImg: '', // 默認圖片的路徑

        // 一個sku的平台屬性值列表，是由用戶選擇平台屬性的值所決定的，
        // 選擇了一個平台屬性值，那麼列表當中就多了一個平台屬性值對象，
        // 沒有選擇，那就沒有啦
        skuAttrValueList: [
          // {
          //   attrId: 0,
          //   attrName: "string",
          //   id: 0,
          //   skuId: 0,
          //   valueId: 0,
          //   valueName: "string",
          // },
        ],
        skuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   isDefault: "string",
          //   skuId: 0,
          //   spuImgId: 0,
          // },
        ],
        skuSaleAttrValueList: [
          // {
          //   id: 0,
          //   saleAttrId: 0,
          //   saleAttrName: "string",
          //   saleAttrValueId: 0,
          //   saleAttrValueName: "string",
          //   skuId: 0,
          //   spuId: 0,
          // },
        ]

      }
    }
  },
  methods: {
    async getAddInitData(row, category1Id, category2Id) {
      this.spu = row
      // 根據123級分類獲取平台屬性列表
      // http://localhost:9529/dev-api/admin/product/attrInfoList/2/13/61
      const promise1 = this.$API.attr.getList(category1Id, category2Id, row.category3Id)

      // 根據spu的id獲取spu的銷售屬性列表
      // http://localhost:9529/dev-api/admin/product/spuSaleAttrList/4
      const promise2 = this.$API.sku.getSpuSaleAttrList(row.id)

      // 根據spu的id獲取spu的圖片列表
      // http://localhost:9529/dev-api/admin/product/spuImageList/4
      const promise3 = this.$API.sku.getSpuImageList(row.id)

      const result = await Promise.all([promise1, promise2, promise3])
      // result 是 promise1, promise2, promise3 成功結果的數組

      this.attrList = result[0].data
      this.spuSaleAttrList = result[1].data

      /*
      這樣做可以避免每個圖片後期都要使用$set，
      因為這裡我們添加好屬性，後面我們是直接把整個數組賦值給響應式屬性
      this.spuImageList，所以內部的東西也都是響應式
      */
      let spuImageList = result[2].data
      spuImageList.forEach(item => { item.isDefault = '0' })
      this.spuImageList = spuImageList
    },

    // 收集sku圖片列表的回調
    // sku的圖片列表是從spu的圖片列表當中選擇而來的，選擇了幾個，那麼這個
    // 選擇的組成數組變為sku的圖片列表
    handleSelectionChange(val) {
      console.log(val)
      this.skuImageList = val
    },

    // 設置默認圖片 (排他)
    setDefaultImg(row, spuImageList) {
      spuImageList.forEach(item => { item.isDefault = '0' })
      row.isDefault = '1'

      // 此時就是蒐集默認圖片的最佳時機
      this.skuForm.skuDefaultImg = row.imgUrl
    },

    // 添加sku的保存操作
    async save() {
      // 獲取參數數據
      let { spu, skuForm, attrList, spuSaleAttrList, skuImageList } = this
      // 整理參數
      skuForm.spuId = spu.id
      skuForm.category3Id = spu.category3Id
      skuForm.tmId = spu.tmId

      // 整理圖片列表
      // {
      //   imgName: "string",
      //   imgUrl: "string",
      //   isDefault: "string",
      //   spuImgId: 0,
      // },

      // 我們目前結構是這樣
      //       id:12
      // imgName:"7155bba4c363065f.jpg"
      // imgUrl:"http://47.93.148.192:8080/group1/M00/00/0rBHu8l-rgfWAVRWzAABUiOmA0ic932jpg"
      // isDefault:"0"
      // spuId:3
      skuImageList = skuImageList.map(item => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id
        }
      })

      skuForm.skuImageList = skuImageList

      // 整理sku的平台屬性列表和銷售屬性列表
      // attrIdValueId和saleAttrIdValueId
      skuForm.skuAttrValueList = attrList.reduce((prev, item) => {
        // 判斷哪個平台屬性當年被選擇過屬性值
        if (item.attrIdValueId) {
          // 把蒐集的數據轉化為需要的屬性值結構
          let [attrId, valueId] = item.attrIdValueId.split(':')
          let obj = { attrId, valueId }
          prev.push(obj)
        }
        return prev
      }, [])

      skuForm.skuSaleAttrValueList = spuSaleAttrList.reduce((prev, item) => {
        if (item.saleAttrIdValueId) {
          let [saleAttrId, saleAttrValueId] = item.saleAttrIdValueId.split(':')
          let obj = { saleAttrId, saleAttrValueId }
          prev.push(obj)
        }
        return prev
      }, [])

      // 發請求
      try {
      // 成功幹啥
        await this.$API.sku.addUpdate(skuForm)
        // 提示
        this.$message.success('保存sku成功')
        // 返回spu列表頁面，不需要重新獲取spu列表數據
        this.$emit('update:visible', false)
        // 清空spu相關data數據
        this.resetData()
      } catch (error) {
      // 失敗幹啥
        this.$message.error('保存sku失敗')
      }
    },

    // 清空data數據
    resetData() {
      this.spu = {}
      this.attrList = []
      this.spuSaleAttrList = []
      this.spuImageList = []
      this.skuImageList = []
      this.skuForm = {
        tmId: '',
        category3Id: '',
        spuId: '',
        price: '',
        weight: '',
        skuName: '',
        skuDesc: '',
        skuDefaultImg: '',
        skuAttrValueList: [],
        skuImageList: [],
        skuSaleAttrValueList: []

      }
    },

    // 添加sku的取消操作
    cancel() {
      // 返回列表頁
      this.$emit('update:visible', false)
      // 清空sku的數據
      this.resetData()
    }

  }
}
</script>

