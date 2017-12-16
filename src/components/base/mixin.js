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
            type: [String, Number],
            default: ''
        },
        ui_form: {
            type: [String, Number],
            default: ''
        },
        statusKey: {
            type: [String, Number],
            default: ''
        }
    },
    computed: {
        form () {
            return this.ui_form || 'form'
        },
        readonly () {
            let editable
            let flag
            if(this.formTmp) {
                editable = _.get(this.$store.state.pageStatus, ['status', this.statusKey + '_detail', this.name])
            } else {
                editable = _.get(this.$store.state.pageStatus,  ['status', this.ui_form])
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
            return _.get(this.$store.state.formData[this.form], 'reset', false)
        },
        hasError: {
            get () {
                let key = this.form + 'checkResult'
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
            return _.get(this.$store.state.formData[this.form], 'validate', false)
        },
        objectModel: {
            get () {
                let form = _.get(this.$store.state.formData, this.form)
                if (form === undefined) {
                    this.$store.commit(ADD_NEW_OBJECT,
                        {
                            attribute: this.form,
                            value: {
                                loading: true,
                                reset: false,
                                validate: false,
                                visible: false,
                                [this.form + 'waitCheck']: []
                            }
                        }
                    )
                }
                let value = _.get(this.$store.state.formData[this.form], this.name)
                if (value === undefined) {
                    switch (this.dataType) {
                    case 'String':
                        this.$store.commit(FORM_ELEMENT_VALUE, 
                            {
                                [this.name]: {
                                    value: '', 
                                    type: this.$options._componentTag
                                }, 
                                form: this.form, 
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
                                form: this.form,
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
                                form: this.form,
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
                                form: this.form,
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
                                form: this.form,
                                checkKey: this.name
                            }
                        )
                    }
                }
                let tmp = _.get(this.$store.state.formData[this.form], [this.name, 'value'], '')
                let type =  _.get(this.$store.state.formData[this.form], [this.name, 'type'])
                if (type === undefined)
                    this.$store.commit(FORM_ELEMENT_VALUE, 
                        {
                            [this.name]: {
                                value: tmp, 
                                type: this.$options._componentTag
                            }, 
                            form: this.form,
                            checkKey: this.name
                        }
                    )
                return tmp
            },
            set (value) {
                this.$store.commit(FORM_ELEMENT_VALUE, 
                    {
                        [this.name]: {
                            value, 
                            type: this.$options._componentTag
                        }, 
                        form: this.form,
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
