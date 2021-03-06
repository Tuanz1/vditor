import {VDITOR_VERSION} from "./ts/constants";
import {Toolbar} from "./ts/toolbar/index";
import {OptionsClass} from "./ts/util/OptionsClass";
import {Ui} from "./ts/ui/index";
import {Editor, insertText} from "./ts/editor/index";
import {Hotkey} from "./ts/hotkey/index";
import {Preview} from "./ts/preview/index";
import {Counter} from "./ts/counter/index";
import {Resize} from "./ts/resize/index";
import {Hint} from "./ts/hint/index";
import {getTextareaPosition} from "./ts/util/textareaPosition";
import {UploadClass} from "./ts/upload/index";

class VditorClass {
    readonly version: string;
    vditor: any

    constructor(id: string, options?: Options) {
        this.version = VDITOR_VERSION;

        const getOptions = new OptionsClass(options)
        const mergedOptions = getOptions.merge()

        this.vditor = {
            id,
            options: mergedOptions,
            mdTimeoutId: -1
        }

        if (mergedOptions.counter > 0) {
            const counter = new Counter(this.vditor)
            this.vditor.counter = counter
        }

        const editor = new Editor(this.vditor)
        this.vditor.editor = editor

        if (mergedOptions.resize.enable) {
            const resize = new Resize(this.vditor)
            this.vditor.resize = resize
        }

        const toolbar = new Toolbar(this.vditor)
        this.vditor.toolbar = toolbar

        if (toolbar.elements.preview) {
            const preview = new Preview(this.vditor)
            this.vditor.preview = preview
        }

        if (mergedOptions.upload.url) {
            const upload = new UploadClass()
            this.vditor.upload = upload
        }

        new Ui(this.vditor)

        if (this.vditor.options.atUser || this.vditor.toolbar.elements.emoji) {
            const hint = new Hint(this.vditor)
            this.vditor.hint = hint
        }

        new Hotkey(this.vditor)
    }

    getValue() {
        return this.vditor.editor.element.value
    }

    insertVale(value: string) {
        insertText(this.vditor.editor.element, value, '')
    }

    focus() {
        this.vditor.editor.element.focus()
    }

    blur() {
        this.vditor.editor.element.blur()
    }

    disabled() {
        this.vditor.editor.element.setAttribute('disabled', 'disabled')
    }

    enable() {
        this.vditor.editor.element.removeAttribute('disabled')
    }

    setSelection(start: number, end: number) {
        this.vditor.editor.element.selectionStart = start
        this.vditor.editor.element.selectionEnd = end
        this.vditor.editor.element.focus()
    }

    getSelection() {
       return this.vditor.editor.element.value.substring(this.vditor.editor.element.selectionStart, this.vditor.editor.element.selectionEnd)
    }

    setValue(value: string) {
        this.vditor.editor.element.selectionStart = 0
        this.vditor.editor.element.selectionEnd = this.vditor.editor.element.value.length
        insertText(this.vditor.editor.element, value, '', true)
        if (!value) {
            localStorage.removeItem('vditor' + this.vditor.id)
        }
    }

    renderPreview(value?: string) {
        this.vditor.preview.render(this.vditor, value)
    }

    getCursorPosition() {
        return getTextareaPosition(this.vditor.editor.element)
    }

    deleteValue() {
        insertText(this.vditor.editor.element, '', '', true)
    }

    updateValue(value: string) {
        insertText(this.vditor.editor.element, value, '', true)
    }

    isUploading() {
        return this.vditor.upload.isUploading
    }

    clearCache() {
        localStorage.removeItem('vditor' + this.vditor.id)
    }

    disabledCache() {
        this.vditor.options.cache = false
    }

    enableCache() {
        this.vditor.options.cache = true
    }
}

export default VditorClass