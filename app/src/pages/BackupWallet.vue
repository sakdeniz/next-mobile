<template>
	<v-ons-page>
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-card>
			<h3>
				{{$t('message.mnemonics')}}
				<v-ons-button style="float:right;margin-bottom:15px;" v-on:click="doCopy(mnemonics)"><i class="fa fa-clipboard"></i></v-ons-button>
			</h3>
			<code>
				{{mnemonics}}
			</code>
		</v-ons-card>
		<v-ons-card>
			<h3>
				{{$t('message.privateKey')}}
				<v-ons-button style="float:right;margin-bottom:15px;" v-on:click="doCopy(privateKeyWif)"><i class="fa fa-clipboard"></i></v-ons-button>
			</h3>
			<code>
				{{privateKeyWif}}
			</code>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
	const buffer=require('buffer');
	const crypto=require('crypto');
	const bitcore = require('@aguycalled/bitcore-lib');
	const Mnemonic = require('@aguycalled/bitcore-mnemonic');
	import { mapGetters,mapActions,mapState} from 'vuex';
	export default
	{
		computed:
		{
			...mapState({
				config: state => state.config,
			}),
		},
		mounted: function ()
		{
			let vm=this;
			wallet.db.GetMasterKey("mnemonic",undefined).then(function (e)
			{
				vm.mnemonics=e;
			});
			wallet.NavGetPrivateKeys(undefined,this.config.public_address).then(function (e)
			{
				vm.privateKeyWif=e[0].privateKey;
			});
		},
		data()
		{
			return {
				mnemonics:'',
				privateKeyWif:''
			};
		},
		methods:
		{
			doCopy: function (value)
			{
				this.$copyText(value).then(function (e)
				{
					vm.$ons.notification.toast(vm.$t('message.clipboardSuccess'), { timeout: 1000, animation: 'fall' });
				},
				function (e)
				{
					vm.$ons.notification.toast(vm.$t('message.clipboardFailed'), { timeout: 1000, animation: 'fall' });
				})
			},
		}
	};
</script>