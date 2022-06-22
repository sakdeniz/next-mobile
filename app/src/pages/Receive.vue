<template>
	<v-ons-page>
		<v-ons-pull-hook :action="loadItem" @changestate="state = $event.state">
			<span v-show="state === 'initial'">{{$t('message.pullToRefresh')}}</span>
			<span v-show="state === 'preaction'">{{$t('message.release')}}</span>
			<span v-show="state === 'action'"><v-ons-progress-circular indeterminate></v-ons-progress-circular></span>
		</v-ons-pull-hook>
		<v-ons-card>
			<div class="title">
				{{$t('message.receive')}}
			</div>
			<div class="content" style="clear:both;">
				<center>
					<img src="images/wallet.png" style="width:128px;height:auto;">
				</center>
				<div class="center" style="margin-bottom:15px;">
					<v-ons-segment :index.sync="segmentIndex" style="width:100%">
						<button><ons-icon icon="ion-ios-unlock"></ons-icon>&nbsp;{{$t('message.public')}}</button>
						<button><ons-icon icon="ion-ios-lock"></ons-icon>&nbsp;{{$t('message.private')}}</button>
					</v-ons-segment>
				</div>
				<div v-show="segmentIndex==0">
					<v-ons-button style="float:right;margin-bottom:15px;" v-on:click="doCopy(publicAddress)">
						<i class="fa fa-clipboard"></i>&nbsp;{{$t('message.copy')}}
					</v-ons-button>
					<v-ons-select style="width:100%" v-model="publicAddress">
						<option v-bind:value="name" v-for="(value, name, index) in config.addresses.spending.public">{{name}}</option>
					</v-ons-select>
					<center>
						<div v-html="qrcode_nav"></div>
					</center>
				</div>
				<div v-show="segmentIndex==1">
					<v-ons-button style="float:right;margin-bottom:15px;" v-on:click="doCopy(privateAddress)">
						<i class="fa fa-clipboard"></i>&nbsp;{{$t('message.copy')}}
					</v-ons-button>
					<v-ons-select style="width:100%" v-model="privateAddress">
						<option v-bind:value="name" v-for="(value, name, index) in config.addresses.spending.private">{{name}}</option>
					</v-ons-select>
					<center>
						<div v-html="qrcode_xnav"></div>
					</center>
				</div>
				<v-ons-list>
					<v-ons-list-item>
						<div class="left">
							<img style="width:24px;height:auto;" src="images/nav-logo-border.png">
						</div>
						<div class="center">
							{{$t('message.publicTransaction')}}
						</div>
						<div class="right">
							{{config.txs.filter((e) => e.type == "nav").length}}
						</div>
					</v-ons-list-item>
					<v-ons-list-item>
						<div class="left">
							<img style="width:24px;height:auto;" src="images/xnav-logo-border.png">
						</div>
						<div class="center">
							{{$t('message.privateTransaction')}}
						</div>
						<div class="right">
							{{config.txs.filter((e) => e.type == "xnav").length}}
						</div>
					</v-ons-list-item>
					<v-ons-list-item>
						<div class="left">
							<v-ons-icon style="margin-left: 5px;" icon="ion-ios-snow" class="list-item__icon"></v-ons-icon>
						</div>
						<div class="center">
							{{$t('message.coldStakingTransaction')}}
						</div>
						<div class="right">
							{{config.txs.filter((e) => e.type == "cold_staking").length}}
						</div>
					</v-ons-list-item>
					<v-ons-list-item>
						<div class="left">
							<v-ons-icon style="margin-left: 5px;" icon="ion-ios-swap" class="list-item__icon"></v-ons-icon>
						</div>
						<div class="center">
							{{$t('message.totalTransaction')}}
						</div>
						<div class="right">
							{{config.txs.length}}
						</div>
					</v-ons-list-item>
				</v-ons-list>
				<div style="float:right" v-show="$store.state.config.txs.length>0">
					<center>
						<v-ons-button :disabled="currentPage==1" @click="prev"><i class="ion-ios-arrow-round-back"></i></v-ons-button>
						<span>{{currentPage}} / {{maxPage}}</span>
						<v-ons-button :disabled="currentPage==maxPage || maxPage==0" @click="next"><i class="ion-ios-arrow-round-forward"></i></v-ons-button>
					</center>
				</div>
				<v-ons-list style="clear:both">
					<v-ons-list-header>{{$t('message.transactionHistory')}}</v-ons-list-header>
					<v-ons-list-item v-for="(tx,i) in paginatedTxs">
						<div class="left">
							<img v-show="tx.type=='nav'" style="width:32px;height:auto;" src="images/nav-logo-no-border.png">
							<img v-show="tx.type=='xnav'" style="width:32px;height:auto;" src="images/xnav-logo-no-border.png">
							<v-ons-icon v-show="tx.type=='cold_staking'" style="margin-left: 5px;width:19px;height:auto;" icon="ion-ios-snow" class="list-item__icon"></v-ons-icon>
							<v-ons-icon v-if="tx.amount>0" style="color:#669900" icon="ion-md-arrow-round-down" class="list-item__icon"></v-ons-icon>
							<v-ons-icon v-if="tx.amount<0" style="color:#cc6600" icon="ion-md-arrow-round-up" class="list-item__icon"></v-ons-icon>
						</div>
						<div class="center">
							<span class="list-item__title">
								<span style="color:#cc6600" v-if="tx.amount<0"><small><span v-if="tx.type!='nft'">{{formatBalance(tx.amount)}} {{tx.token_code}} {{(tx.token_name?"("+tx.token_name+")":"")}}</span><span v-else>{{tx.token_name}}</span></small></span>
								<span style="color:#669900" v-if="tx.amount>0"><small><span v-if="tx.type!='nft'">+{{formatBalance(tx.amount)}} {{tx.token_code}} {{(tx.token_name?"("+tx.token_name+")":"")}}</span><span v-else>{{tx.token_name}}</span></small></span>
							</span>
							<span class="list-item__subtitle">
								<span class="list-item__subtitle">
									<span class="notification">{{tx.type.toUpperCase()}}</span>
								</span>
								<span class="list-item__subtitle">
									<small>{{(tx.confirmed?"Confirmed":"Not Confirmed")}}</small>
								</span>
								<br/>
								<template v-if="tx.memos">
									<div v-if="tx.memos.in.length>0">
										<div v-for="(item,index) in tx.memos.in" style="margin-top:10px;">
											<small v-if="item!='' && item!=undefined && item!='Change'"><v-ons-icon style="color:#cc6600" icon="ion-md-arrow-round-up" class="list-item__icon"></v-ons-icon>{{item}}</small>
										</div>
									</div>
									<div v-if="tx.memos.out.length>0">
										<span class="list-item__subtitle" v-for="(item,index) in tx.memos.out" style="margin-top:10px;">
											<small v-if="item!='' && item!=undefined && item!='Change'"><v-ons-icon style="color:#669900" icon="ion-md-arrow-round-down" class="list-item__icon"></v-ons-icon>{{item}}</small>
										</span>
									</div>
								</template>
							</span>
						</div>
						<div class="right" style="margin: 0px;padding:0px;font-size:10pt;min-width:100px !important;">
							<small>
								{{formatDate(tx.timestamp)}}
							</small>
						</div>
					</v-ons-list-item>
				</v-ons-list>
			</div>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
