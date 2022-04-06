<template id="main">
	<v-ons-page>
		<v-ons-modal :visible="modalVisible" @click="modalVisible = false">
			<p style="text-align: center">
				{{$t('message.txInProgress')}} <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
			</p>
		</v-ons-modal>
		<v-ons-action-sheet :visible.sync="actionSheetVisible" cancelable :title="$t('message.nftFilter')">
			<v-ons-action-sheet-button  v-on:click="setFilter(undefined)">{{$t('message.clearNftFilter')}}</v-ons-action-sheet-button>
			<v-ons-action-sheet-button v-for="item in categories" v-on:click="setFilter(item.id)">{{item.name}}</v-ons-action-sheet-button>
		</v-ons-action-sheet>
		<div style="background: #ffffff;background-image: url(https://img.freepik.com/free-vector/abstract-background-with-squares_23-2148995948.jpg);">
			<div style="font-size:18pt;padding:15px;">
				<v-ons-icon icon="ion-ios-cart" style="position: absolute;margin-top:4px;"></v-ons-icon>&nbsp;&nbsp;&nbsp;&nbsp; {{$t('message.nftMarketplace')}}
				<v-ons-button @click="actionSheetVisible = true" style="float:right;">
					<i class="fa fa-filter"></i>&nbsp;{{$t('message.filter')}}
				</v-ons-button>
			</div>
			<div style="padding:15px;">
				<v-ons-progress-circular indeterminate v-if="orders.length<1"></v-ons-progress-circular>
				<span v-if="filter">Filtering by : {{filter}}</span>
			</div>
		</div>
		<v-ons-list v-show="orders.length>0" style="margin:15px;background: transparent;">
			<v-ons-list-item modifier="nodivider" v-if="!filter||parseJSON(item.collection_metadata).category==filter" style="padding: 20px;background: #ffffff;border: 1px solid #cfcfcf;margin-bottom: 15px;" v-for="(item,index) in orders">
				<div class="center">
					<img style="width:100%;height:auto" :src="parseJSON(parseJSON(item.metadata).metadata).attributes.thumbnail_url">
						<span class="list-item__title" style="margin-top:15px;">
							{{parseJSON(parseJSON(item.metadata).metadata).name}}
						<span style="float: right">#{{item.nft_id}}</span>
						</span>
						<span class="list-item__subtitle">
							{{item.collection_name}}
							<span style="float: right">{{parseJSON(item.collection_metadata).category}}</span>
						</span>
						<span class="list-item__subtitle">
							{{parseJSON(parseJSON(item.metadata).metadata).description}}
						</span>
						<span class="list-item__subtitle">Price : {{formatBalance(JSON.parse(item.nft_order).pay[0].amount)}} <img style="width: 24px;height: 24px;position: absolute;margin-left:8px;margin-top:-3px;" src="images/xnav-logo-border.png"/></span>
						<span class="list-item__subtitle" v-show="item.owner" style="color: purple">This nft belongs to you.</span>
						<span class="list-item__subtitle" v-show="!item.owner" style="margin-top:15px;">
							<v-ons-button v-on:click="buyNFT(item.nft_order,parseJSON(parseJSON(item.metadata).metadata).attributes.thumbnail_url)">BUY</v-ons-button>
						</span>
				</div>
			</v-ons-list-item>
		</v-ons-list>
	</v-ons-page>
</template>
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
			modalVisible:false,
			orders:[],
			order:undefined,
			filter:undefined,
			actionSheetVisible:false,
			categories:
			[
				{"id":"art",name:"Art"},
				{"id":"game_content",name:"Game Content"},
				{"id":"collectibles",name:"Collectibles"},
				{"id":"music",name:"Music"},
				{"id":"photography",name:"Photography"},
				{"id":"sports",name:"Sports"},
				{"id":"trading_cards",name:"Trading Cards"},
				{"id":"utility",name:"Utility"}
			],
			isLocal:false,
			apiURL:(this.isLocal?"http://localhost:3000/":"https://api.nextwallet.org/")
		};
	},
	computed:
	{
		config()
		{
			return this.$store.state.config;
		}
	},
	mounted: function ()
	{
		wallet.on('connected', (e) =>
		{
			this.getSellOrders();
		});
	},
	methods:
	{
		setFilter: function(filter)
		{
			this.filter=filter;
			this.actionSheetVisible=false;
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
		getSellOrders()
		{
			try
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
				console.log("Getting sell orders...");
				let vm=this;
				axios.post(vm.apiURL+'GetSellOrders',{},config).then(function(retval)
				{
					vm.orders=retval.data.orders;
					vm.orders.forEach(order =>
					{
						if (arr.includes(order.token_id+":"+order.nft_id))
						{
							order.owner=true;
						}
						else
						{
							order.owner=false;
						}
					});
				}).
				catch(function(err)
				{
					console.log(err);
				})
			}
			catch (e)
			{
				console.log(e);
			}
		},
		buyNFT(o,img_url)
		{
			let order=JSON.parse(o);
			vm.$ons.notification.confirm("<img style='width:100%;height:auto' src='"+img_url+"'/>"+vm.$t('message.nftTokenId') + " : <pre style='width:240px;height:40px;white-space:normal;word-spacing:initial;word-wrap:break-word;font-size:8pt;'>" + order.receive[0].tokenId + "</pre>"+vm.$t('message.nftId') + " : " + order.receive[0].tokenNftId + "<br/><br/>"+vm.$t('message.nftPrice') + " : " + sb.toBitcoin(order.pay[0].amount) + " xNAV<br/><br/>"+vm.$t('message.nftBuyConfirmQuestion'),{title:vm.$t('message.nftBuyConfirm'),buttonLabels:[vm.$t('message.nftBuyConfirmNo'), vm.$t('message.nftBuyConfirmYes')]})
			.then((response) =>
			{
				if (response)
				{
					wallet.AcceptOrder(order).then(function (tx)
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
								vm.$ons.notification.toast(vm.$t('message.nftBuySuccess'), { timeout: 3000, animation: 'fall' });
							}
						})
						.catch((e) =>
						{
							vm.modalVisible=false;
							vm.$ons.notification.alert(e.message,{title:vm.$t('message.nftBuy')});
						});
					})
					.catch((e) =>
					{
						vm.$ons.notification.alert(e.message,{title:vm.$t('message.nftBuy')});
					});
				}
			});
		}
	}
}
</script>