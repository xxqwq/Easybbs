<template>
  <div class="comment-body">
    <div class="comment-title">
      <div class="title">
        评论
        <span class="count">0</span>
      </div>
      <div class="tab">
        <span>热榜</span>
        <el-divider direction="vertical"></el-divider>
        <span>最新</span>
      </div>
    </div>
    <!-- 发送评论 -->
    <div class="comment-form-panel">
      <CommentPost
        :avatarWidth="50"
        :userId="currentUserInfo.userId"
        :showInsertImg="currentUserInfo.userId !== null"
        :articleId="articleId"
        :pCommentId="0"
        @postCommentFinish="postCommentFinish"
      />
    </div>
    <div class="comment-list">
      <DataList
        :dataSource="commentListInfo"
        :loading="loading"
        @loadData="loadComment"
      >
        <template #default="{data}">
          <CommentListItem
            :articleId="articleId"
            :commentData="data"
            :articleUserId="articleUserId"
            :currentUserId="currentUserInfo.userId"
            @hiddenAllReply="hiddenAllReplyHandler"
          />
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useStore } from "vuex";
import CommentListItem from "./CommentListItem.vue";
import CommentPost from "./CommentPost.vue";
const { proxy } = getCurrentInstance();
const store = useStore();
const props = defineProps({
  articleId: {
    type: String,
  },
  articleUserId: {
    type: String,
  },
});
const api = {
  loadComment: "/comment/loadComment",
  postComment: "/comment/postComment",
  doLike: "/comment/doLike",
  changeTopType: "/comment/changeTopType",
};

//用户信息
const currentUserInfo = ref({});
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);

//排序
const orderType = ref(0);

//评论列表
const loading = ref(null);
const commentListInfo = ref({});
const loadComment = async () => {
  let params = {
    pageNo: commentListInfo.value.pageNo,
    articleId: props.articleId,
    orderType: orderType.value,
  };
  loading.value = true;
  let result = await proxy.Request({
    url: api.loadComment,
    params: params,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  commentListInfo.value = result.data;
};
loadComment();

//隐藏所有回复框
const hiddenAllReplyHandler = () => {
  commentListInfo.value.list.forEach((element) => {
    element.showReply = false;
  });
};

//发布评论
const postCommentFinish = (resultData) => {
  commentListInfo.value.list.unshift(resultData);
};
</script>

<style lang="scss" scoped>
.comment-body {
  .comment-title {
    display: flex;
    align-items: center;
    .title {
      font-size: 20px;
      .count {
        font-size: 14px;
        padding: 0px 10px;
      }
    }
  }
  .comment-form-panel {
    margin-top: 20px;
  }
}
</style>
