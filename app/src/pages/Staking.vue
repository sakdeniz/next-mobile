<template>
	<v-ons-page id="page-staking">
		<v-ons-card>
			<div class="title">
				{{$t('message.staking')}}
			</div>
			<div class="content">
	            <center>
        			<img src="images/cold_staking.svg" style="width:128px;height:auto;">
        		</center>
				<div v-html="$t('message.stakingIntroduction')"></div>
				<div v-if="cold_staking_active" class="cl1">
					Cold Staking Active
				</div>
				<div v-if="cold_staking_address" class="cl2">
	                <v-ons-button style="float:right" modifier="quiet" v-on:click="doCopy()"><i class="fa fa-clipboard"></i></v-ons-button>
					{{cold_staking_address}}
				</div>
				<div class="center" style="margin-top:40px">
					<center><v-ons-progress-circular indeterminate v-if="state"></v-ons-progress-circular></center>
					<v-ons-button v-if="!state" modifier="large" v-on:click="checkBalance()">{{$t('message.startStaking')}}</v-ons-button>
				</div>
			</div>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
import axios from 'axios';
import sb from 'satoshi-bitcoin';
import message from 'bitcore-message';

export default {
  data () {
    return {
    	state:false,
	    publicAddress:'',
	    address:'',
	    amount:'',
	    fee:100000,
	    cold_staking_active:false,
	    cold_staking_address:"",
    };
  },
  created: function () {
	this.cold_staking_active=this.config.cold_staking_active;
	this.cold_staking_address=this.config.cold_staking_address;
    this.publicAddress=db.get('addr').value()[0].publicAddress;
  },
  computed:
  {
  	config()
  	{
    	return this.$store.state.config;
  	}
  },
  methods: {
  	doCopy: function ()
    {
        this.$copyText(this.cold_staking_address).then(function (e)
        {
            vm.$ons.notification.toast(vm.$t('message.clipboardSuccess'), { timeout: 1000, animation: 'fall' });
        },
        function (e)
        {
            vm.$ons.notification.toast(vm.$t('message.clipboardFailed'), { timeout: 1000, animation: 'fall' });
        })
    },
  	checkBalance()
  	{
  		let vm=this;
  		vm.$ons.notification.confirm(vm.$t('message.confirmColdStakingQuestion'),{title:vm.$t('message.confirmColdStakingTitle'),buttonLabels:[vm.$t('message.confirmColdStakingNo'), vm.$t('message.confirmColdStakingYes')]})
		.then((response) =>
    	{
    		if (response)
    		{
    			vm.state=true;
				console.log("Checking Balance...");
				axios.get(window.apiURL+'utxo', {
		        params: {
		          network: window.network,
		          a: vm.publicAddress
		        }
		       })
			   .then(function (response)
			   {
			   		console.log(response);
			   		var utxo=response.data;
			        if(utxo.length>0)
			        {
			        	vm.startStaking();
			        }
			        else
			        {
			        	vm.state=false;
			        	console.log("No UTXO record found");
						vm.$ons.notification.alert(vm.$t('message.stakingNoBalance'),{title:vm.$t('message.staking')});
			        }
			   });
    		}
    		else
    		{
    			vm.state=false;
    		}
    	});

  	},
  	startStaking()
  	{
  		let vm=this;
      	const bitcore=require('bitcore-lib');
		console.log("Start staking...");
		var privateKey = bitcore.PrivateKey.fromWIF(db.get('addr').value()[0].privateKey.toString());
		var message = new bitcore.Message("next wallet cold staking permission "+vm.publicAddress);
		var signature = message.sign(privateKey);
		axios.get(window.apiURL+'getcoldstakingaddress', {
			params: {
			  network: window.network,
			  a: vm.publicAddress,
			  signature : signature
			}
		})
		.then(function (response)
		{
			console.log(response);
		    try
			{
				if (!response.data.error)
				{
					var data=response.data;
					var coldStakingAddress=response.data.coldStakingAddress;
					//
				    axios.get(window.apiURL+'utxo', {
				        params: {
				          network: window.network,
				          a: vm.publicAddress
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
				                var amount=(tx.inputAmount-vm.fee)/100000000;
				                console.log("UTXO Amount :" + amount);
				                //
							    console.log(response.data);
		    					vm.$store.commit('config/setColdStakingActive',true);
						    	vm.$store.commit('config/setColdStakingAddress',coldStakingAddress);
								vm.cold_staking_active=true;
						    	vm.cold_staking_address=coldStakingAddress;
								// ##### SEND #####
								axios.get(window.apiURL+'utxo', {
									params: {
									  network: window.network,
									  a: vm.publicAddress
									}
								})
								.then(function (response)
								{
									console.log("Amount:"+sb.toSatoshi(amount));
									var utxo=response.data;	  
								    try
									{
										console.log("To:"+coldStakingAddress);
										console.log("Amount:"+amount);
										const publicAddress=vm.publicAddress;
										const privateKey=window.db.get('addr').value()[0].privateKey;
										var tx = new bitcore.Transaction()
										.from(utxo)
										.to(coldStakingAddress, sb.toSatoshi(amount))
										.settime(moment().unix())
										.change(vm.publicAddress)
										.sign(window.db.get('addr').value()[0].privateKey);
										console.log(tx.toObject());
										console.log(tx.serialize());
										axios.post(window.apiURL+'sendrawtransaction', "network="+window.network+"&a="+tx.serialize().toString(),config)
										.then((retval) =>
										{
											console.log(retval.data);
											vm.state=false;
											vm.$ons.notification.alert(vm.$t('message.stakingSuccessfullyStarted'),{title:vm.$t('message.staking')});
										}
										).catch((e) => {sendError(res, 200,e);})
									}
									catch(err)
									{
										vm.state=false;
										vm.$ons.notification.alert("Error No :" + err.errno + "<br/>" + "Code :" + err.code + "<br/>" + "Path :" + err.path + "<br/>" + "Message :" + err.message,{title:vm.$t('message.staking')});
									}
								})
								.catch(function (error)
								{
									vm.state=false;
									console.log(error);
								})
								.then(function ()
								{
								});
								// ##### SEND #####
				            }
				            catch(err)
				            {
				            	vm.state=false;
				                console.log(err);
				            }
				        }
				        else
				        {
				        	vm.state=false;
				        	console.log("No UTXO record found");
							vm.$ons.notification.alert(vm.$t('message.stakingNoBalance'),{title:vm.$t('message.staking')});
				        }
				    })
				    .catch(function (error)
					{
						vm.state=false;
						console.log(error);
					})
					.then(function ()
					{
					});
				}
				else
				{
					vm.state=false;
	                vm.$ons.notification.alert(response.data.error,{title:vm.$t('message.staking')});
				}
			}
			catch(err)
			{
			}
		})
		.catch(function (error)
		{
			vm.state=false;
			console.log(error);
		})
		.then(function ()
		{
		});
	},
    startStaking2()
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

.cl1 {text-align:center;margin:3px;margin-top:10px;color:#ffffff;padding:5px;border-radius:5px;background-image: linear-gradient(to right, #673AB7 0%, #512DA8 51%, #673AB7 100%)}
.cl1:hover { background-position: right center; }

.cl2 {font-family:"Courier New";margin:3px;margin-top:10px;color:#232323;padding:5px;border-radius:5px;background-color:#f3f3f3;}
.cl2:hover { background-position: right center; }

</style>