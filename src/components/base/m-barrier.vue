<template>
    <div :style="{margin: height + 'px' + ' 0px'}"></div>
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