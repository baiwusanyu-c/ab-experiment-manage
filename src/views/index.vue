<template>
  <div class="app-container home">
    <div class="home">
      <h1>欢迎使用AB-TEST后台管理系统</h1>
      <img src="../assets/images/cbd.png" />
      <h2>我们可以在AB-TEST后台管理系统上面进行创建应用、创建实验、配置实验参数等。</h2>
    </div>
  </div>
</template>

<script setup name="Index"></script>

<style scoped lang="scss">
  .home {
    font-family: 'open sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 13px;
    color: #676a6c;
    overflow-x: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    h1 {
      font-size: 3rem;
    }
    img {
      margin: 1rem 0;
    }
    h2 {
      width: 24rem;
      text-align: center;
      line-height: 36px;
    }
  }
</style>
