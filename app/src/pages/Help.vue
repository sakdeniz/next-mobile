<template>
	<v-ons-page>
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-card>
			{{$t('message.help')}}
			<v-ons-list>
				<v-ons-list-item tappable modifier="nodivider" v-on:click="loadLink('https://discordapp.com/invite/y4Vu9jw')">
					<div class="left">
						<v-ons-icon icon="ion-md-open" class="list-item__icon"></v-ons-icon>
					</div>
					<div class="center">
						{{$t('message.helpDiscord')}}
					</div>
				</v-ons-list-item>
				<v-ons-list-item tappable modifier="nodivider" v-on:click="loadLink('https://www.navcoin.org')">
					<div class="left">
						<v-ons-icon icon="ion-md-open" class="list-item__icon"></v-ons-icon>
					</div>
					<div class="center">
						{{$t('message.navcoinWebsite')}}
					</div>
				</v-ons-list-item>
				<v-ons-list-item tappable modifier="nodivider" v-on:click="loadLink('https://www.reddit.com/r/navcoin')">
					<div class="left">
						<v-ons-icon icon="ion-logo-reddit" class="list-item__icon"></v-ons-icon>
					</div>
					<div class="center">
						{{$t('message.navcoinReddit')}}
					</div>
				</v-ons-list-item>
				<v-ons-list-item tappable modifier="nodivider" v-on:click="loadLink('https://www.github.com/sakdeniz/next')">
					<div class="left">
						<v-ons-icon icon="ion-logo-github" class="list-item__icon"></v-ons-icon>
					</div>
					<div class="center">
						{{$t('message.githubRepo')}}
					</div>
				</v-ons-list-item>
			</v-ons-list>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
export default
{
	data()
	{
		return{};
	},
	methods:
	{
		loadLink(url) {
			window.open(url, '_blank');
		}
	}
};
</script>