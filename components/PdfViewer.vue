<template>
  <ejs-pdfviewer
    ref="pdfviewer"
    id="pdfViewer"
    :service-url="serviceUrl"
    :document-path="documentPath"
    :on-document-load="documentLoad"
    :toolbar-settings="toolbarSettings"
    :add-signature="addSignature"
    :form-field-add="formFieldAdd"
  />
</template>

<script>
import Vue from 'vue';
/**
 * SCRIPT
 */
import {
  PdfViewerComponent,
  Toolbar, Magnification, Navigation,
  ThumbnailView, Print,
  TextSearch, FormDesigner, FormFields,
  PdfViewerPlugin
} from '@syncfusion/ej2-vue-pdfviewer';

import { registerLicense } from '@syncfusion/ej2-base';

Vue.use(PdfViewerPlugin);

export default {
  name: 'MtxPdfviewer',
  components: {
    'ejs-pdfviewer': PdfViewerComponent
  },
  provide: {
    PdfViewer: [Toolbar, Magnification, Navigation, ThumbnailView, Print, TextSearch, FormDesigner, FormFields]
  },
  props: {
    locale: {
      type: String,
      default: ''
    },
    serviceUrl: {
      type: String,
      default: ''

    },
    documentPath: {
      type: String,
      default: 'https://storage.googleapis.com/ceropapel-storage-staging/tmp/org_JOq1HQbaP7qbLJMt/0f09fdd2-4434-4e57-a841-54b04095f180/base.pdf?GoogleAccessId=storage-staging%40quody-210119.iam.gserviceaccount.com&Expires=1667525925&Signature=jAiT6UeRE85g%2B5PVKVtRr8CDIFezuz6NJLW9HNo22MO2mgIw5zjw4LxaxngIlygWoTVTr%2BTjv8q85v4%2BTyGgUwMBipPbnXbXvUUbscL9Xqx0jcumu2nvmeJ2iNWBmXnGqKcNudk8OYrruuo1tsNrF%2BlW9CSegKvLR2HQpoDFqukffp1LxIIy7hj5Ehp%2F%2BqskhaV2vQ76F06DMoBoa%2FOGvb88hsfoUK2vB1bW6dAD5egxdQ%2B7PY0UCJlVMtHiIHYIx1zrjA1k3sPOBip4DW3AgbLJ9caJrb%2BUm5ixY9uTORjVv835j0pSdh0YzMaNe7j4H4FeMjVqhxx9s7eltBP6Bw%3D%3D'
    },
    editMode: {
      type: Boolean,
      default: false
    },
    currentUser: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      formFields: [],
      toolbarSettings: {
        toolbarItems: ['PageNavigationTool', 'MagnificationTool', 'PanTool', 'SelectionTool', 'SearchOption', 'FormDesignerEditTool', 'PrintOption', 'DownloadOption'],
        formDesignerToolbarItems: ['']
      },
      noSignAsignField: {}
    };
  },
  beforeMount () {
    if (!window?._COMPONENT_LICENCE_REGISTERED) {
      registerLicense('ORg4AjUWIQA/Gnt2VVhhQlFaclhJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRdkBjW35ccnBRT2ZbWEc=');
      window._COMPONENT_LICENCE_REGISTERED = true;
    }
  },
  mounted () {
    this.toolbarSettings.formDesignerToolbarItems = [];
  },
  methods: {
    documentLoad () {
      this.$emit('loaded');
    },
    addSignBox (params) {
      const viewer = this.$refs.pdfviewer.ej2Instances;
      viewer.formDesignerModule.addFormField('SignatureField', {
        name: params.name,
        bounds: params.bounds,
        signatureIndicatorSettings: {
          backgroundColor: params.backgroundColor,
          text: params.signText || 'Jesus Fregoso'
        }
      });
      const pdfLayerElement = document.getElementById('pdfViewer_textLayer_0');

      const signElement = pdfLayerElement.lastChild.firstChild.firstChild;
      signElement.style.backgroundColor = params.backgroundColor || 'rgba(34, 178, 75, .35)';

      signElement.firstChild.style.boxShadow = '5px 5px rgb(0 0 0 / 20%)';
      signElement.firstChild.style.borderRadius = '100px';

      signElement.style.boxShadow = '5px 5px rgb(0 0 0 / 20%)';
      signElement.style.borderRadius = '100px';
      const spanElement = signElement.querySelector('span');
      // spanElement.classList.add('cloud-span')

      spanElement.style.marginLeft = '25px';
      this.formFields.push(params);
    },
    addDrawAndDropSign (params) {
      const viewer = this.$refs.pdfviewer.ej2Instances;
      viewer.formDesignerModule.setFormFieldMode('SignatureField');
      this.noSignAsignField = params;
    },
    async saveDocument () {
      console.log(this);
      const viewer = this.$refs.pdfviewer.ej2Instances;
      const document = await viewer.saveAsBlob();
      const data = {
        document,
        formFields: this.formFields
      };
      this.$emit('onSaveDocument', data);
    },
    async addSignature (sign) {
      const viewer = this.$refs.pdfviewer.ej2Instances;
      const formField = await viewer.formFieldCollection.find(formField => formField.id === sign.id.split('_')[0]);

      const formFieldIndex = this.formFields.findIndex(field => (field.name === formField.name));

      this.formFields[formFieldIndex] = {
        ...this.formFields[formFieldIndex],
        bounds: {
          X: formField.bounds.x,
          Y: formField.bounds.y,
          Width: formField.bounds.width,
          Height: formField.bounds.height
        },
        signature: sign.data
      };
      this.$emit('onAddSignature', this.formFields[formFieldIndex]);
    },
    formFieldAdd (data) {
      const viewer = this.$refs.pdfviewer.ej2Instances;
      if (data.field.name === 'Signature1') {
        const formField = viewer.formFieldCollection.find(formField => formField.id === data.field.id);
        const bounds = {
          X: formField.bounds.x - 101,
          Y: formField.bounds.y - 35,
          Width: formField.bounds.width,
          Height: formField.bounds.height
        };
        viewer.formDesignerModule.deleteFormField(data.field.id);
        this.addSignBox({
          id: this.noSignAsignField.id,
          name: this.noSignAsignField.name,
          bounds,
          backgroundColor: this.noSignAsignField.backgroundColor,
          signText: this.noSignAsignField.signText
        });
      }
    }
  }
};
</script>

<style>
@import '@syncfusion/ej2-base/styles/material.css';
@import '@syncfusion/ej2-buttons/styles/material.css';
@import '@syncfusion/ej2-dropdowns/styles/material.css';
@import '@syncfusion/ej2-inputs/styles/material.css';
@import '@syncfusion/ej2-navigations/styles/material.css';
@import '@syncfusion/ej2-popups/styles/material.css';
@import '@syncfusion/ej2-splitbuttons/styles/material.css';
@import '@syncfusion/ej2-vue-pdfviewer/styles/material.css';

  #pdfViewer {
    height: 640px;
  }
  #signIcon0_1 {

  }

  .cloud {
    box-shadow: 10px 10px rgb(0 0 0 / 20%);
    border-radius: 100px;
  }

  .cloud::after, .cloud::before{
    content:"";
    position:relative;
    display:inline-block;
    background:inherit;
    border-radius:inherit;
  }
  .cloud::after{
      width:100px;
      height:100px;
      top:-220px;
      left:50px;
  }
  .cloud::before{
      width:180px;
      height:180px;
      top: -70px;
      left:130px;
  }
  .cloud-span {
    margin-left: 25px;
  }
</style>
