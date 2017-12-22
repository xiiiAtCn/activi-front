<template>
    <Button @click="click">点击</Button>
</template>
<script>
    import { dispatch } from 'utils/actionUtils'

    let action = {
        type: 'selectOne',
        message: '请选择一项',
        buttons: [
            {
                text: '审批通过',
                size: 'large',
                type: 'primary',
                action: {
                    type: 'asLink'
                }
            }, 
            {
                text: '审批拒绝',
                size: 'large',
                type: 'primary',
                action: {
                    type: 'asLink'
                }
            }
        ]
    }
    export default {
        methods: {
            click() {
                dispatch(action)
            }
        }
    }
</script>