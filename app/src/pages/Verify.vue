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
import bitcore from 'bitcore-lib';
import message from 'bitcore-message';
export default {
  data() {
    return {
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
					var privateKey = bitcore.PrivateKey.fromWIF(window.db.get('addr').value()[0].privateKey.toString());
					var result = new bitcore.Message(this.message).verify(this.address, this.signature);
					vm.$ons.notification.toast(result.toString(), {timeout: 1000, animation: 'fall' });
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