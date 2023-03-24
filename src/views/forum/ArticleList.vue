<template>
  <div
    class="container-body article-list-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <!-- 二级板块 -->
    <div class="sub-board" v-if="pBoardId">
      <span :class="['board-item', boardId == 0 ? 'active' : '']"
        ><router-link :to="`/forum/${pBoardId}`">全部</router-link></span
      >
      <span
        v-for="item in subBoardList"
        :class="['board-item', item.boardId == boardId ? 'active' : '']"
      >
        <router-link :to="`/forum/${item.pBoardId}/${item.boardId}`">{{
          item.boardName
        }}</router-link>
      </span>
    </div>
    <div class="article-panel">
      <div class="top-tab">
        <div
          :class="['tab', orderType == 0 ? 'active' : '']"
          @click="changeOrderType(0)"
        >
          热榜
        </div>
        <el-divider direction="vertical"></el-divider>
        <div
          :class="['tab', orderType == 1 ? 'active' : '']"
          @click="changeOrderType(1)"
        >
          发布时间
        </div>
        <el-divider direction="vertical"></el-divider>
        <div
          :class="['tab', orderType == 2 ? 'active' : '']"
          @click="changeOrderType(2)"
        >
          最新
        </div>
      </div>
      <div class="article-list">
        <DataList
          :dataSource="articleListInfo"
          :loading="loading"
          @loadData="loadArticle"
          noDataMsg="暂无文章"
        >
          <template #default="{ data }">
            <ArticleListItem :data="data" /> </template
        ></DataList>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import ArticleListItem from "./ArticleListItem.vue";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
const api = {
  loadArticle: "/forum/loadArticle",
};
//文章列表
//一级版块
const pBoardId = ref(0);
//二级版块
const boardId = ref(0);
const orderType = ref(0);
const changeOrderType = (type) => {
  orderType.value = type;
  loadArticle();
};
const loading = ref(false);
const articleListInfo = ref({});
const loadArticle = async () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo,
    boardId: boardId.value,
    pBoardId: pBoardId.value,
    orderType: orderType.value,
  };
  let result = await proxy.Request({
    url: api.loadArticle,
    params: params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  articleListInfo.value = result.data;
};
// loadArticle();

//二级板块
const subBoardList = ref([]);
const setSubBoard = () => {
  subBoardList.value = store.getters.getSubBoardList(pBoardId.value);
};

//监听路由变化
watch(
  () => route.params,
  (newVal, oldVal) => {
    pBoardId.value = newVal.pBoardId;
    boardId.value = newVal.boardId || 0;
    setSubBoard();
    loadArticle();
    store.commit('setactivePboardId', newVal.pBoardId);
    store.commit('setActiveBoardId', newVal.boardId);
  },
  { immediate: true, deep: true }
);

//监听boardList的变化
watch(
  store.state.boardList,
  () => (newVal, oldVal) => {
    setSubBoard();
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.article-list-body {
  .sub-board {
    padding: 10px 0px 12px 0px;
    .board-item {
      background-color: #dddada;
      border-radius: 15px;
      padding: 2px 10px;
      margin-right: 10px;
      color: #909090;
      cursor: pointer;
      font-size: 14px;
      a {
        text-decoration: none;
        color: #909090;
      }
    }
    .active {
      background-color: var(--link);
      a {
        color: #fff;
      }
    }
  }
  .article-panel {
    background-color: #fff;
    .top-tab {
      display: flex;
      align-items: center;
      padding: 10px;
      font-size: 15px;
      border-bottom: 1px solid #ddd;
      .tab {
        cursor: pointer;
      }
      .active {
        color: var(--link);
      }
    }
    .article-list {
      padding-bottom: 5px;
    }
  }
}
</style>
