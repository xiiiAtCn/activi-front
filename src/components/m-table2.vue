<template>
  <div>
    <h3 class="title">{{alias}}</h3>
    <div v-for="operation in operations" class="operation" :key="operation.url">
      <Button type="primary" @click="getMeta(operation.url)">{{operation.name}}</Button>
    </div>
    <div style="padding: 0 20px;">
      <Table :columns="columnsDef" :data="rowData"></Table>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      'alias': {
        type: String
      },
      'operations': {
        'type': Array,
        'default': function () {
          return []
        }
      },
      'columnsDef': {
        type: Array,
        'default': function () {
          return []
        }
      },
      'rowData': {
        type: Array,
        'default': function () {
          return []
        }
      }
    },
    methods: {
      getMeta: function () {
      }
    }
  }

</script>

<style scoped>
  .title {
    margin: 0 20px 5px;
  }

  .operation {
    margin: 0 20px 5px;
  }
</style>

