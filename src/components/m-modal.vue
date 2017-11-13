<template>
  <div>
    <div class="modal fade" :class="{in:classIn}" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" :style="style">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
              &times;
            </button>
            <h4 class="modal-title" id="myModalLabel">
              模态框（Modal）标题
            </h4>
          </div>
          <div class="modal-body">
            在这里添加一些文本
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-default" data-dismiss="modal">关闭
            </button>
            <button type="button" class="btn btn-primary">
              提交更改
            </button>
          </div>
        </div><!-- /.modal-content -->
      </div><!-- /.modal -->
    </div>
  </div>
</template>

<script>
  export default {
      data: function () {
          return {
              style: {'display': 'block'},
              classIn: false
          }
      }
  }
</script>
