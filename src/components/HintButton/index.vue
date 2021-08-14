<template>
  <a href="javascript:;" :title="title" style="margin:4px">
    <el-button v-bind="$attrs" v-on="$listeners" />
  </a>
</template>

<script>
export default {
  name: '',
  props: ['title']

}
</script>
