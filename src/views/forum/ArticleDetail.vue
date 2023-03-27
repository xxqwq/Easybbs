<template>
  <div
    class="container-body article-detail-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
    v-if="Object.keys(articleInfo).length > 0"
  >
    <div class="board-info">
      <router-link :to="`/forum/${articleInfo.pBoardId}`" class="a-link">{{
        articleInfo.pBoardName
      }}</router-link>
      <span class="iconfont icon-right"></span>
      <template v-if="articleInfo.boardId">
        <router-link
          :to="`/forum/${articleInfo.pBoardId}/${articleInfo.boardId}`"
          class="a-link"
          >{{
            articleInfo.boardId ? articleInfo.boardName : "全部"
          }}</router-link
        >
        <span class="iconfont icon-right"></span>
      </template>

      <span>{{ articleInfo.title }}</span>
    </div>
    <div
      class="detail-container"
      :style="{ width: proxy.globalInfo.bodyWidth - 300 + 'px' }"
    >
      <div class="article-detail">
        <!-- 标题 -->
        <div class="title">{{ articleInfo.title }}</div>
        <!-- 用户信息 -->
        <div class="user-info">
          <Avatar :userId="articleInfo.userId" :width="50" />
          <div class="user-info-detail">
            <router-link
              class="nick-name a-link"
              :to="`/user/${articleInfo.userId}`"
              >{{ articleInfo.nickName }}</router-link
            >
            <div class="time-info">
              <span>{{ articleInfo.postTime }}</span>
              <span
                >&nbsp;&nbsp;·&nbsp;&nbsp;{{ articleInfo.userIpAddress }}</span
              >
              <span class="iconfont icon-eye-solid">{{
                articleInfo.readCount == 0 ? "阅读" : articleInfo.readCount
              }}</span>
            </div>
          </div>
        </div>
        <!-- 文章详情 -->
        <div class="detail" id="detail" v-html="articleInfo.content"></div>
      </div>
      <!-- 附件 -->
      <div class="attachment-panel" v-if="attachment" id="view-attachment">
        <div class="title">附件</div>
        <div class="attachment-info">
          <div class="iconfont icon-zip item"></div>
          <div class="file-name item">{{ attachment.fileName }}</div>
          <div class="size item">
            {{ proxy.Utils.sizeToStr(attachment.fileSize) }}
          </div>
          <div class="item">
            需要<span class="integral">{{ attachment.integral }}积分</span>
          </div>
          <div class="download-count item">
            已下载{{ attachment.downloadCount }}次
          </div>
          <div class="download-btn item">
            <el-button
              type="primary"
              size="small"
              @click="downloadAttachment(attachment.fileId)"
              >下载</el-button
            >
          </div>
        </div>
      </div>
      <!-- 评论 -->
      <div class="comment-panel" id="view-comment">
        <CommentList
          :articleId="articleInfo.articleId"
          :articleUserId="articleInfo.userId"
          v-if="articleInfo.articleId"
        />
      </div>
    </div>
    <!-- 左侧快捷操作 -->
    <div class="quick-panel" :style="{ left: quickPanelLeft + 'px' }">
      <!-- 点赞 -->
      <el-badge
        :value="articleInfo.goodCount"
        type="info"
        :hidden="!articleInfo.goodCount > 0"
      ></el-badge>
      <div class="quick-item" @click="doLikeHandler">
        <span
          :class="['iconfont', 'icon-good', haveLike ? 'have-like' : '']"
        ></span>
      </div>
      <!-- 评论 -->
      <el-badge
        :value="articleInfo.commentCount"
        type="info"
        :hidden="!articleInfo.commentCount > 0"
      ></el-badge>
      <div class="quick-item" @click="goToPostion('view-comment')">
        <span class="iconfont icon-comment"></span>
      </div>

      <!-- 附件-->
      <div class="quick-item" @click="goToPostion('view-attachment')">
        <span class="iconfont icon-attachment"></span>
      </div>
      <!-- 图片预览 -->
      <ImageViewer
        ref="imageViewerRef"
        :imageList="previewImgList"
      ></ImageViewer>
    </div>
  </div>
</template>

