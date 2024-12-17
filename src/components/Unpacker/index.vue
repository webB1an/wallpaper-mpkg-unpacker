<script lang="ts" setup>
import type { UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'
import { ElMessage, genFileId } from 'element-plus'

import { useUnpacker } from '@/hooks/unpacker'

function getFileExtension(fileNameWidthExt: string) {
  const arr = fileNameWidthExt.split('.')
  const ext = arr.pop()
  const fileName = arr.join('.')
  return {
    ext,
    fileName,
  }
}
const downloadName = ref('')
const fileList = ref<UploadUserFile[]>([])
const uploadRef = ref<UploadInstance>()
const { PkgReaderV1, checkRequirements, downloadLink, downloadSize } = useUnpacker()

const decoderV1 = new PkgReaderV1()

onMounted(() => {
  if (!checkRequirements())
    ElMessage.error('当前浏览器不支持解包')
})

const fileChange: UploadProps['onChange'] = async (file) => {
  const { fileName, ext } = getFileExtension(file.name)
  downloadName.value = fileName
  if (ext === 'mpkg' || ext === 'pkg') {
    const fr = new FileReader()
    fr.onload = function (e) {
      const content = new Uint8Array(e.target!.result as ArrayBuffer)

      const version = decoderV1.readVersionString(content)
      switch (version) {
        case 'PKGV0001':
        case 'PKGV0002':
        case 'PKGV0003':
        case 'PKGV0004':
        default: // disabled version check
          decoderV1.decodeFile(content)
          break
      }
    }
    fr.readAsArrayBuffer(file.raw!)
  }
  else {
    uploadRef.value!.clearFiles()
    ElMessage.error('请上传.mpkg或.pkg文件')
  }
}
const fileExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}
</script>

<template>
  <div class="unpacker mx-auto mt-5 h-510px max-w-1000px flex">
    <div class="upload-mpkg w-3/5 flex flex-col justify-between">
      <el-card>
        <el-upload
          ref="uploadRef"
          v-model:file-list="fileList"
          class="upload-container"
          :auto-upload="false"
          :on-change="fileChange"
          :on-exceed="fileExceed"
          drag
          :limit="1"
        >
          <svg class="mx-auto w-100px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024"><path fill="currentColor" d="M544 864V672h128L512 480 352 672h128v192H320v-1.6c-5.376.32-10.496 1.6-16 1.6A240 240 0 0 1 64 624c0-123.136 93.12-223.488 212.608-237.248A239.808 239.808 0 0 1 512 192a239.872 239.872 0 0 1 235.456 194.752c119.488 13.76 212.48 114.112 212.48 237.248a240 240 0 0 1-240 240c-5.376 0-10.56-1.28-16-1.6v1.6z" /></svg>
          <div class="el-upload__text">
            拖拽文件到此处或者<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              请上传 pkg 或者 mpkg 文件
            </div>
          </template>
        </el-upload>

        <a v-if="downloadLink" class="mt-2 inline-block flex rounded bg-#0d41ba px-4 py-2 text-14px text-white hover:bg-#113383" :href="downloadLink" :download="downloadName">
          <el-text line-clamp="1" class="!text-white">
            下载 {{ downloadName }}.zip（{{ downloadSize }}KB）
          </el-text>
        </a>
      </el-card>

      <el-card class="mt-5">
        <template #header>
          <div class="card-header">
            <span>Wallpaper Engine 壁纸分享</span>
          </div>
        </template>
        <div class="flex items-center">
          <a href="https://pan.quark.cn/s/077520ec1974" target="_blank">
            <img class="w-100px" src="../../icons/quark.svg" alt="quark">
          </a>
        </div>
      </el-card>
    </div>
    <div class="ml-10px flex flex-1 flex-col justify-between text-14px">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>关于</span>
          </div>
        </template>
        <p>
          项目脱胎于：<a class="font-bold text-#0d41ba" href="https://wetranslate.thiscould.work/scene.pkg/">scene.pkg unpacker</a>，我只是把项目搬运过来，做了简单的改造。
        </p>
        <p class="mt-2">
          本项目主要用于个人分享壁纸用，因为有些壁纸并不是视频，需要通过这种方式将 mpkg 文件解包获取视频文件。
        </p>
        <p class="mt-2">
          注意：<b>并不是每个 mpkg 文件解包后，都会有视频文件！</b>
        </p>
      </el-card>

      <el-card class="mt-5">
        <div>
          <img src="../../icons/bug_feedback.png" alt="bug 反馈">
        </div>
      </el-card>
    </div>
  </div>
</template>

<style>
.upload-container .el-upload-list__item-info {
  margin-left: 0 !important;
}
.upload-container .el-upload-list__item-name {
  padding-left: 0;
}
.upload-loading .el-loading-spinner .circular {
  background: url(../../icons/logo_without_bg.gif) no-repeat center center;
  background-size: 50px 50px;
  animation: unset;
}
.upload-loading .el-loading-spinner .path {
  display: none;
}
</style>
