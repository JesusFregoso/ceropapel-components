
<template>
  <!-- <ejs-documenteditorcontainer height="700px" style="width: 100%" :serviceUrl='serviceUrl' :isReadOnly='false'
    :enablePrint='true' :enableSfdtExport='true' :enableSelection='true' :enableContextMenu='true' :enableSearch='true'
    :enableOptionsPane='true' :enableWordExport='true' :enableTextExport='true' :enableEditor='true'
    :enableImageResizer='true' :enableEditorHistory='true' :enableHyperlinkDialog='true' :enableTableDialog='true'
    :enableBookmarkDialog='true' :enableTableOfContentsDialog='true' :enablePageSetupDialog='true'
    :enableStyleDialog='true' :enableListDialog='true' :enableParagraphDialog='true' :enableFontDialog='true'
    :enableTablePropertiesDialog='true' :enableBordersAndShadingDialog='true' :enableTableOptionsDialog='true'>
  </ejs-documenteditorcontainer> -->
  <div>
    <ejs-documenteditorcontainer
      ref="container"
      height="80vh"
      :service-url="serviceUrl"
      :enable-toolbar="true"
      :toolbar-click="onToolbarClick"
      :toolbar-items="items"
      :enable-lock-and-edit="isReadOnly"
    />
    <div id="variableModal" class="col-md-8 control-section" style="height:350px;">
      <ejs-dialog
        ref="modalDialog"
        :is-modal="modal.isModal"
        :header="modal.header"
        :overlay-click="modal.isoverlay"
        :target="modal.target"
        :width="modal.width"
        :buttons="modal.buttons"
        :animation-settings="modal.animationSettings"
        :content="modal.content"
        :open="modal.modalDlgOpen"
        :close="modal.modalDlgClose"
        :visible="false"
      >
        <ejs-textbox v-model="search" float-label-type="Auto" css-class="e-outline e-padding" placeholder="buscar" @keydown.native="debounce(searchVariables(),2000)" />
        <ejs-listbox ref="variablesList" :data-source="variablesList" :selection-settings="modal.selectionSettings" selection-mode="Single" />
      </ejs-dialog>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { DocumentEditorContainerPlugin, Toolbar, WordExport, Editor } from '@syncfusion/ej2-vue-documenteditor';
import { DialogPlugin } from '@syncfusion/ej2-vue-popups';
import { ListBoxPlugin, CheckBoxSelection } from '@syncfusion/ej2-vue-dropdowns';
import { TextBoxPlugin } from '@syncfusion/ej2-vue-inputs';

import { registerLicense, setCulture, L10n } from '@syncfusion/ej2-base';
import langEs from '@syncfusion/ej2-locale/src/es.json';

L10n.load({ es: langEs.es });
setCulture('es');

Vue.use(DocumentEditorContainerPlugin);
Vue.use(DialogPlugin);
Vue.use(ListBoxPlugin);
Vue.use(TextBoxPlugin);

