<template id="main">
	<v-ons-page>
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-modal :visible="modalVisible" @click="modalVisible = false">
			<p style="text-align: center">
				{{$t('message.pleaseWait')}} <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
			</p>
		</v-ons-modal>
		<v-ons-card>
			<div class="center" style="margin-top:20px;margin-bottom:20px;">
				<v-ons-segment :index.sync="segmentIndex" style="width:100%">
					<button>{{$t('message.sellNFT')}}</button>
					<button @click="getNftSellOrders()">{{$t('message.sellOrders')}}</button>
				</v-ons-segment>
			</div>
			<div class="content" >
				<div v-if="segmentIndex==0">
					<div class="center" style="margin-top:20px">
						<center>
							<img src="images/nft_sell.png" style="width:64px;height:auto;">
						</center>
					</div>
					<div class="center" style="margin-top:20px">
						<p>
							<small>{{$t('message.sellNFTInfo')}}</small>
						</p>
					</div>
					<div class="center" style="margin-top:40px">
						{{$t('message.collection')}} : <v-ons-select float style="width: 100%" v-model="sell_token_id" v-if="config.Balance">
							<option v-bind:value="index" v-for="(item,index) in config.Balance.nfts">{{item.name}}</option>
						</v-ons-select>
					</div>
					<div class="center" style="margin-top:40px">
						{{$t('message.nft')}} : <v-ons-select float style="width: 100%" v-model="sell_nft_id" v-if="sell_token_id">
							<option v-bind:value="index" v-for="(item,index) in config.Balance.nfts[sell_token_id].confirmed">{{index}} - {{(parseJSON(item)?parseJSON(item).name:item)}}</option>
						</v-ons-select>
					</div>
					<div class="center" style="margin-top:40px">
						<v-ons-input :placeholder="$t('message.sellNFTPaymentAddress')" float type="text" v-model="sell_payment_address" style="width:100%"></v-ons-input>
					</div>
					<div class="center" style="margin-top:30px">
						<v-ons-input :placeholder="$t('message.sellNFTPrice')" float type="number" v-model="sell_price" style="width:100%"></v-ons-input>
					</div>
					<div class="center" style="margin-top:40px">
						<v-ons-button :disabled="!sell_payment_address || !sell_nft_id" v-on:click="sellNFT()">{{$t('message.sellNFTSubmit')}}</v-ons-button>
					</div>
				</div>
				<div v-if="segmentIndex==1">
					<div class="center" style="margin-top:20px">
						<center>
							<img src="images/nft_orders.png" style="width:64px;height:auto;">
						</center>
					</div>
					<v-ons-list v-if="orders.length>0">
						<v-ons-list-item expandable :expanded.sync="item.isExpanded" v-if="item.owner" v-for="(item,index) in orders">
							<v-ons-icon icon="ion-ios-bookmark"></v-ons-icon>&nbsp;
							{{parseJSON(parseJSON(item.metadata).metadata).name}}
							<div class="expandable-content">
								<div class="left" style="width:25%;float:left;">
									<img style="width:100%;height:auto" :src="ipfsToURL(parseJSON(parseJSON(item.metadata).metadata).attributes.thumbnail_url)">
								</div>
								<div class="center" style="width:70%;margin-left: 15px;float:right;">
									<div class="list-item__subtitle">
										{{parseJSON(parseJSON(item.metadata).metadata).name}}
									</div>
									<div class="list-item__subtitle">
										{{item.collection_name}}
									</div>
									<div class="list-item__subtitle">
										{{parseJSON(parseJSON(item.metadata).metadata).description}}
									</div>
									<div class="list-item__subtitle">
										Price : {{formatBalance(JSON.parse(item.nft_order).pay.amount)}} NAV
									</div>
									<div class="list-item__subtitle" style="margin-top:15px;">
										Listed on {{formatDate(item.verification_date)}}
									</div>
									<div class="list-item__subtitle" style="margin-top:15px;">
										<v-ons-button modifier="outline" style="float:right" v-on:click="CancelSellNftOrder(item.token_id,item.nft_id)"><v-ons-icon icon="ion-md-trash"></v-ons-icon>&nbsp;Cancel Order</v-ons-button>
									</div>
								</div>
							</div>
						</v-ons-list-item>
					</v-ons-list>
					<div v-else style="margin-top:30px;">
						<center>No sell order found.</center>
					</div>
				</div>
			</div>
		</v-ons-card>
	</v-ons-page>
</template>
<style>
input[type="file"]
{
	display: none;
}
.custom-file-upload
{
	border: 1px solid #ccc;
	display: inline-block;
	padding: 6px 12px;
	cursor: pointer;
}
a {
	text-decoration: none;
	color: #673AB7;
}
</style>
<script>
import Vue from "vue";
import axios from 'axios';
import sb from 'satoshi-bitcoin';
import {
  mapState,
  mapActions
} from "vuex";

