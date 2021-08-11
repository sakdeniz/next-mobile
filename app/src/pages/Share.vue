<template>
	<v-ons-page>
  		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
	  	<v-ons-card>
			<v-ons-list>
      			<v-ons-list-item v-for="item in links" :key="item.title" :modifier="md ? 'nodivider' : ''" @click="loadLink(item.url)">
        			<div class="left">
          				<v-ons-icon fixed-width class="list-item__icon" :icon="item.icon"></v-ons-icon>
        			</div>
        			<div class="center">
          				{{item.title}}
        			</div>
      			</v-ons-list-item>
    		</v-ons-list>
		</v-ons-card>
	</v-ons-page>
</template>

<script>
export default {
  data() {
    return {
    	links: [
        {
          title: "Facebook",
          icon: 'ion-logo-facebook',
          url: 'https://www.facebook.com/sharer/sharer.php?u=https://www.nextwallet.org'
        },
        {
          title: 'Twitter',
          icon: 'ion-logo-twitter',
          url: 'http://www.twitter.com/share?url=https://www.nextwallet.org'
        }
      ],
    };
  },
  methods: {
    loadLink(url) {
      window.open(url, '_blank');
    }
  },
};
</script>