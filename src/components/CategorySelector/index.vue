<template>
  <div>
    <!-- CategorySelector -->
    <el-form
      :inline="true"
      class="demo-form-inline"
      :disabled="!isShowList"
    >
      <el-form-item
        label="一級分類"
        :model="cForm"
      >
        <!-- selector、option默認必須要有value，沒有會報錯 -->
        <!--
          selector 收集選中的option的value值，順便把v-model給寫了，
          收集到cForm裡面，就把上面的form當中寫個:model="cForm"，
          然後發現data裡面要保存起來。
          二級是當一級被選中的時候才會有數據，
          所以 @change="handlerCategory1"
          -->
        <el-select
          v-model="cForm.category1Id"
          placeholder="請選擇"
          @change="handlerCategory1"
        >
          <el-option
            v-for="(c1,index) in category1List"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="二級分類" :model="cForm">
        <!-- selecor、option默認必須要有value，沒有會報錯 -->
        <el-select
          v-model="cForm.category2Id"
          placeholder="請選擇"
          @change="handlerCategory2"
        >
          <el-option
            v-for="(c2,index) in category2List"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="三級分類" :model="cForm">
        <!-- selecor、option默認必須要有value，沒有會報錯 -->
        <el-select
          v-model="cForm.category3Id"
          placeholder="請選擇"
          @change="handlerCategory3"
        >
          <el-option
            v-for="(c3,index) in category3List"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          />
        </el-select>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'CategorySelector',
  props: ['isShowList'],
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      cForm: {
        category1Id: '',
        category2Id: '',
        category3Id: ''
      }
    }
  },

  mounted() {
    this.getCategory1List()
  },

  methods: {
    async getCategory1List() {
      const result = await this.$API.category.getCategory1()
      if (result.code === 200) {
        this.category1List = result.data
      }
    },

    // 選中一級分類的回調，拿二級的數據
    async handlerCategory1(category1Id) {
      // 用戶選中1級需要清空23級
      this.category2List = []
      this.category3List = []
      this.cForm.category2Id = ''
      this.cForm.category3Id = ''

      // 選中1級要觸發自訂義事件，把1級的id傳遞給父組件
      // this.$emit('handlerCategory', category1Id)
      // 我們傳遞的id區分不了是幾級id，因為一級可能有id是1，二級有可能id是1
      this.$emit('handlerCategory', { categoryId: category1Id, level: 1 })

      // 拿二級列表
      const result = await this.$API.category.getCategory2(category1Id)
      if (result.code === 200) {
        this.category2List = result.data
      }
    },

    // 選中二級分類的回調，拿三級的數據
    async handlerCategory2(category2Id) {
      // 用戶選中2級需要清空3級
      this.category3List = []
      this.cForm.category3Id = ''

      // 選中2級要觸發自訂義事件，把2級的id傳遞給父組件
      // this.$emit('handlerCategory', category2Id) // 我們傳遞的id區分不了是幾級id
      this.$emit('handlerCategory', { categoryId: category2Id, level: 2 })

      // 拿三級列表
      const result = await this.$API.category.getCategory3(category2Id)
      if (result.code === 200) {
        this.category3List = result.data
      }
    },

    handlerCategory3(category3Id) {
      // 先讓這個函數是個空，不知道後面要做啥
      // 做到這解決一個bug，重新選中必須清空
      // 選中3級要觸發自訂義事件，把3級的id傳遞給父組件
      // this.$emit('handlerCategory', category3Id) // 我們傳遞的id區分不了是幾級id
      this.$emit('handlerCategory', { categoryId: category3Id, level: 3 })
    }
  }
}
</script>

