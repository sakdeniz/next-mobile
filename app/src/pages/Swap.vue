<template>
	<v-ons-page>
		<v-ons-modal :visible="modalVisible">
			<p style="text-align: center">
				{{$t('message.swapInProgress')}} <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
			</p>
		</v-ons-modal>
		<v-ons-modal :visible="modalVisible_2">
			<p style="text-align: center">
				{{$t('message.pleaseWait')}} <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
			</p>
		</v-ons-modal>
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-card>
			<div class="content">
				<ons-list>
					<ons-list-header>
						{{$t('message.swapType')}}
					</ons-list-header>
					<ons-list-item>
						<div class="center">
							<span v-if="isPrivateToPublic">{{$t('message.swapPrivateToPublic')}}</span>
							<span v-else>{{$t('message.swapPublicToPrivate')}}</span>
						</div>
						<div class="right">
							<v-ons-switch input-id="switch1" v-model="isPrivateToPublic"></v-ons-switch>
						</div>
					</ons-list-item>
					<ons-list-item>
						<div class="center">
							{{$t('message.includesTxFee')}}
						</div>
						<div class="right">
							<v-ons-switch input-id="switch2" v-model="isIncludesTxFee"></v-ons-switch>
						</div>
					</ons-list-item>
				</ons-list>
				<div class="center" style="margin-top:30px">
					<v-ons-input :placeholder="$t('message.swapAmount')" float type="number" v-model="amount" inputmode="decimal" style="width:100%"></v-ons-input>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-button :disabled="!amount" v-on:click="swap()"><i class="ion-ios-repeat"></i>&nbsp;{{$t('message.btnSwap')}}</v-ons-button>
					<v-ons-button style="float:right" v-on:click="useAllFunds()">{{$t('message.btnSwapUseAllFunds')}}</v-ons-button>
				</div>
			</div>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
import sb from 'satoshi-bitcoin';
export default {
	data() {
		return {
			amount:'',
			isPrivateToPublic:false,
			isIncludesTxFee:false,
			modalVisible:false,
			modalVisible_2:false
		};
	},
	created: function ()
	{
	},
	methods:
	{
		useAllFunds()
		{
			if (this.isPrivateToPublic)
			{
				this.amount=(this.$store.state.config.Balance.xnav.confirmed)/1e8;
			}
			else
			{
				this.amount=(this.$store.state.config.Balance.nav.confirmed+this.$store.state.config.Balance.staked.confirmed)/1e8;
			}
		},
		swap()
		{
			let vm=this;
			if (!this.amount)
			{
				vm.$ons.notification.toast(vm.$t('message.swapMissingAmount'), { timeout: 3000, animation: 'fall' });
				return;
			}
			const publicAddress=this.$store.state.config.public_address;
			const privateAddress=this.$store.state.config.private_address;
			let amount=parseFloat((vm.amount*1e8).toFixed(0));
			if (vm.isPrivateToPublic)
			{
				try
				{
					vm.modalVisible_2=true;
					wallet.xNavCreateTransaction(publicAddress, amount, '', undefined, vm.isIncludesTxFee).then(function (tx)
					{
						vm.modalVisible_2=false;
						vm.$ons.notification.confirm(vm.$t('message.amountToSwap') + " : " + sb.toBitcoin((vm.isIncludesTxFee?amount-tx.fee:amount)) + " xNAV<br/>" + vm.$t('message.transactionFee') + " : " + sb.toBitcoin(tx.fee) + " xNAV<br/>" + vm.$t('message.totalAmount') + " : " + sb.toBitcoin((vm.isIncludesTxFee?amount:amount+tx.fee)) + " xNAV"+"<br/><br/>"+vm.$t('message.swapConfirmQuestion'),{title:vm.$t('message.swapConfirm'),buttonLabels:[vm.$t('message.swapConfirmNo'), vm.$t('message.swapConfirmYes')]})
						.then((response) =>
						{
							if (response)
							{
								vm.modalVisible=true;
								wallet.SendTransaction(tx.tx).then(function (result)
								{
									if (result.error)
									{
										vm.modalVisible=false;
										vm.modalVisible_2=false;
										vm.$ons.notification.alert(result.error,{title:vm.$t('message.swapSubmitError')});
									}
									else
									{
										vm.modalVisible=false;
										vm.modalVisible_2=false;
										vm.amount=null;
										vm.$ons.notification.toast(vm.$t('message.swapSuccess'), { timeout: 3000, animation: 'fall' });
									}
								})
								.catch((e) =>
								{
									vm.modalVisible=false;
									vm.modalVisible_2=false;
									vm.$ons.notification.alert(e.message,{title:vm.$t('message.swap')});
								});
							}
						})
						.catch((e) =>
						{
							vm.modalVisible=false;
							vm.modalVisible_2=false;
							vm.$ons.notification.alert(e.message,{title:vm.$t('message.swap')});
						});
					})
					.catch((e) =>
					{
						vm.modalVisible=false;
						vm.modalVisible_2=false;
						vm.$ons.notification.alert(e.message,{title:vm.$t('message.swap')});
					});
				}
				catch(e)
				{
					vm.modalVisible=false;
					vm.modalVisible_2=false;
					vm.$ons.notification.alert(e.message,{title:vm.$t('message.swap')});
				}
			}
			else
			{
				try
				{
					vm.modalVisible_2=true;
					wallet.NavCreateTransaction(privateAddress,amount, '', undefined, vm.isIncludesTxFee).then(function (tx)
					{
						vm.modalVisible_2=false;
						console.log(`transaction ${tx.tx} with fee ${tx.fee}`);
						vm.$ons.notification.confirm(vm.$t('message.amountToSwap') + " : " + sb.toBitcoin((vm.isIncludesTxFee?amount-tx.fee:amount)) + " NAV<br/>" + vm.$t('message.transactionFee') + " : " + sb.toBitcoin(tx.fee) + " NAV<br/>" + vm.$t('message.totalAmount') + " : " + sb.toBitcoin((vm.isIncludesTxFee?amount:amount+tx.fee)) + " NAV"+"<br/><br/>"+vm.$t('message.swapConfirmQuestion'),{title:vm.$t('message.swapConfirm'),buttonLabels:[vm.$t('message.swapConfirmNo'), vm.$t('message.swapConfirmYes')]})
						.then((response) =>
						{
							if (response)
							{
								vm.modalVisible=true;
								wallet.SendTransaction(tx.tx).then(function (result)
								{
									if (result.error)
									{
										vm.modalVisible=false;
										vm.modalVisible_2=false;
										vm.$ons.notification.alert(result.error,{title:vm.$t('message.swapSubmitError')});
									}
									else
									{
										vm.modalVisible=false;
										vm.modalVisible_2=false;
										vm.amount=null;
										vm.$ons.notification.toast(vm.$t('message.swapSuccess'), { timeout: 3000, animation: 'fall' });
									}
								})
								.catch((e) =>
								{
									vm.modalVisible=false;
									vm.modalVisible_2=false;
									console.log(e.message);
									vm.$ons.notification.alert(e.message,{title:vm.$t('message.swap')});
								});
							}
						});
					})
					.catch((e) =>
					{
						vm.modalVisible=false;
						vm.modalVisible_2=false;
						vm.$ons.notification.alert(e.message,{title:vm.$t('message.swap')});
					});
				}
				catch(e)
				{
					vm.modalVisible=false;
					vm.modalVisible_2=false;
					vm.$ons.notification.alert(e.message,{title:vm.$t('message.swap')});
				}
			}
		}
	}
};
</script>