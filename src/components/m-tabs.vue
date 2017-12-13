<template>
    <Row>
        <Col :span="define.mode === 'vertical' ? 3 :24">
            <Menu :mode="define.mode" :active-name="activeNumber" @on-select="handleSelect" class="menu" width="auto">
                <MenuItem v-for="(item, key) in content" :key="key" :name="key">
                    <Icon v-if="item.icon" type="item.icon"></Icon>
                        {{item.ui_define.title}}
                </MenuItem>
            </Menu>
        </Col>
        <Col :span="define.mode === 'vertical' ? 21 :24">
            <div class="container" v-for="(val,key) in content">
                <component
                    v-for="item in val.ui_content"
                    v-show="key === menuName"
                    :is="item.ui_type"
                    :define="item.ui_define"
                    :content="item.ui_content"
                    :form="item.ui_form"
                ></component>
            </div>
        </Col>
    </Row>
</template>

<script>
    export default {
        props:['define','content'],
        data () {
            return {
                theme1: 'light',
                activeNumber:0,
                menuName:0,
                menuSection:{}
            }
        },
        methods:{
            handleSelect(name){
                this.menuName = Number(name)
            }
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
    .container{
        margin: 20px;
    }
</style>
