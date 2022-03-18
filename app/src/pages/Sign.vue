<template>
	<v-ons-page>
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-card>
			<div style="margin-top:20px">
				{{$t('message.publicKey')}}
				<pre>{{config.public_address}}</pre>
			</div>
			<div class="center" style="margin-top:50px">
				<v-ons-input float type="text" v-model="message" :placeholder="$t('message.signMessage')" style="width:100%"></v-ons-input>
			</div>
			<div style="margin-top:20px">
				<v-ons-button @click="signMessage()">{{$t('message.sign')}}</v-ons-button>
				<v-ons-button v-show="signedMessage" v-on:click="doCopy()"><i class="fa fa-clipboard"></i>&nbsp;{{$t('message.copy')}}</v-ons-button>
			</div>
			<div style="margin-top:15px;">
				<code>
					{{signedMessage}}
				</code>
			</div>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
import bitcore from '@aguycalled/bitcore-lib';
import message from 'bitcore-message';
import { mapGetters,mapActions,mapState} from 'vuex';
export default {
	data()
	{
		return {
			toolbarInfo:
			{
				backLabel: 'Home',
				title: "Sign",
			},
			message:'',
			signedMessage:''
		};
	},
	computed:
	{
		...mapState({
			config: state => state.config,
		}),
	},
	methods:
	{
		signMessage()
		{
			let vm=this;
			if (!this.message)
			{
				vm.$ons.notification.toast(vm.$t('message.enterSignMessage'), {timeout: 1000, animation: 'fall' });
			}
			else
			{
				try
				{
					wallet.NavGetPrivateKeys("",this.config.public_address).then(function (e)
					{
						vm.signedMessage=wallet.Sign(bitcore.PrivateKey.fromWIF(e[0].privateKey),vm.message);
					});
				}
				catch (err)
				{
					vm.$ons.notification.toast(err.message, {timeout: 1000, animation: 'fall' });
				}
			}
		},
		doCopy: function ()
		{
			this.$copyText(this.signedMessage).then(function (e)
			{
				vm.$ons.notification.toast(vm.$t('message.clipboardSuccess'), { timeout: 1000, animation: 'fall' });
			},
			function (e)
			{
				vm.$ons.notification.toast(vm.$t('message.clipboardFailed'), { timeout: 1000, animation: 'fall' });
			})
		}
	}
};
</script>


