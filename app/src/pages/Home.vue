<template>
	<v-ons-page>
		<v-ons-pull-hook :action="loadItem" @changestate="state = $event.state">
			<span v-show="state === 'initial'">{{$t('message.pullToRefresh')}}</span>
			<span v-show="state === 'preaction'">{{$t('message.release')}}</span>
			<span v-show="state === 'action'">
				<v-ons-progress-circular indeterminate></v-ons-progress-circular>
			</span>
		</v-ons-pull-hook>
		<div class="asset-card asset-card-nav">
			<div class="asset-card-icon">
				<img style="width:40px;height:auto;" src="images/nav-logo-border.png">
			</div>
			<div class="asset-card-content">
				<div class="card-title">
					{{$t('message.public')}}
				</div>
				<div class="card-sub-title">
					<span v-if="!hideBalance&&config.Balance">
						NAV {{formatBalance(config.Balance.nav.confirmed)}} / {{getAssetFiatValue(config.Balance.nav.confirmed)}} {{config.currency.symbol}}
					</span>
					<span v-if="hideBalance">*****</span>
					<span v-if="!hideBalance&&!config.Balance">{{$t('message.loading')}}</span>
				</div>
				<div class="card-sub-title" v-if="config.Balance&&config.Balance.nav.pending!=0">
					{{$t('message.pending')}} : NAV {{formatBalance(config.Balance.nav.pending)}}
				</div>
			</div>
		</div>
		<div class="asset-card asset-card-xnav">
			<div class="asset-card-icon">
				<img style="width:40px;height:auto;" src="images/xnav-logo-border.png">
			</div>
			<div class="asset-card-content">
				<div class="card-title">
					{{$t('message.private')}}
				</div>
				<div class="card-sub-title">
					<span v-if="!hideBalance&&config.Balance">
						xNAV {{formatBalance(config.Balance.xnav.confirmed)}} / {{getAssetFiatValue(config.Balance.xnav.confirmed)}} {{config.currency.symbol}}
					</span>
					<span v-if="hideBalance">*****</span>
					<span v-if="!hideBalance&&!config.Balance">{{$t('message.loading')}}</span>
				</div>
				<div class="card-sub-title" v-if="config.Balance&&config.Balance.xnav.pending!=0">
					{{$t('message.pending')}} : xNAV {{formatBalance(config.Balance.xnav.pending)}}
				</div>
			</div>
		</div>
		<div class="asset-card asset-card-staking">
			<div class="asset-card-icon">
				<i class="ion-ios-leaf" style="margin-left: 10px;font-size: 32px;"></i>
			</div>
			<div class="asset-card-content">
				<div class="card-title">
					{{$t('message.staking')}}
				</div>
				<div class="card-sub-title">
					<span v-if="!hideBalance&&config.Balance">
						NAV {{formatBalance(config.Balance.staked.confirmed)}} / {{getAssetFiatValue(config.Balance.staked.confirmed)}} {{config.currency.symbol}}
					</span>
					<span v-if="hideBalance">*****</span>
					<span v-if="!hideBalance&&!config.Balance">{{$t('message.loading')}}</span>
				</div>
				<div class="card-sub-title" v-if="config.Balance&&config.Balance.staked.pending!=0">
					{{$t('message.pending')}} : NAV {{formatBalance(config.Balance.staked.pending)}}
				</div>
			</div>
		</div>
		<v-ons-list modifier="noborder">
			<v-ons-list-item modifier="nodivider">
				<div class="left">
					<span v-if="!hideBalance">{{getTotalFiatValue()}} {{config.currency.symbol}}</span>
					<span v-else>*****</span>&nbsp;
					<i v-bind:class="{ 'ion-ios-eye': !hideBalance, 'ion-ios-eye-off': hideBalance }" aria-hidden="true" v-on:click="showHideBalance()"></i>
				</div>
				<div class="right">
					<v-ons-button style="float:right" v-on:click="push(pages[0].component, 'Swap')"><i class="ion-ios-repeat"></i>&nbsp;{{$t('message.swap')}}</v-ons-button>
				</div>
			</v-ons-list-item>
			<v-ons-list-item modifier="nodivider" v-show="config.sync_progress!=100">
				<div class="left">
					<span class="notification notification--material">
						<small>{{$t('message.walletSyncProgressInfo')}}</small>
					</span>
				</div>
			</v-ons-list-item>
			<v-ons-list-item modifier="nodivider" v-show="config.sync_progress!=100">
				<div class="center">
					<span class="list-item__title">
						{{config.sync_status}}
					</span>
					<span class="list-item__subtitle">
						{{config.current_node}}
					</span>
				</div>
			</v-ons-list-item>
			<v-ons-list-item modifier="nodivider" v-show="config.sync_progress==100">
				<div class="left">
					<span class="list-item__subtitle">
						<i class="ion-ios-flash"></i>&nbsp;{{config.current_node}}
					</span>
				</div>
				<div class="center">
				</div>
				<div class="right">
					<span class="list-item__subtitle">
						<i class="ion-ios-hammer"></i>&nbsp;{{config.block_height}}
					</span>
				</div>
			</v-ons-list-item>
		</v-ons-list>
		<v-ons-card style="margin:0px;margin-top:1px;padding-top:0px;padding-left:0px;padding-right:0px;background: #ffffff">
			<div style="clear:both">
				<v-ons-segment :index.sync="segmentIndex" style="width: 100%">
					<button v-on:click="getGraph(7)">{{$t('message.week')}}</button>
					<button v-on:click="getGraph(30)">{{$t('message.month')}}</button>
					<button v-on:click="getGraph(365)">{{$t('message.year')}}</button>
					<button v-on:click="getGraph(0)">{{$t('message.all')}}</button>
				</v-ons-segment>
			</div>
			<div style="margin:0px;padding:0px;">
				<div style="display:inline-block;float:left;margin-top:10px;margin-left:10px;">
					Navcoin
				</div>
				<div style="display:inline-block;float:right;margin-top:10px;margin-right:10px;">
					{{getUnitFiatValue()}} {{config.currency.symbol}}
					<br/>
					<span style="color:red;float:right;" v-if="priceMulti && get24HChange()<0">{{get24HChange()}}%</span>
					<span style="color:green;float:right;" v-if="priceMulti && get24HChange()>0">+{{get24HChange()}}%</span>
				</div>
				<area-chart style="margin:0px;margin-bottom:30px;" :data="cData" height="100px" :curve="true" :legend="false" :colors="['#ceb8ef']" :dataset="{pointRadius: 0,borderColor:'#7d5ab5',backgroundColor:'#fafafa',fill: true}" :library="{scales: {xAxes: [{display: false}],yAxes: [{display: false}],},responsive:true}" label="NAV Chart"></area-chart>
			</div>
		</v-ons-card>
		<v-ons-card v-if="status.maintenance_mode==1" style="margin:0px;margin-top:20px;background: #ffffff">
			<h3><i class="ion-ios-build"></i>&nbsp;{{$t('maintenanceMode')}}</h3>
			<p>{{status.maintenance_message}}</p>
			<p>{{$t('currentBlock')}} : {{status.blocks}}/{{status.headers}}</p>
			<p>{{$t('syncProgress')}} : {{status.sync}}%</p>
			<p>{{$t('daysBehind')}} : {{status.days_behind}}</p>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
