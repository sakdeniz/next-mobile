<template>
	<v-ons-page>
  		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
    	<v-ons-card>
			<div class="center" style="margin-top:20px">
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
import bitcore from 'bitcore-lib';
import message from 'bitcore-message';
export default {
  data() {
    return {
    	message:'',
    	signedMessage:''
    };
  },
  methods: {
    	signMessage()
    	{
    		if (!this.message)
			{
				vm.$ons.notification.toast(vm.$t('message.enterSignMessage'), {timeout: 1000, animation: 'fall' });
			}
			else
			{
				try
				{
					var privateKey=bitcore.PrivateKey.fromWIF(window.db.get('addr').value()[0].privateKey.toString());
					var message=new bitcore.Message(this.message);
					var signature=message.sign(privateKey);
					this.signedMessage=signature.toString();
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


