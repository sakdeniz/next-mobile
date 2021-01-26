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
				      <td>{{balanceInfo.received?formatBalance(balanceInfo.received):0}}</td>
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
                        	<a v-bind:href="'https://www.navexplorer.com/tx/'+tx.txid">
                        	  <v-ons-icon style="color:#232323" icon="ion-android-open" class="list-item__icon"></v-ons-icon>
                      	   	</a>
                          <v-ons-icon v-if="tx.type=='send'" style="color:#cc6600" icon="ion-arrow-up-a" class="list-item__icon"></v-ons-icon>
                          <v-ons-icon v-if="tx.type=='receive'" style="color:#669900" icon="ion-arrow-down-a" class="list-item__icon"></v-ons-icon>
                          <v-ons-icon v-if="tx.type=='community_fund_payout'" style="color:#669900" icon="ion-arrow-down-a" class="list-item__icon"></v-ons-icon>
                          <v-ons-icon v-if="tx.type=='cold_stake'" style="color:#673ab7" icon="ion-ios-snowy" class="list-item__icon"></v-ons-icon>
                        </div>
                        <div class="center">
                            <span style="color:#cc6600" v-if="tx.changes.balance<0">{{formatBalance(tx.changes.balance)}}</span>
                            <span style="color:#669900" v-if="tx.changes.balance>0">+{{formatBalance(tx.changes.balance)}}</span>
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
    txs:[]
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
		                vm.balanceInfo={"balance":"0","received":"0"}
		            }
		            catch(err)
		            {
		                console.log(err);
		            }
		        }
		        else
		        {
	                vm.balanceInfo={"balance":"0","received":"0"}
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
	   		url=window.apiURL+'balance';
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
					vm.balanceInfo={"balance":"0","received":"0"}
				}
			})
		    .then(function ()
			{
			}); 
		}
    },
 	getStakingReward: function (tx)
	{
		return(sb.toBitcoin(parseFloat(tx.output)-parseFloat(tx.input)));
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
        if (n) return moment.unix(n).format('DD/MM/YYYY HH:mm:ss'); else return "";
    },
    txhistory()
    {
        let vm=this;
        axios.get(window.apiURL+'history?a='+this.publicAddress, {
            params: {}
        })
        .then(function (response)
        {
            vm.txs=response.data.reverse();
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
