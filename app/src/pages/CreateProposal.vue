<template>
  <v-ons-page>
    <custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
     <v-ons-card>
      <div class="title">
        {{$t('message.createProposal')}}
      </div>
      <div class="content">
        <div class="center" style="margin-top:20px">
            <v-ons-input :placeholder="$t('message.createProposalDescription')" float type="text" v-model="proposalTitle" style="width:100%" autofocus></v-ons-input>
        </div>
        <div class="center" style="margin-top:30px">
            <v-ons-input :placeholder="$t('message.createProposalAmount')" float type="number" v-model="proposalRequestedAmount" style="width:100%"></v-ons-input>
        </div>
        <div class="center" style="margin-top:30px">
            <v-ons-input :placeholder="$t('message.createProposalPaymentAddress')" float type="text" v-model="proposalAddress" style="width:100%"></v-ons-input>
        </div>
        <h3 class="title">
        	{{$t('message.createProposalTimeline')}}
        </h3>
		<v-ons-select class="ui dropdown" v-model="day" value="1"><option v-for="index in 32" :key="index" v-bind:value="index-1">{{index-1}} {{$t('message.days')}}</option></v-ons-select>
		<v-ons-select class="ui dropdown" v-model="month"><option v-for="index in 13" :key="index" v-bind:value="index-1">{{index-1}} {{$t('message.months')}}</option></v-ons-select>
		<v-ons-select class="ui dropdown" v-model="year"><option v-for="index in 6" :key="index" v-bind:value="index-1">{{index-1}} {{$t('message.years')}}</option></v-ons-select>

        <div class="center" style="margin-top:40px">
            <v-ons-button :disabled="!proposalTitle || !proposalRequestedAmount || !proposalAddress" v-on:click="createProposal()">{{$t('message.createProposalSubmit')}}</v-ons-button>
        </div>
      </div>
    </v-ons-card>
  </v-ons-page>
</template>

<script>
import axios from 'axios';
import sb from 'satoshi-bitcoin';
import bitcore from 'bitcore-lib';
export default {
  data() {
    return {
    day:0,
  	month:0,
  	year:0,
    proposalTitle:'',
    proposalRequestedAmount:'',
    proposalAddress:'',
    strdzeel_v:2,
    strdzeel_d:''
    };
  },
  created: function ()
  {
	this.proposalAddress=db.get('addr').value()[0].publicAddress;
  },
  methods: {
  	total_in_seconds: function ()
	{
		var tis=0;
		if (this.day) tis=this.day*86400;
		if (this.month) tis+=this.month*2592000;
		if (this.year) tis+=this.year*31536000;
		return tis;
	},
    createProposal()
    {
    	let vm=this;
		if (!this.proposalTitle)
		{
			vm.$ons.notification.toast(vm.$t('message.createProposalMissingDescription'), { timeout: 2000, animation: 'fall' });
			return;
		}
		if (!this.proposalRequestedAmount)
		{
			vm.$ons.notification.toast(vm.$t('message.createProposalMissingAmount'), { timeout: 2000, animation: 'fall' });
			return;
		}
		if (!this.proposalAddress)
		{
			vm.$ons.notification.toast(vm.$t('message.createProposalMissingAddress'), { timeout: 2000, animation: 'fall' });
			return;
		}
		if (vm.total_in_seconds()==0)
		{
			vm.$ons.notification.toast(vm.$t('message.createProposalMissingTimeline'), { timeout: 2000, animation: 'fall' });
			return;
		}
		this.strdzeel_d=vm.total_in_seconds();
	    console.log(this.proposalTitle);
	    console.log(this.proposalRequestedAmount);
	    console.log(this.proposalAddress);
	    console.log(this.strdzeel_d);
	    //
		const publicAddress=db.get('addr').value()[0].publicAddress;
		axios.get(window.apiURL+'utxo', {
			params: {
				network: window.network,
				a: publicAddress
			}
		})
		.then(function (response)
		{
			var utxo=response.data;	 
			console.log(utxo);
		    try
			{
				var script = new bitcore.Script()
				.add('OP_RETURN')
				.add('OP_CFUND')
				var strdzeel='{\"n\":'+sb.toSatoshi(vm.proposalRequestedAmount)+',\"a\":\"'+vm.proposalAddress+'\",\"d\":'+vm.strdzeel_d+',\"s\":\"'+vm.proposalTitle+'\",\"v\":'+vm.strdzeel_v+'}';
				console.log("strdzeel:"+strdzeel);
				const publicAddress=db.get('addr').value()[0].publicAddress;
				const privateKey=db.get('addr').value()[0].privateKey;
				var tx=new bitcore.Transaction()
				.from(utxo)
				.addOutput(new bitcore.Transaction.Output({
					script: script,
					satoshis: sb.toSatoshi(50)
				}))
				.settime(moment().unix())
				.change(publicAddress)
				.setversion("4")
				.anondest(strdzeel)
				.sign(privateKey);
				console.log("-----------");
				console.log("TRANSACTION");
				console.log("-----------");
				console.log(tx.toObject());
				console.log("----------");
				console.log("SERIALIZED");
				console.log("----------");
				console.log(tx.serialize({disableSmallFees: true,disableMoreOutputThanInput:true}));
				console.log("-----------");
				axios.post(window.apiURL+'sendrawtransaction', "network="+window.network+"&a="+tx.serialize({disableSmallFees: true,disableMoreOutputThanInput:true}).toString(),window.config)
				.then((retval) =>{
					if (retval.data.substring(0,5) == "error")
					{
						vm.$ons.notification.alert(retval.data,{title:"Error"});
					}
					else
					{
						vm.proposalTitle='';
						vm.proposalRequestedAmount='';
						vm.day=0;
						vm.month=0;
						vm.year=0;
						vm.$ons.notification.toast(vm.$t('message.createProposalSubmitSuccess'), { timeout: 2000, animation: 'fall' });
					}
					console.log(retval.data);
				}
				).catch((e) =>{
					vm.$ons.notification.toast(e, { timeout: 2000, animation: 'fall' });
					console.log(e);
				})
			}
			catch(err)
			{
				vm.$ons.notification.toast(e, { timeout: 2000, animation: 'fall' });
				console.log(err);
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
};
</script>