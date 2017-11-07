<template>
  <div class="input-group">
    <div class="input-group-btn">
      <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{coin}}<span class="caret"></span></button>
      <ul class="dropdown-menu">
        <li v-for="coindata in coindatas">
          <a href="javascript:;" v-on:click="checkCoin(coindata.coin,coindata.id)">{{coindata.coin}}</a>
        </li>
      </ul>
    </div>
    <input type="text" class="form-control" maxlength="64">
  </div>
</template>
<script>
  export default {
      props: ['coindatas', 'selected', 'getSelect'],
      mounted: function () {
      },
      data: function () {
          return {
              coin: ''
          }
      },
      methods: {
          checkCoin: function (coin, id) {
              this.coin = coin
              this.getSelect(id)
          }
      }
  }
</script>