export default {
  provide: {
    // Inject require modules.
    // DocumentEditor: [Print, SfdtExport, WordExport, TextExport, Selection, Search, Editor, ImageResizer, EditorHistory, ContextMenu, OptionsPane, HyperlinkDialog, TableDialog, BookmarkDialog, TableOfContentsDialog, PageSetupDialog, StyleDialog, ListDialog, ParagraphDialog, BulletsAndNumberingDialog, FontDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, StylesDialog]
    // DocumentEditorContainer: [Toolbar, Print, SfdtExport, WordExport, TextExport, Selection, Search, Editor, ImageResizer, EditorHistory, ContextMenu, OptionsPane, HyperlinkDialog, TableDialog, BookmarkDialog, TableOfContentsDialog, PageSetupDialog, StyleDialog, ListDialog, ParagraphDialog, BulletsAndNumberingDialog, FontDialog, TablePropertiesDialog, BordersAndShadingDialog, TableOptionsDialog, CellOptionsDialog, StylesDialog]
    DocumentEditorContainer: [Toolbar, WordExport, Editor],
    listbox: [CheckBoxSelection]
  },
  props: {
    serviceUrl: {
      type: String,
      default: '',
      required: true
    },
    isReadOnly: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modal: {
        target: '#variableModal',
        width: '335px',
        header: 'Listado de Variables',
        buttons: [{ click: this.saveVariable, buttonModel: { content: 'Añadir Variable', isPrimary: true } }],
        isModal: true,
        animationSettings: { effect: 'None' },
        showBtn: false,
        selectionSettings: { selectionMode: 'Single' }
      },
      initialVariablesList: [
        { text: 'colaborador 1', id: '@colaborador1' },
        { text: 'colaborador 2', id: '@colaborar2' },
        { text: 'fecha', id: '@fecha' },
        { text: 'propiedad', id: '@propiedad' },
        { text: 'fecha 2', id: '@fecha2' },
        { text: 'fecha 3', id: '@fecha3' },
        { text: 'variable 1', id: '@variable1' }
      ],
      variablesList: [],
      exportItems: [
        { text: 'variable2', id: 'word' },
        { text: 'colaborador', id: 'sfdt' }
      ],
      currentLang: 'es',
      items: [
        'Open',
        'Separator',
        {
          // https://ej2.syncfusion.com/documentation/appearance/icons/#material
          prefixIcon: 'e-selection',
          tooltipText: 'Listado de Variables',
          text: 'Listado de Variables',
          id: 'Custom',
          disabled: this.isReadOnly
        },
        {
          prefixIcon: 'e-save',
          tooltipText: 'Guardar',
          text: 'Guardar Documento',
          id: 'save',
          disabled: this.isReadOnly
        },
        'Separator',
        'Undo', 'Redo', 'Separator', 'Image', 'Table', 'Hyperlink', 'TableOfContents', 'Separator', 'Header', 'Footer', 'PageSetup', 'PageNumber', 'Break',
        'Separator', 'Find'

      ],
      search: ''
    };
  },
  beforeCreate () {
    if (!window._COMPONENT_LICENCE_REGISTERED) {
      registerLicense('ORg4AjUWIQA/Gnt2VVhhQlFaclhJXGFWfVJpTGpQdk5xdV9DaVZUTWY/P1ZhSXxRdkBjW35ccnBRT2ZbWEc=');
      window._COMPONENT_LICENCE_REGISTERED = true;
    }
  },
  beforeMount () {
    if (this.isReadOnly) {
      this.items = this.items.filter(item => item !== 'Open');
    }
  },
  mounted () {
    this.variablesList = this.initialVariablesList;
    this.$nextTick(() => {
      this.$refs.container.ej2Instances.serviceUrl = this.serviceUrl + 'api/documenteditor/';
      this.$refs.container.ej2Instances.documentChange = () => {
        this.documentChangedEvent();
      };
    });
  },
  methods: {
    onToolbarClick: function (args) {
      switch (args.item.id) {
        case 'Custom':
          this.$refs.modalDialog.show();
          break;
        case 'save':
          this.$refs.container.ej2Instances.documentEditor.saveAsBlob('Docx').then((exportedDocument) => {
            this.$emit('save', exportedDocument);
          });
          break;
      }
    },
    handleMenuCustomization: function (args) {
      const documentEditor = this.$refs.container.ej2Instances.documentEditor;
      const search = document.getElementById(args.ids[0]);
      search.style.display = 'none';
      const searchContent = documentEditor.selection.text;
      if (!documentEditor.selection.isEmpty && /\S/.test(searchContent)) {
        search.style.display = 'block';
      }
    },
    searchVariables: function () {
      this.variablesList = this.initialVariablesList.filter(item => item.text.match(this.search));
    },
    saveVariable: function () {
      const elements = this.$refs.variablesList.getItems();
      console.log({ elements });
      elements.forEach((item) => {
        if (item.className.match('.e-selected')) {
          const variable = this.$refs.variablesList.getDataByValue(item.innerText);
          this.$refs.container.ej2Instances.documentEditor.editor.insertText(variable.id);
          this.$refs.modalDialog.hide();
        }
      });
      this.$refs.modalDialog.hide();
    },
    debounce (callback, wait) {
      console.log(callback);
      let timerId;
      return (...args) => {
        console.log(...args);
        clearTimeout(timerId);
        timerId = setTimeout(() => {
          // eslint-disable-next-line n/no-callback-literal
          callback(...args);
        }, wait);
      };
    }
  }
};
</script>
<style>
@import '@syncfusion/ej2-base/styles/material.css';
@import '@syncfusion/ej2-buttons/styles/material.css';
@import '@syncfusion/ej2-inputs/styles/material.css';
@import '@syncfusion/ej2-popups/styles/material.css';
@import '@syncfusion/ej2-lists/styles/material.css';
@import '@syncfusion/ej2-navigations/styles/material.css';
@import '@syncfusion/ej2-splitbuttons/styles/material.css';
@import '@syncfusion/ej2-dropdowns/styles/material.css';
@import '@syncfusion/ej2-vue-documenteditor/styles/material.css';
</style>