import axios from 'axios';
import bitcore from '@aguycalled/bitcore-lib';
import sb from 'satoshi-bitcoin';
import Vue from 'vue'
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'
import Swap from './Swap.vue';
Vue.use(VueChartkick, {adapter: Chart})
export default
{
	data ()
	{
		return {
			state: 'initial',
			items: [1, 2, 3],
			price:{},
			status:{},
			graphData:[],
			cData:[],
			priceMulti:'',
			segmentIndex: 0,
			graphLimit:90,
			hideBalance:false,
			proposals:[],
			proposalFilter:'',
			pages:
			[
			{
				component: Swap,
				label: 'Swap',
				desc: 'Desc'
			}
			]
		};
	},
	created: function ()
	{
		this.getPrice();
		this.getStatus();
		this.getGraph();
		this.getProposals();
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
		filter: function(proposals)
		{
			return proposals.filter(proposal => proposal.featured==1);
		},
		swap()
		{
		},
		secondsToDhms:function(seconds)
		{
			seconds=Number(seconds);
			var d=Math.floor(seconds / (3600*24));
			var h=Math.floor(seconds % (3600*24) / 3600);
			var m=Math.floor(seconds % 3600 / 60);
			var s=Math.floor(seconds % 3600 % 60);
			var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
			return dDisplay;
		},
		showHideBalance()
		{
			this.hideBalance=!this.hideBalance;
		},
		capitalize: function (s) 
		{
			if (typeof s !== 'string') return ''
			return s.charAt(0).toUpperCase() + s.slice(1)
		},
		formatNumber: n => {
			if (!n) return "0";
			return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
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
		getYesVotesProportion: function (proposal)
		{
			var total_votes = proposal.votesYes + proposal.votesNo;
			return Math.round((proposal.votesYes / total_votes) * 100, 2);
		},
		getNoVotesProportion: function (proposal)
		{
			var total_votes = proposal.votesYes + proposal.votesNo;
			return Math.round((proposal.votesNo / total_votes) * 100, 2);
		},
		getRequiredVotesProportion: function (proposal)
		{
			try
			{
				var requiredVotesProportion=(((proposal.votesYes+proposal.votesNo)*100)/this.cfundStats.consensus.minSumVotesPerVotingCycle).toFixed(2);
				if (requiredVotesProportion>100) return 100; else return requiredVotesProportion;
			}
			catch(err){}
		},
		getProposals()
		{
			let vm=this;
			axios.get(window.apiURL+'listproposals', {
				params: {
					network: window.network
				}
			})
			.then(function (response)
			{
				vm.proposals=response.data;
			})
			.catch(function (error)
			{
				console.log(error);
			})
			.then(function ()
			{
			});
		},
		loadItem(done)
		{
			this.priceMulti='';
			this.graphData=[];
			this.cData=[];
			this.price={};
			this.getStatus();
			this.getPrice();
			this.getGraph();
			setTimeout(() => 
			{
				this.items = [...this.items, this.items.length + 1];
				done();
			}, 1000);
		},
		myFunction(value, index, array)
		{
			let vm=this;
			vm.cData.push([moment.unix(value["time"]).format('DD/MM/YYYY HH:MM:ss'),value["close"]]);
		},
		get24HChange()
		{
			return this.priceMulti["DISPLAY"]["NAV"]["USD"]["CHANGEPCT24HOUR"];
		},
		getGraph(limit)
		{
			var str="";
			this.cData=[];
			let vm=this;
			if (limit) this.graphLimit=limit;
			if (limit=="0") this.graphLimit=0;
			if (this.graphLimit>0) str="&limit="+this.graphLimit; else str="&allData=true";
			axios.get("https://min-api.cryptocompare.com/data/histoday?fsym=NAV&tsym=USD"+str, {
				params: {}
			})
			.then(function (response)
			{
				vm.graphData=JSON.parse(JSON.stringify(response.data));
				vm.graphData["Data"].forEach(vm.myFunction);
			})
			.catch(function (error)
			{
				console.log(error);
			})
			.then(function ()
			{
			});
		},
		getTotalFiatValue()
		{
			if (!this.$store.state.config.Balance) return "0";
			var a=0;
			try
			{
				var t=sb.toBitcoin(this.$store.state.config.Balance.nav.confirmed+this.$store.state.config.Balance.xnav.confirmed+this.$store.state.config.Balance.staked.confirmed)*this.price[this.config.currency.code];
					a=this.formatNumbers(t.toFixed(2));
			}
			catch (e)
			{
				console.log(e);
			}
			return a;
		},
		getAssetFiatValue(amount)
		{
			if (!amount) return "0";
			var a=0;
			try
			{
				var t=sb.toBitcoin(amount)*this.price[this.config.currency.code];
				a=this.formatNumbers(t.toFixed(2));
			}
			catch (e)
			{
				console.log(e);
			}
			return a;
		},
		getUnitFiatValue()
		{
			var t=this.price[this.config.currency.code];
			if (t) return this.formatNumbers(t.toFixed(2));
		},
		getPrice()
		{
			let vm=this;
			axios.get("https://min-api.cryptocompare.com/data/price?fsym=NAV&tsyms=USD,JPY,EUR,TRY,GBP", {
				params: {}
			})
			.then(function (response)
			{
				vm.price=JSON.parse(JSON.stringify(response.data));
				console.log(vm.price);
			})
			.catch(function (error)
			{
				console.log(error);
			})
			.then(function ()
			{
			});
			axios.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms=NAV&tsyms=USD,EUR", {
				params: {}
			})
			.then(function (response)
			{
				vm.priceMulti=JSON.parse(JSON.stringify(response.data));
			})
			.catch(function (error)
			{
				console.log(error);
			})
			.then(function ()
			{
			});
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
		formatNumbers: function(n)
		{
			if (n==undefined) return;
			var parts = n.toString().split(".");
			return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
		},
		getStatus()
		{
			console.log("Getting status...");
			let vm=this;
			axios.get(window.apiURL+'status', {})
			.then(function (response)
			{
				console.log("Status retrieved.");
				console.log(response.data);
				vm.status=response.data;
			})
			.catch(function (error)
			{
				console.log(error);
			});
		},
		push(page, key)
		{
			this.$store.commit('navigator/push', {
			extends: page,
			data()
			{
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
.intro
{
	text-align: left;
	padding: 0 22px;
	margin-top: 20px;
	font-size: 14px;
	line-height: 1.4;
	color: rgba(0, 0, 0, .54);
}

.page__background
{
	background: #eceff1;
}

ons-card
{
	cursor: pointer;
	color: #333;
}

.card__title, .card--material__title
{
	font-size: 20px;
}

<style>
.title
{
	color:#232323;
}

div .main
{
	width: 100%;
	height: 300px;
	position: absolute;
	top:0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
}

ons-card {
	cursor: pointer;
	color: #333;
}

.card__title, .card--material__title {
	font-size: 20px;
}

p {
	width: 100%;
}

.description
{
	font-size:9pt;
	color:#787878;
}

.ml-5 { 
	margin-left:5px;
}

.ml-10 { 
	margin-left:10px;
}

.ow-anywhere { 
	overflow-wrap: anywhere; 
}

.ow-break-word {
	overflow-wrap: break-word;
}

.word-break {
	word-break: break-all;
}

.hyphens {
	hyphens: auto;
}

.title
{
	color:#7D5AB5;
}

.sub-title
{
	font-size:15px;
	color:#7D5AB5;
}
.purple
{
	color:#7D5AB5;
}

.progress-bar {
	border-radius: 10px;
	margin-top:5px;
}
#positive .progress-bar__primary,
#positive .progress-bar--material__primary {
	background-color: #A4C639;
}

#positive .progress-bar__secondary,
#positive .progress-bar--material__secondary {
	background-color: #f5f5f5;
}

#negative .progress-bar__primary,
#negative .progress-bar--material__primary {
	background-color: #DD4B39;
}

#negative .progress-bar__secondary,
#negative .progress-bar--material__secondary {
	background-color: #f5f5f5;
}

.badge
{
	background: #7D5AB5;
	color:#ffffff;
	border-radius: 4px;
	padding:5px;
}
.amount
{
	background: #7D5AB5;
	color:#ffffff;
	border-radius: 4px;
	padding:5px;
	font-size:9pt;
	margin-bottom:5px;
}
.status
{
	background: #FCFCFC;
	color:#232323;
	border-radius: 4px;
	padding:5px;
	font-size:9pt;
	margin-top:5px;
}
.bg1
{
	color:#787878;
	padding-left:10px;
	padding-right:10px;
	padding-bottom:10px;
	font-size:10pt;
	border-bottom: 1px solid #F3F3F3;
}
.voteYes
{
	color:#A4C639;
	font-size:10pt;
}
.voteNo
{
	color:#DD4B39;
	font-size:10pt;
}
.asset-card-icon
{
	width: 60px;
	margin-top: 5px;
}
.asset-card-content
{
	flex-grow: 1;
}
.asset-card
{
	color: #FFFFFF;
	padding-left: 15px;
	padding-right: 15px;
	padding-top: 5px;
	padding-bottom: 5px;
	display: flex;
}
.asset-card-nav
{
	background: #6F55D8;
}
.asset-card-xnav
{
	background: #232323;
}
.asset-card-staking
{
	background: #1E7DF0;
}
.card-title
{
	font-size: 12pt;
	margin-top: 5px;
}
.card-sub-title
{
	font-size: 10pt;
	margin-top: 3px;
}
ons-card
{
	cursor: pointer;
	color: #333;
}

.card__title, .card--material__title
{
	font-size: 20px;
}
.notification
{
	font-size:8pt;
	background-color: #673ab7;
}
</style>