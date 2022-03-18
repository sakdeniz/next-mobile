<template>
	<v-ons-page>
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-card>
			<div class="title">
				{{$t('message.createProposal')}}
			</div>
			<div class="content">
				<div class="center" style="margin-top:20px">
					v{{strdzeel_v}}
				</div>
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
				<v-ons-list style="margin-top:15px;">
					<v-ons-list-header>
						<i class="ion-ios-star"></i>&nbsp;Creates a super proposal which would print new coins instead of taking from the fund.
					</v-ons-list-header>
					<v-ons-list-item>
						<label class="left">
							<v-ons-checkbox input-id="superProposal" v-model="isSuperProposal"></v-ons-checkbox>
							&nbsp;<label class="center" for="superProposal">
							Super Proposal
							</label>
						</label>
					</v-ons-list-item>
				</v-ons-list>
				<div class="center" style="margin-top:40px">
					<v-ons-button :disabled="!proposalTitle || !proposalRequestedAmount || !proposalAddress" v-on:click="createProposal()"><i class="ion-ios-send"></i>&nbsp;{{$t('message.createProposalSubmit')}}</v-ons-button>
				</div>
			</div>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
import axios from 'axios';
import moment from 'moment';
import sb from 'satoshi-bitcoin';
import bitcore from '@aguycalled/bitcore-lib';
import { mapGetters,mapActions,mapState} from 'vuex';
export default {
	data() {
		return {
			day:0,
			month:0,
			year:0,
			proposalTitle:'',
			proposalRequestedAmount:'',
			proposalAddress:undefined,
			strdzeel_v:'',
			strdzeel_v_normal:42,
			strdzeel_v_super:106,
			strdzeel_d:'',
			isSuperProposal:false,
			publicAddress:undefined,
			privateKey:undefined
		};
	},
	created: function ()
	{
		this.strdzeel_v=this.strdzeel_v_normal;
	},
	computed:
	{
		...mapState({
			config: state => state.config,
		}),
	},
	mounted: function()
	{
		if (this.proposalAddress==undefined) this.proposalAddress=this.config.public_address;
	},
	watch:
	{
		isSuperProposal: function (val) 
		{
			if (val) this.strdzeel_v=this.strdzeel_v_super; else this.strdzeel_v=this.strdzeel_v_normal;
		}
	},
	methods:
	{
		total_in_seconds: function ()
		{
			var tis=0;
			if (this.day) tis=this.day*86400;
			if (this.month) tis+=this.month*2592000;
			if (this.year) tis+=this.year*31536000;
			return tis;
		},
		createProposal: function ()
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
			//
			this.publicAddress=this.config.public_address;
			console.log(this.publicAddress);
			wallet.NavGetPrivateKeys().then(function (e)
			{
				Object.entries(e).forEach(([key, item]) =>
				{
					if(item.address==vm.publicAddress)
					{
						vm.privateKey=item.privateKey;
						console.log("Title:"+vm.proposalTitle);
						console.log("Amount:"+vm.proposalRequestedAmount);
						console.log("Payment Address:"+vm.proposalAddress);
						console.log("Time:"+vm.strdzeel_d);
						console.log("Public address:"+vm.publicAddress);
						console.log("Private key:"+vm.privateKey);
						console.log(moment().unix());
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
							try
							{
								var script = new bitcore.Script()
								.add('OP_RETURN')
								.add('OP_CFUND')
								var strdzeel='{\"n\":'+sb.toSatoshi(vm.proposalRequestedAmount)+',\"a\":\"'+vm.proposalAddress+'\",\"d\":'+vm.strdzeel_d+',\"s\":\"'+vm.proposalTitle+'\",\"v\":'+vm.strdzeel_v+'}';
								console.log("strdzeel:"+strdzeel);
								var tx=new bitcore.Transaction()
								.from(utxo)
								.addOutput(new bitcore.Transaction.Output({
									script: script,
									satoshis: sb.toSatoshi(50)
								}))
								.settime(moment().unix())
								.change(vm.publicAddress)
								.setversion("4")
								.anondest(strdzeel)
								.sign(vm.privateKey);
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
							catch(e)
							{
								vm.$ons.notification.toast(e, { timeout: 2000, animation: 'fall' });
								console.log(e);
							}
						})
						.catch(function (e)
						{
							vm.$ons.notification.toast(e, { timeout: 2000, animation: 'fall' });
							console.log(e);
						})
						.then(function ()
						{
						});
					}
				});
			});
		}
	}
};
</script>