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
                <v-ons-button style="float:right" modifier="quiet" v-on:click="doCopy()"><i class="fa fa-clipboard"></i></v-ons-button>
            </div>
           
            <div class="content" style="clear:both;">
	        	<center>
	    			<img src="images/wallet.svg" style="width:128px;height:auto;">
	    		</center>
                <center>{{publicAddress}}</center>
            </div>

            <center>
            	<div v-html="qrcode"></div>
            </center>
        </v-ons-card>
        <v-ons-card>
            <div class="title">
                {{$t('message.balanceSummary')}}
            </div>
            <div class="content">
	            <table class="ui table">
				  <tbody>
				    <tr>
				      <td class="collapsing">
				        <i class="ion-android-arrow-down"></i> {{$t('message.balanceSummaryReceived')}}
				      </td>
				      <td>{{balanceInfo.received?formatBalance(balanceInfo.received):0}} <span class="notification">{{balanceInfo.receivedCount?balanceInfo.receivedCount:0}}</span></td>
				    </tr>
				    <tr>
				      <td>
				        <i class="ion-android-arrow-up"></i> {{$t('message.balanceSummarySent')}}
				      </td>
				      <td>{{balanceInfo.sent?formatBalance(balanceInfo.sent):0}} <span class="notification">{{balanceInfo.sentCount?balanceInfo.sentCount:0}}</span></td>
				    </tr>
				    <tr>
				      <td>
				        <i class="ion-android-add"></i> {{$t('message.balanceSummaryStaked')}}
				      </td>
				      <td>{{balanceInfo.staked?formatBalance(balanceInfo.staked):0}} <span class="notification">{{balanceInfo.stakedCount?balanceInfo.stakedCount:0}}</span></td>
				    </tr>
				    <tr>
				      <td nowrap>
				        <i class="ion-connection-bars"></i> {{$t('message.balanceSummaryRichListPosition')}}
				      </td>
				      <td>{{balanceInfo.richListPosition}}</td>
				    </tr>
				  </tbody>
				</table>
			</div>
		</v-ons-card>
		<v-ons-card>
			<div class="title">
                {{$t('message.transactionHistory')}}
            </div>
            <div class="content">
                <v-ons-list>
                    <v-ons-list-item v-for="tx in txs">
                        <div class="left">
                        	<a v-bind:href="'https://www.navexplorer.com/tx/'+tx.transaction">
                        	  <v-ons-icon style="color:#232323" icon="ion-android-open" class="list-item__icon"></v-ons-icon>
                      	   	</a>
                          <v-ons-icon v-if="tx.type=='SEND'" style="color:#cc6600" icon="ion-arrow-up-a" class="list-item__icon"></v-ons-icon>
                          <v-ons-icon v-if="tx.type=='RECEIVE'" style="color:#669900" icon="ion-arrow-down-a" class="list-item__icon"></v-ons-icon>
                          <v-ons-icon v-if="tx.type=='COLD_STAKING'" style="color:#673ab7" icon="ion-ios-snowy" class="list-item__icon"></v-ons-icon>
                        </div>
                        <div class="center">
                            <span style="color:#cc6600" v-if="tx.type=='SEND'">-{{formatBalance(tx.sent-tx.received)}}</span>
                            <span style="color:#669900" v-if="tx.type=='RECEIVE'">+{{formatBalance(tx.received)}}</span>
                            <span style="color:#673ab7" v-if="tx.type=='COLD_STAKING'">+{{getStakingReward(tx)}}</span>
                        </div>
                        <div class="right">{{formatDate(tx.time)}}</div>
                    </v-ons-list-item>
                </v-ons-list>
            </div>
        </v-ons-card>
    </v-ons-page>
</template>

