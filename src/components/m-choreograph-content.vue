<template>
    <div>
        <div class="container">
            <div class="detailTable">
                <mDetailTable
                    :define="tableModel.ui_define"
                    :content="tableModel.ui_content"
                    :ui_form="tableModel.ui_form"
                ></mDetailTable>
            </div>
            <div class="cardTable">
                <component
                    v-if="taskTrack"
                    :is="taskTrack.ui_type"
                    :define="taskTrack.ui_define"
                    :content="taskTrack.ui_content"
                ></component>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            define:{
                type:null,
                default () {
                    return {}
                }
            },
            content:{
                type:null,
                default () {
                    return {}
                }
            }
        },
        data () {
            return {
                downData:{}
            }
        },
        computed:{
        },
        mounted(){
        },
        methods:{
            handleSelect(name){
                this.menuName = Number(name)
                this.downData = this.define
            },
        }
    }
</script>

<style scoped>
    .container{
        padding:0 15px;
    }
    .card-container{
        margin-bottom: 20px;
    }
    .detailTable{

    }
    .cardTable{

    }
</style>
