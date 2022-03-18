<template>
	<v-ons-page>
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-modal :visible="modalVisible" @click="modalVisible = false">
			<p style="text-align: center">
				{{$t('message.pleaseWait')}} <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
			</p>
		</v-ons-modal>
		<div class="center" style="margin-top:20px;">
			<v-ons-segment :index.sync="segmentIndex" style="width:100%">
				<button>{{$t('message.availableTokens')}}</button>
				<button>{{$t('message.createToken')}}</button>
				<button>{{$t('message.mintBurnToken')}}</button>
				<button>{{$t('message.sendToken')}}</button>
			</v-ons-segment>
		</div>
		<v-ons-card v-show="segmentIndex==0">
			<div class="content">
				<div class="center" style="margin-top:20px">
					<center>
						<img src="images/blockchain.png" style="width:64px;height:auto;">
					</center>
				</div>
				<v-ons-list v-if="config.Balance && Object.keys(config.Balance.tokens).length>0">
					<v-ons-list-item expandable :expanded.sync="item.isExpanded" v-for="(item,index) in config.Balance.tokens">
						<img src="images/block.png" style="width:32px;height:auto;margin-right:10px;"><b>{{item.name}}</b>
						<div class="expandable-content">
							<div>{{$t('message.tokenName')}} : {{item.name}}</div>
							<div>{{$t('message.tokenSymbol')}} : {{item.code}}</div>
							<div>{{$t('message.tokenMaxSupply')}} : {{numberWithCommas(item.supply)}} {{item.code}}</div>
							<div v-if="item.confirmed">{{$t('message.tokenBalance')}} : {{formatBalance(item.confirmed)}} {{item.code}}</div>
							<div v-if="item.pending">{{$t('message.tokenPending')}} : {{formatBalance(item.pending)}} {{item.code}}</div>
						</div>
					</v-ons-list-item>
				</v-ons-list>
				<div v-else>
					<p>
						<small>{{$t('message.noPrivateTokenAvailable')}}</small>
					</p>
					<v-ons-button v-on:click="segmentIndex=1">{{$t('message.btnCreateNewToken')}}</v-ons-button>
				</div>
			</div>
		</v-ons-card>
		<v-ons-card v-show="segmentIndex==1">
			<div class="content">
				<div class="center" style="margin-top:20px">
					<center>
						<img src="images/block_add.png" style="width:64px;height:auto;">
					</center>
				</div>
				<div class="center" style="margin-top:20px">
					<p>
						<small>{{$t('message.createTokenInfo')}}</small>
					</p>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.tokenName')" float type="text" class="form-control" style="width:100%;" v-model="name"></v-ons-input>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.tokenSymbol')" float type="text" class="form-control" style="width:100%;" v-model="symbol"></v-ons-input>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.tokenMaxSupply')" float type="number" class="form-control" style="width:100%;" v-model="max_supply"></v-ons-input>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-button v-on:click='createToken' :disabled="!name || !symbol || !max_supply"><i class="ion-ios-color-wand"></i>&nbsp;{{$t('message.btnCreateToken')}}</v-ons-button>
				</div>
			</div>
		</v-ons-card>
		<v-ons-card v-show="segmentIndex==2">
			<div class="content">
				<div class="center" style="margin-top:20px">
					<center>
						<img src="images/blocks.png" style="width:64px;height:auto;">
					</center>
				</div>
				<div class="center" style="margin-top:20px">
					<p>
						<small>{{$t('message.mintTokenInfo')}}</small>
					</p>
				</div>
				<div class="center" style="margin-top:40px">
					{{$t('message.token')}} : <v-ons-select float style="width: 100%" v-model="mint_token_id">
						<option v-bind:value="item.id" v-for="(item,index) in config.privateTokens.filter(item => item.version==0)">{{item.name}}</option>
					</v-ons-select>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.tokenDestination')" float type="text" style="width:100%;" v-model="mint_token_destination"></v-ons-input>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.tokenAmount')" float type="number"style="width:100%;" v-model="mint_token_amount"></v-ons-input>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-button v-on:click='mintToken' :disabled="!mint_token_id || !mint_token_destination || !mint_token_amount"><i class="ion-ios-hammer"></i>&nbsp;{{$t('message.btnMintToken')}}</v-ons-button>
					<v-ons-button v-on:click='burnToken' :disabled="!mint_token_id || !mint_token_destination || !mint_token_amount"><i class="ion-ios-flame"></i>&nbsp;{{$t('message.btnBurnToken')}}</v-ons-button>
				</div>
			</div>
		</v-ons-card>
		<v-ons-card v-show="segmentIndex==3">
			<div class="content">
				<div class="center" style="margin-top:20px">
					<center>
						<img src="images/private_token_send.png" style="width:64px;height:auto;">
					</center>
				</div>
				<div class="center" style="margin-top:20px">
					<p>
						<small>{{$t('message.sendTokenInfo')}}</small>
					</p>
				</div>
				<div class="center" style="margin-top:40px">
					{{$t('message.token')}} : <v-ons-select float style="width: 100%" v-model="token" v-if="config.Balance">
						<option v-bind:value="index" v-for="(item,index) in config.Balance.tokens">{{item.name}} - {{formatBalance(item.confirmed)}} {{item.code}}</option>
					</v-ons-select>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.sendXNAVAddress')" float type="text" v-model="address" style="width:100%"></v-ons-input>
				</div>
				<div class="center" style="margin-top:30px">
					<v-ons-input :placeholder="$t('message.sendTokenAmount')" float type="number" v-model="amount" inputmode="decimal" style="width:100%"></v-ons-input>
				</div>
				<div class="center" style="margin-top:30px">
					<v-ons-input :placeholder="$t('message.sendMemo')" float type="text" v-model="memo" style="width:100%"></v-ons-input>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-button :disabled="!address || !amount" v-on:click="send()">{{$t('message.sendSubmit')}}</v-ons-button>
				</div>
			</div>
		</v-ons-card>
	</v-ons-page>