<script setup>
import hljs from "highlight.js";
import { ref, reactive, getCurrentInstance, onMounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import CommentList from "@/views/forum/CommentList.vue";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
const api = {
  getArticleDetail: "/forum/getArticleDetail",
  doLike: "/forum/doLike",
  getUserDownloadInfo: "/forum/getUserDownloadInfo",
  attachmentDownload: "/api/forum/attachmentDownload",
};
//文章详情
const articleInfo = ref({});

//附件
const attachment = ref({});
//是否已点赞
const haveLike = ref(false);
//点赞
const doLikeHandler = async () => {
  if (!store.getters.getLoginUserInfo) {
    store.commit("showLogin", true);
    return;
  }
  let result = await proxy.Request({
    url: api.doLike,
    params: {
      articleId: articleInfo.value.articleId,
    },
  });
  if (!result) {
    return;
  }
  haveLike.value = !haveLike.value;
  let goodCount = 1;
  if (!haveLike.value) {
    goodCount = -1;
  }
  articleInfo.value.goodCount += goodCount;
};

const getArticleDetail = async (articleId) => {
  let result = await proxy.Request({
    url: api.getArticleDetail,
    params: {
      articleId: articleId,
    },
  });
  if (!result) {
    return;
  }
  articleInfo.value = result.data.forumArticle;
  attachment.value = result.data.attachment;
  haveLike.value = result.data.haveLike;

  store.commit("setactivePboardId", result.data.forumArticle.pBoardId);
  store.commit("setActiveBoardId", result.data.forumArticle.boardId);
  //图片预览
  imagePreview();
  //代码高亮
  highlightCode();
};

onMounted(() => {
  getArticleDetail(route.params.articleId);
});
//快捷操作
const quickPanelLeft =
  (window.innerWidth - proxy.globalInfo.bodyWidth) / 2 - 110;

//跳转
const goToPostion = (domId) => {
  document.querySelector("#" + domId).scrollIntoView();
};

//下载附件
const downloadAttachment = async (fileId) => {
  const currentUserInfo = store.getters.getLoginUserInfo;
  if (!store.getters.getLoginUserInfo) {
    store.commit("showLogin", true);
    return;
  }
  //0积分的情况
  if (
    attachment.value.integral == 0 ||
    currentUserInfo.userId == articleInfo.value.userId
  ) {
    downloadDo(fileId);
    return;
  }
  //获取用户下载信息
  let result = await proxy.Request({
    url: api.getUserDownloadInfo,
    params: {
      fileId: fileId,
    },
  });
  if (!result) {
    return;
  }
  //判断用户是否下载过
  if (result.data.haveDownload) {
    downloadDo(fileId);
    return;
  }
  //判断用户积分是否够
  if (result.data.userIntegral < attachment.value.integral) {
    proxy.Message.warning("你的积分不够，无法下载");
    return;
  }

  proxy.Confirm(
    `你还有${result.data.userIntegral}积分，当前下载会扣除${attachment.value.integral},确定要下载吗?`,
    () => {
      downloadDo(fileId);
    }
  );

  // if(result.data>attachment.value.integral||currentUserInfo.userId==articleInfo.userId){

  // }
};

const downloadDo = (fileId) => {
  document.location.href = api.attachmentDownload + "?fileId=" + fileId;
  attachment.value.downloadCount += 1;
};

//文章图片列表
const imageViewerRef = ref(null);
const previewImgList = ref([]);
const imagePreview = () => {
  nextTick(() => {
    const imageNodeList = document
      .querySelector("#detail")
      .querySelectorAll("img");
    const imageList = [];
    imageNodeList.forEach((item, index) => {
      const src = item.getAttribute("src");
      imageList.push(src);
      item.addEventListener("click", () => {
        imageViewerRef.value.show(index);
      });
    });
    previewImgList.value = imageList;
  });
};
//代码高亮
const highlightCode = () => {
  nextTick(() => {
    let blocks = document.querySelectorAll("pre code");
    blocks.forEach((item) => {
      hljs.highlightBlock(item);
    });
  });
};
</script>

<style lang="scss" scoped>
.article-detail-body {
  .board-info {
    line-height: 40px;
    .icon-right {
      margin: 0px 10px;
    }
  }
  .detail-container {
    .article-detail {
      background-color: #ffffff;
      padding: 10px;
      .title {
        font-weight: bold;
      }
      .user-info {
        margin-top: 15px;
        display: flex;
        padding-bottom: 10px;
        .user-info-detail {
          margin-left: 10px;
          .nick-name {
            text-decoration: none;
            color: #4e5959;
            font-size: 15px;
          }
          .nick-name:hover {
            color: var(--link);
          }
          .time-info {
            margin-top: 5px;
            font-size: 13px;
            color: var(--text2);
            .iconfont {
              margin-left: 10px;
            }
            .iconfont:before {
              padding-right: 3px;
            }
          }
        }
      }
      .detail {
        letter-spacing: 1px;
        line-height: 22px;
        a {
          text-decoration: none;
          color: var(--link);
        }
        img {
          max-width: 90%;
          cursor: pointer;
        }
      }
    }
    .attachment-panel {
      margin-top: 20px;
      background-color: #fff;
      padding: 20px;
      .title {
        font-size: 18px;
      }
      .attachment-info {
        display: flex;
        align-items: center;
        color: #9f9f9f;
        margin-top: 10px;
        .item {
          margin-right: 10px;
        }
        .icon-zip {
          font-size: 20px;
          color: var(--link);
        }
        .file-name {
          color: var(--link);
        }
        .integral {
          color: red;
          padding: 0px 5px;
        }
      }
    }
    .comment-panel {
      margin-top: 20px;
      background: #fff;
      padding: 20px;
    }
  }
}

.quick-panel {
  position: fixed;
  width: 50px;
  top: 200px;
  text-align: center;
  .el-badge__content.is-fixed {
    top: 5px;
    right: 15px;
  }
  .quick-item {
    display: flex;
    width: 50px;
    height: 50px;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: #fff;
    margin-bottom: 30px;
    cursor: pointer;
    .iconfont {
      font-size: 22px;
      color: var(--text2);
    }
    .have-like {
      color: red;
    }
  }
}
</style>
