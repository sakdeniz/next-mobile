<template>
	<v-ons-page>
		<div v-show="!config.scanning">
			<v-ons-dialog cancelable :visible.sync="dialogVisible">
				<v-ons-list v-if="config.book.length>0" style="width: 100%;height:300px;overflow-y: scroll;">
					<v-ons-list-item v-on:click="setAddress(user.address)" v-for="user,index in config.book"  tappable>
						<div class="center">
							<span class="list-item__subtitle">
								<i class="fa fa-user"></i>&nbsp;{{user.name}}
							</span>
							<span class="list-item__subtitle"><small>{{user.address}}</small></span>
						</div>
					</v-ons-list-item>
				</v-ons-list>
			</v-ons-dialog>
			<v-ons-modal :visible="modalVisible">
				<p style="text-align: center">
					{{$t('message.txInProgress')}} <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
				</p>
			</v-ons-modal>
			<v-ons-modal :visible="modalVisible_2">
				<p style="text-align: center">
					{{$t('message.pleaseWait')}} <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
				</p>
			</v-ons-modal>
			<v-ons-card>
				<div class="title">
					{{$t('message.send')}}
					<v-ons-button style="float:right" v-on:click="scan()"><i class="ion-md-qr-scanner"></i>&nbsp;{{$t('message.scan')}}</v-ons-button>
					<v-ons-button style="float:right;margin-right:5px;" v-on:click="dialogVisible=true"><i class="ion-md-person"></i></v-ons-button>
				</div>
				<div class="content">
					<div class="center" style="margin-top:20px">
						<center>
							<img src="images/transfer.png" style="width:128px;height:auto;">
						</center>
					</div>
					<ons-list>
						<ons-list-header>{{$t('message.settings')}}</ons-list-header>
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
						<v-ons-input :placeholder="$t('message.sendAmount')" float type="number" v-model="amount" inputmode="decimal" style="width:100%"></v-ons-input>
					</div>
					<div class="center" style="margin-top:40px">
						<v-ons-button v-on:click="useAllFunds()">{{$t('message.useAllFunds')}}</v-ons-button>
						<v-ons-button style="float:right" :disabled="!address || !amount" v-on:click="send()">{{$t('message.sendSubmit')}}</v-ons-button>
					</div>
				</div>
			</v-ons-card>
		</div>
		<div v-show="config.scanning">
			<v-ons-fab id="cancel-scan" position="bottom right" v-on:click="cancelScan()">
				<v-ons-icon icon="md-close"></v-ons-icon>
			</v-ons-fab>
			<div class="ocrloader">
				<p>Scanning</p>
				<em></em>
				<span></span>
			</div>
		</div>
	</v-ons-page>
</template>
<script>
function onDone(err, status)
{
	console.log("STATUS:"+JSON.stringify(status));
	console.log("err:"+err);
	if (err)
	{
		alert(JSON.stringify(err._message));
	}
	if (status.authorized)
	{
	}
	else if (status.denied)
	{
		alert("Camera access denied");
	}
	else
	{
	}
}
import sb from 'satoshi-bitcoin';
export default
{
	data ()
	{
		return {
			modalVisible:false,
			modalVisible_2:false,
			isPrivateTransaction:false,
			isIncludesTxFee:false,
			address:'',
			amount:'',
			fee:100000,
			dialogVisible: false,
			scanning:false
		};
	},
	computed:
	{
		config()
		{
			return this.$store.state.config;
		}
	},
	methods:
	{
		scan()
		{
			if (typeof(QRScanner) != "undefined")
			{
				let vm=this;
				$('.page__background').css('background-color','transparent');
				$('.tabbar').css('display','none');
				this.$store.commit('config/setScanning', true);
				QRScanner.prepare(onDone);
				QRScanner.scan(displayContents);
				function displayContents(err, text)
				{
					vm.scanning=false;
					if(err)
					{
						// an error occurred, or the scan was canceled (error code `6`)
					}
					else
					{
						console.log(text);
						if (text.startsWith("navcoin:"))
						{
							vm.address=text.split(":")[1];
							$('.page__background').css('background-color','#eceff1');
							$('.tabbar').css('display','');
							vm.$store.commit('config/setScanning', false);
							console.log("Destroying QRScanner...");
							QRScanner.destroy(function(status)
							{
								console.log(status);
							});
						}
					}
				}
				QRScanner.show();
			}
			else
			{
				$('.tabbar').css('display','none');
				$('.page__background').css('background-color','transparent');
				this.$store.commit('config/setScanning', true);
			}
		},
		cancelScan()
		{
			this.$store.commit('config/setScanning', false);
			$('.page__background').css('background-color','#eceff1');
			$('.tabbar').css('display','');
			console.log("cancelling scan...");
			if (typeof(QRScanner) != "undefined")
			{
				QRScanner.destroy(function(status)
				{
					console.log(status);
				});
			}
		},
		setAddress(address)
		{
			this.address=address;
			this.dialogVisible=false;
		},
		useAllFunds()
		{
			if (this.isPrivateTransaction)
			{
				this.amount=(this.$store.state.config.Balance.xnav.confirmed)/1e8;
			}
			else
			{
				this.amount=(this.$store.state.config.Balance.nav.confirmed+this.$store.state.config.Balance.staked.confirmed)/1e8;
			}
		},
		send()
		{
			let vm=this;
			let amount=parseFloat((vm.amount*1e8).toFixed(0));
			if (vm.isPrivateTransaction)
			{
				try
				{
					vm.modalVisible_2=true;
					wallet.xNavCreateTransaction(vm.address, amount, '', undefined, vm.isIncludesTxFee).then(function (tx)
					{
						vm.modalVisible_2=false;
						vm.$ons.notification.confirm(vm.$t('message.amountToSend') + " : " + sb.toBitcoin((vm.isIncludesTxFee?amount-tx.fee:amount)) + " xNAV<br/>" + vm.$t('message.transactionFee') + " : " + sb.toBitcoin(tx.fee) + " xNAV<br/>" + vm.$t('message.totalAmount') + " : " + sb.toBitcoin((vm.isIncludesTxFee?amount:amount+tx.fee)) + " xNAV"+"<br/><br/>"+vm.$t('message.sendConfirmQuestion'),{title:vm.$t('message.sendConfirm'),buttonLabels:[vm.$t('message.sendConfirmNo'), vm.$t('message.sendConfirmYes')]})
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
					wallet.NavCreateTransaction(vm.address,amount, '', undefined, vm.isIncludesTxFee).then(function (tx)
					{
						vm.modalVisible_2=false;
						vm.$ons.notification.confirm(vm.$t('message.amountToSend') + " : " + sb.toBitcoin((vm.isIncludesTxFee?amount-tx.fee:amount)) + " NAV<br/>" + vm.$t('message.transactionFee') + " : " + sb.toBitcoin(tx.fee) + " NAV<br/>" + vm.$t('message.totalAmount') + " : " + sb.toBitcoin((vm.isIncludesTxFee?amount:amount+tx.fee)) + " NAV"+"<br/><br/>"+vm.$t('message.sendConfirmQuestion'),{title:vm.$t('message.sendConfirm'),buttonLabels:[vm.$t('message.sendConfirmNo'), vm.$t('message.sendConfirmYes')]})
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
		push(page,key)
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