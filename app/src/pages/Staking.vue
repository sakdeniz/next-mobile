<template>
	<v-ons-page id="page-staking">
		<v-ons-modal :visible="modalVisible" @click="modalVisible = false">
			<p style="text-align: center">
				{{$t('message.txInProgress')}} <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
			</p>
		</v-ons-modal>
		<v-ons-card>
			<div class="title">
				{{$t('message.staking')}}
			</div>
			<div class="content">
				<center>
					<img src="images/cold_staking.png" style="width:128px;height:auto;">
				</center>
				<div v-html="$t('message.stakingIntroduction')"></div>
				<div v-if="config.Balance">
					<div v-show="config.Balance.staked.confirmed>0" class="cl1">
						{{$t('message.coldStakingActive')}}
					</div>
					<div v-show="config.Balance.staked.confirmed==0" class="cl1">
						{{$t('message.coldStakingNotActive')}}
					</div>
					<div v-show="config.Balance.staked.pending>0" class="cl3">
						<i class="ion-ios-information-circle-outline"></i>&nbsp;{{$t('message.coldStakingPending')}} {{formatBalance(config.Balance.staked.pending)}} NAV
					</div>
					<div v-show="config.Balance.staked.confirmed>0" class="cl3">
						<i class="ion-ios-snow"></i>&nbsp;{{$t('message.coldStakingActivelyStaking')}} {{formatBalance(config.Balance.staked.confirmed)}} NAV
					</div>
					<div v-if="publicAddress" class="cl2">
						<h5>{{$t('message.spendingAddress')}}</h5>
						{{publicAddress}}
					</div>
					<div v-if="cold_staking_address" class="cl2">
						<v-ons-button style="float:right" modifier="quiet" v-on:click="doCopy()"><i class="fa fa-clipboard"></i></v-ons-button>
						<h5>{{$t('message.coldStakingAddress')}}</h5>
						{{cold_staking_address}}
					</div>
					<div class="center" style="margin-top:40px">
						<center><v-ons-progress-circular indeterminate v-if="state"></v-ons-progress-circular></center>
					</div>
					<div class="center" style="margin-top:20px" v-show="!state&&config.Balance.nav.confirmed>0">
						<v-ons-button modifier="large" v-on:click="confirmColdStaking('next')"><i class="ion-ios-play"></i>&nbsp;{{$t('message.startStaking')}}</v-ons-button>
					</div>
					<div class="center" style="margin-top:20px" v-show="!state&&config.Balance.nav.confirmed>0">
						<v-ons-button modifier="large" v-on:click="confirmColdStaking('custom')"><i class="ion-ios-add-circle-outline"></i>&nbsp;{{$t('message.coldStakingStartCustomStaking')}}</v-ons-button>
					</div>
					<div v-show="!state&&config.Balance.nav.confirmed==0&&!cold_staking_active" class="center" style="margin-top:20px">
						{{$t('message.coldStakingDepositRequired')}}
					</div>
					<div class="center" style="margin-top:20px" v-show="!state&&config.Balance.staked.confirmed>0">
						<v-ons-button modifier="large" v-on:click="confirmStopColdStaking()"><i class="ion-ios-square"></i>&nbsp;{{$t('message.stopStaking')}}</v-ons-button>
					</div>
				</div>
			</div>
		</v-ons-card>
		<v-ons-card>
			<div class="content">
				<div class="title">
					{{$t('message.coldStakingFAQTitle')}}
				</div>
				<div v-html="$t('message.coldStakingFAQ')"></div>
			</div>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
