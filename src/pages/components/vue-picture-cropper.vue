<script lang="ts">
import { defineComponent, reactive, ref } from "vue"
import VuePictureCropper, { cropper } from "vue-picture-cropper"
// Only used in demo
import { getLocales } from "./live-demo"

export default defineComponent({
  components: {
    VuePictureCropper
  },
  setup() {
    const locales = getLocales()
    const isShowModal = ref<boolean>(false)
    const uploadInput = ref<HTMLInputElement | null>(null)
    const pic = ref<string>("")
    const result = reactive({
      dataURL: "",
      blobURL: ""
    })

    /**
     * Select the picture to be cropped
     */
    function selectFile(e: Event) {
      // Reset last selection and results
      pic.value = ""
      result.dataURL = ""
      result.blobURL = ""

      // Get selected files
      const { files } = e.target as HTMLInputElement
      if (!files || !files.length) return

      // Convert to dataURL and pass to the cropper component
      const file = files[0]
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        // Update the picture source of the `img` prop
        pic.value = String(reader.result)

        // Show the modal
        isShowModal.value = true

        // Clear selected files of input element
        if (!uploadInput.value) return
        uploadInput.value.value = ""
      }
    }

    /**
     * Get cropping results
     */
    async function getResult() {
      if (!cropper) return
      const base64 = cropper.getDataURL()
      const blob: Blob | null = await cropper.getBlob()
      if (!blob) return

      const file = await cropper!.getFile({
        fileName: locales.fileName
      })

      console.log({ base64, blob, file })
      result.dataURL = base64
      result.blobURL = URL.createObjectURL(blob)
      isShowModal.value = false
    }

    return {
      // Only used in demo
      locales,

      // Data
      uploadInput,
      pic,
      result,
      isShowModal,

      // Methods
      selectFile,
      getResult
    }
  }
})
</script>

<template>
  <div class="live-demo">
    <!-- Select a picture for cropping -->
    <section class="section">
      <p>{{ locales.tips }}</p>

      <!-- Set a button that invokes selecting an image -->
      <button class="select-picture">
        <span>{{ locales.selectPictureButtonText }}</span>
        <input
          ref="uploadInput"
          type="file"
          accept="image/jpg, image/jpeg, image/png, image/gif"
          @change="selectFile"
        >
      </button>
    </section>

    <!-- Crop result preview -->
    <section class="section" v-if="result.dataURL && result.blobURL">
      <p>{{ locales.previewTips.dataURL }}</p>
      <div class="preview">
        <img :src="result.dataURL">
      </div>
      <p>{{ locales.previewTips.blob }}</p>
      <div class="preview">
        <img :src="result.blobURL">
      </div>
      <p>{{ locales.previewTips.print }}</p>
    </section>

    <!-- A Popup for cropping -->
    <!-- You can replace it with the framework's Modal component -->
    <div class="modal-wrap" v-if="isShowModal">
      <div class="modal-mask" />
      <div class="modal-scroll-view">
        <div class="modal">
          <div class="modal-title">
            <span class="title">{{ locales.modal.title }}</span>
            <div class="tools">
              <button class="" @click="isShowModal = false">
                {{ locales.modal.btnCancelText }}
              </button>
              <button class=" primary" @click="getResult">
                {{ locales.modal.btnCropText }}
              </button>
            </div>
          </div>

          <div class="modal-content">
            <!-- The component imported from `vue-picture-cropper` plugin -->
            <VuePictureCropper
              :box-style="{
                width: '100%',
                height: '100%',
                backgroundColor: '#f8f8f8',
                margin: 'auto',
              }"
              :img="pic"
              :options="{
                viewMode: 1,
                dragMode: 'move',
                aspectRatio: 16 / 8,
                cropBoxResizable: false,
              }"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.mixin-button {
  display: inline-block;
  border: 1px solid transparent;
  text-align: center;
  white-space: nowrap;
  transition:
    color 0.25s,
    border-color 0.25s,
    background-color 0.25s;
  cursor: pointer;
}

.live-demo {
  --demo-spacing: 12px;

  .section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }
  .select-picture {
    position: relative;
    line-height: 38px;
    font-size: 14px;
    color: var(--vp-button-brand-text);
    border-color: var(--vp-button-brand-border);
    background-color: var(--vp-button-brand-bg);
    border-radius: 20px;
    padding: 0 40px;
    margin-bottom: 1em;
    &:hover {
      border-color: var(--vp-button-brand-hover-border);
      color: var(--vp-button-brand-hover-text);
      background-color: var(--vp-button-brand-hover-bg);
    }
    input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: 0;
      cursor: pointer;
      opacity: 0;
    }
  }
  .preview {
    display: flex;
    width: 100%;
    max-width: 800px;
    margin-bottom: 1em;
    img {
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
    }
  }
  .modal-wrap {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 99;
    .modal-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(101, 108, 133, 0.8);
    }
    .modal-scroll-view {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
    }
    .modal {
      position: relative;
      top: 100px;
      width: 800px;
      max-width: calc(100vw - var(--demo-spacing));
      background-color: var(--vp-c-bg-soft);
      border-radius: 4px;
      margin: 0 auto 200px;
      box-sizing: border-box;
      .modal-title {
        display: flex;
        align-items: center;
        width: 100%;
        height: 60px;
        box-sizing: border-box;
        padding: 0 var(--demo-spacing);
        border-bottom: 1px solid var(--vp-c-divider);
        .title {
          color: var(--vp-button-alt-text);
          font-size: 1.2em;
          word-wrap: break-word;
        }
        .tools {
          display: flex;
          flex: 1;
          justify-content: flex-end;
          align-items: center;
          overflow: hidden;
          .btn {
            position: relative;
            line-height: 32px;
            font-size: 14px;
            color: var(--vp-button-alt-text);
            border-color: var(--vp-button-alt-border);
            background-color: var(--vp-button-alt-bg);
            border-radius: 4px;
            padding: 0 30px;
            margin-left: var(--demo-spacing);
            .mixin-button();
            &.primary {
              color: var(--vp-button-brand-text);
              border-color: var(--vp-button-brand-border);
              background-color: var(--vp-button-brand-bg);
              &:hover {
                color: var(--vp-button-brand-hover-text);
                border-color: var(--vp-button-brand-hover-border);
                background-color: var(--vp-button-brand-hover-bg);
              }
            }
            &:hover {
              color: var(--vp-button-alt-hover-text);
              border-color: var(--vp-button-alt-hover-border);
              background-color: var(--vp-button-alt-hover-bg);
            }
          }
        }
      }
      .modal-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: var(--demo-spacing);
      }
    }
  }
}
</style>
