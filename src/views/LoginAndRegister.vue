<template>
  <div>
    <Dialog
      :Show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      :showCancel="false"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        class="login-register"
      >
        <!--input输入-->
        <el-form-item prop="email" required>
          <el-input
            size="large"
            clearable
            placeholder="请输入邮箱"
            v-model="formData.email"
            maxLength="100"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span> </template
          ></el-input>
        </el-form-item>
        <!-- 登录密码 -->
        <el-form-item prop="password" required v-if="opType === 1">
          <el-input
            size="large"
            placeholder="请输入密码"
            v-model="formData.password"
            show-password
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 注册 -->
        <div v-if="opType === 0 || opType === 2">
          <el-form-item prop="emailCode" required>
            <div class="send-email-panel">
              <el-input
                size="large"
                clearable
                placeholder="请输入邮箱验证码"
                v-model="formData.emailCode"
              >
                <template #prefix>
                  <span class="iconfont icon-checkcode"></span> </template
              ></el-input>
              <el-button
                type="primary"
                size="large"
                class="send-mail-btn"
                @click="getEmailCode"
                >获取验证码</el-button
              >
            </div>
            <el-popover placement="left" :width="450" trigger="click">
              <div>
                <p>1.在垃圾箱中查找邮箱验证码</p>
                <p>
                  2.在邮箱中头像-》设置-》反垃圾-》白名单-》设置邮件地址白名单
                </p>
                <p>3.[2021236373@qq.com】添加到白名单</p>
                <a href="https://www.coderlx.cn/" target="_blank"
                  >不知道怎么设置？</a
                >
              </div>
              <template #reference>
                <span class="a-link" :style="{ 'font-size': '14px' }"
                  >未收到邮箱验证码</span
                >
              </template>
            </el-popover>
          </el-form-item>
          <el-form-item prop="nickname" v-if="opType === 0">
            <el-input
              size="large"
              clearable
              placeholder="请输入昵称"
              v-model="formData.nickname"
              maxLength="20"
            >
              <template #prefix>
                <span class="iconfont icon-account"></span> </template
            ></el-input>
          </el-form-item>
          <el-form-item prop="registerPassword" required>
            <el-input
              size="large"
              placeholder="请输入密码"
              v-model="formData.registerPassword"
              show-password
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="passwordAgain" required>
            <el-input
              size="large"
              placeholder="请再次输入密码"
              v-model="formData.passwordAgain"
              show-password
            >
              <template #prefix>
                <span class="iconfont icon-password"></span> </template
            ></el-input>
          </el-form-item>
        </div>

        <el-form-item prop="checkCode" required>
          <div class="check-code-panel">
            <el-input
              size="large"
              clearable
              placeholder="请输入验证码"
              v-model="formData.checkCode"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span> </template
            ></el-input>
            <img
              :src="checkCodeurl"
              class="check-code"
              @click="changeCheckCode(0)"
            />
          </div>
        </el-form-item>
        <el-form-item>
          <div class="remember-me-panel">
            <el-checkbox v-model="formData.rememberMe" v-if="opType === 1"
              >记住我</el-checkbox
            >
          </div>
          <div class="no-account">
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="showPanel(2)"
              v-if="opType === 1"
              >忘记密码?</a
            >
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="showPanel(0)"
              v-if="opType === 1"
              >没有账号?</a
            >
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="showPanel(1)"
              v-if="opType === 0"
              >已有帐号</a
            >
            <a
              href="javascript:void(0)"
              class="a-link"
              @click="showPanel(1)"
              v-if="opType === 2"
              >去登录</a
            >
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="op-btn" @click="doSubmit"
            ><span v-if="opType === 0">注册</span
            ><span v-if="opType === 1">登录</span
            ><span v-if="opType === 2">重置密码</span></el-button
          >
        </el-form-item>
      </el-form>
    </Dialog>
    <!-- 发送邮箱验证码 -->
    <Dialog
      :Show="dialogConfig4SendMailCode.show"
      :title="dialogConfig4SendMailCode.title"
      :buttons="dialogConfig4SendMailCode.buttons"
      width="500px"
      :showCancel="false"
      @close="dialogConfig4SendMailCode.show = false"
    >
      <el-form
        :model="formData4SendMailCode"
        :rules="rules"
        ref="formData4SendMailCodeRef"
        label-width="80px"
      >
        <el-form-item label="邮箱">
          {{ formData.email }}
        </el-form-item>
        <el-form-item label="验证码" prop="checkCode">
          <div :style="{ display: 'flex' }">
            <el-input
              size="large"
              clearable
              placeholder="请输入验证码"
              v-model="formData4SendMailCode.checkCode"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img
              :src="checkCodeurl4SendMailCode"
              class="check-code"
              @click="changeCheckCode(1)"
            />
          </div>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";

const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const api = {
  checkCode: "/api/checkCode",
  sendMailCode: "/sendEmailCode",
  register: "/register",
  login: "/login",
  resetPwd: "/resetPwd",
};
//0:注册 1：登录 2：重置密码
const opType = ref();
const showPanel = (type) => {
  opType.value = type;
  resetForm();
};
const dialogConfig4SendMailCode = reactive({
  show: false,
  title: "发送邮箱验证码",
  buttons: [
    {
      type: "primary",
      text: "发送验证码",
      click: () => {
        sendEmailCode();
      },
    },
  ],
});
const getEmailCode = () => {
  formDataRef.value.validateField("email", (valid) => {
    if (!valid) {
      return;
    } else {
      dialogConfig4SendMailCode.show = true;
      nextTick(() => {
        changeCheckCode(1);
        formData4SendMailCodeRef.value.resetFields();
        formData4SendMailCode.value = {
          email: formData.value.email,
        };
      });
    }
  });
};
//发送邮件
const sendEmailCode = () => {
  formData4SendMailCodeRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    } else {
      const params = Object.assign({}, formData4SendMailCode.value);
      params.type = opType.value == 0 ? 0 : 1;
      let result = await proxy.Request({
        url: api.sendMailCode,
        params: params,
        errorCallback: () => {
          changeCheckCode(1);
        },
      });
      if (!result) {
        return;
      }
      proxy.Message.success("验证码发送成功,请登录邮箱查看");
      dialogConfig4SendMailCode.show = false;
    }
  });
};
//登录，注册，弹窗配置
const dialogConfig = reactive({
  show: false,
  title: "登录",
  buttons: [],
});

