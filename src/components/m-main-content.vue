<template>
    <div class="layout">
        <Row type="flex" v-if="details">
            <div class="container">
                <div class="at-grid" data-column="4" style="margin-left: -100px;">
                    <div class="at-column" v-for="(item,index) in details" :key="item.code" @click="path(item.code)">
                        <div class="at-user">
                            <div class="at-user__avatar_r">
                                <div class="at-user__name">
                                    {{item.title}}
                                </div>
                            </div>
                        </div>
                        <img :src="item.picUrl" class="bacImg"/>
                    </div>
                </div>
            </div>
        </Row>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                details: []
            }
        },
        methods: {
            getMenu: function () {
                this.setUrl('/api/module/topMenu').forGet(res => {
                    this.details = res
                })
            },
            path: function (code) {
                this.$router.push({path: '/layoutContent/' + code})
            }
        },
        mounted: function () {
            this.getMenu()
        }
    }
</script>

<style scoped>

    .bacImg {
        border-radius: 8px;
        width: 100%;
        height: 100%;
        transition: .5s;
    }

    .at-column:hover {
        z-index: 1;
        color: white;
    }

    .at-column:hover .bacImg {
        width: 120%;
        height: 120%;
    }

    a {
        display: block;
        color: #6F808A;
    }

    .at-grid {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-direction: row;
        flex-direction: row;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        background: #FFF;
    }

    .at-grid[data-column="1"] .at-column {
        width: 100%;
        max-width: 100%;
        min-width: 100%;
        -ms-flex-preferred-size: 100%;
        flex-basis: 100%;
    }

    .at-grid[data-column="2"] .at-column {
        width: 50%;
        max-width: 50%;
        min-width: 50%;
        -ms-flex-preferred-size: 50%;
        flex-basis: 50%;
    }

    .at-grid[data-column="3"] .at-column {
        width: 33.33333%;
        max-width: 33.33333%;
        min-width: 33.33333%;
        -ms-flex-preferred-size: 33.33333%;
        flex-basis: 33.33333%;
    }

    .at-grid[data-column="4"] .at-column {
        width: 24%;
        max-width: 24%;
        min-width: 24%;
        -ms-flex-preferred-size: 24%;
        flex-basis: 24%;
    }

    .at-grid[data-column="5"] .at-column {
        width: 20%;
        max-width: 20%;
        min-width: 20%;
        -ms-flex-preferred-size: 20%;
        flex-basis: 20%;
    }

    .at-grid[data-column="6"] .at-column {
        width: 16.66667%;
        max-width: 16.66667%;
        min-width: 16.66667%;
        -ms-flex-preferred-size: 16.66667%;
        flex-basis: 16.66667%;
    }

    .at-grid[data-column="7"] .at-column {
        width: 14.28571%;
        max-width: 14.28571%;
        min-width: 14.28571%;
        -ms-flex-preferred-size: 14.28571%;
        flex-basis: 14.28571%;
    }

    .at-grid[data-column="8"] .at-column {
        width: 12.5%;
        max-width: 12.5%;
        min-width: 12.5%;
        -ms-flex-preferred-size: 12.5%;
        flex-basis: 12.5%;
    }

    .at-grid[data-column="9"] .at-column {
        width: 11.11111%;
        max-width: 11.11111%;
        min-width: 11.11111%;
        -ms-flex-preferred-size: 11.11111%;
        flex-basis: 11.11111%;
    }

    .at-column {
        z-index: 0;
        height: 200px;
        position: relative;
        border: 1px solid #dddddd;
        /*padding: 10px;        */
        cursor: pointer;
        margin: 6px;
        /*padding: 6px;*/
        border-radius: 8px;
        color: white;
        overflow: hidden;
        /*display: flex;*/
        /*justify-content: space-between;*/
        /*align-items: center;*/
    }

    .at-column:hover .at-user__avatar_r .at-user__name {
        color: white;
    }

    .at-column:hover .at-user__avatar .at-user__icon {
        color: white;
    }

    .at-column:hover .at-user__avatar_r .at-user__title {
        color: white;
    }

    .at-column:hover .at-social {
        margin: 16px 0 0;
        opacity: 1;
        color: white;
    }

    @media (max-width: 800px) {
        .at-column {
            width: 50% !important;
            max-width: 50% !important;
            min-width: 50% !important;
            -ms-flex-preferred-size: 50% !important;
            flex-basis: 50% !important;
        }
    }

    @media (max-width: 600px) {
        .at-column {
            width: 100% !important;
            max-width: 100% !important;
            min-width: 100% !important;
            -ms-flex-preferred-size: 100% !important;
            flex-basis: 100% !important;
        }
    }

    .at-user {
        position: absolute;
        /*top: 50%;*/
        /*top: 100px;*/
        bottom: 37px;
        left: 0;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        -webkit-transform: translate(0, -50%);
        transform: translate(0, -50%);
        text-align: center;
        margin-top: 4px;
    }

    .at-user__avatar {
        width: 60px;
        height: 60px;
        margin: 10px 22px 0 22px;
        overflow: hidden;
    }

    .at-user__avatar i {
        display: block;
        width: 100%;
        max-width: 100%;
        font-size: 50px;
    }

    .at-user__icon {
        color: #ed3f14;
    }

    .at-user__name {
        /*color: #ed3f14;        font-family: 'Roboto', sans-serif;*/
        font-size: 1.2rem;
        /*font-weight: bold;*/
        left: 12px;
        text-shadow: 1px 2px 1px #000000;
        position: absolute;
        bottom: 124px;
        /*margin-bottom: 8px;*/
        /*text-align: right;*/
    }

    .at-user__title {
        width: 90%;
        height: 40px;
        color: #d9d9d9;
        /*color: white;*/
        margin: 0 10px 10px 0;
        word-wrap: break-word;
        font-family: 'Roboto', sans-serif;
        font-size: 1rem;
        line-height: 1.4rem;
        text-align: left;
    }

    .at-social {
        margin: 0 0 -18px;
        opacity: 0;
        -webkit-transition: margin 0.2s ease, opacity 0.2s ease;
        transition: margin 0.2s ease, opacity 0.2s ease;
    }

    .at-social__item {
        display: inline-block;
        margin: 0 10px;
    }

    .at-social__item a {
        display: block;
    }

    .at-social__item svg {
        fill: #515F65;
        display: block;
        height: 18px;
        -webkit-transition: fill 0.2s ease;
        transition: fill 0.2s ease;
    }

    .at-social__item svg:hover {
        fill: #788D96;
    }

    .container {
        width: 100%;
        margin: 40px 0 0 -20px;
        box-sizing: border-box;
        -webkit-transform-origin: top center;
        transform-origin: top center;
        -webkit-transform: scale(0.8);
        transform: scale(0.8);
    }

</style>
