<template>
  <div>
    <el-card>
      <!-- 三級聯動組件 -->
      <CategorySelector
        :is-show-list="isShowList"
        @handlerCategory="handlerCategory"
      />
    </el-card>

    <el-card style="margin-top:20px">
      <!-- spu的列表頁 -->
      <div v-show="!isShowSpuForm && !isShowSkuForm">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddSpuForm"
        >添加SPU</el-button>
        <el-table
          :data="SpuList"
          style="width: 100%"
          border
        >
          <el-table-column
            type="index"
            align="center"
            label="序號"
            width="80"
          />
          <el-table-column
            prop="spuName"
            label="SPU名稱"
            width="width"
          />
          <el-table-column
            prop="description"
            label="SPU描述"
            width="width"
          />
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >
            <template slot-scope="{row,$index}">
              <HintButton
                icon="el-icon-plus"
                type="success"
                title="添加SKU"
                @click="showAddSkuForm(row)"
              />
              <HintButton
                icon="el-icon-edit"
                type="warning"
                title="修改SPU"
                @click="showUpdateSpuForm(row)"
              />
              <HintButton icon="el-icon-info" type="info" title="查看SPU的SKU列表" />
              <HintButton icon="el-icon-delete" type="danger" title="刪除SPU" />
            </template>
          </el-table-column>
        </el-table>
        <!--
      @size-change="handleSizeChange"
      @current-change="getSpuList"
      -->
        <el-pagination
          style="text-align:center"
          :current-page="page"
          :page-sizes="[2,4,6]"
          :page-size="limit"
          :pager-count="5"
          :total="total"
          layout="prev, pager, next, jumper,->,sizes,total"

          @size-change="handleSizeChange"
          @current-change="getSpuList"
        />
      </div>

      <!-- spu的添加與修改頁面 -->
      <!-- <div></div> -->
      <!-- <SpuForm
        v-show="isShowSpuForm"
        :visible="isShowSpuForm"
        @update:visible="isShowSpuForm = $event"
      /> -->
      <SpuForm
        v-show="isShowSpuForm"
        ref="spu"
        :visible.sync="isShowSpuForm"
      />

      <!-- sku的添加頁面 -->
      <!-- <div></div> -->
      <SkuForm v-show="isShowSkuForm" />
    </el-card>
  </div>
</template>

<script>
import SpuForm from '@/views/components/SpuForm'
import SkuForm from '@/views/components/SkuForm'
export default {
  name: 'Spu',
  components: { SpuForm, SkuForm },
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      SpuList: [],

      // 這個數據是為了完成三級分類可操作性傳遞過去的，和三個頁面顯示隱藏沒有關係
      isShowList: true,

      // 有分頁就要有這三個數據
      page: 1,
      limit: 2,
      total: 0,

      // 三個頁面顯示隱藏通過下面兩個數據做實現
      isShowSpuForm: false,
      isShowSkuForm: false

    }
  },

  methods: {
    handlerCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        this.category2Id = ''
        this.category3Id = ''
        this.SpuList = []
      } else if (level === 2) {
        this.category2Id = categoryId
        this.category3Id = ''
        this.SpuList = []
      } else {
        this.category3Id = categoryId
        this.getSpuList()
      }
    },

    // 獲取spu分頁列表
    async getSpuList(pager = 1) {
      this.page = pager
      const { page, limit, category3Id } = this
      const result = await this.$API.spu.getList(page, limit, category3Id)
      if (result.code === 200) {
        this.SpuList = result.data.records
        this.total = result.data.total
      }
    },

    // 修改每頁數量的回調
    handleSizeChange(size) {
      this.limit = size
      this.getSpuList()
    },

    // 點擊添加spu的回調，顯示spu的添加頁面
    showAddSpuForm() {
      this.isShowSpuForm = true
      // 獲取到子組件對象，調用子組件裡面的方法，進行發請求
      this.$refs.spu.getAddInitData()
    },

    // 點擊修改spu的回調，顯示spu的修改頁面 (和添加是同一個頁面)
    showUpdateSpuForm(row) {
      this.isShowSpuForm = true
      this.$refs.spu.getUpdateInitData(row)
    },

    // 點擊添加sku的回調，顯示sku的添加頁面
    showAddSkuForm(row) {
      this.isShowSkuForm = true
    }

  }
}
</script>

<style lang="sass">

</style>