const checkRePassword = (rule, value, callback) => {
  if (value !== formData.value.registerPassword) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
const formData = ref({});
const formDataRef = ref();
const formData4SendMailCode = ref({});
const formData4SendMailCodeRef = ref({});
const rules = reactive({
  // email: [{ required: true, message: "请输入邮箱" }],
  // emailCode: [{ required: true, message: "请输入邮箱收到的验证码" }],
  // password: [
  //   { required: true, message: "请输入密码", trigger: "blur" },
  //   {
  //     message: "请输入8位以上带数字或字母的密码",
  //     pattern: /^[a-zA-Z0-9]{8,}$/,
  //     trigger: "change",
  //   },
  // ],
  // passwordAgain: [
  //   {
  //     required: true,
  //     message: "请再次输入密码",
  //   },
  //   { validator: (rule, value, callback, source) => {} },
  // ],
  // checkcode: [{ required: true, message: "请输入验证码" }],
  email: [
    { required: true, message: "请输入邮箱" },
    { validator: proxy.Verify.email, message: "请输入正确的邮箱" },
  ],
  password: [{ required: true, message: "请输入密码" }],
  emailCode: [{ required: true, message: "请输入邮箱验证码" }],
  nickName: [{ required: true, message: "请输入昵称" }],
  registerPassword: [
    { required: true, message: "请输入密码" },
    {
      validator: proxy.Verify.password,
      message: "密码只能是数字，字母，特殊字符 8-18位",
    },
  ],
  passwordAgain: [
    { required: true, message: "请再次输入密码" },
    {
      validator: checkRePassword,
      message: "两次输入的密码不一致",
    },
  ],
  checkCode: [{ required: true, message: "请输入图片验证码" }],
});
//验证码
const checkCodeurl = ref(api.checkCode);
const checkCodeurl4SendMailCode = ref(api.checkCode);
const changeCheckCode = (type) => {
  if (type == 0) {
    checkCodeurl.value =
      api.checkCode + "?type=" + type + "&time=" + new Date().getTime();
  } else {
    checkCodeurl4SendMailCode.value =
      api.checkCode + "?type=" + type + "&time=" + new Date().getTime();
  }
};
//密码显示隐藏
const passwordEyeType = reactive({
  passwordEyeOpen: false,
  RegisterPasswordEyeOpen: false,
  reRegisterPasswordEyeOpen: false,
});
const eyeChange = (type) => {
  passwordEyeType[type] = !passwordEyeType[type];
};
//发送邮箱验证码弹窗
//重置表单
const resetForm = () => {
  dialogConfig.show = true;
  if (opType.value === 0) {
    dialogConfig.title = "注册";
  } else if (opType.value === 1) {
    dialogConfig.title = "登录";
  } else if (opType === 2) {
    dialogConfig.title = "重置密码";
  }
  nextTick(() => {
    changeCheckCode(0);
    formDataRef.value.resetFields();
    formData.value = {};
  });
};
//登录、注册、重置密码 提交表单
const doSubmit = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    //注册
    if (opType.value == 0 || opType.value == 2) {
      params.password = params.registerPassword;
      delete params.registerPassword;
      delete params.registerPassword;
    }
    let url = null;
    if (opType.value == 0) {
      url = api.register;
    } else if (opType.value == 1) {
      url = api.login;
    } else if (opType.value == 2) {
      url = api.resetPwd;
    }
    let result = await proxy.Request({
      url: url,
      params: params,
      errorCallback: () => {
        changeCheckCode(0);
      },
    });

    if (!result) {
      return;
    }
    //注册返回
    if (opType.value == 0) {
      proxy.Message.success("注册成功，请返回登录窗口登录");
      showPanel(1);
    }
    //登录
    else if (opType.value == 1) {
    }
    //重置密码
    else if (opType.value === 2) {
      proxy.Message.success("重置密码成功，请返回登录窗口登录");
      showPanel(1);
    }
  });
};
defineExpose({ showPanel });
</script>

<style lang="scss" scoped>
.login-register {
  .send-email-panel {
    display: flex;
    width: 100%;
    .send-mail-btn {
      margin-left: 5px;
    }
  }
  .check-code-panel {
    display: flex;
    .check-code {
      margin-left: 5px;
      cursor: pointer;
    }
  }
  .remember-me-panel {
    width: 100%;
  }
  .no-account {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
  .op-btn {
    width: 100%;
  }
}
</style>
