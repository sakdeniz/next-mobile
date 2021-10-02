<template>
	<v-ons-page id="page-send">
		<v-ons-modal :visible="modalVisible" @click="modalVisible = false">
			<p style="text-align: center">
				{{$t('message.txInProgress')}} <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
			</p>
		</v-ons-modal>
		<v-ons-modal :visible="modalVisible_2" @click="modalVisible_2 = false">
			<p style="text-align: center">
				{{$t('message.pleaseWait')}} <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
			</p>
		</v-ons-modal>
		<v-ons-card>
			<div class="title">
				{{$t('message.send')}}
				<v-ons-button style="float:right" v-on:click="scan()"><i class="ion-md-qr-scanner"></i>&nbsp;{{$t('message.scan')}}</v-ons-button>
				<v-ons-button style="float:right;margin-right:5px;" v-on:click="push(pages['0'].component, $t('message.settingsAddressBook'))"><i class="ion-md-person"></i></v-ons-button>
			</div>
			{{getAddress}}
			<div class="content">
				<div class="center" style="margin-top:20px">
					<center>
						<img src="images/transfer.svg" style="width:128px;height:auto;">
					</center>
				</div>
				<ons-list>
					<ons-list-header>Settings</ons-list-header>
					<ons-list-item>
						<div class="center">
							<span v-if="isPrivateTransaction">{{$t('message.sendPrivateDescription')}}</span> <span v-else>{{$t('message.sendPublicDescription')}}</span>
						</div>
						<div class="right">
							<v-ons-switch input-id="switch1" v-model="isPrivateTransaction"></v-ons-switch>
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
				<div class="center" style="margin-top:40px">
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
import sb from 'satoshi-bitcoin';
import AddressBook from './AddressBook.vue';
export default
{
	data ()
	{
		return {
			modalVisible:false,
			modalVisible_2:false,
			publicAddress:'',
			isPrivateTransaction:false,
			isIncludesTxFee:false,
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
	created: function ()
	{
		this.publicAddress=db.get('addr').value()[0].publicAddress;
	},
	methods:
	{
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
			if (this.isPrivateTransaction)
			{
				this.amount=(this.$store.state.config.Balance.xnav.confirmed)/100000000;
			}
			else
			{
				this.amount=(this.$store.state.config.Balance.nav.confirmed+this.$store.state.config.Balance.staked.confirmed)/100000000;
			}
		},
		send()
		{
			let vm=this;
			if (vm.isPrivateTransaction)
			{
				try
				{
					vm.modalVisible_2=true;
					window.wallet.xNavCreateTransaction(vm.address, vm.amount * 1e8, '', undefined, vm.isIncludesTxFee).then(function (tx)
					{
						vm.modalVisible_2=false;
						vm.$ons.notification.confirm(vm.$t('message.amountToSend') + " : " + sb.toBitcoin((vm.isIncludesTxFee?(vm.amount*1e8)-tx.fee:vm.amount*1e8)) + " xNAV<br/>" + vm.$t('message.transactionFee') + " : " + sb.toBitcoin(tx.fee) + " xNAV<br/>" + vm.$t('message.totalAmount') + " : " + sb.toBitcoin((vm.isIncludesTxFee?vm.amount*1e8:(vm.amount*1e8)+tx.fee)) + " xNAV"+"<br/><br/>"+vm.$t('message.sendConfirmQuestion'),{title:vm.$t('message.sendConfirm'),buttonLabels:[vm.$t('message.sendConfirmNo'), vm.$t('message.sendConfirmYes')]})
						.then((response) =>
						{
							if (response)
							{
								vm.modalVisible=true;
								window.wallet.SendTransaction(tx.tx).then(function (result)
								{
									if (result.error)
									{
										vm.modalVisible=false;
										vm.modalVisible_2=false;
										vm.$ons.notification.alert(result.error,{title:vm.$t('message.txSubmitError')});
									}
									else
									{
										vm.modalVisible=false;
										vm.modalVisible_2=false;
										vm.address=null;
										vm.amount=null;
										vm.$ons.notification.toast(vm.$t('message.sendSuccess'), { timeout: 3000, animation: 'fall' });
									}
								})
								.catch((e) =>
								{
									vm.modalVisible=false;
									vm.modalVisible_2=false;
									vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
								});
							}
						})
						.catch((e) =>
						{
							vm.modalVisible=false;
							vm.modalVisible_2=false;
							vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
						});
					})
					.catch((e) =>
					{
						vm.modalVisible=false;
						vm.modalVisible_2=false;
						vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
					});
				}
				catch(e)
				{
					vm.modalVisible=false;
					vm.modalVisible_2=false;
					vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
				}
			}
			else
			{
				try
				{
					vm.modalVisible_2=true;
					window.wallet.NavCreateTransaction(vm.address,vm.amount * 1e8, '', undefined, vm.isIncludesTxFee).then(function (tx)
					{
						vm.modalVisible_2=false;
						vm.$ons.notification.confirm(vm.$t('message.amountToSend') + " : " + sb.toBitcoin((vm.isIncludesTxFee?(vm.amount*1e8)-tx.fee:vm.amount*1e8)) + " NAV<br/>" + vm.$t('message.transactionFee') + " : " + sb.toBitcoin(tx.fee) + " NAV<br/>" + vm.$t('message.totalAmount') + " : " + sb.toBitcoin((vm.isIncludesTxFee?vm.amount*1e8:(vm.amount*1e8)+tx.fee)) + " NAV"+"<br/><br/>"+vm.$t('message.sendConfirmQuestion'),{title:vm.$t('message.sendConfirm'),buttonLabels:[vm.$t('message.sendConfirmNo'), vm.$t('message.sendConfirmYes')]})
						.then((response) =>
						{
							if (response)
							{
								vm.modalVisible=true;
								window.wallet.SendTransaction(tx.tx).then(function (result)
								{
									if (result.error)
									{
										vm.modalVisible=false;
										vm.modalVisible_2=false;
										vm.$ons.notification.alert(result.error,{title:vm.$t('message.txSubmitError')});
									}
									else
									{
										vm.modalVisible=false;
										vm.modalVisible_2=false;
										vm.address=null;
										vm.amount=null;
										vm.$ons.notification.toast(vm.$t('message.sendSuccess'), { timeout: 3000, animation: 'fall' });
									}
								})
								.catch((e) =>
								{
									vm.modalVisible=false;
									vm.modalVisible_2=false;
									vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
								});
							}
						});
					})
					.catch((e) =>
					{
						vm.modalVisible=false;
						vm.modalVisible_2=false;
						vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
					});
				}
				catch(e)
				{
					vm.modalVisible=false;
					vm.modalVisible_2=false;
					vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
				}
			}
		},
		push(page, key)
		{
			this.$store.commit('navigator/push', {
				extends: page,
				data() {
					return {
						toolbarInfo:{
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