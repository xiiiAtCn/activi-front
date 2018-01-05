import * as d3 from 'd3'

export const ComputedType = {
    width: 'width',
    height: 'height'
}

export const mixin = {
    props: {
        paddingTop: {
            type: String,
            default: '10%'
        },
        paddingRight: {
            type: String,
            default: '10%'
        },
        paddingBottom: {
            type: String,
            default: '10%'
        },
        paddingLeft: {
            type: String,
            default: '10%'
        },
    },
    computed: {
        // 画布
        svg () {
            return d3.select(this.$el)
                .select('svg')
                .attr('preserveAspectRatio', 'xMidYMid')
                .attr('viewBox', `0, 0, ${this.width}, ${this.height}`)
        },
        percentPaddingTop () {
            return this.computedLength(this.paddingTop, ComputedType.height)
        },
        percentPaddingRight () {
            return this.computedLength(this.paddingRight, ComputedType.width)
        },
        percentPaddingBottom () {
            return this.computedLength(this.paddingBottom, ComputedType.height)
        },
        percentPaddingLeft () {
            return this.computedLength(this.paddingLeft, ComputedType.width)
        },
    },
    methods: {
        draw () {},
        computedLength (str, computedType) {
            let length = null
            let svgLength = null
            if (computedType === ComputedType.width) {
                length = this.svg.node().clientWidth || this.svg.node().parentNode.clientWidth
                svgLength = this.width
            } else {
                length = this.svg.node().clientHeight || this.svg.node().parentNode.clientHeight
                svgLength = this.height
            }

            // px转为百分比
            if (str.indexOf('px') !== -1) {
                let px = str.slice(0, str.indexOf('px'))
                return px / length * svgLength
            } else if (str.indexOf('%') !== -1) {
                return Number(str.slice(0, str.indexOf('%'))) / 100 * svgLength
            } else {
                throw new Error(`不支持的长度，${str}`)
            }
        },
    },
    mounted () {
        this.$nextTick(() => {
            this.draw()
        })
    }
}