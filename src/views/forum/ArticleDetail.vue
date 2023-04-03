<template>
  <div>
    <div
      class="container-body article-detail-body"
      :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
      v-if="Object.keys(articleInfo).length > 0"
    >
      <!-- 板块导航 -->
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
      <!-- 文章详情 -->
      <div
        class="detail-container"
        :style="{ width: proxy.globalInfo.bodyWidth - 300 + 'px' }"
      >
        <div class="article-detail">
          <!-- 标题 -->
          <div class="title">
            {{ articleInfo.title }}
            <el-tag v-if="articleInfo.status == 0" type="danger">待审核</el-tag>
          </div>
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
                  >&nbsp;&nbsp;·&nbsp;&nbsp;{{
                    articleInfo.userIpAddress
                  }}</span
                >
                <span class="iconfont icon-eye-solid">{{
                  articleInfo.readCount == 0 ? "阅读" : articleInfo.readCount
                }}</span>
                <router-link
                  v-if="articleInfo.userId == currentUserInfo.userId"
                  :to="`/editPost/${articleInfo.articleId}`"
                  class="a-link btn-edit"
                >
                  <span class="iconfont icon-edit">编辑</span>
                </router-link>
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
            @updateCommentCount="updateCommentCount"
          />
        </div>
      </div>
      <!-- 目录 -->
      <div class="toc-panel">
        <div class="top-container">
          <div class="toc-title">目录</div>
          <div class="toc-list">
            <template v-if="tocArray.length == 0">
              <div class="no-toc">未解析到目录</div>
            </template>
            <template v-else>
              <div v-for="toc in tocArray">
                <span
                  @click="gotoAnchor(toc.id)"
                  :class="['toc-item', toc.id == anchorId ? 'active' : '']"
                  :style="{ 'padding-left': toc.level * 15 + 'px' }"
                  >{{ toc.title }}</span
                >
              </div>
            </template>
          </div>
        </div>
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
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  nextTick,
  onUnmounted,
  watch,
} from "vue";
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
const currentUserInfo = ref({});
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
  //目录生成
  makeToc();
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
  if (!currentUserInfo.value) {
    store.commit("showLogin", true);
    return;
  }
  //0积分的情况
  if (
    attachment.value.integral == 0 ||
    currentUserInfo.value.userId == articleInfo.value.userId
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

//更新评论数量
const updateCommentCount = (totalCount) => {
  articleInfo.value.commentCount = totalCount;
};
//获取目录
const tocArray = ref([]);
const makeToc = () => {
  nextTick(() => {
    const tocTags = ["H1", "H2", "H3", "H4", "H5", "H6"];
    //获取所有H标签
    const contentDom = document.querySelector("#detail");
    const childNodes = contentDom.childNodes;

    let index = 0;
    childNodes.forEach((item) => {
      let tagName = item.tagName;
      if (tagName == undefined || !tocTags.includes(tagName.toUpperCase())) {
        return true;
      }
      index++;
      let id = "toc" + index;
      item.setAttribute("id", id);
      tocArray.value.push({
        id: id,
        title: item.innerText,
        level: Number.parseInt(tagName.substring(1)),
        offsetTop: item.offsetTop,
      });
    });
  });
};

//定位
const anchorId = ref(null);
const gotoAnchor = (domId) => {
  const dom = document.querySelector("#" + domId);
  dom.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
};

const listenerScroll = () => {
  let currentScrollTop = getScrollTop();
  tocArray.value.some((item, index) => {
    if (
      (index < tocArray.value.length - 1 &&
        currentScrollTop >= tocArray.value[index].offsetTop &&
        currentScrollTop < tocArray.value[index + 1].offsetTop) ||
      (index == tocArray.value.length - 1 &&
        currentScrollTop < tocArray.value[index].offsetTop)
    ) {
      anchorId.value = item.id;
      return true;
    }
  });
};

//获取滚动条的高度
const getScrollTop = () => {
  let scrollTop =
    document.documentElement.scrollTop ||
    window.pageYOffset ||
    document.body.scrollTop;
  return scrollTop;
};

onMounted(() => {
  window.addEventListener("scroll", listenerScroll);
});
onUnmounted(() => {
  window.removeEventListener("scroll", listenerScroll);
});
// 监听登录用户
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = store.getters.getLoginUserInfo || {};
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.article-detail-body {
  position: relative;
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
            .btn-edit {
              .iconfont {
                font-size: 14px;
              }
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
.toc-panel {
  position: absolute;
  top: 45px;
  right: 0px;
  width: 285px;

  .top-container {
    width: 285px;
    position: fixed;
    background: #fff;
    height: 500px;
    .toc-title {
      border-bottom: 1px solid #ddd;
      padding: 10px;
    }
    .toc-list {
      max-height: calc(100vh - 200px);
      overflow: auto;
      padding: 5px;
      .no-toc {
        text-align: center;
        color: #5f5d5d;
        line-height: 40px;
        font-size: 13px;
      }
      .toc-item {
        cursor: pointer;
        display: block;
        line-height: 35px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #555666;
        border-radius: 3px;
        font-size: 14px;
        border-left: 2px solid #fff;
      }
      .toc-item:hover {
        background: #fff;
      }
      .active {
        border-left: 2px solid #6ca1f7;
        border-radius: 0px 3px 3px 0px;
      }
    }
  }
}
</style>
