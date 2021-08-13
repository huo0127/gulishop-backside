<template>
  <div>
    <el-button type="primary" icon="el-icon-plus" @click="showAddDialog">新增</el-button>
    <!--
      el-table為表格
      表格當中是一列一列的el-table-column
      el-table:
        :data="data" 這個屬性是用來展示數據的，但是我們現在沒數據。
        表格展示數據的時候，數據必須是數組，數組內部是對象。
        border 這個屬性代表是否需要邊框
      el-table-column:
        prop="prop" 目前不用，後期需要展示數據當中的某個屬性使用。
        label="label" 代表這一列的名稱
        width="width" 代表這一列的寬度，直接寫數字，不用寫px。如果不寫，平分。
        如果寫哪一個列，哪一個就變為自己寫的寬度。
        align="center" 讓某個列的數據居中。
     -->
    <!--
       table當中:data="trademarkList"，代表的是表格要展示的數組，
       當我們寫上的時候，table會吧把這個數組給每個列都傳遞一份，
       每個列內部都是在展示我們的這個數組數據 vfor，
       每個列在展示數據的時候，結構是由我們說的算，
       所以table內部都是有作用域插槽的。

       table的列在展示數據的時候，如果我們的數據就是要展示的數據，
       那麼直接寫prop就好了。
       如果我們的數據不是直接展示的數據，而是需要其他的結構，
       那麼必須使用作用域插槽。
      -->
    <el-table
      style="width:100%;margin:20px 0"
      border
      :data="trademarkList"
    >
      <el-table-column
        type="index"
        label="序號"
        width="80"
        align="center"
      />
      <el-table-column
        prop="tmName"
        label="品牌名稱"
        width="width"
      />
      <el-table-column
        label="LOGO"
        width="width"
      >
        <template slot-scope="{row,$index}">
          <!-- row代表當前遍歷的對象 -->
          <!-- $index代表當前遍歷對象的下標 -->
          <img
            :src="row.logoUrl"
            alt=""
            style="height:60px;width:80px"
          >
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="width"
      >
        <template
          slot-scope="{row,$index}"
        >
          <el-button
            type="warning"
            icon="el-icon-edit"
            @click="showUpdateDialog(row)"
          >修改
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteTrademark(row)"
          >刪除
          </el-button>

        </template>
      </el-table-column>
    </el-table>

    <!--
      分頁器
      之前我們用的分頁器是自己組裝的分頁器組件，
      這次我們用的是element-ui給我們封裝的分頁器組件
      :current-page="pageNum"  傳遞的當前頁碼
      :page-sizes="[10,20,50]" 傳遞的每頁數量
      :page-size="pageSize"    傳遞的總數
      :pager-count="3"         傳遞的連續頁碼，如果寫的是5，連續數是3，5包含了首頁跟尾頁
      @current-change="handleCurrentChange"  切換頁碼的事件

      之前沒有的
      :page-sizes="[10,20,50]"               在頁面可以改變當前頁的數量
      @size-change="handleSizeChange"        改變當前頁數量的事件

      layout="total,sizes,prev,pager,next,jumper" 可以改變分頁器前後順序(布局順序)

      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      -->
    <el-pagination
      background
      style="text-align:center"
      :current-page="page"
      :page-size="limit"
      :pager-count="5"
      :total="total"
      :page-sizes="[3, 5, 10]"
      layout="prev, pager, next, jumper,->, sizes, total"

      @current-change="getTrademarkList"
      @size-change="handleSizeChange"
    />

    <!--
      點擊添加或點擊修改的對話框頁面，
      寫靜態頁面的時候把東西複製過來，先把內部所有的動態數據刪除掉。
      -->
    <el-dialog title="新增品牌" :visible.sync="dialogFormVisible">
      <el-form style="width:90%" :model="tmForm">
        <!--
           el-form 代表的是表單
           表單裡面是表單項
                每個表單都可以通過label-width設置表單項名稱的寬度
                每個表單都可以通過label設置表單項名稱
           form當中都會寫 :model="對象"
              作用：1、以後用來對這個form表單驗證
                    2、用來標識這個form收集的數據收集到哪
        -->
        <el-form-item label="品牌名稱" label-width="100px">
          <el-input v-model="tmForm.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px">
          <!-- 拷貝upload組件的時候，把html、css、js相關的東西全部拷貝 -->

          <!--
            上傳圖片分為兩步：
              我們上傳的時候需要調用接口，把本地的圖片傳到後端服務器，
              接下來，後端服務器會給我們返回這個圖片在後端服務器上的地址(線上路徑)，
              我們要收集的東西就是返回來的路徑。

            上傳的接口地址，前面必須添加/dev-api
            action="/dev-api/admin/product/fileUpload"
            如果不添加默認是往這發請求
            http://localhost:9528/admin/product/fileUpload 404
            如果添加了往這發
            http://localhost:9528/dev-api/admin/product/fileUpload
            就會被代理轉發到真實的地址
            http://39.98.123.211/admin/product/fileUpload 是對的

            :show-file-list="false" 代表顯示的只有一張圖片，不是多個(照片牆)

             :on-success="handleAvatarSuccess" 代表圖片上傳成功後的回調
            :before-upload="beforeAvatarUpload" 代表圖片上船前的回調

           -->
          <el-upload
            class="avatar-uploader"
            action="/dev-api/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" />
            <div slot="tip" class="el-upload__tip">只能上傳jpg/png文件，且不超過500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="addOrUpdateTrademark">確定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Trademark',
  data() {
    return {
      page: 1,
      limit: 3,
      trademarkList: [],
      total: 0,
      dialogFormVisible: false, // 這個數據決定了dialog是否顯示
      imageUrl: '', // upload組件內部的數據，有可能不用
      tmForm: {
        // tmForm就是我們收集成功的那個品牌對象
        // 用來收集數據
        tmName: '', // 收集品牌名稱
        logoUrl: '' // 收集品牌logo圖片路徑
      }
    }
  },
  mounted() {
    this.getTrademarkList()
  },
  methods: {
    async getTrademarkList(page = 1) {
      this.page = page
      const result = await this.$API.trademark.getPageList(this.page, this.limit)
      if (result.code === 200) {
        this.trademarkList = result.data.records
        this.total = result.data.total
      }
    },

    // // 切換分頁器的回調
    // handleCurrentChange(page) {
    //   this.page = page
    //   this.getTrademarkList()
    // }

    // 切換每頁數量的回調，這個回調不能省略
    handleSizeChange(size) {
      this.limit = size
      this.getTrademarkList()
    },

    // upload組件當中寫的兩個函數
    // 圖片上傳成功的回調
    handleAvatarSuccess(res, file) {
    // res代表上傳成功後返回的響應數據
    // file代表上傳成功後返回的圖片文件本身

      // 本身寫的東西，這個是錯的，他也是收集上傳成功的路徑，但是這樣的寫法只是模擬
      // 他最終收集的是本地路徑，是錯的，我們要的是上傳成功後服務器返回來的線上路徑。
      // this.imageUrl = URL.createObjectURL(file.raw)
      // console.log(URL.createObjectURL(file.raw))
      // blob:http://localhost:9528/6cf4d647-e84e-4869-9662-1800c552c8e0

      this.tmForm.logoUrl = res.data // 或者是file.response.data
    },
    // 圖片上傳前的回調
    // 上傳的時候可以限制圖片的格式和大小
    beforeAvatarUpload(file) {
      // file代表的是上傳的那個圖片
      const isJPG = file.type === 'image/jpeg' // 判斷上傳的圖片是否為jpg
      const isLt2M = file.size / 1024 / 1024 < 2 // 判斷上傳的圖片是否小於2M

      if (!isJPG) {
        this.$message.error('上傳品牌圖片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上傳品牌圖片大小不能超過 2MB!')
      }
      return isJPG && isLt2M
    },

    // 點擊添加按鈕彈出添加品牌的dialog對話框
    showAddDialog() {
      this.dialogFormVisible = true
      // 把tmForm內的數據清空，如果不清空，添加數據點取消，再點添加，數據還存在。
      this.tmForm = {
        tmName: '', // 收集品牌名稱
        logoUrl: '' // 收集品牌logo圖片路徑
      }
    },

    // 點擊修改彈出修改品牌的dialog
    showUpdateDialog(row) {
      this.dialogFormVisible = true
      // this.tmForm = row // row代表的就是要修改的那一行，就是要修改的品牌對象
      this.tmForm = {
        ...row
      } // 最簡單的淺拷貝
      /*
        row是列表頁中展示的數據
        tmForm是dialog對話框展示的數據
        this.tmForm = row 是把列表頁的數據給了tmForm，讓tmForm和row就是同一個數據

        深淺拷貝
        var a = [1,2,3] var b = a 是拷貝嗎?
        => 不是
        拷貝：
            出現另外一個內存空間。
        深淺拷貝：
            拷貝過程中數據的類型問題。
            深淺拷貝面向的數據必然是對象格式。基本數據類型，不存在深淺拷貝。
        淺拷貝：對象邦中所有的對象數據再拷貝給另一個內存的時候，拷貝地址
        深拷貝：對象當中所有的對象數據在拷貝給另一個內存的時候，拷貝數據而不是地址

        原數據
        tmForm = {
          tmName:'aa',
          logoUrl:'bb',
          data:[1,2,3]  0x100
        }
        淺拷貝
        tmFormCopy = {
          tmName:'aa',
          logoUrl:'bb',
          data:[1,2,3]  0x100
        }
        深拷貝
        tmFormDeepCopy = {
          tmName:'aa',
          logoUrl:'bb',
          data:[1,2,3]  0x200
        }
      */

      // 這裡row當中只有基本數據類型，所以淺拷貝就ok，沒必要深拷貝，當然深拷貝也可以
    },

    // 點擊確定按鈕發請求添加或者修改品牌
    async addOrUpdateTrademark() {
      // 獲取參數
      const trademark = this.tmForm // tmForm就是我們添加或者修改最終收集到的品牌數據
      // 整理參數，一般是我們的參數數據不符合我們請求的參數數據，那麼就需要整理
      // 發請求
      try {
        // 成功幹啥
        await this.$API.trademark.addOrUpdate(trademark)
        // 1、提示
        this.$message.success(trademark.id ? '修改品牌成功' : '新增品牌成功')
        // 2、關閉dialog，回到列表頁
        this.dialogFormVisible = false
        // 3、重新發請求獲取列表頁數據
        // 如果添加成功，那麼重新請求的第一頁數據，添加新的數據是在最後一頁
        // 如果修改成功，那麼得重新請求這條數據所在的頁數
        this.getTrademarkList(trademark.id ? this.page : 1)
      } catch (error) {
      // 失敗幹啥
        this.$message.error(trademark.id ? '修改品牌失敗' : '新增品牌失敗')
      }
    },

    // 點擊刪除按鈕，刪除對應品牌
    deleteTrademark(row) {
      this.$confirm(`確定刪除${row.tmName}嗎？`, '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // then處理的就是點擊確定按鈕的邏輯
        // 點擊消息盒子確定按鈕後要發請求去刪除
        try {
          this.$API.trademark.delete(row.id)
          // 1、刪除成功後提示
          this.$message.success('刪除成功!')
          // this.$message({
          //   type: 'success',
          //   message: '刪除成功!'
          // })
          // 2、重新發請求獲取列表數據
          // 刪除哪個數據回到的還是哪個數據所在的頁面
          // 假設刪除數據的那一頁只有一條數據，我們需要回到前一頁，而不是數據當前頁。
          this.getTrademarkList(this.trademarkList.length > 1 ? this.page : this.page - 1)
        } catch (error) {
          this.$message.error('刪除失敗')
        }
      }).catch(() => {
        // catch處理的就是點擊取消的邏輯
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}

</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
