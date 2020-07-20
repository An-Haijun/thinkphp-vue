<template>
  <div class="t-tip">
    <p class="content">TIP：{{text}}</p>
  </div>
</template>

<script scoped>
export default {
  name: 'tTip',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
  .t-tip {
    .content {
      background: rgba(0,0,0,0.6);
      font-size: 15px;
      padding: 4px 6px;
    }
  }
</style>