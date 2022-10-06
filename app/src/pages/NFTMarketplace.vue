<template id="main">
	<v-ons-page id="page-nft-marketplace">
		<v-ons-pull-hook :action="loadItem" @changestate="state = $event.state">
			<span v-show="state === 'initial'">{{$t('message.pullToRefresh')}}</span>
			<span v-show="state === 'preaction'">{{$t('message.release')}}</span>
			<span v-show="state === 'action'">
				<v-ons-progress-circular indeterminate></v-ons-progress-circular>
			</span>
		</v-ons-pull-hook>
		<v-ons-modal :visible="modalVisible">
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
				<v-ons-progress-circular indeterminate v-if="is_loading" style="float:right"></v-ons-progress-circular>
			</div>
			<div style="padding:15px;">
				<v-ons-button v-on:click="scan()"><i class="ion-md-qr-scanner"></i>&nbsp;{{$t('message.scan')}}</v-ons-button>
				<v-ons-button @click="actionSheetVisible = true">
					<i class="fa fa-filter"></i>&nbsp;{{$t('message.filter')}}
				</v-ons-button>
			</div>
			<div style="padding:15px;" v-if="filter">
				Filtering by : {{filter}}
			</div>
		</div>
		<v-ons-list v-show="orders.length>0" style="margin:15px;background: transparent;">
			<v-ons-list-item modifier="nodivider" v-if="!filter||parseJSON(item.collection_metadata).category==filter" style="padding: 20px;background: #ffffff;border: 1px solid #cfcfcf;margin-bottom: 15px;" v-for="(item,index) in orders">
				<div class="center">
					<i v-if="parseJSON(parseJSON(item.metadata).metadata)&&parseJSON(parseJSON(item.metadata).metadata).attributes.content_type.split('/')[0]=='audio'" class="ion-ios-musical-notes fa-2x"></i>
					<i v-if="parseJSON(parseJSON(item.metadata).metadata)&&parseJSON(parseJSON(item.metadata).metadata).attributes.content_type.split('/')[0]=='video'" class="ion-ios-videocam fa-2x"></i>
					<img v-else-if="parseJSON(parseJSON(item.metadata).metadata)" onerror="this.style.display='none'" style="width:100%;height:auto" :src="ipfsToURL(parseJSON(parseJSON(item.metadata).metadata).attributes.thumbnail_url)">
					<div v-else>
						<i class="ion-ios-image fa-10x" style="color: #C3C3C3;text-align: center;"></i>
					</div>
					<span class="list-item__subtitle" style="margin-top:5px;" v-if="parseJSON(parseJSON(item.metadata).metadata)&&parseJSON(parseJSON(item.metadata).metadata).attributes.content_type.split('/')[0]=='audio'">
						<audio controls style="width:100%">
							<source :src="ipfsToURL(parseJSON(parseJSON(item.metadata).metadata).image)" type="audio/ogg">
							<source :src="ipfsToURL(parseJSON(parseJSON(item.metadata).metadata).image)" type="audio/mpeg">
							Your browser does not support the audio element.
						</audio>
					</span>
					<span class="list-item__subtitle" style="margin-top:5px;" v-if="parseJSON(parseJSON(item.metadata).metadata).attributes&&parseJSON(parseJSON(item.metadata).metadata).attributes.content_type.split('/')[0]=='video'">
						<video onplay="this.webkitEnterFullscreen();" controls playsinline style="width:100%">
							<source :src="ipfsToURL(parseJSON(parseJSON(item.metadata).metadata).image)" type="video/mp4">
							<source :src="ipfsToURL(parseJSON(parseJSON(item.metadata).metadata).image)" type="video/ogg">
							Your browser does not support the audio element.
						</video>
					</span>
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
					<span class="list-item__subtitle cl1" v-show="item.owner">This nft belongs to you.</span>
					<span class="list-item__subtitle" v-show="!item.owner" style="margin-top:15px;">
						<v-ons-button v-on:click="buyNFT(index,item.nft_order,ipfsToURL(parseJSON(parseJSON(item.metadata).metadata).attributes.thumbnail_url))">BUY</v-ons-button>
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
			state: 'initial',
			items: [1, 2, 3],
			modalVisible:false,
			orders:[],
			is_loading:true,
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
			]
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
		wallet.on('sync_finished', (e) =>
		{
			this.getNftSellOrders();
		});
	},
	methods:
	{
		ipfsToURL: function(link)
		{
			let base_url="https://ipfs.nextwallet.org/ipfs/";
			let e=link.split("ipfs://");
			return base_url+e[1];
		},
		loadItem(done)
		{
			this.orders=[];
			this.getNftSellOrders();
			setTimeout(() => 
			{
				this.items = [...this.items, this.items.length + 1];
				done();
			}, 1000);
		},
		scan()
		{
			if (typeof(QRScanner) != "undefined")
			{
				let vm=this;
				$("#page-nft-marketplace").hide();
				QRScanner.scan(displayContents);
				function displayContents(err, text)
				{
					if(err)
					{
						// an error occurred, or the scan was canceled (error code `6`)
					}
					else
					{
						if (text.startsWith("navcoin-nft-order:"))
						{
							let token_id=text.split(":")[1];
							let token_nft_id=text.split(":")[2];
							let order;
							let img_url='';
							vm.orders.forEach(o =>
							{
								let or=JSON.parse(o.nft_order);
								if (or.receive[0].tokenId==token_id && or.receive[0].tokenNftId==token_nft_id)
								{
									order=or;
									img_url=vm.parseJSON(vm.parseJSON(o.metadata).metadata).attributes.thumbnail_url;
								}
							});
							vm.$ons.notification.confirm("<img style='width:100%;height:auto' src='"+vm.ipfsToURL(img_url)+"'/>"+vm.$t('message.nftTokenId') + " : <pre style='width:240px;height:40px;white-space:normal;word-spacing:initial;word-wrap:break-word;font-size:8pt;'>" + order.receive[0].tokenId + "</pre>"+vm.$t('message.nftId') + " : " + order.receive[0].tokenNftId + "<br/><br/>"+vm.$t('message.nftPrice') + " : " + sb.toBitcoin(order.pay[0].amount) + " xNAV<br/><br/>"+vm.$t('message.nftBuyConfirmQuestion'),{title:vm.$t('message.nftBuyConfirm'),buttonLabels:[vm.$t('message.nftBuyConfirmNo'), vm.$t('message.nftBuyConfirmYes')]})
							.then((response) =>
							{
								if (response)
								{
									vm.modalVisible=true;
									wallet.AcceptOrder(order).then(function (tx)
									{
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
						console.log("Destroying QRScanner...");
						QRScanner.destroy(function(status)
						{
							console.log(status);
						});
						$("#page-nft-marketplace").show();
					}
				}
				QRScanner.show();
			}
		},
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
		getNftSellOrders()
		{
			let vm=this;
			wallet.GetBalance().then((value) =>
			{
				vm.$store.commit('config/setBalance', value);
				try
				{
					console.log("Getting nfts in wallet...");
					let arr=[];
					for (const [token_id, value] of Object.entries(vm.config.Balance.nfts))
					{
						for (const [nft_id] of Object.entries(value.confirmed))
						{
							arr.push(token_id+":"+nft_id);
						}
					}
					console.log("------");
					console.log(arr);
					console.log("------");
					console.log("Getting nft sell orders...");
					axios.post(vm.$store.state.config.api_url+'GetNftSellOrders',{},config).then(function(retval)
					{
						console.log(retval);
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
						vm.is_loading=false;
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
			});
		},
		buyNFT(index,o,img_url)
		{
			console.log(img_url);
			let vm=this;
			let order=JSON.parse(o);
			vm.$ons.notification.confirm("<img style='width:100%;height:auto' src='"+img_url+"'/>"+vm.$t('message.nftTokenId') + " : <pre style='width:240px;height:40px;white-space:normal;word-spacing:initial;word-wrap:break-word;font-size:8pt;'>" + order.receive[0].tokenId + "</pre>"+vm.$t('message.nftId') + " : " + order.receive[0].tokenNftId + "<br/><br/>"+vm.$t('message.nftPrice') + " : " + sb.toBitcoin(order.pay[0].amount) + " xNAV<br/><br/>"+vm.$t('message.nftBuyConfirmQuestion'),{title:vm.$t('message.nftBuyConfirm'),buttonLabels:[vm.$t('message.nftBuyConfirmNo'), vm.$t('message.nftBuyConfirmYes')]})
			.then((response) =>
			{
				if (response)
				{
					vm.modalVisible=true;
					wallet.AcceptOrder(order).then(function (tx)
					{
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
								vm.orders.splice(index,1);
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
						vm.modalVisible=false;
						vm.$ons.notification.alert(e.message,{title:vm.$t('message.nftBuy')});
					});
				}
			});
		}
	}
}
</script>
<style>
	.cl1 {text-align:center;margin:3px;margin-top:10px;color:#ffffff;padding:5px;border-radius:5px;background-image: linear-gradient(to right, #673AB7 0%, #8862e2 51%, #673AB7 100%)}
</style>