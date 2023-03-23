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
      <div class="menu-panel">
        <span class="menu-item" to="/">首页</span>
        <template v-for="board in boardList">
          <el-popover
            placement="bottom-start"
            :width="300"
            trigger="hover"
            v-if="board.children.length > 0"
          >
            <template #reference>
              <span class="menu-item" @click="boardClickHandler(board)">{{
                board.boardName
              }}</span>
            </template>
            <div class="sub-board-list">
              <span
                class="sub-board"
                v-for="subBoard in board.children"
                @click="subBoardClickHandler( subBoard)"
                >{{ subBoard.boardName }}</span
              >
            </div>
          </el-popover>
          <span class="menu-item" v-else @click="boardClickHandler(board)">{{
            board.boardName
          }}</span>
        </template>
      </div>
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
        <!-- 显示用户信息 -->
        <template v-if="userInfo?.userId">
          <div class="message-info">
            <el-dropdown>
              <el-badge :value="12" class="item">
                <div class="iconfont icon-message"></div>
              </el-badge>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>回复我的</el-dropdown-item>
                  <el-dropdown-item>赞了我的文章</el-dropdown-item>
                  <el-dropdown-item>赞了我的评论 </el-dropdown-item>
                  <el-dropdown-item>下载了我的附件</el-dropdown-item>
                  <el-dropdown-item>系统消息</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="user-info">
            <el-dropdown>
              <Avatar :userId="userInfo?.userId" :width="50" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>回复我的</el-dropdown-item>
                  <el-dropdown-item>赞了我的文章</el-dropdown-item>
                  <el-dropdown-item>赞了我的评论 </el-dropdown-item>
                  <el-dropdown-item>下载了我的附件</el-dropdown-item>
                  <el-dropdown-item>系统消息</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>

        <el-button-group :style="{ 'margin-left': '10px' }" v-else>
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
import { useStore } from "vuex";
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import LoginAndRegister from "@/views/LoginAndRegister.vue";
const { proxy } = getCurrentInstance();
const router = useRouter();
const store = useStore();
const emit = defineEmits(["loginAndRegister"]);

const api = {
  getUserInfo: "/getUserInfo",
  loadBoard: "/board/loadBoard",
  loadMessageCount: "/ucenter/getMessageCount",
  logout: "/logout",
  getSysSetting: "/getSysSetting",
};
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
  getUserInfo();
});
//获取用户信息
const getUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
  });
  if (!result) {
    return;
  }
  store.commit("updateLoginUserInfo", result.data);
};
//获取板块信息
const boardList = ref([]);
const loadBoard = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) {
    return;
  }
  boardList.value = result.data;
};
loadBoard();

//监听登录用户信息
const userInfo = ref({});
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal != undefined && newVal != null) {
      userInfo.value = newVal;
    } else {
      userInfo.value = {};
    }
  },
  { immediate: true, deep: true }
);
//监听是否展示登录框
watch(
  () => store.state.showLogin,
  (newVal, oldVal) => {
    if (newVal) {
      loginAndRegister(1);
    }
  },
  { immediate: true, deep: true }
);

//板块切换
//一级板块
const boardClickHandler = (board) => {
  router.push(`/forum/${board.boardId}`);
};
//二级板块
const subBoardClickHandler = (subBoard) => {
  router.push(`/forum/${subBoard.pBoardId}/${subBoard.boardId}`);
};
</script>

<style lang="scss">
.header {
  top: 0;
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
      .menu-item {
        margin-left: 20px;
        cursor: pointer;
      }
    }
    .user-info-panel {
      width: 400px;
      display: flex;
      align-items: center;
      .op-btn {
        .iconfont {
          margin-left: 5px;
        }
        .el-button + .el-button {
          margin-left: 5px;
        }
      }
      .message-info {
        margin-left: 5px;
        margin-right: 25px;
        cursor: pointer;
        .icon-message {
          font-size: 25px;
          color: rgb(147, 147, 147);
        }
      }
      .user-info {
      }
    }
  }
}
.sub-board-list {
  display: flex;
  flex-wrap: wrap;
  .sub-board {
    padding: 0px 10px;
    border-radius: 20px;
    margin-right: 10px;
    background-color: rgb(218, 208, 208);
    border: 1px solid #ddd;
    color: rgb(119, 118, 118);
    margin-top: 10px;
    cursor: pointer;
    .sub-board:bover {
      color: var(--link);
    }
  }
}
</style>
