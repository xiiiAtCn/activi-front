/**
 * Created by yang on 2017/9/27.
 */
import Vue from 'vue'
import _ from 'lodash'
import mDetailView from "./m-detailView.vue"
import {default as fetch, post} from '../utils/DefineFetcher'

let detailViewShim = Vue.component('detailView-Shim', {
    render: function (h) {
        return h(mDetailView, {
            props: { "rows": this.rows, "operation": this.operation, "titleDefine": this.titleDefine, "bodyDefine": this.bodyDefine }
        });
    },
    data() {
        return {
            url: "",
            userUrl: false,
            rows: [],
            operation: [],
            titleDefine: [],
            bodyDefine: []
        }
    },
    props: {
        uid: {
            type: String,
            default: "m-DetailView"
        },
        define: {
            type: Object,
            default: {}
        }
    },
    mounted: function () {
        this.initial();
    },
    methods: {
        detDetailData: function (url) {
            let self = this;
            fetch(url, function (error, body) {
                if (!error || error === null) {
                    Vue.nextTick(function () {
                        // 加个下标
                        body.forEach(function (item, index) {
                            item.index = index
                        });
                        self.rows = body;
                        self.userUrl = true;
                    });
                }
            });
        },
        initial() {
            // 明细处理按钮
            this.operation = _.get(this.define, "operation", null);
            // 详细标题
            this.titleDefine = _.get(this.define, "titleDefine", null);
            // 详细明细
            this.bodyDefine = _.get(this.define, "bodyDefine", null);
            // 获取详细一览数据
            this.url = _.get(this.define, "data_url", null);
            if (this.url !== null) {
                this.detDetailData(this.url);
            }
        }
    }
});

export default detailViewShim;