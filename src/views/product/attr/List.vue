<template>
  <div>
    <el-card>
      <!-- 三級聯動組件 -->
      <CategorySelector :is-show-list="isShowList" @handlerCategory="handlerCategory" />
    </el-card>

    <el-card style="margin-top:20px">
      <!--
        屬性列表頁
        屬性列表頁和添加或者修改頁面共同存在car當中，但一次只能出現一個，
        所以把它們都放進div內，用v-show解決，用isShow控制。
        v-if：直接增加或刪除DOM
        不能用v-if，由於我們可能兩個條件都要操作。
        如果 isShow = false 就不能操作了，只能操作true的那個。
      -->
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
          屬性裡面又有一個列表
          展示屬性值列表的時候，我們需要v-for遍歷，而且每個屬性值外部有結構。
          因為又有綠色的框，是額外的結構 <el-tag> 所以得用作用域插槽
          -->
            <template slot-scope="{row,$index}">
              <!--
            row代表的是當前遍歷的屬性值，row.attrValueList才是我們要遍歷展示的屬性值列表
            如果忘記row是誰，就看data展示的是誰
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

              <el-popconfirm
                :title="`確定刪除 ${row.attrName} ？`"
                @onConfirm="deleteAttr(row)"
              >
                <HintButton
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  title="刪除"
                />
              </el-popconfirm>
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

        <el-button
          type="primary"
          iocn="el-icon-plus"
          :disabled="!attrForm.attrName"
          @click="addAttrValue"
        >新增屬性值</el-button>
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
          先點擊，添加一個對象，但裡面沒有值。顯示一個iuput，從input輸入值，這個值就放進對象裡面了。
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

            <!-- 編輯模式或者是查看模式的切換 -->
            <template slot-scope="{row,$index}">
              <el-input
                v-if="row.isEdit"
                :ref="$index"
                v-model="row.valueName"
                placeholder="請輸入屬性值名稱"
                @blur="toLook(row)"
                @keyup.enter.native="toLook(row)"
              />
              <span
                v-else
                style="display:block;width:100%;height:100%"
                @click="toEdit(row,$index)"
              >{{ row.valueName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="prop"
            label="操作"
            width="width"
          >

            <template slot-scope="{row,$index}">
              <el-popconfirm
                :title="`確定刪除 ${row.valueName} 這個屬性值？`"
                @onConfirm="attrForm.attrValueList.splice($index,1)"
              >
                <!--
              onConfirm點擊氣泡確認框的確定按鈕，會觸發一個事件，事件名稱是onConfirm，官網寫錯。
              -->
                <HintButton
                  slot="reference"
                  type="danger"
                  title="刪除屬性值"
                  size="mini"
                  icon="el-icon-delete"
                />
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>

        <el-button
          type="primary"
          :disabled="attrForm.attrValueList.length === 0"
          @click="save"
        >保存

        </el-button>
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
    // 接收子組件傳過來的id，先判斷level
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

      // 每次打開添加屬性的頁面得把收集的數據清空，順便收集categaryId
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
        valueName: '', // 一會兒需要用戶輸入的屬性值名稱
        // 這個屬性值標識現在的模式為編輯模式，每個屬性值都有這個數據，true or false
        isEdit: true
      })

      // 讓新增屬性值input自動獲取焦點
      // 新添加的永遠是最後一個
      this.$nextTick(() => {
        this.$refs[this.attrForm.attrValueList.length - 1].focus()
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
      /*
      這裡代表修改屬性，修改屬性的時候，屬性當中已經存在了一些屬性值，這些屬性值我們也得
      添加模式
      */
      // this.attrForm.attrValueList.forEach(item => item.isEdit = false)
      // 響應式數據：對象當中的屬性數據更改會導致頁面更改
      // 這裡使用 item.isEdit = false 給每個值添加屬性，不是響應式屬性。
      // vue當中對數據進行數據監視的時候，只是一開始對數據裡面的所有屬性做了響應式，
      // Object.defineProperty對data當中的每個屬性都做了getter和setter做了響應式，
      // 但是如果不是一開始就有的屬性，不會做監視，既然沒做監視，後期添加的就不是響應式屬性
      // 不是響應式屬性，後期這個屬性值改變，頁面是不回改變的。

      // this.$set 或 Vue.set 為響應式對象添加新屬性才是響應式數據
      this.attrForm.attrValueList.forEach(item => this.$set(item, 'isEdit', false))
    },

    // 對input失去焦點或者回車，那麼切換查看模式
    toLook(row) {
      // 1、失去焦點的時候要判定數據中是否有屬性值名稱，如果沒有值或值不合法，不會變為span
      if (row.valueName.trim() === '') {
        this.$message.info('輸入的屬性值名稱不能為空')
        row.valueName = ''
        return
      }

      /*
      2、我們還得判斷當前輸入的這個屬性值名稱，除去自身之外，在其餘的屬性值是否存在，
         如果重複了，不能變為span。
      */
      const isRepeat = this.attrForm.attrValueList.some(item => {
        /*
       去除自身再去找，如果item.valueName === row.valueName 代表有重複就返回true
       */

        if (item !== row) {
          return item.valueName === row.valueName
        }
        if (isRepeat) {
          this.$message.info('輸入的屬性值名稱不能重複')
          row.valueName = ''
          return
        }
      })

      row.isEdit = false
    },

    // 對span點擊，那麼切換編輯模式
    toEdit(row, index) {
      row.isEdit = true

      // 讓span切換input自動獲取焦點
      // this.refs[index].focus()
      // 直接寫這行，input標籤其實還沒創建成功，所以報錯 this.refs[index].focus()是undefined
      this.$nextTick(() => {
        this.$refs[index].focus()
      })
    },

    // 保存操作
    async save() {
      // 1、獲取參數
      const attr = this.attrForm

      // 2、整理參數
      // 2-1、屬性值名稱如果為空串，從屬性值列表當中去除
      // 2-2、屬性值當中去除isEdit屬性，isEdit是我們添加用來標示查看模式和編輯模式的
      attr.attrValueList = attr.attrValueList.filter((item) => {
        if (item.valueName !== '') {
          delete item.isEdit
          return true
        }
      })

      // 3、屬性值列表如果沒有屬性值，不發請求
      if (attr.attrValueList.length === 0) {
        this.$message.info('屬性值列表必須有屬性值才能保存')
        return
      }

      // 3、發請求
      try {
        // 4、成功幹啥
        await this.$API.attr.addOrUpdate(attr)
        this.$message.success('保存屬性成功')
        this.isShowList = true
        this.getAttrList()
      } catch (error) {
        // 5、失敗幹啥
        this.$message.error('保存失敗' + error.message)
      }
    },

    // 刪除屬性操作
    async deleteAttr(row) {
      try {
        await this.$API.attr.delete(row.id)
        this.$message.success('刪除屬性成功')
        this.getAttrList()
      } catch (error) {
        this.$message.error('刪除屬性失敗')
      }
    }
  }

}

</script>

