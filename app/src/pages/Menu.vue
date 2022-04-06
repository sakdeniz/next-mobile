<template>
	<v-ons-page modifier="white">
		<v-ons-list>
			<v-ons-list-item v-for="(item, index) in access" :key="item.title" :modifier="md ? 'nodivider' : ''" @click="loadView(index)">
				<div class="left">
					<v-ons-icon fixed-width class="list-item__icon" :icon="item.icon"></v-ons-icon>
				</div>
				<div class="center">
					{{item.title}}
				</div>
			</v-ons-list-item>
			<v-ons-list-item v-for="item in pages" :modifier="md ? 'nodivider' : ''" v-on:click="push(item.component, item.title)">
				<div class="left">
					<v-ons-icon fixed-width class="list-item__icon" :icon="item.icon"></v-ons-icon>
				</div>
				<div class="center">
					{{item.title}}
				</div>
			</v-ons-list-item>
		</v-ons-list>
		<v-ons-list-title>Links</v-ons-list-title>
		<v-ons-list>
			<v-ons-list-item v-for="item in links" :key="item.title" :modifier="md ? 'nodivider' : ''" @click="loadLink(item.url)">
				<div class="left">
					<v-ons-icon fixed-width class="list-item__icon" :icon="item.icon"></v-ons-icon>
				</div>
				<div class="center">
					{{item.title}}
				</div>
				<div class="right">
					<v-ons-icon icon="fa-external-link"></v-ons-icon>
				</div>
			</v-ons-list-item>
		</v-ons-list>
	</v-ons-page>
</template>
<script>
import PrivateToken from './PrivateToken.vue';
import NFTWorkshop from './NFTWorkshop.vue';
import DotNAV from './DotNAV.vue';
import LinkedProjects from './LinkedProjects.vue';
import NFTOrders from './NFTOrders.vue';

export default
{
	methods: {
		loadView(index)
		{
			this.$store.commit('tabbar/set', index);
			this.$store.commit('splitter/toggle');
		},
		loadLink(url)
		{
			window.open(url, '_blank');
		},
		push(page, key)
		{
			this.$store.commit('navigator/push', {
				extends: page
			});
		}
	},
	data()
	{
		return {
			links: [
				{
					title: vm.$t('message.navcoinWebsite'),
					icon: 'ion-ios-open',
					url: 'https://www.navcoin.org'
				},
				{
					title: vm.$t('message.nextWalletWebsite'),
					icon: 'ion-ios-open',
					url: 'https://www.nextwallet.org'
				},
				{
					title: 'Github',
					icon: 'ion-logo-github',
					url: 'https://github.com/sakdeniz/next'
				},
				{
					title: 'Twitter',
					icon: 'ion-logo-twitter',
					url: 'https://twitter.com/nextwallet'
				}
			],
			pages:[
				{
					component: PrivateToken,
					title: vm.$t('message.privateTokensTitle'),
					desc: vm.$t('message.privateTokensTitle'),
					icon: this.md ? 'ion-ios-hammer' : 'ion-ios-hammer',
				},
				{
					component: NFTWorkshop,
					title: vm.$t('message.nftWorkshopTitle'),
					desc: vm.$t('message.nftWorkshopTitle'),
					icon: this.md ? 'ion-ios-images' : 'ion-ios-images',
				},
				{
					component: DotNAV,
					title: vm.$t('message.dotNavTitle'),
					desc: vm.$t('message.dotNavTitle'),
					icon: this.md ? 'ion-ios-globe' : 'ion-ios-globe',
				},
				{
					component: LinkedProjects,
					title: vm.$t('message.linkedProjectsTitle'),
					desc: vm.$t('message.linkedProjectsTitle'),
					icon: this.md ? 'ion-ios-planet' : 'ion-ios-planet',
				},
				{
					component: NFTOrders,
					title: vm.$t('message.NFTOrdersTitle'),
					desc: vm.$t('message.NFTOrdersTitle'),
					icon: this.md ? 'ion-ios-timer' : 'ion-ios-timer',
				}
			],
			access: [
				{
					title: vm.$t('message.home'),
					icon: 'ion-ios-wallet,ion-ios-wallet'
				},
				{
					title: vm.$t('message.receive'),
					icon: 'ion-ios-swap,ion-ios-swap'
				},
				{
					title: vm.$t('message.send'),
					icon: 'ion-ios-send,ion-ios-send'
				},
				{
					title: vm.$t('message.nftMarketplace'),
					icon: 'ion-ios-cart,ion-ios-cart'
				},
				{
					title: vm.$t('message.staking'),
					icon: 'ion-ios-snow, ion-ios-snow'
				},
				{
					title: vm.$t('message.communityFund'),
					icon: 'ion-md-chatboxes, ion-md-chatboxes'
				},
				{
					title: vm.$t('message.settings'),
					icon: 'ion-ios-cog, ion-ios-cog'
				}
			]
		};
	}
};
</script>
<style scoped>
.profile-pic
{
	width: 100%;
	background-color: #fff;
	border-bottom: 1px solid #DDD;
	color: rgba(0, 0, 0, .56);
	padding-bottom: 8px;
}
.page--material .profile-pic {
	background-color: #f6f6f6;
}

.profile-pic > img {
	display: block;
	max-width: 100%;
}
</style>

<style>
.page--material__background.page--white__background
{
	background-color: #fff;
}
</style>
