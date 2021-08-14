<template>
  <div>
    <el-card>
      <!-- 三級聯動組件 -->
      <CategorySelector @handlerCategory="handlerCategory" />
    </el-card>

    <el-card style="margin-top:20px">
      <!-- 屬性列表頁 -->
      <div v-show="isShowList">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="showAddDiv"
        >新增屬性</el-button>
        <el-table
          border
          style="width: 100%"
          :data="attrList"
        >
          <el-table-column
            type="index"
            label="序號"
            width="80"
            align="center"
          />
          <el-table-column
            prop="attrName"
            label="屬性名稱"
            width="150"
          />
          <el-table-column
            prop="prop"
            label="屬性值列表"
            width="width"
          >
            <!--
          展示屬性值列表的時候，我們需要v-for遍歷，而且每個屬性值外部有結構，所以得用
          作用域插槽
          -->
            <template slot-scope="{row,$index}">
              <!--
            row代表的是當前遍歷的屬性值，row.attrValueList才是我們要遍歷展示的屬性值列表
          -->
              <el-tag
                v-for="(attrValue,index) in row.attrValueList"
                :key="attrValue.id"
                type="success"
              >{{ attrValue.valueName }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column
            prop="prop"
            label="操作"
            width="150"
          >
            <template slot-scope="{row,$index}">
              <HintButton
                type="warning"
                icon="el-icon-edit"
                title="修改"
                @click="showUpdateDiv(row)"
              />
              <HintButton type="danger" icon="el-icon-delete" title="刪除" />
            </template>

          </el-table-column>
        </el-table>
      </div>

      <!-- 添加或者修改頁面 -->
      <div v-show="!isShowList">
        <el-form :inline="true" :model="attrForm">
          <el-form-item label="屬性名">
            <el-input
              v-model="attrForm.attrName"
              placeholder="請輸入屬姓名"
            />
          </el-form-item>
        </el-form>

        <el-button type="primary" iocn="el-icon-plus" @click="addAttrValue">新增屬性</el-button>
        <el-button @click="isShowList=true">取消</el-button>

        <!--
          這個table是為了展示收集的屬性值的列表，
          收集屬性名稱很好收集，上面用的是v-model用戶輸入直接可以收集，
          收集屬性值不好收集，那麼我用採用的是先使用table去展示要收集的
          屬性值列表。
          一開始屬性值列表當中是沒有任何數據的，所以表格中不會有任何東西。

          當要收集屬性值的時候，用了一個佔位的思想，先往數組裡面添加一個屬性值對象，只不過
          屬性值的名稱此時是空的。
          但是，一旦添加這個屬性值對象，表格當中都會出現一行，我們可以使用輸入框再去給剛才添加的屬性值對象，收集名稱。
          -->
        <el-table
          style="width: 100%;margin:20px 0"
          border
          :data="attrForm.attrValueList"
        >
          <el-table-column
            type="index"
            label="序號"
            width="80"
            align="center"
          />
          <el-table-column
            prop="prop"
            label="屬性值名稱"
            width="width"
          >
            <template slot-scope="{row,$index}">
              <el-input
                v-model="row.valueName"
                placeholder="請輸入屬性值名稱"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >
            <template>
              <!--  -->
              <HintButton type="danger" title="刪除屬性值" size="mini" icon="el-icon-delete" />
            </template>
          </el-table-column>
        </el-table>

        <el-button type="primary">保存</el-button>
        <el-button @click="isShowList=true">取消</el-button>

      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Attr',
  data() {
    return {
      category1Id: '',
      category2Id: '',
      category3Id: '',
      attrList: [],

      isShowList: true,

      attrForm: {
        attrName: '', // 屬性名稱
        attrValueList: [ // 屬性中的屬性值列表
          // {
          //   'attrId': 0,
          //   'id': 0,
          //   'valueName': 'string'
          // }
        ],
        // 'categoryId': this.category3Id,
        /*
        以後都要記住，data當中不能使用this，獲取data當中的另外一個數據，因為data數據是一個對象，初始化的順序不一定。
       */
        categoryId: 0,
        categoryLevel: 3 // 默認是3，必須選中3級id才能操作
      }

    }
  },

  methods: {
    handlerCategory({ categoryId, level }) {
      if (level === 1) {
        this.category1Id = categoryId
        // 子組件重新選擇1級，清空父組件當中的23級和屬性列表
        this.category2Id = ''
        this.category3Id = ''
        this.attrList = []
      } else if (level === 2) {
        this.category2Id = categoryId
        // 子組件重新選擇2級，清空父組件當中的3級和屬性列表
        this.category3Id = ''
        this.attrList = []
      } else if (level === 3) {
        this.category3Id = categoryId
        // 發請求拿平台屬性的列表數據
        this.getAttrList()
      }
    },

    // 請求獲取屬性的列表數據
    async  getAttrList() {
      const { category1Id, category2Id, category3Id } = this
      const result = await this.$API.attr.getList(category1Id, category2Id, category3Id)
      if (result.code === 200) {
        this.attrList = result.data
      }
    },

    // 點擊新增按鈕顯示添加的頁面
    showAddDiv() {
      this.isShowList = false

      // 每次打開添加屬性的頁面得把收集的數據重製
      // 在這裡我們可以順便收集categaryId
      this.attrForm = {

        attrName: '', // 屬性名稱
        attrValueList: [ // 屬性中的屬性值列表
          // {
          //   'attrId': 0,
          //   'id': 0,
          //   'valueName': 'string'
          // }
        ],
        categoryId: this.category3Id,
        categoryLevel: 3 // 默認是3，必須選中3級id才能操作
      }
    },

    // 點擊添加屬性值
    addAttrValue() {
      this.attrForm.attrValueList.push({

        // 這個id代表的是屬性值所屬屬性的id，有id就是修改頁面，沒有就是新增頁面undefined
        attrId: this.attrForm.id,
        //   'id': 0, // 新添加的屬性沒有id
        valueName: '' // 一會兒需要用戶輸入的屬性值名稱
      })
    },

    // 點擊修改屬性按鈕，顯示修改屬性頁面
    showUpdateDiv(row) {
      this.isShowList = false
      /*
       這次這裡使用淺拷貝，沒辦法，因為內部數組是一個對象類型，淺拷貝的還是地址，數組還是同一個
        this.attrForm = { ...row }
      */
      this.attrForm = cloneDeep(row)
    }
  }

}

</script>

