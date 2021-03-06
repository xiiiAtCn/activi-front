import _ from 'lodash'
import { ADD_NEW_OBJECT, FORM_ELEMENT_VALUE , ERASURE_DATA } from 'store/Mutation'
import { VALIDATION } from 'utils/consts'
import bus from 'routers/bus'
const mixin = {
    inject: {
        baseForm: {
            default: ''
        },
        tmpForm: {
            default: ''
        }
    },
    props: {
        define: {
            type: Object,
            default () {
                return {}
            }
        },
        focusId: {
            type: String,
            default: ''
        },
        statusKey: {
            type: [String, Number],
            default: ''
        },
    },
    computed: {
        readonly () {
            return _.get(this.define, 'readonly', true)
        },
        required () {
            return _.get(this.define, 'required', true)
        },
        visible () {
            return _.get(this.define, 'visible', true)
        },
        name () {
            return _.get(this.define, 'name', 'defaultName')
        },
        dataType () {
            return _.get(this.define, 'dataType', 'String')
        },
        reset () {
            if(this.tmpForm) {
                return _.get(this.$store.state.formData[this.tmpForm], '_reset', false)
            }
            return _.get(this.$store.state.formData[this.form], '_reset', false)
        },
        hasError: {
            get () {
                let key
                if (this.tmpForm) {
                    key = this.tmpForm + VALIDATION
                } else {
                    key ='_' + this.form + VALIDATION
                }
                if (this.$store.state.formData[key] === undefined) {
                    this.$store.commit(ADD_NEW_OBJECT,
                        {
                            attribute: key,
                            value: {}
                        }
                    )
                }
                return _.get(this.$store.state.formData[key], this.name, false)
            }
        },
        validate () {
            if (this.tmpForm) {
                return _.get(this.$store.state.formData[this.tmpForm], '_validate', false)
            }
            return _.get(this.$store.state.formData[this.form], '_validate', false)
        },
        objectModel: {
            get () {
                let formFix = this.tmpForm ? this.tmpForm : this.form
                let form = _.get(this.$store.state.formData, formFix)
                if (form === undefined) {
                    this.$store.commit(ADD_NEW_OBJECT,
                        {
                            attribute: formFix,
                            value: {
                                _loading: true,
                                _reset: false,
                                _validate: false,
                                _visible: false,
                                ['_' + formFix + 'waitCheck']: []
                            }
                        }
                    )
                }
                let value = _.get(this.$store.state.formData[formFix], this.name)
                if (value === undefined) {
                    switch (this.dataType) {
                    case 'String':
                        this.$store.commit(FORM_ELEMENT_VALUE,
                            {
                                [this.name]: {
                                    value: '',
                                    _META_: this._META_,
                                    type: this.$options._componentTag
                                },
                                form: formFix,
                                checkKey: this.name
                            }
                        )
                        break
                    case 'Array':
                        this.$store.commit(FORM_ELEMENT_VALUE,
                            {
                                [this.name]: {
                                    value: [],
                                    _META_: this._META_,
                                    type: this.$options._componentTag
                                },
                                form: formFix,
                                checkKey: this.name
                            }
                        )
                        break
                    case 'Date':
                        this.$store.commit(FORM_ELEMENT_VALUE,
                            {
                                [this.name]: {
                                    value: '',
                                    _META_: this._META_,
                                    type: this.$options._componentTag
                                },
                                form: formFix,
                                checkKey: this.name
                            }
                        )
                        break
                    case 'Object':
                        this.$store.commit(FORM_ELEMENT_VALUE,
                            {
                                [this.name]: {
                                    value: {},
                                    _META_: this._META_,
                                    type: this.$options._componentTag
                                },
                                form: formFix,
                                checkKey: this.name
                            }
                        )
                        break
                    default:
                        this.$store.commit(FORM_ELEMENT_VALUE,
                            {
                                [this.name]: {
                                    value: {},
                                    _META_: this._META_,
                                    type: this.$options._componentTag
                                },
                                form: formFix,
                                checkKey: this.name
                            }
                        )
                    }
                }
                let tmp = _.get(this.$store.state.formData[formFix], [this.name, 'value'], '')
                let valueObject = _.get(this.$store.state.formData[formFix], this.name)
                let type = _.get(this.$store.state.formData[formFix], [this.name, 'type'])
                let _META_ = _.get(this.$store.state.formData[formFix], [this.name, '_META_'])
                if (type === undefined || _META_ === undefined)
                    this.$store.commit(FORM_ELEMENT_VALUE,
                        {
                            [this.name]: {
                                ...valueObject,
                                _META_: this._META_,
                                value: tmp,
                                type: this.$options._componentTag
                            },
                            form: formFix,
                            checkKey: this.name
                        }
                    )
                return tmp
            },
            set (value) {
                let formFix = this.tmpForm ? this.tmpForm : this.form
                let valueObject = _.get(this.$store.state.formData[formFix], this.name)
                this.$store.commit(FORM_ELEMENT_VALUE,
                    {
                        [this.name]: {
                            ...valueObject,
                            value,
                            _META_: this._META_,
                            type: this.$options._componentTag
                        },
                        form: formFix,
                        checkKey: this.name
                    }
                )
            }
        },
        isRelated () {
            return _.get(this.define, 'isRelated', false)
        },
        // 关联对象
        boundTarget () {
            if (this.isRelated) {
                let targetId = _.get(this.define, ['relation', 'target'], '')
                return _.get(this.$store.state.formData[this.form], targetId, '')
            } else {
                return ''
            }
        },
        fixForm() {
            return this.tmpForm ? this.tmpForm : this.form
        },
        form() {
            return _.get(this.define, 'ui_form', 'form')
        },
        _META_() {
            return _.get(this.define, '_META_', {})
        }
    },
    watch: {
        validate (newVal) {
            if (newVal) {
                this.valid()
            }
        },
        boundTarget (newVal, oldVal) {
            if (!_.isEqual(newVal, oldVal)) {
                this.$store.commit(FORM_ELEMENT_VALUE, {[this.name]: {value: ''}, form: this.form})
            }
        }
    },
    data () {
        return {
            errorMessage: ''
        }
    },
    mounted() {
        bus.$on('finish', data => {
            this.changeValue(data)
        })
    },
    methods: {
        changeValue(data) {
            if(this.name === data.target) {
                this.objectModel = data.data
            }
        }
    },
    destroyed() {
        let formFix = this.tmpForm ? this.tmpForm : this.form
        this.$store.commit(ERASURE_DATA, { form: formFix, name : this.name})
    }
}

export default mixin
