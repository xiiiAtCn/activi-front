<template>
  <div>
    <nav id="menu" class="menu">
      <a href="https://github.com/mango/slideout" target="_blank">
        <header class="menu-header">
          <span class="menu-header-title">Tests</span>
        </header>
      </a>

      <section class="menu-section">
        <h3 class="menu-section-title">Docs</h3>
        <ul class="menu-section-list">
          <li><a href="https://github.com/mango/slideout#installation" target="_blank">Installation</a></li>
          <li><a href="https://github.com/mango/slideout#usage" target="_blank">Usage</a></li>
          <li><a href="https://github.com/mango/slideout#api" target="_blank">API</a></li>
          <li><a href="https://github.com/mango/slideout#npm-scripts" target="_blank">npm-scripts</a></li>
        </ul>
      </section>

      <section class="menu-section">
        <h3 class="menu-section-title">Docs</h3>
        <ul class="menu-section-list">
          <li><a href="https://github.com/mango/slideout#installation" target="_blank">Installation</a></li>
          <li><a href="https://github.com/mango/slideout#usage" target="_blank">Usage</a></li>
          <li><a href="https://github.com/mango/slideout#api" target="_blank">API</a></li>
          <li><a href="https://github.com/mango/slideout#npm-scripts" target="_blank">npm-scripts</a></li>
        </ul>
      </section>

      <section class="menu-section">
        <h3 class="menu-section-title">Docs</h3>
        <ul class="menu-section-list">
          <li><a href="https://github.com/mango/slideout#installation" target="_blank">Installation</a></li>
          <li><a href="https://github.com/mango/slideout#usage" target="_blank">Usage</a></li>
          <li><a href="https://github.com/mango/slideout#api" target="_blank">API</a></li>
          <li><a href="https://github.com/mango/slideout#npm-scripts" target="_blank">npm-scripts</a></li>
        </ul>
      </section>

      <section class="menu-section">
        <h3 class="menu-section-title">Docs</h3>
        <ul class="menu-section-list">
          <li><a href="https://github.com/mango/slideout#installation" target="_blank">Installation</a></li>
          <li><a href="https://github.com/mango/slideout#usage" target="_blank">Usage</a></li>
          <li><a href="https://github.com/mango/slideout#api" target="_blank">API</a></li>
          <li><a href="https://github.com/mango/slideout#npm-scripts" target="_blank">npm-scripts</a></li>
        </ul>
      </section>
    </nav>

    <!--<main id="panel" class="panel">-->
    <!--<header class="panel-header">-->
    <!--<h1 class="title">Slideout.js</h1>-->
    <!--</header>-->

    <!--<section class="box">-->
    <!--<h2 class="box-title">Test</h2>-->
    <!--<div id="mocha" class="box-content"></div>-->
    <!--</section>-->

    <!--<footer class="panel-footer">-->
    <!--<p>with <span class="heart">❤</span> by <a href="https://getmango.com/en" target="_blank">Mango</a></p>-->
    <!--</footer>-->
    <!--</main>-->
    <div class="panel-header">
      <button class="btn-hamburger js-slideout-toggle" @click="toggle"></button>
    </div>
  </div>
</template>
<script>
  import { Slideout } from '../componentJS/slideout.min'

  export default {
      methods: {
          toggle: function () {
              this.slide.toggle()
          }
      },
      mounted: function () {
          document.querySelector('.container').className += ' panel'
          this.slide = new Slideout({
              'panel': document.querySelector('.container'),
              'menu': document.getElementById('menu'),
              'padding': 256,
              'tolerance': 70
          })
//            this.toggle();
      },
      data: function () {
          return {
              slide: {}
          }
      }

  }

</script>

<style scoped>
  .slideout-menu {
    position: fixed;
    top: 0;
    bottom: 0;
    width: 256px;
    min-height: 100vh;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    z-index: 0;
    display: none;
  }

  .slideout-menu-left {
    left: 0;
  }

  .slideout-menu-right {
    right: 0;
  }

  .slideout-panel {
    position: relative;
    z-index: 1;
    will-change: transform;
    background-color: #FFF; /* A background-color is required */
    min-height: 100vh;
  }

  .slideout-open,
  .slideout-open body,
  .slideout-open .slideout-panel {
    overflow: hidden;
  }

  .slideout-open .slideout-menu {
    display: block;
  }

  .btn-hamburger {
    top: 20px;
    left: 30px;
  }

  .btn-hamburger {
    border: none;
    position: absolute;
    top: 12px;
    left: 12px;
    outline: none;
    background: url('~../assets/img/menu.png') no-repeat center;
    width: 50px;
    height: 50px;
  }

  .menu {
    background-color: #1D1F20;
    background-image: linear-gradient(145deg, #1D1F20, #404348);
  }

  .menu a {
    color: #fff;
  }

  .menu a:hover {
    text-decoration: underline;
  }

  .menu-header {
    border-bottom: 1px solid #2a2d2f;
    padding: 20px;
    background-size: 32px;
  }

  .menu-header-title {
    font-weight: 400;
    letter-spacing: 0.5px;
    margin: 0;
  }

  .menu-section {
    margin: 25px 0;
  }

  .menu-section-title {
    text-transform: uppercase;
    color: #85888d;
    font-weight: 200;
    font-size: 13px;
    letter-spacing: 1px;
    padding: 0 20px;
    margin: 0;
  }

  .menu-section-list {
    padding: 0;
    margin: 10px 0;
    list-style: none;
  }

  .menu-section-list a {
    display: block;
    padding: 10px 20px;
  }

  /*.panel {*/
  /*text-align: center;*/
  /*padding-top: 5px;*/
  /*min-height: 100%;*/
  /*}*/

  /**
   * Boxes
   */
  .box {
    border: 1px solid #4b5;
    border-radius: 4px;
    text-align: left;
    margin: 50px 10px;
    position: relative;
  }

  .box:before,
  .box:after {
    content: ' ';
    display: inline-block;
    width: 1px;
    height: 50px;
    border-left: 1px solid #4b5;
    position: absolute;
    left: 50%;
  }

  .box:before {
    top: -50px;
  }

  .box:after {
    bottom: -50px;
  }

  .box-title {
    margin: 0;
    padding: 10px 20px;
    border-bottom: 1px solid #4b5;
    color: #4b5;
    font-size: 1.2em;
    font-weight: 400;
  }

  .box-content {
    padding: 20px;
    background-color: #f8f8f8;
  }

  /**
   * Medium Screens
   */
  @media all and (min-width: 40em) {

    .btn-hamburger {
      top: 20px;
      left: 30px;
    }

    .panel-header {
      margin-top: 40px;
      width: 455px;
    }

    .title {
      font-size: 4.2em;
    }
  }

  /**
   * Large Screens
   */
  @media all and (min-width: 54em) {
    .box {
      width: 70%;
      max-width: 1200px;
      margin: 50px auto;
    }
  }

  .panel {
    text-align: center;
    padding-top: 5px;
    min-height: 100%;
  }
</style>
