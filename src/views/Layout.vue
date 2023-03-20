<template>
  <div class="main">
    <Header />
    <div :style="{ height: '1500px' }">
      <router-view />
    </div>
    <!-- <Dialog :isShow="showDialog" :buttons="buttons" @close="showDialog = false"
      >
    </Dialog> -->
    <!-- 登录注册 -->

  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
import Header from "@/components/Header.vue";
// import LoginAndRegister from "@/views/LoginAndRegister.vue";
// import Dialog from "@/components/Dialog.vue";
const buttons = [
  {
    text: "确定",
    type: "primary",
  },
];

</script>

<style lang="scss">
</style>
