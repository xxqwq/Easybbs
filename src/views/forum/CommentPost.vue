<template>
  <div class="post-comment-panel">
    <div class="comment-form-panel">
      <Avatar :width="avatarWidth" :userId="userId"></Avatar>
      <div class="comment-form">
        <el-form
          :model="formData"
          :rules="rules"
          ref="formDataRef"
          @submit.prevent
        >
          <!--textarea输入-->
          <el-form-item prop="content">
            <el-input
              clearable
              :placeholder="placeholderInfo"
              type="textarea"
              :maxlength="800"
              resize="none"
              show-word-limit
              v-model="formData.content"
            ></el-input>
            <div class="insert-img" v-if="showInsertImg">
              <el-upload
                name="file"
                :show-file-list="false"
                accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
                :http-request="selectImg"
              >
                <span class="iconfont icon-image"></span>
              </el-upload>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="send-btn" @click="postCommentDo">发表</div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  postComment: "/comment/postComment",
};
const props = defineProps({
  articleId: {
    type: String,
  },
  pCommentId: {
    type: Number,
  },
  replyUserId: {
    type: String,
  },
  avatarWidth: {
    type: Number,
  },
  userId: {
    type: String,
  },
  showInsertImg: {
    type: Boolean,
  },
  placeholderInfo: {
    type: String,
    default: "请文明发言，做一个棒棒的程序员",
  },
});
const formData = ref({});
const formDataRef = ref();
const rules = {
  content: [
    { required: true, message: "请输入评论内容" },
    { min: 5, message: "评论至少5个字" },
  ],
};
// 选择图片
const selectImg = () => {};

const emit = defineEmits(["postCommentFinish"]);
//发表评论
const postCommentDo = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = Object.assign({}, formData.value);
    params.articleId = props.articleId;
    params.pCommentId = props.pCommentId;
    params.replyUserId = props.replyUserId;
    let result = await proxy.Request({
      url: api.postComment,
      params:params
    });
    if (!result) {
      return;
    }
    proxy.Message.success("评论发表成功");
    formDataRef.value.resetFields();
    emit("postCommentFinish", result.data);
  });
};
</script>

<style lang="scss" scoped>
.post-comment-panel {
  .comment-form-panel {
    display: flex;
    align-items: top;
    .comment-form {
      flex: 1;
      margin: 0px 10px;
      .el-textarea__inner {
        height: 60px;
      }
      .insert-image {
        line-height: normal;
        .iconfont {
          margin-top: 3px;
          font-size: 20px;
        }
      }
    }
    .send-btn {
      width: 60px;
      height: 60px;
      background: var(--link);
      color: #fff;
      text-align: center;
      line-height: 60px;
      border-radius: 5px;
      cursor: pointer;
    }
  }
}
</style>
