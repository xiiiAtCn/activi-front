<template>
    <div :class="define.mode === 'horizontal' ? 'horizontal' : 'vertical'">
        <Menu :mode="define.mode" :active-name="activeNumber" @on-select="handleSelect" class="menu">
            <MenuItem v-for="(item, key) in content" :key="key" :name="key">
                <Icon v-if="item.icon" type="item.icon"></Icon>
                    {{item.ui_define.title}}
            </MenuItem>
        </Menu>
        <div class="container">
            <div v-for="(item, key) in content" :key="key">
                <div v-show="menuName === key">
                    <component
                        v-for="val in item.ui_content"
                        :is="val.ui_type"
                        :define="val.ui_define"
                        :content="val.ui_content"
                        :form="val.ui_form"
                    ></component>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props:['define','content'],
        data () {
            return {
                theme1: 'light',
                menuName: 0,
                activeNumber:0
            }
        },
        mounted(){
        },
        methods:{
            handleSelect(name){
                this.menuName = Number(name)
            },
        }
    }
</script>

<style scoped>
    div.horizontal .menu{
        margin-bottom: 20px;
    }
    div.vertical:after {
        display: block;
        clear: both;
        content:"";
    }
    div.vertical .menu{
        float: left;
    }
    div.vertical .container{
        padding-left: 15px;
        height: 100%;
    }
</style>
