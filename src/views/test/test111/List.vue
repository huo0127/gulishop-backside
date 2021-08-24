<template>
  <div>
    <el-button v-if="$hasBP('btn.Test111.add')" type="primary">添加</el-button>
    <el-button v-if="$hasBP('btn.Test111.remove')" type="danger">刪除</el-button>
    <el-button v-if="$hasBP('btn.Test111.update')" type="warning">修改</el-button>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
