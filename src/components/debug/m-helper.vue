<template>
    <div style="margin: 30px; font-size: 18px;">
        <Collapse accordion>
            <Panel name="1">
                引入js提示<span style="color:red;">GET https://192.168.1.105:8282/web-apps/apps/api/documents/api.js net::ERR_CERT_AUTHORITY_INVALID</span>
                <p slot="content">
                    点击<a href="https://192.168.1.105:8282/" target="_blank">此处</a>, 在弹出的页面中忽略浏览器提醒, 操作完成后<a onclick="javascript:location.reload();">刷新</a>页面即可
                </p>
            </Panel>
            <Panel name="2">
                在权限管理处修改角色所属菜单后未生效
                <p slot="content">
                    修改角色权限后需登出系统再次登录才能生效. 并且只有二级菜单全部被选中, 左侧边栏才会出现一级菜单
                </p>
            </Panel>
            <Panel name="3">
                点击文件预览时报错
                <p slot="content">
                    点击<a href="https://192.168.1.105:8282/" target="_blank">此处</a>, 在弹出的页面中忽略浏览器提醒, 操作完成后<a onclick="javascript:location.reload();">刷新</a>页面即可
                </p>
            </Panel>
        </Collapse>
    </div>
</template>
<script>
    export default {
        data() {
            return {

            }
        }
    }
</script>