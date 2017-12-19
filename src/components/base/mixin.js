import _ from 'lodash'
import { FORM_ELEMENT_VALUE, ADD_NEW_OBJECT, DESTROY_FORM_DATA, CLEAR_FORM_STATUS } from 'store/Mutation'
const mixin = {
    props: {
        define: {
            type: Object,
            default() {
                return {}
            }
        },
        focusId: {
            type: String,
            default: ''
        },
        ui_form: {
            type: [String, Number],
            default: ''
        },
        form: {
            type: [String, Number],
            default: 'form'
        },
        statusKey: {
            type: [String, Number],
            default: ''
        }
    },
    computed: {
        readonly () {
            let editable
            let flag
            if(this.statusKey) {
                editable = _.get(this.$store.state.pageStatus, ['status', this.form ,this.statusKey + '_detail', this.name])
            } else {
                editable = _.get(this.$store.state.pageStatus,  ['status', this.form, this.name])
            }
            if(editable === 'editable') {
                flag = false
            } else {
                flag = true
            }
            return flag
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
            return _.get(this.$store.state.formData[this.form], '_reset', false)
        },
        hasError: {
            get () {
                let key
                if(this.ui_form) {
                    key = this.ui_form + 'checkResult'
                } else {
                    key = this.form + 'checkResult'
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
            if(this.ui_form) {
                return _.get(this.$store.state.formData[this.ui_form], '_validate', false)
            }
            return _.get(this.$store.state.formData[this.form], '_validate', false)
        },
        objectModel: {
            get () {
                let formFix = this.ui_form?this.ui_form: this.form
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
                                    type: this.$options._componentTag
                                }, 
                                form: formFix,
                                checkKey: this.name
                            }
                        )
                    }
                }
                let tmp = _.get(this.$store.state.formData[formFix], [this.name, 'value'], '')
                let type =  _.get(this.$store.state.formData[formFix], [this.name, 'type'])
                if (type === undefined)
                    this.$store.commit(FORM_ELEMENT_VALUE, 
                        {
                            [this.name]: {
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
                let formFix = this.ui_form?this.ui_form: this.form
                this.$store.commit(FORM_ELEMENT_VALUE, 
                    {
                        [this.name]: {
                            value, 
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
        }
    },
    watch: {
        validate(newVal) {
            if (newVal) {
                this.valid()
            }
        },
        boundTarget(newVal, oldVal) {
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
    beforeDestroy() {
        this.$store.commit(DESTROY_FORM_DATA, {form: this.form})
        this.$store.commit(CLEAR_FORM_STATUS)
    }
}

export default mixin
