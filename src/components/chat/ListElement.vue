<template>
  <div class="wrapper">
    <div class="title">
      Test
    </div>
    <div class="lastMessage">
      Test
    </div>
  </div>
</template>

<script>
export default {
  name: 'chatList',
  data: () => ({
  }),
  methods: {
  }
}
</script>

<style lang="less" scoped>
  .wrapper {
    width: 100%;
    height: 80px;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    .title {
      width: 100%;
      height: 35%;
    }
    .lastMessage {
      width: 100%;
      height: 50%;
    }
  }
</style>