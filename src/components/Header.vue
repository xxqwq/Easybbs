<template>
  <div class="header" v-show="showHeader">
    <div
      class="header-content"
      :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
    >
      <!-- logo -->
      <router-link class="logo" to="/">
        <span
          v-for="(item, index) in logoInfo"
          :key="index"
          :style="{ color: item.color }"
          >{{ item.letter }}</span
        >
      </router-link>
      <!-- 板块信息 -->
      <div class="menu-panel"></div>
      <!-- 登录 注册 用户信息 -->
      <div class="user-info-panel">
        <div class="op-btn">
          <el-button type="primary" class="op-btn">
            发帖<span class="iconfont icon-add"></span>
          </el-button>
          <el-button type="primary" class="op-btn">
            搜索<span class="iconfont icon-search"></span>
          </el-button>
        </div>

        <el-button-group :style="{ 'margin-left': '10px' }">
          <el-button type="primary" plain @click="loginAndRegister(1)"
            >登录</el-button
          >
          <el-button type="primary" plain @click="loginAndRegister(0)"
            >注册</el-button
          >
        </el-button-group>
      </div>
    </div>
    <LoginAndRegister ref="loginAndRegisterRef" />
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import LoginAndRegister from '@/views/LoginAndRegister.vue'
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const emit = defineEmits(["loginAndRegister"]);
const logoInfo = ref([
  {
    letter: "E",
    color: "#3285FF",
  },
  {
    letter: "a",
    color: "r#FB3624",
  },
  {
    letter: "s",
    color: "#FFBA02",
  },
  {
    letter: "y",
    color: "#3285FF",
  },
  {
    letter: "B",
    color: "#25B24E",
  },
  {
    letter: "B",
    color: "#FD3224",
  },
  {
    letter: "S",
    color: "#FFBA02",
  },
]);
//处理头部和滚动条的位置
const showHeader = ref(true);
//获取滚动条的高度
const getScrollTop = () => {
  let scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop; //兼容问题
  return scrollTop;
};

const initScroll = () => {
  let initScrollTop = getScrollTop();
  let scrollType = 0;
  window.addEventListener("scroll", () => {
    let currentScrollTop = getScrollTop();
    if (currentScrollTop > initScrollTop) {
      scrollType = 1; //往下滚
    } else {
      scrollType = 0; //往上滚
    }
    initScrollTop = currentScrollTop; //滚动完重新赋值一下
    if (scrollType == 1 && currentScrollTop > 100) {
      showHeader.value = false;
    } else {
      showHeader.value = true;
    }
  });
};
//登陆注册
const loginAndRegisterRef = ref();
const loginAndRegister = (type) => {
  loginAndRegisterRef.value.showPanel(type);
};
onMounted(() => {
  //初始化滚动条
  initScroll();
});
</script>

<style lang="scss" scoped>
.header {
  z-index: 1000;
  width: 100%;
  position: fixed;
  height: 60px;
  box-shadow: 0 6px 6px 0 #ddd;
  .header-content {
    margin: 0px auto;
    align-items: center;
    height: 60px;
    display: flex;
    .logo {
      display: block;
      margin-right: 5px;
      text-decoration: none;
      font-size: 30px;
      font-weight: bold;
    }
    .menu-panel {
      flex: 1;
    }
    .user-info-panel {
      width: 300px;
      display: flex;
      .op-btn {
        .iconfont {
          margin-left: 5px;
        }
        .el-button + .el-button {
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
