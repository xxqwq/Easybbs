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
        <router-link
          to="/"
          :class="['menu-item', activePboardId == undefined ? 'active' : '']"
          >首页</router-link
        >
        <template v-for="board in boardList">
          <el-popover
            placement="bottom-start"
            :width="300"
            trigger="hover"
            v-if="board.children.length > 0"
          >
            <template #reference>
              <span
                :class="[
                  'menu-item',
                  board.boardId == activePboardId ? 'active' : '',
                ]"
                @click="boardClickHandler(board)"
                >{{ board.boardName }}</span
              >
            </template>
            <div class="sub-board-list">
              <span
                v-for="subBoard in board.children"
                @click="subBoardClickHandler(subBoard)"
                :class="[
                  'sub-board',
                  subBoard.boardId == activeboardId ? 'active' : '',
                ]"
                >{{ subBoard.boardName }}</span
              >
            </div>
          </el-popover>
          <span
            class="menu-item"
            v-else
            @click="boardClickHandler(board)"
            :class="[
              'menu-item',
              board.boardId == activePboardId ? 'active' : '',
            ]"
            >{{ board.boardName }}</span
          >
        </template>
      </div>
      <!-- 登录 注册 用户信息 -->
      <div class="user-info-panel">
        <div class="op-btn">
          <el-button type="primary" class="op-btn" @click="newPost">
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
              <el-badge
                :value="messageCountInfo.total"
                class="item"
                :hidden="
                  messageCountInfo.total == null || messageCountInfo.total == 0
                "
              >
                <div class="iconfont icon-message"></div>
              </el-badge>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    @click="gotoMessage('reply')"
                    class="message-item"
                    ><span class="text">回复我的</span>
                    <span class="count-tag" v-if="messageCountInfo.reply > 0">{{
                      messageCountInfo.reply > 99
                        ? "99+"
                        : messageCountInfo.reply
                    }}</span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="gotoMessage('likePost')"
                    class="message-item"
                    ><span class="text">赞了我的文章</span>
                    <span
                      class="count-tag"
                      v-if="messageCountInfo.likePost > 0"
                      >{{
                        messageCountInfo.likePost > 99
                          ? "99+"
                          : messageCountInfo.likePost
                      }}</span
                    ></el-dropdown-item
                  >
                  <el-dropdown-item
                    @click="gotoMessage('likeComment')"
                    class="message-item"
                    ><span class="text">赞了我的评论</span>
                    <span
                      class="count-tag"
                      v-if="messageCountInfo.likeComment > 0"
                      >{{
                        messageCountInfo.likeComment > 99
                          ? "99+"
                          : messageCountInfo.likeComment
                      }}</span
                    >
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="gotoMessage('downloadAttachment')"
                    class="message-item"
                    ><span class="text">下载了我的附件</span>
                    <span
                      class="count-tag"
                      v-if="messageCountInfo.downloadAttachment > 0"
                      >{{
                        messageCountInfo.downloadAttachment > 99
                          ? "99+"
                          : messageCountInfo.downloadAttachment
                      }}</span
                    ></el-dropdown-item
                  >
                  <el-dropdown-item
                    @click="gotoMessage('sys')"
                    class="message-item"
                    ><span class="text">系统消息</span>
                    <span class="count-tag" v-if="messageCountInfo.sys > 0">{{
                      messageCountInfo.sys > 99 ? "99+" : messageCountInfo.sys
                    }}</span></el-dropdown-item
                  >
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <div class="user-info">
            <el-dropdown>
              <Avatar :userId="userInfo?.userId" :width="50" :addLink="false" />
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="gotoUcenter(userInfo.userId)"
                    >个人主页</el-dropdown-item
                  >
                  <el-dropdown-item @click="logout">退出</el-dropdown-item>
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
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  watch,
  defineEmits,
} from "vue";
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
  loadMessageCount: "/ucenter/getMessageCount",
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
  store.commit("saveBoardList", result.data);
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
//当前选中的版块
const activePboardId = ref(0);
watch(
  () => store.state.activePboardId,
  (newVal, oldVal) => {
    if (newVal !== 0) {
      activePboardId.value = newVal;
    }
  },
  { immediate: true, deep: true }
);

const activeboardId = ref(0);
watch(
  () => store.state.activeBoardId,
  (newVal, oldVal) => {
    activeboardId.value = newVal;
  },
  {
    immediate: true,
    deep: true,
  }
);

//发帖
const newPost = () => {
  if (!store.getters.getLoginUserInfo) {
    loginAndRegister(1);
  } else {
    router.push("/newPost");
  }
};

const gotoUcenter = (userId) => {
  router.push(`/user/${userId}`);
};
//消息相关
const gotoMessage = (type) => {
  router.push(`/user/message/${type}`);
};

const messageCountInfo = ref({});
const loadMessageCount = async () => {
  let result = await proxy.Request({
    url: api.loadMessageCount,
  });
  if (!result) {
    return;
  }
  messageCountInfo.value = result.data;
  store.commit("updateMessageCountInfo", result.data);
};

watch(
  () => store.state.messageCountInfo,
  (newVal, oldVal) => {
    messageCountInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);

watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal) {
      loadMessageCount();
    }
  },
  { immediate: true, deep: true }
);
//退出
const logout = () => {
  proxy.Confirm("确定要退出吗?", async () => {
    let result = await proxy.Request({
      url: api.logout,
    });
    if (!result) {
      return;
    }
    store.commit("updateLoginUserInfo", null);
  });
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
      .home {
        text-decoration: none;
        color: #000;
      }
      .menu-item {
        margin-left: 20px;
        cursor: pointer;
      }
      .active {
        color: var(--link);
      }
      a {
        text-decoration: none;
        color: black;
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
  }
  .sub-board:hover {
    color: var(--link);
  }
  .active {
    background-color: var(--link);
    color: #fff;
  }
  .active:hover {
    color: #fff;
  }
}
.message-item {
  display: flex;
  justify-content: space-around;
  .text {
    flex: 1;
  }
  .count-tag {
    height: 15px;
    line-height: 15px;
    min-width: 20px;
    display: inline-block;
    background: #f56c6c;
    border-radius: 10px;
    font-size: 13px;
    text-align: center;
    color: #fff;
    margin-left: 10px;
  }
}
</style>
