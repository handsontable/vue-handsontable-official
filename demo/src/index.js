import Vue from 'vue';
import SampleApp from './sampleApp.vue';

Vue.component('sampleapp', SampleApp);

new Vue({
  el: '#sampleApp',
});