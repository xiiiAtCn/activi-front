<template>
    <div :style="{margin: height + 'px' + ' 0px', opacity: '0', 'font-size':'0'}">
       'just opacity here'
    </div>
</template>
<script>
    export default {
        props:{
            height:{
                type: Number || String,
                default: 5
            }
        }
    }
</script>