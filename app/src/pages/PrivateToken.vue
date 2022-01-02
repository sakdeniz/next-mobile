<template>
	<v-ons-page>
		<v-ons-modal :visible="modalVisible" @click="modalVisible = false">
			<p style="text-align: center">
				{{$t('message.pleaseWait')}} <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
			</p>
		</v-ons-modal>
		<v-ons-toolbar modifier="transparent">
			<div class="center">
				<v-ons-segment :index.sync="segmentIndex" style="width:100%">
					<button>{{$t('message.availableTokens')}}</button>
					<button>{{$t('message.createToken')}}</button>
					<button>{{$t('message.mintBurnToken')}}</button>
				</v-ons-segment>
			</div>
		</v-ons-toolbar>
		<v-ons-card v-show="segmentIndex==0">
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
						<div>{{$t('message.tokenMaxSupply')}} : {{formatBalance(item.supply)}} {{item.code}}</div>
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
		</v-ons-card>
		<v-ons-card v-show="segmentIndex==1">
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
				<v-ons-input :placeholder="$t('message.tokenName')" type="text" class="form-control" style="width:100%;" v-model="name"/>
			</div>
			<div class="center" style="margin-top:40px">
				<v-ons-input :placeholder="$t('message.tokenSymbol')" type="text" class="form-control" style="width:100%;" v-model="symbol"/>
			</div>
			<div class="center" style="margin-top:40px">
				<v-ons-input :placeholder="$t('message.tokenMaxSupply')" type="number" class="form-control" style="width:100%;" v-model="max_supply" float/>
			</div>
			<div class="center" style="margin-top:40px">
				<v-ons-button v-on:click='createToken' :disabled="!name || !symbol || !max_supply"><i class="ion-ios-color-wand"></i>&nbsp;{{$t('message.btnCreateToken')}}</v-ons-button>
			</div>
		</v-ons-card>
		<v-ons-card v-show="segmentIndex==2">
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
				<v-ons-select style="width: 100%" v-model="mint_token_id">
					<option v-bind:value="item.id" v-for="(item,index) in config.privateTokens.filter(item => item.version==0)">{{item.name}}</option>
				</v-ons-select>
			</div>
			<div class="center" style="margin-top:40px">
				<v-ons-input :placeholder="$t('message.tokenDestination')" type="text" class="form-control" style="width:100%;" v-model="mint_token_destination"/>
			</div>
			<div class="center" style="margin-top:40px">
				<v-ons-input :placeholder="$t('message.tokenAmount')" type="number" class="form-control" style="width:100%;" v-model="mint_token_amount" float/>
			</div>
			<div class="center" style="margin-top:40px">
				<v-ons-button v-on:click='mintToken' :disabled="!mint_token_id || !mint_token_destination || !mint_token_amount"><i class="ion-ios-hammer"></i>&nbsp;{{$t('message.btnMintToken')}}</v-ons-button>
				<v-ons-button v-on:click='burnToken' :disabled="!mint_token_id || !mint_token_destination || !mint_token_amount"><i class="ion-ios-flame"></i>&nbsp;{{$t('message.btnBurnToken')}}</v-ons-button>
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
			modalVisible:false,
			segmentIndex: 0,
			name:'',
			symbol:'',
			max_supply: "",
			mint_token_id:'',
			mint_token_destination:'',
			mint_token_amount:""
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
		this.mint_token_destination=this.config.private_address;
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
		}
	}
}
</script>