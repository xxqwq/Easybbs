<template>
  <div class="comment-item">
    <Avatar :userId="commentData.userId" :width="50"></Avatar>
    <div class="comment-info">
      <div class="nick-name">
        <span class="name">{{ commentData.nickName }}</span>
        <span v-if="commentData.userId == articleUserId" class="tag-author"
          >作者</span
        >
      </div>
      <div class="comment-content">
        <span v-html="commentData.content"></span>
      </div>
      <div class="op-panel">
        <div class="time">
          <span>{{ commentData.postTime }}</span>
          <span>&nbsp;&nbsp;·&nbsp;&nbsp;{{ commentData.userIpAddress }} </span>
        </div>
        <div class="iconfont icon-good">
          {{ commentData.goodCount > 0 ? commentData.goodCount : "点赞" }}
        </div>
        <div class="iconfont icon-comment">回复</div>
        <el-dropdown v-if="articleUserId == currentUserId">
          <div class="iconfont icon-more"></div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>
                {{ commentData.topType == 0 ? "设为置顶" : "" }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  commentData: {
    type: Object,
  },
  articleUserId: {
    type: String,
  },
  currentUserId: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  padding-top: 15px;
  .comment-info {
    margin-left: 10px;
    border-bottom: 1px solid #ddd;
    padding-bottom:15px;
    flex: 1;
    .nick-name {
      .name {
        font-size: 14px;
        color: var(--text2);
        margin-right: 10px;
        cursor: pointer;
      }
      .tag-author {
        background: var(--pink);
        color: #fff;
        font-size: 12px;
        border-radius: 2px;
      }
    }
    .comment-content {
      margin-top: 5px;
      font-size: 15px;
      line-height: 22px;
    }
    .op-panel {
      display: flex;
      margin-top: 5px;
      font-size: 13px;
      color:var(--text2);
      align-items: center;
      .time{
        margin-right: 20px;
      }
      .iconfont{
        margin-right: 15px;
        font-size:14px;
        color:var(--icon)
      }
      .iconfont::before{
        margin-right: 3px;
      }
    }
  }
}
</style>
