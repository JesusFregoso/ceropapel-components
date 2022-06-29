<template>
  <div>
    <client-only>
      <mtx-document-editor service-url="https://api.ceropapel.dev/v1/word-processor" />
      <mtx-pdf-viewer ref="pdfViewer" service-url="https://api.ceropapel.dev/v1/pdf-viewer" @onSaveDocument="onSaveDocument" />
    </client-only>
    <div>
      <button style="bottom:15px" @click="saveDocument()">
        Guardar Documento
      </button>
    </div>
  </div>
</template>

<script>

import Vue from 'vue';

Vue.config.ignoredElements = [
  'mtx-document-editor',
  'mtx-pdf-viewer'
];

export default {
  data () {
    return {};
  },

  created () {
    this.$customElements.registerEntry('MtxDocumentEditor');
    this.$customElements.registerEntry('MtxPdfViewer');
  },
  methods: {
    saveDocument () {
      console.log(this.$refs);
      const instance = this.$refs.pdfViewer.getVueInstance();
      instance.saveDocument();
      console.log({ instance });
    },
    onSaveDocument (data) {
      console.log({ data });
    }
  }
};

</script>

<style>
.container > div {
  width: 100%;
}

.logo {
  width: 100%;
  min-width: 280px;
  max-width: 640px;
}

.custom-elements-example-fieldset {
  margin: 0 auto;
  margin-top: 20px;
}
</style>
