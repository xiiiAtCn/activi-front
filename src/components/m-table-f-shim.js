import Vue from 'vue'
import _ from 'lodash'
import mTableF from "./m-table-f.vue"

let tableFShim = Vue.component('tableF-Shim', {
    render: function (h) {
        return h(mTableF, {
            props: { "showModalBtn": this.showModalBtn, "operation": this.operation, "cols": this.cols, "rowsContent": this.rowsContent,"search":this.showSearch, }
        })
    },
    data() {
        return {
            url: "",
            showModalBtn:[],
            rowsContent: [],
            operation: [],
            cols:[],
            showSearch:false
        }
    },
    props: {
        uid: {
            type: String,
            default: "m-TableF"
        },
        define: {
            type: Object,
            default: {}
        }
    },
    mounted: function () {
        this.initialize()
        console.log("m-table-f-shim run")
    },
    methods: {
        detDetailData: function (url) {
            let self = this;
            this.setUrl(url).forGet((body , error)=>{
                if (!error || error === null){
                  self.rowsContent = body;
                  self.userUrl = true;
                }
            })
        },
        initialize() {
            this.operation = _.get(this.define, "operation", [])
            this.showModalBtn = _.get(this.define, "showModalBtn", [])
            this.cols = _.get(this.define, "cols", [])
            this.url = _.get(this.define, "data_url", null)
            if (this.url !== null) {
                this.detDetailData(this.url)
            }
        }
    }
})

export default tableFShim