<script>
import axios from 'axios';
import bitcore from 'bitcore-lib';
import sb from 'satoshi-bitcoin';
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
VueClipboard.config.autoSetContainer=true;
Vue.use(VueClipboard);
export default {
  data () {
    return {
    state: 'initial',
    items: [1, 2, 3],
    publicAddress:'',
    balanceInfo:'',
    qrcode:'',
    prefix:"navcoin:",
    txs:[],
    apiExplorerURL:'https://api.navexplorer.com/api/'
    };
  },
  created: function ()
  {
    this.publicAddress=db.get('addr').value()[0].publicAddress;
    this.getBalance();
    var qrcode=new QRCode(this.prefix+this.publicAddress);
    this.qrcode=qrcode.svg();
    this.txhistory();
  },
  methods: {
  	getBalance()
    {
		var url;
		let vm=this;
		const publicAddress=this.publicAddress;
		if (window.network!="main")
		{
		    axios.get(window.apiURL+'utxo', {
		        params: {
		          network: window.network,
		          a: vm.publicAddress
		        }
		      })
		      .then(function (response)
		      {
		        var utxo=response.data;
		        if(utxo.length>0)
		        {
		            try
		            {
		                var tx=new bitcore.Transaction()
		                .from(utxo);
		                var amount=(tx.inputAmount);
		                vm.balanceInfo={
		                	"hash":"",
							"received":0,
							"receivedCount":0,
							"sent":0,
							"sentCount":0,
							"staked":0,
							"stakedCount":0,
							"stakedSent":0,
							"stakedReceived":0,
							"coldStaked":0,
							"coldStakedCount":0,
							"coldStakedSent":0,
							"coldStakedReceived":0,
							"coldStakedBalance":0,
							"balance":amount,
							"blockIndex":0,
							"richListPosition":0
						}
		            }
		            catch(err)
		            {
		                console.log(err);
		            }
		        }
		        else
		        {
	                vm.balanceInfo={
		                	"hash":"",
							"received":0,
							"receivedCount":0,
							"sent":0,
							"sentCount":0,
							"staked":0,
							"stakedCount":0,
							"stakedSent":0,
							"stakedReceived":0,
							"coldStaked":0,
							"coldStakedCount":0,
							"coldStakedSent":0,
							"coldStakedReceived":0,
							"coldStakedBalance":0,
							"balance":0,
							"blockIndex":0,
							"richListPosition":0
						}
		        }
		    })
		    .catch(function (error)
			{
				console.log(error);
			})
			.then(function ()
			{
			});
		}
	    if (window.network=="main")
	    {
	   		url=vm.apiExplorerURL+'address/'+vm.publicAddress;
			axios.get(url, {
				params: {
					network: window.network,
					a: vm.publicAddress
				}
			})
			.then(function (response)
			{
				vm.balanceInfo=response.data;
			})
			.catch(function (error)
			{
				console.log(error);
				if(error.response.data.status=="404")
				{
	                vm.balanceInfo={
	                	"hash":"",
						"received":0,
						"receivedCount":0,
						"sent":0,
						"sentCount":0,
						"staked":0,
						"stakedCount":0,
						"stakedSent":0,
						"stakedReceived":0,
						"coldStaked":0,
						"coldStakedCount":0,
						"coldStakedSent":0,
						"coldStakedReceived":0,
						"coldStakedBalance":0,
						"balance":0,
						"blockIndex":0,
						"richListPosition":0
					}
				}
			})
		    .then(function ()
			{
			}); 
		}
    },
 	getStakingReward: function (tx)
	{
		return(sb.toBitcoin(parseFloat(tx.received)-parseFloat(tx.sent)));
	},
    doCopy: function ()
    {
        this.$copyText(this.publicAddress).then(function (e)
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
        this.txs=[];
        this.txhistory();
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
        if (n) return moment(n).format('DD/MM/YYYY HH:mm:ss'); else return "";
    },
    txhistory()
    {
        let vm=this;
        axios.get(window.apiExplorerURL+'address/'+this.publicAddress+'/tx?size=50&page=1', {
            params: {}
        })
        .then(function (response)
        {
            vm.txs=response.data;
            //console.log(JSON.stringify(response.data));
        })
        .catch(function (error)
        {
            console.log(error);
        })
        .then(function ()
        {
        }); 
    },
    push(page, key) {
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
.notification
{
	font-size:8pt;
	background-color: #673ab7;
}
</style>
