<template>
  <div class="article-item">
    <div class="article-item-inner">
      <div class="article-body">
        <div class="user-info">
          <Avatar :userId="data.userId" :width="30" />
          <router-link :to="'/user/' + data.userId" class="link-info">{{
            data.nickName
          }}</router-link>
          <el-divider direction="vertical"></el-divider>
          <div class="post-time">{{ data.postTime }}</div>
          <el-divider direction="vertical"></el-divider>
          <div class="address">·{{ data.userIpAddress }}</div>
          <el-divider direction="vertical"></el-divider>
          <router-link :to="'/user/' + data.userId" class="link-info">{{
            data.pBoardName
          }}</router-link>

          <template v-if="data.BoardId">
            <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
            <router-link :to="'/user/' + data.userId" class="link-info">{{
              data.boardName
            }}</router-link>
          </template>
        </div>
        <router-link to="/" class="title">{{ data.title }}</router-link>
        <div class="summary">{{ data.summary }}</div>
        <div class="article-info">
          <span class="iconfont icon-eye-solid">{{
            data.readCount == 0 ? "阅读" : data.readCount
          }}</span>
          <span class="iconfont icon-good">{{
            data.goodCount == 0 ? "点赞" : data.goodCount
          }}</span>
          <span class="iconfont icon-comment">{{
            data.commentCount == 0 ? "评论" : data.commentCount
          }}</span>
        </div>
      </div>
      <Cover :cover="data.cover" :width="100" v-if="data.cover"/>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  //文章信息
  data: {
    type: Object,
  },
});
</script>

<style lang="scss" scoped>
.article-item {
  padding: 5px 10px 0 10px;
  .article-item-inner {
    border-bottom: 1px solid #ddd;
    padding: 10px;
    display: flex;
    .article-body {
      flex: 1;
      .user-info {
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #4e5969;
        .link-info {
          margin-left: 5px;
          color: #494949;
          text-decoration: none;
        }
        .link-info:hover {
          color: var(--link);
        }
        .post-time {
          font-size: 13px;
          color: rgb(99, 95, 95);
        }
      }
      .title {
        font-weight: bold;
        font-size: 16px;
        text-decoration: none;
        color: #4a4a4a;
        margin: 10px 0px;
        display: inline-block;
      }
      .summary {
        font-size: 14px;
        color: #86909c;
      }
      .article-info {
        margin-top: 10px;
        display: flex;
        align-items: center;
        font-size: 13px;
        .iconfont {
          color: #86909c;
          margin-right: 25px;
          font-size: 14px;
        }
        .iconfont:before {
          padding-right: 3px;
        }
      }
    }
  }
}
.article-item:hover {
  background: #ddd;
}
</style>
