<template>
	<v-ons-page>
  		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
    	<v-ons-card>
			<p v-html="$t('message.sweepPrivateKeyDescription')"></p>
			<div class="center" style="margin-top:20px">
            	<v-ons-input float type="text" v-model="privateKey" :placeholder="$t('message.sweepPrivateKey')" style="width:100%"></v-ons-input>
        	</div>
			<div style="margin-top:20px">
				<v-ons-button @click="sweepPrivateKey()">{{$t('message.sweepAddress')}}</v-ons-button>
			</div>
  		</v-ons-card>
	</v-ons-page>
</template>
<script>
import bitcore from 'bitcore-lib';
import axios from 'axios';
import sb from 'satoshi-bitcoin';
export default {
  data() {
    return {
    	privateKey:'',
    	publicAddress:'',
		fee:100000
    };
  },
  created: function () {
    this.publicAddress=db.get('addr').value()[0].publicAddress;
  },
  methods: {
    	sweepPrivateKey()
    	{
    		let vm=this;
    		if (!this.privateKey)
			{
				vm.$ons.notification.toast(vm.$t('message.enterPrivateKey'), {timeout: 1000, animation: 'fall' });
			}
			else
			{
				if (!bitcore.PrivateKey.isValid(this.privateKey))
				{
		        	vm.$ons.notification.toast(vm.$t('message.invalidPrivateKey'), {timeout: 1000, animation: 'fall' });
				}
				var privateKey = bitcore.PrivateKey.fromWIF(this.privateKey);
				var publicKey = privateKey.toAddress();
			    axios.get(apiURL+'utxo', {
			        params: {
			          network: network,
			          a: publicKey.toString()
			        }
			      })
			      .then(function (response)
			      {
			        var utxo=response.data;
			        if(utxo.length>0)
			        {
			            try
			            {
			                var tx=new bitcore.Transaction().from(utxo);
			                var amount=(tx.inputAmount-vm.fee)/100000000;
						    try
							{
								var tx = new bitcore.Transaction()
								.from(utxo)
								.to(vm.publicAddress, sb.toSatoshi(amount))
								.settime(moment().unix())
								.change(vm.publicAddress)
								.sign(privateKey);
								console.log(tx.toObject());
								console.log(tx.serialize());
								axios.post(apiURL+'sendrawtransaction', "network="+network+"&a="+tx.serialize().toString(),config)
								.then((retval) =>
								{
							       vm.$ons.notification.alert("<pre style='font-size:8pt'>" + vm.$t('message.sweepAddress')+"\r\n" + publicKey + "\r\n\r\n"+vm.$t('message.sweepAmount') + "\r\n" + amount + "</pre>",{title:vm.$t('message.sweepSuccess')});
								}
								).catch((e) => {sendError(res, 200,e);})
							}
							catch(err)
							{
								vm.$ons.notification.toast(err.message, {timeout: 1000, animation: 'fall' });
							}
			            }
			            catch(err)
			            {
			                console.log(err);
			            }
			        }
			        else
			        {
				       vm.$ons.notification.alert(vm.$t('message.noUTXO'),{title:vm.$t('message.sweepPrivateKey')});
			        }
			    })
			    .catch(function (error)
				{
					console.log(error);
				})
				.then(function ()
				{
				});
			}
    	}
	}
};
</script>