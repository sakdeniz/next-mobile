import 'onsenui/css/onsenui.css';
import './onsen-css-components.css';
import Vue from 'vue';
import Vuex from 'vuex';
import VueOnsen from 'vue-onsenui';
import storeLike from './store.js';
import CustomToolbar from './partials/CustomToolbar.vue';
import AppNavigator from './AppNavigator.vue';
import VueI18n from 'vue-i18n';
import en from './languages/en.json';
import es from './languages/es.json';
import de from './languages/de.json';
import tr from './languages/tr.json';
Vue.use(VueI18n);
Vue.use(Vuex);
Vue.use(VueOnsen);
var locale;
const messages={en:en,es:es,de:de,tr:tr}
const i18n=new VueI18n({locale:locale,messages});
Vue.component('custom-toolbar',CustomToolbar);
setTimeout(function()
{
	window.vm=new Vue({
		i18n,
		config,
	    el: '#app',
	    render: h => h(AppNavigator),
	    store: new Vuex.Store(storeLike),
	    beforeCreate()
	    {
	        Vue.prototype.md = this.$ons.platform.isAndroid();
	        if (window.location.search.match(/iphonex/i))
	        {
	            document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
	            document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
	        }
	    }
	});
},3000);