export default {
	data()
	{
		return {
			toolbarInfo:
			{
				backLabel: 'Home',
				title: "NFT Orders",
			},
			modalVisible:false,
			segmentIndex:0,
			sell_token_id:'',
			sell_nft_id:'',
			sell_payment_address:undefined,
			sell_price:0,
			orders:[]
		};
	},
	computed:
	{
		config()
		{
			return this.$store.state.config;
		}
	},
	updated:function()
	{
		if (this.sell_payment_address==undefined) this.sell_payment_address=this.config.private_address;
	},
	methods:
	{
		ipfsToURL: function(link)
		{
			let base_url="https://ipfs.nextwallet.org/ipfs/";
			let e=link.split("ipfs://");
			return base_url+e[1];
		},
		formatDate: n =>
		{
			if (n) return moment(n).format('DD.MM.YY HH:mm:ss'); else return "";
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
		parseJSON: function(str)
		{
			try
			{
				return JSON.parse(str);
			}
			catch(err)
			{
				return false;
			}
		},
		sellNFT()
		{
			console.log(this.sell_token_id);
			console.log(this.sell_nft_id);
			console.log(this.sell_payment_address);
			console.log(this.sell_price);
			console.log("Submitting sell order...");
			let vm=this;
			let amount=parseFloat((vm.sell_price*1e8).toFixed(0));
			try
			{
				console.log("Creating NFT proof...");
				vm.modalVisible=true;
				wallet.CreateNftProof(vm.sell_token_id,vm.sell_nft_id,undefined).then((p) =>
				{
					let hex=Buffer.from(p.sig).toString('hex');
					let proof={nftId:vm.sell_nft_id,tokenId:vm.sell_token_id,sig:Buffer.from(hex,'hex')};
					console.log(proof);
					wallet.CreateSellNftOrder(vm.sell_token_id, vm.sell_nft_id, vm.sell_payment_address, amount).then(function (order)
					{
						console.log(order);
						wallet.VerifyOrder(order).then((result) =>
						{
							console.log("Verify order result -> " + result);
						})
						//console.log(JSON.stringify(order));
						//console.log(JSON.parse(JSON.stringify(order)));
						console.log("Verifying proof...");
						wallet.VerifyNftProof(vm.sell_token_id,parseInt(vm.sell_nft_id),proof).then((v) =>
						{
							console.log(v);
						});
						axios.post(vm.$store.state.config.api_url+'CreateSellNftOrder',{order:order,proof:proof},config).then(function(retval)
						{
							vm.modalVisible=false;
							console.log(retval.data);
							if (retval.data.status=="order_created")
							{
								vm.$ons.notification.alert(vm.$t('message.sellNFTOrderSuccess'),{title:vm.$t('message.sellNFT')});
							}
							else
							{
								vm.$ons.notification.alert(vm.$t('message.sellNFTOrderFailed') +"<br/><br/>"+retval.data.message,{title:vm.$t('message.sellNFT')});
							}
						}).
						catch(function(err)
						{
							console.log(err);
							vm.modalVisible=false;
						})
					})
					.catch((e) =>
					{
						console.log("CreateSellNftOrder failed -> " + e.message);
						vm.$ons.notification.alert(e.message,{title:vm.$t('message.sellNFT')});
						vm.modalVisible=false;
					});
				}).
				catch((e) =>
				{
					vm.modalVisible=false;
					console.log("CreateNftProof failed -> " + e.message);
					vm.$ons.notification.alert(vm.$t('message.nftProofError')+"<br/><br/>"+e.message,{title:vm.$t('message.proofNFT')});
				});
			}
			catch(e)
			{
				vm.modalVisible=false;
				vm.$ons.notification.alert(e.message,{title:vm.$t('message.sellNFT')});
			}
		},
		getNftSellOrders()
		{
			console.log("Getting nfts in wallet...");
			let arr=[];
			for (const [token_id, value] of Object.entries(this.config.Balance.nfts))
			{
				for (const [nft_id] of Object.entries(value.confirmed))
				{
					arr.push(token_id+":"+nft_id);
				}
			}
			console.log("Getting nft sell orders...");
			let vm=this;
			axios.post(vm.$store.state.config.api_url+'GetNftSellOrders',{},config).then(function(retval)
			{
				vm.orders=retval.data.orders;
				console.log("Retrieved -> " + vm.orders.length);
				vm.orders.forEach(order =>
				{
					if (arr.includes(order.token_id+":"+order.nft_id))
					{
						order.owner=true;
						console.log("Order owner -> " + order.token_id+":"+order.nft_id);
					}
					else
					{
						order.owner=false;
						console.log("Not order owner -> " + order.token_id+":"+order.nft_id);
					}
				});
			}).
			catch(function(err)
			{
				console.log(err);
			})
		},
		CancelSellNftOrder(token_id,nft_id)
		{
			console.log(this.config.private_address);
			console.log(token_id);
			console.log(nft_id);
			let vm=this;
			try
			{
				vm.modalVisible=true;
				wallet.tokenCreateTransaction(this.config.private_address, 1, undefined, undefined, token_id,nft_id).then(function (tx)
				{
					vm.modalVisible=false;
					vm.$ons.notification.confirm(vm.$t('message.transactionFee') + " : " + sb.toBitcoin(tx.fee) + " xNAV<br/><br/>"+vm.$t('message.sendConfirmQuestion'),{title:vm.$t('message.sendConfirm'),buttonLabels:[vm.$t('message.sendConfirmNo'), vm.$t('message.sendConfirmYes')]})
					.then((response) =>
					{
						if (response)
						{
							vm.modalVisible=true;
							wallet.SendTransaction(tx.tx).then(function (result)
							{
								console.log(result);
								if (result.error)
								{
									vm.modalVisible=false;
									vm.$ons.notification.alert(result.error,{title:vm.$t('message.txSubmitError')});
								}
								else
								{
									vm.modalVisible=false;
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
						console.log(e);
						vm.modalVisible=false;
						vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
					});
				})
				.catch((e) =>
				{
					console.log(e);
					vm.modalVisible=false;
					vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
				});
			}
			catch(e)
			{
				console.log(e);
				vm.modalVisible=false;
				vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
			}
		}
	}
}
</script>