<template>
  <!-- The Modal -->
  <div id="myModal" class="m-modal" v-bind:style="styleObject">

    <!-- Modal content -->
    <div class="m-modal-content">
      <div class="m-modal-header">
        <span class="m-close" @click="close()">&times;</span>
        <h2 v-text="headerText"></h2>
      </div>
      <div class="m-modal-body">
        <p>Some text in the Modal Body</p>
        <p>Some other text...</p>
      </div>
      <!--<div class="m-modal-footer">-->
      <!--<h3 v-text="footerText"></h3>-->
      <!--</div>-->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'm-bottomModal',
    data () {
      return {
        styleObject: {
          display: 'none'
        }
      }
    },
    computed: {
      'serverName': function () {
        return this.name
      }
    },
    mounted: function () {
    },
    props: {
      headerText: {type: String, 'default': ''}
//            footerText: {type: String, 'default': 'foot'},
    },
    methods: {
      open: function () {
        this.styleObject.display = 'block'
      },
      close: function () {
        this.styleObject.display = 'none'
      }
    },
    watch: {}
  }

</script>


<style scoped>
  .m-modal {
    display: none; /* Hidden by default */
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
    -webkit-animation-name: fadeIn; /* Fade in the background */
    -webkit-animation-duration: 0.4s;
    animation-name: fadeIn;
    animation-duration: 0.4s
  }

  /* Modal Content */
  .m-modal-content {
    position: fixed;
    bottom: 0;
    background-color: #fefefe;
    width: 100%;
    height: 80%;
    -webkit-animation-name: slideIn;
    -webkit-animation-duration: 0.4s;
    animation-name: slideIn;
    animation-duration: 0.4s;
    /*-webkit-box-shadow: 5px 10px 10px #cccccc;*/
    /*-moz-box-shadow: 5px 5px 10px #cccccc;*/
    /*box-shadow: 5px 10px 10px #cccccc;*/
  }

  /* The Close Button */
  .m-close {
    color: white;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .m-close:hover,
  .m-close:focus {
    color: #000;
    text-decoration: none;
    cursor: pointer;
  }

  .m-modal-header {
    padding: 2px 16px;
    min-height: 45px;
    background-color: #7eee7e;
    color: white;
  }

  .m-modal-body {
    padding: 10px 16px;
    /*height: 90%;*/
  }

  /*.m-modal-footer {*/
  /*padding: 2px 16px;*/
  /*background-color: #5cb85c;*/
  /*color: white;*/
  /*}*/

  /* Add Animation */
  @-webkit-keyframes slideIn {
    from {
      bottom: -300px;
      opacity: 0
    }
    to {
      bottom: 0;
      opacity: 1
    }
  }

  @keyframes slideIn {
    from {
      bottom: -300px;
      opacity: 0
    }
    to {
      bottom: 0;
      opacity: 1
    }
  }

  @-webkit-keyframes fadeIn {
    from {
      opacity: 0
    }
    to {
      opacity: 1
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0
    }
    to {
      opacity: 1
    }
  }
</style>
