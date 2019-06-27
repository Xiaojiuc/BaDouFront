<template>
  <div>
    <el-upload
      class="upload-demo"
      ref="upload"
      action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :auto-upload="true"
    >
      <el-button slot="trigger" size="small" @click="handlePreview" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
      <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>

<script>
export default {
  data() {
    return {
      fileList: [ ]
    };
  },
  methods: {
    submitUpload() {
        alert("submitUpload");
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
        alert("handleRemove");
      console.log(file, fileList);
    },
    handlePreview(file) {
        alert("handlePreview");
      console.log(file);
    }
  }
};
</script>