import sb from 'satoshi-bitcoin';
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import { mapGetters,mapActions,mapState} from 'vuex';
VueClipboard.config.autoSetContainer=true;
Vue.use(VueClipboard);
export default
{
	data ()
	{
		return {
			state: 'initial',
			items: [1, 2, 3],
			segmentIndex: 0,
			publicAddress:undefined,
			privateAddress:undefined,
			qrcode_nav:'',
			qrcode_xnav:'',
			prefix:"navcoin:",
			txs:[],
			isExpanded:false,
			pageSize: 10,
			currentPage:1
		};
	},
	updated: function()
	{
		if (this.publicAddress==undefined) this.publicAddress=this.config.public_address;
		if (this.privateAddress==undefined) this.privateAddress=this.config.private_address;
		this.qrcode_nav=new QRCode(this.prefix+this.publicAddress).svg();
		this.qrcode_xnav=new QRCode(this.prefix+this.privateAddress).svg();
	},
	computed:
	{
		...mapState({
			config: state => state.config,
		}),
		indexStart()
		{
			return (this.currentPage - 1) * this.pageSize;
		},
		indexEnd()
		{
			return this.indexStart + this.pageSize;
		},
		maxPage()
		{
			return Math.ceil(this.$store.state.config.txs.length/this.pageSize);
		},
		paginatedTxs()
		{
			return this.$store.state.config.txs.slice(this.indexStart, this.indexEnd);
		}
	},
	methods:
	{
		prev()
		{
			this.currentPage--;
		},
		next()
		{
			this.currentPage++;
		},
		doCopy: function (value)
		{
			this.$copyText(value).then(function (e)
			{
				vm.$ons.notification.toast(vm.$t('message.clipboardSuccess'), { timeout: 1000, animation: 'fall' });
			},
			function (e)
			{
				vm.$ons.notification.toast(vm.$t('message.clipboardFailed'), { timeout: 1000, animation: 'fall' });
			})
		},
		loadItem(done)
		{
			setTimeout(() =>
			{
				this.items = [...this.items, this.items.length + 1];
				done();
			}, 1000);
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
		formatDate: n =>
		{
			if (n) return moment.unix(n).format('DD.MM.YY HH:mm:ss'); else return "";
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