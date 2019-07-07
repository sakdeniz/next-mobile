<template>
  <v-ons-page :style="swipePosition">
    <custom-toolbar :style="swipeTheme" modifier="white-content">
      <span class="logo-text">{{title}}</span>
      <v-ons-toolbar-button slot="right" modifier="white-content" @click="$store.commit('splitter/toggle');">
        <v-ons-icon icon="ion-navicon, material:md-menu"></v-ons-icon>
      </v-ons-toolbar-button>
    </custom-toolbar>

    <v-ons-tabbar position="bottom"
      :modifier="md ? 'autogrow white-content' : ''"
      :on-swipe="md ? onSwipe : null"
      :tabbar-style="swipeTheme"
      :tabs="tabs"
      :index.sync="index"
    ></v-ons-tabbar>
  </v-ons-page>
</template>

<script>
import Home from './pages/Home.vue';
import Receive from './pages/Receive.vue';
import Send from './pages/Send.vue';
import CommunityFund from './pages/CommunityFund.vue';
import Settings from './pages/Settings.vue';

// Just a linear interpolation formula
const lerp = (x0, x1, t) => parseInt((1 - t) * x0 + t * x1, 10);
// RGB colors
const red = [244, 67, 54];
const blue = [30, 136, 229];
const purple = [103, 58, 183];

export default {
  data () {
    return {
      shutUp: !this.md,
      colors: purple,
      animationOptions: {},
      topPosition: 0,
      tabs: [
        {
          label: '',
          icon: this.md ? 'ion-home' : 'ion-home',
          page: Home,
          theme: purple
        },
        {
          label: '',
          icon: this.md ? 'ion-archive' : 'ion-archive',
          page: Receive,
          theme: purple
        },
        {
          label: '',
          icon: this.md ? 'ion-paper-airplane' : 'ion-paper-airplane',
          page: Send,
          theme: purple
        },
        {
          label: '',
          icon: this.md ? 'ion-chatbubbles' : 'ion-chatbubbles',
          page: CommunityFund,
          theme: purple
        },
        {
          label: '',
          icon: this.md ? 'ion-gear-a' : 'ion-gear-a',
          page: Settings,
          theme: purple
        }
      ]
    };
  },

  methods: {
    onSwipe(index, animationOptions)
    {
		if (typeof(QRScanner) != "undefined")
		{
			QRScanner.getStatus(function(status)
			{
				if (status.scanning)
				{
					QRScanner.cancelScan(function(status)
					{
					});
					$("#page-send").show();
					$("#page-add-contact").show();
		  		}
		  	});
	  	}
     	// Apply the same transition as ons-tabbar
      	this.animationOptions = animationOptions;
      	// Interpolate colors and top position
      	const a = Math.floor(index), b = Math.ceil(index), ratio = index % 1;
      	this.colors = this.colors.map((c, i) => lerp(this.tabs[a].theme[i], this.tabs[b].theme[i], ratio));
      	this.topPosition = lerp(this.tabs[a].top || 0, this.tabs[b].top || 0, ratio);
    }
  },

  computed: {
    index: {
      get() {
        return this.$store.state.tabbar.index;
      },
      set(newValue) {
        this.$store.commit('tabbar/set', newValue)
      }
    },
    title() {
      return this.md ? 'NEXT' : this.tabs[this.index].title || this.tabs[this.index].label;
    },
    swipeTheme() {
      return this.md && {
        backgroundColor: `rgb(${this.colors.join(',')})`,
        transition: `all ${this.animationOptions.duration || 0}s ${this.animationOptions.timing || ''}`
      }
    },
    swipePosition() {
      return this.md && {
        top: this.topPosition + 'px',
        transition: `all ${this.animationOptions.duration || 0}s ${this.animationOptions.timing || ''}`
      }
    }
  }
};
</script>

<style>
/* Custom 'white-content' modifier */

.page--material .toolbar--white-content__center,
.page--material .toolbar-button--white-content,
.page--material :checked + .tabbar--white-content__button {
  color: white;
}

.page--material .tabbar--white-content__button {
  color: rgba(255, 255, 255, 0.7);
}

.page--material .tabbar--white-content__border {
  background-color: white;
}

@font-face {
  font-family: 'neo';
  src: url('../static/fonts/neo-latina.ttf');
}

.logo-text {
	font-family: 'neo';
	font-size:30pt;
	font-weight:normal;
}
</style>
