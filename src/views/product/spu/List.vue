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
              <el-popconfirm
                :title="`確定刪除${row.spuName}嗎？`"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  slot="reference"
                  icon="el-icon-delete"
                  type="danger"
                  title="刪除SPU"
                />
              </el-popconfirm>

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
        @backSuccess="backSuccess"
        @cancelSuccess="cancelSuccess"
      />

      <!-- sku的添加頁面 -->
      <!-- <div></div> -->
      <SkuForm v-show="isShowSkuForm" ref="sku" :visible.sync="isShowSkuForm" />
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
      this.$refs.spu.getAddInitData(this.category3Id)
    },

    // 點擊修改spu的回調，顯示spu的修改頁面 (和添加是同一個頁面)
    showUpdateSpuForm(row) {
      this.flag = row.id // 這個數據只是為了讓返回的時候，判斷是怎麼返回來的
      this.isShowSpuForm = true
      this.$refs.spu.getUpdateInitData(row, this.category3Id)
    },

    // 點擊添加sku的回調，顯示sku的添加頁面
    showAddSkuForm(row) {
      this.isShowSkuForm = true
      this.$refs.sku.getAddInitData(row, this.category1Id, this.category2Id)
    },

    // 保存spu成功返回
    backSuccess() {
      // 重新發請求spu列表數據
      // 返回是怎麼返回的？添加成功返回的還是修改成功返回的？請求的哪一頁是不一樣的。
      if (this.flag) {
        this.getSpuList(this.page)
      } else {
        this.getSpuList()
      }
      this.flag = null // 重置標誌位
    },

    // 取消返回的回調
    cancelSuccess() {
      this.flag = null // 重置標誌位
    },

    // 刪除spu
    async deleteSpu(row) {
      try {
        await this.$API.spu.remove(row.id)
        this.$message.success('刪除spu成功')
        this.getSpuList(this.SpuList.length > 1 ? this.page : this.page - 1)
      } catch (error) {
        this.$message.error('刪除spu失敗')
      }
    }

  }
}
</script>

<style lang="sass">

</style>