</template>
<script type="text/javascript">
import Vue from "vue";
import sb from 'satoshi-bitcoin';
import {
  mapState,
  mapActions
} from "vuex";

export default {
	data: function ()
	{
		return {
			toolbarInfo:
			{
				backLabel: 'Home',
				title: "Private Tokens",
			},
			modalVisible:false,
			segmentIndex: 0,
			name:'',
			symbol:'',
			max_supply: '',
			mint_token_id:'',
			mint_token_destination:undefined,
			mint_token_amount:'',
			token:'',
			address:'',
			amount:'',
			memo:''
		}
	},
	computed:
	{
		...mapState({
			config: state => state.config,
			privateTokens: state => state.privateTokens,
		}),
	},
	updated : function()
	{
		if (this.mint_token_destination==undefined) this.mint_token_destination=this.config.private_address;
	},
	methods:
	{
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
		numberWithCommas: (num,sep,dec,u) =>
		{
			sep=sep||',';
			u=u||'\\d';
			if(typeof num!='string')
			{
				num=String(num);if(dec&&dec!='.')num=num.replace('.',dec);
			}
			return num.replace(RegExp('\\'+(dec||'.')+u+'+|'+u+'(?=(?:'+u+'{3})+(?!'+u+'))','g'),function(a){return a.length==1?a+sep:a})
		},
		createToken: function()
		{
			console.log(this.name);
			console.log(this.symbol);
			console.log(this.max_supply);
			console.log("Creating transaction...");
			let vm=this;
			vm.modalVisible=true;
			wallet.CreateToken(this.name,this.symbol,this.max_supply*1e8).then(function (response)
			{
				vm.modalVisible=false;
				console.log(response);
				if (response.tx)
				{
					vm.$ons.notification.confirm(vm.$t('message.createTokenConfirmRequiredFree')+sb.toBitcoin(response.fee)+" xNAV<br/><br/>" + vm.$t('message.createTokenConfirmQuestion'),{title:vm.$t('message.createTokenConfirmTitle'),buttonLabels:[vm.$t('message.createTokenConfirmNo'), vm.$t('message.createTokenConfirmYes')]})
					.then((confirm) =>
					{
						if (confirm)
						{
							vm.modalVisible=true;
							console.log("Submitting transaction...");
							wallet.SendTransaction(response.tx).then(function (response)
							{
								console.log(response);
								vm.modalVisible=false;
								vm.$ons.notification.alert(vm.$t('message.createTokenSuccess'),{title:vm.$t('message.createToken')});
							}).
							catch((e) =>
							{
								vm.modalVisible=false;
								vm.$ons.notification.alert(vm.$t('message.createTokenFailed')+"<br/><br/>"+e.message,{title:vm.$t('message.createToken')});
							});
						}
						else
						{
							vm.modalVisible=false;
						}
					});
				}
			})
			.catch((e) =>
			{
				vm.modalVisible=false;
				vm.$ons.notification.alert(e.message,{title:vm.$t('message.createToken')});
			});
		},
		mintToken: function()
		{
			console.log(this.mint_token_id);
			console.log(this.mint_token_destination);
			console.log(this.mint_token_amount);
			console.log("Minting token...");
			let vm=this;
			vm.modalVisible=true;
			wallet.MintToken(this.mint_token_id, this.mint_token_destination, this.mint_token_amount*1e8).then(function (response)
			{
				vm.modalVisible=false;
				console.log(response);
				if (response.tx)
				{
					vm.$ons.notification.confirm(vm.$t('message.mintConfirmRequiredFree')+sb.toBitcoin(response.fee)+" xNAV<br/><br/>" + vm.$t('message.mintConfirmQuestion'),{title:vm.$t('message.mintConfirmTitle'),buttonLabels:[vm.$t('message.mintConfirmNo'), vm.$t('message.mintConfirmYes')]})
					.then((confirm) =>
					{
						if (confirm)
						{
							vm.modalVisible=true;
							console.log("Submitting transaction...");
							wallet.SendTransaction(response.tx).then(function (response)
							{
								vm.modalVisible=false;
								if (response.error)
								{
									console.log(response.error);
									console.log(response.hashes[0]);
									vm.$ons.notification.alert(response.error,{title:vm.$t('message.mintToken')});
								}
								else
								{
									vm.$ons.notification.alert(vm.$t('message.mintTokenSuccess'),{title:vm.$t('message.mintToken')});
								}
							}).
							catch((e) =>
							{
								vm.modalVisible=false;
								vm.$ons.notification.alert(vm.$t('message.mintTokenFailed')+"<br/><br/>"+e.message,{title:vm.$t('message.mintToken')});
							});
						}
						else
						{
							vm.modalVisible=false;
						}
					});
				}
			})
			.catch((e) =>
			{
				vm.modalVisible=false;
				vm.$ons.notification.alert(e.message,{title:vm.$t('message.mintToken')});
			});
		},
		burnToken: function()
		{
			console.log(this.mint_token_id);
			console.log(this.mint_token_amount);
			console.log("Burning...");
		},
		send()
		{
			console.log(this.token);
			console.log(this.address);
			console.log(this.amount);
			console.log(this.memo);
			console.log("Sending...");
			let vm=this;
			let amount=parseFloat((vm.amount*1e8).toFixed(0));
			try
			{
				vm.modalVisible=true;
				wallet.tokenCreateTransaction(vm.address, amount, vm.memo, undefined, vm.token).then(function (tx)
				{
					vm.modalVisible=false;
					vm.$ons.notification.confirm(vm.$t('message.amountToSend') + " : " + sb.toBitcoin(amount) + " " + vm.config.Balance.tokens[vm.token].code + " <br/>" + vm.$t('message.transactionFee') + " : " + sb.toBitcoin(tx.fee) + " xNAV<br/><br/>"+vm.$t('message.sendConfirmQuestion'),{title:vm.$t('message.sendConfirm'),buttonLabels:[vm.$t('message.sendConfirmNo'), vm.$t('message.sendConfirmYes')]})
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
									vm.$ons.notification.alert(result.error,{title:vm.$t('message.txSubmitError')});
								}
								else
								{
									vm.modalVisible=false;
									vm.address=null;
									vm.amount=null;
									vm.$ons.notification.toast(vm.$t('message.sendSuccess'), { timeout: 3000, animation: 'fall' });
								}
							})
							.catch((e) =>
							{
								vm.modalVisible=false;
								vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
							});
						}
					})
					.catch((e) =>
					{
						vm.modalVisible=false;
						vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
					});
				})
				.catch((e) =>
				{
					vm.modalVisible=false;
					vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
				});
			}
			catch(e)
			{
				vm.modalVisible=false;
				vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
			}
		}
	}
}
</script>