<template>
	<v-ons-page>
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
			<v-ons-card>
				<div class="center" style="margin-top:20px;margin-bottom:40px">
					<v-ons-input float type="text" v-model="message" :placeholder="$t('message.verifyMessage')" style="width:100%" ></v-ons-input>
				</div>
				<div class="center" style="margin-bottom:40px">
					<v-ons-input float type="text" v-model="address" :placeholder="$t('message.verifyAddress')" style="width:100%"></v-ons-input>
				</div>
				<div class="center" style="margin-bottom:40px">
					<v-ons-input float type="text" v-model="signature" :placeholder="$t('message.verifySignature')" style="width:100%"></v-ons-input>
				</div>
				<v-ons-button @click="verifyMessage()" style="margin-top:20px">
					{{$t('message.verify')}}
				</v-ons-button>
			</v-ons-card>
	</v-ons-page>
</template>
<script>
import bitcore from '@aguycalled/bitcore-lib';
import message from 'bitcore-message';
export default
{
	data() {
		return {
			toolbarInfo:
			{
				backLabel: 'Home',
				title: "Verify",
			},
			message:'',
			address:'',
			signature:'',
			error:'',
		};
	},
	methods: {
		verifyMessage()
		{
			if (!this.message || !this.address || !this.signature)
			{
				vm.$ons.notification.toast(vm.$t('message.enterVerifyMessage'), {timeout: 1000, animation: 'fall' });
			}
			else
			{
				try
				{
					let result=wallet.VerifySignature(this.address,this.message,this.signature)
					vm.$ons.notification.toast((result.toString()=="true"?vm.$t('message.messageValid'):vm.$t('message.messageNotValid')), {timeout: 1000, animation: 'fall' });
				}
				catch (err)
				{
					vm.$ons.notification.toast(err.message, {timeout: 1000, animation: 'fall' });
				}
			}
		}
	}
};
</script>