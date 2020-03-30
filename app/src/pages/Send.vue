<template>
	<v-ons-page id="page-send">
		<v-ons-card>
			<div class="title">
				{{$t('message.send')}}
				<v-ons-button style="float:right" v-on:click="scan()"><i class="ion-qr-scanner"></i>&nbsp;{{$t('message.scan')}}</v-ons-button>
				<v-ons-button style="float:right;margin-right:5px;" v-on:click="push(pages['0'].component, $t('message.settingsAddressBook'))"><i class="ion-android-person"></i></v-ons-button>
			</div>
			{{getAddress}}
			<div class="content">
				<div class="center" style="margin-top:20px">
					<center>
	        			<img src="images/transfer.svg" style="width:128px;height:auto;">
    	    		</center>
        		</div>
				<div class="center" style="margin-top:20px">
					<v-ons-input :placeholder="$t('message.sendAddress')" float type="text" v-model="address" style="width:100%"></v-ons-input>
				</div>
				<div class="center" style="margin-top:30px">
					<v-ons-input :placeholder="$t('message.sendAmount')" float type="number" v-model="amount" inputmode="numeric" style="width:100%"></v-ons-input>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-button :disabled="!address || !amount" v-on:click="send()">{{$t('message.sendSubmit')}}</v-ons-button>
					<v-ons-button style="float:right" v-on:click="useAllFunds()">{{$t('message.useAllFunds')}}</v-ons-button>
				</div>
			</div>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
import axios from 'axios';
import sb from 'satoshi-bitcoin';
import AddressBook from './AddressBook.vue';
export default {
  data () {
    return {
	    publicAddress:'',
	    address:'',
	    amount:'',
	    fee:100000,
	    pages: [
	    {
	          component: AddressBook,
	          label: 'AddressBook',
	          desc: 'AddressBook'
	    }]
    };
  },
  computed:
  {
  	getAddress()
  	{
  		this.address=this.$store.state.config.address;
  	}
  },
  created: function () {
    this.publicAddress=db.get('addr').value()[0].publicAddress;
  },
  methods: {
  	scan()
	{
		if (typeof(QRScanner) != "undefined")
		{
			let vm=this;
			$("#page-send").hide();
			QRScanner.scan(displayContents);
			function displayContents(err, text)
			{
				if(err)
				{
			    	// an error occurred, or the scan was canceled (error code `6`)
			  	}
				else
				{
			    	if (text.startsWith("navcoin:"))
			    	{
			    		vm.address=text.split(":")[1];
			    	}
			    	QRScanner.cancelScan(function(status)
			    	{
					});
			    	$("#page-send").show();
			  	}
			}
			QRScanner.show();
		}
	},
    useAllFunds()
    {      
      let vm=this;
      const bitcore=require('bitcore-lib');
      axios.get(window.apiURL+'utxo', {
        params: {
          network: window.network,
          a: this.publicAddress
        }
      })
      .then(function (response)
      {
        var utxo=response.data;
        console.log(utxo);
        if(utxo.length>0)
        {
            try
            {
                var tx=new bitcore.Transaction()
                .from(utxo);
                vm.amount=(tx.inputAmount-vm.fee)/100000000;
                console.log(vm.amount);
            }
            catch(err)
            {
                console.log(err);
                vm.$ons.notification.alert(err,{title:vm.$t('message.send')});
            }
        }
    });

    },
    send()
    {
      	let vm=this;
    	vm.$ons.notification.confirm(vm.$t('message.sendConfirmQuestion'),{title:vm.$t('message.sendConfirm'),buttonLabels:[vm.$t('message.sendConfirmNo'), vm.$t('message.sendConfirmYes')]})
		.then((response) =>
    	{
    		if (response)
    		{
    			axios.get(window.apiURL+'utxo', {
		        params: {
		          network: window.network,
		          a: this.publicAddress
		        }
		      })
		      .then(function (response)
		      {
		        console.log("Amount:"+sb.toSatoshi(vm.amount));
		        var utxo=response.data;   
		        console.log(utxo);
		        if(utxo.length>0)
		        {
		            try
		            {
		                const buffer=require('buffer');
		                const crypto=require('crypto');
		                const bitcore=require('bitcore-lib');
		                const Mnemonic=require('bitcore-mnemonic');
		                const config={headers:{'Content-Type':'application/x-www-form-urlencoded'},responseType:'text'}
		                const publicAddress=window.db.get('addr').value()[0].publicAddress;
		                const privateKey=window.db.get('addr').value()[0].privateKey;
		                var tx=new bitcore.Transaction()
		                .from(utxo)
		                .to(vm.address, sb.toSatoshi(vm.amount))
		                .settime(moment().unix())
		                .change(vm.publicAddress)
		                .sign(privateKey);
		                console.log(tx.getFee());
						if (tx.outputAmount>tx.inputAmount)
						{
							vm.$ons.notification.toast(vm.$t('message.sendNotEnoughFunds'), { timeout: 1000, animation: 'fall' });
						}
						else
						{
			                axios.post(window.apiURL+'sendrawtransaction', "network="+window.network+"&a="+tx.serialize().toString(),config)
			                .then((retval) =>
			                {
			                  vm.$ons.notification.toast('Sent', { timeout: 1000, animation: 'fall' });
			                  vm.address=null;
			                  vm.amount=null;
			                }
			                ).catch((e) => {sendError(res, 200,e);})
		                }
		            }
		            catch(err)
		            {
		                console.log(err);
		                vm.$ons.notification.alert(err,{title:vm.$t('message.send')});
		            }
		        }
		        else
		        {
		            vm.$ons.notification.toast(vm.$t('message.sendNotEnoughFunds'), { timeout: 1000, animation: 'fall' });
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
    	});
    },
    push(page, key) {
      this.$store.commit('navigator/push', {
        extends: page,
        data() {
          return {
            toolbarInfo: {
              backLabel: 'Home',
              title: key
            }
          }
        }
      });
    }
  }
};
</script>

<style>
.intro {
  text-align: left;
  padding: 0 22px;
  margin-top: 20px;
  font-size: 14px;
  line-height: 1.4;
  color: rgba(0, 0, 0, .54);
}

ons-card {
  cursor: pointer;
  color: #333;
}

.card__title, .card--material__title {
  font-size: 20px;
}
</style>