import axios from 'axios';
import sb from 'satoshi-bitcoin';
import message from '@aguycalled/bitcore-message';
import { mapGetters,mapActions,mapState} from 'vuex';
export default {
	data () {
		return {
			state:false,
			publicAddress:undefined,
			cold_staking_active:false,
			cold_staking_address:"",
			modalVisible:false
			};
	},
	created: function ()
	{
		this.cold_staking_active=this.config.cold_staking_active;
		this.cold_staking_address=this.config.cold_staking_address;
	},
	computed:
	{
		...mapState({
			config: state => state.config,
		}),
	},
	updated:function()
	{
		if (this.publicAddress==undefined) this.publicAddress=this.config.public_address;
	},
	methods:
	{
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
		formatBalance: n =>
		{
			if (n==0) return n;
			if (n)
			{
				var amount=sb.toBitcoin(n);
				var parts=amount.toString().split(".");
				return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
			}
			else
			{
				return "";
			}
		},
		confirmStopColdStaking()
		{
			let vm=this;
			vm.$ons.notification.confirm(vm.$t('message.confirmColdStakingStopQuestion'),{title:vm.$t('message.confirmColdStakingStopTitle'),buttonLabels:[vm.$t('message.confirmColdStakingNo'), vm.$t('message.confirmColdStakingYes')]})
			.then((response) =>
			{
				if (response)
				{
					wallet.NavCreateTransaction(vm.config.public_address,vm.$store.state.config.Balance.staked.confirmed,'',undefined,true,undefined,0x2).then(function (tx)
					{
						vm.$ons.notification.confirm(vm.$t('message.amountToSend') + " : " + sb.toBitcoin(vm.$store.state.config.Balance.staked.confirmed) + " NAV<br/>" + vm.$t('message.transactionFee') + " : " + sb.toBitcoin(tx.fee) + " NAV<br/>" + vm.$t('message.totalAmount') + " : " + sb.toBitcoin(vm.$store.state.config.Balance.staked.confirmed-tx.fee) + " NAV"+"<br/><br/>"+vm.$t('message.sendConfirmQuestion'),{title:vm.$t('message.sendConfirm'),buttonLabels:[vm.$t('message.sendConfirmNo'), vm.$t('message.sendConfirmYes')]})
						.then((response) =>
						{
							if (response)
							{
								vm.state=true;
								vm.modalVisible=true;
								wallet.SendTransaction(tx.tx).then(function (result)
								{
									if (result.error)
									{
										vm.state=false;
										vm.modalVisible=false;
										vm.$ons.notification.alert(result.error,{title:vm.$t('message.txSubmitError')});
									}
									else
									{
										vm.state=false;
										vm.modalVisible=false;
										vm.$ons.notification.toast(vm.$t('message.sendSuccess'), { timeout: 3000, animation: 'fall' });
									}
								})
								.catch((e) =>
								{
									vm.state=false;
									vm.modalVisible=false;
									vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
								});
							}
						});
					})
					.catch((e) =>
					{
						vm.state=false;
						vm.modalVisible=false;
						vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
					});
				}
			});
		},
		startColdStaking(coldStakingAddress)
		{
			let vm=this;
			wallet.NavCreateTransaction(coldStakingAddress,vm.$store.state.config.Balance.nav.confirmed, '', undefined, true).then(function (tx)
			{
				vm.$ons.notification.confirm(vm.$t('message.amountToSend') + " : " + sb.toBitcoin(vm.$store.state.config.Balance.nav.confirmed) + " NAV<br/>" + vm.$t('message.transactionFee') + " : " + sb.toBitcoin(tx.fee) + " NAV<br/>" + vm.$t('message.totalAmount') + " : " + sb.toBitcoin(vm.$store.state.config.Balance.nav.confirmed-tx.fee) + " NAV"+"<br/><br/>"+vm.$t('message.sendConfirmQuestion'),{title:vm.$t('message.confirmColdStakingStartTitle'),buttonLabels:[vm.$t('message.sendConfirmNo'), vm.$t('message.sendConfirmYes')]})
				.then((response) =>
				{
					if (response)
					{
						vm.state=true;
						vm.modalVisible=true;
						wallet.SendTransaction(tx.tx).then(function (result)
						{
							if (result.error)
							{
								vm.state=false;
								vm.modalVisible=false;
								vm.$ons.notification.alert(result.error,{title:vm.$t('message.txSubmitError')});
							}
							else
							{
								vm.$store.commit('config/setColdStakingActive',true);
								vm.$store.commit('config/setColdStakingAddress',coldStakingAddress);
								vm.cold_staking_active=true;
								vm.cold_staking_address=coldStakingAddress;
								vm.state=false;
								vm.modalVisible=false;
								vm.$ons.notification.toast(vm.$t('message.sendSuccess'), { timeout: 3000, animation: 'fall' });
							}
						})
						.catch((e) =>
						{
							vm.state=false;
							vm.modalVisible=false;
							vm.$ons.notification.alert(e.message,{title:vm.$t('message.staking')});
						});
					}
				});
			})
			.catch((e) =>
			{
				vm.state=false;
				vm.modalVisible=false;
				vm.$ons.notification.alert(e.message,{title:vm.$t('message.staking')});
			});
		},
		confirmColdStaking(type)
		{
			const bitcore=require('@aguycalled/bitcore-lib');
			let vm=this;
			if (vm.$store.state.config.Balance.nav.confirmed>0)
			{
				if (type=="next")
				{
					vm.$ons.notification.confirm(vm.$t('message.confirmColdStakingQuestion'),{title:vm.$t('message.confirmColdStakingStartTitle'),buttonLabels:[vm.$t('message.confirmColdStakingNo'), vm.$t('message.confirmColdStakingYes')]})
					.then((response) =>
					{
						if (response)
						{
							wallet.NavGetPrivateKeys("",vm.config.public_address).then(function (e)
							{
								var privateKey = bitcore.PrivateKey.fromWIF(e[0].privateKey);
								var message = new bitcore.Message("next wallet cold staking permission "+vm.config.public_address);
								var signature = message.sign(privateKey);
								axios.get(window.apiURL+'getcoldstakingaddress', {
									params:{
										network: window.network,
										a: vm.config.public_address,
										signature : signature
									}
								})
								.then(function (response)
								{
									try
									{
										if (!response.data.error)
										{
											vm.startColdStaking(response.data.coldStakingAddress);
										}
										else
										{
											vm.state=false;
											vm.$ons.notification.alert(response.data.error,{title:vm.$t('message.staking')});
										}
									}
									catch(e)
									{
										vm.state=false;
										vm.modalVisible=false;
										vm.$ons.notification.alert(e.message,{title:vm.$t('message.staking')});
									}
								})
								.catch(function (error)
								{
									vm.state=false;
								})
							});
						}
					});
				}
				if (type=="custom")
				{
					vm.$ons.notification.prompt(vm.$t('message.coldStakingSpecifyCustomAddress'),{title:vm.$t('message.coldStakingStartCustomStaking')})
					.then(function(stakingAddress)
					{
						if (stakingAddress)
						{
							try
							{
								let coldStakingAddress=bitcore.Address.fromScript(new bitcore.Script.fromAddresses(stakingAddress,bitcore.Address(vm.config.public_address))).toString(window.network);
								vm.startColdStaking(coldStakingAddress);
							}
							catch(e)
							{
								vm.$ons.notification.alert(e.message,{title:vm.$t('message.staking')});
							}
						}
					});
				}
			}
			else
			{
				vm.$ons.notification.alert(vm.$t('message.stakingNoBalance'),{title:vm.$t('message.staking')});
			}
		},
		push(page, key)
		{
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

.cl1 {text-align:center;margin:3px;margin-top:10px;color:#ffffff;padding:5px;border-radius:5px;background-image: linear-gradient(to right, #673AB7 0%, #8862e2 51%, #673AB7 100%)}
.cl1:hover { background-position: right center; }

.cl2 {font-family:"Courier New";margin:3px;margin-top:10px;color:#232323;padding:5px;border-radius:5px;background-color:#f3f3f3;}
.cl2:hover { background-position: right center; }

.cl3 {text-align:center;margin:3px;margin-top:10px;color:#ffffff;padding:5px;border-radius:5px;background-image: linear-gradient(to right, #1a98e9 0%, #1a98e9 51%, #1a98e9 100%)}
.cl3:hover { background-position: right center; }

</style>