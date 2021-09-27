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
	    			<img src="images/wallet.svg" style="width:128px;height:auto;">
	    		</center>
		
	      		<div class="center" style="margin-bottom:15px;">
	        		<v-ons-segment :index.sync="segmentIndex" style="width:100%">
	          			<button><ons-icon icon="ion-ios-unlock"></ons-icon>&nbsp;{{$t('message.public')}}</button>
	          			<button><ons-icon icon="ion-ios-lock"></ons-icon>&nbsp;{{$t('message.private')}}</button>
	        		</v-ons-segment>
	      		</div>
		
				<div v-show="segmentIndex==0">
	                <v-ons-button style="float:right;margin-bottom:15px;" v-on:click="doCopy(publicAddress)"><i class="fa fa-clipboard"></i>&nbsp;{{$t('message.copy')}}</v-ons-button>
	                <div style="clear: both">
	                	<center>
	                		{{publicAddress}}
	                	</center>
	                </div>
		            <center>
		            	<div v-html="qrcode_nav"></div>
		            </center>
				</div>

				<div v-show="segmentIndex==1">
	                <v-ons-button style="float:right;margin-bottom:15px;" v-on:click="doCopy(config.private_address)"><i class="fa fa-clipboard"></i>&nbsp;{{$t('message.copy')}}</v-ons-button>
	                <div style="clear: both">
	                	<center>
	                		{{config.private_address}}
	                	</center>
	                </div>
		            <center>
		            	<div v-html="qrcode_xnav"></div>
		            </center>
				</div>

					<div class="title" style="margin-top:30px;">
	                	{{$t('message.transactionHistory')}}
	            	</div>

					<div class="title" style="margin-top:15px;">
						{{config.txs.length}} Total Transaction
					</div>

					<div class="title" style="margin-top:15px;">
						{{config.txs.filter((e) => e.type == "nav").length}} Public Transaction
					</div>

					<div class="title" style="margin-top:12px;">
						{{config.txs.filter((e) => e.type == "xnav").length}} Private Transaction
					</div>

					<div class="title" style="margin-top:12px;">
						{{config.txs.filter((e) => e.type == "cold_staking").length}} Cold Staking
					</div>

                <v-ons-list>
                    <v-ons-list-item v-for="(tx,i) in config.txs">
                        <div class="left">
                          <!--<span style="color:#cc6600">{{i+1}} {{tx.type}}</span>!-->
                          <v-ons-icon v-if="tx.amount>0" style="color:#669900" icon="ion-md-arrow-round-down" class="list-item__icon"></v-ons-icon>
                          <v-ons-icon v-if="tx.amount<0" style="color:#cc6600" icon="ion-md-arrow-round-up" class="list-item__icon"></v-ons-icon>
                        </div>
                        <div class="center">
                            <span style="color:#cc6600" v-if="tx.amount<0">{{formatBalance(tx.amount)}}</span>
                            <span style="color:#669900" v-if="tx.amount>0">+{{formatBalance(tx.amount)}}</span>
                        </div>
                        <div class="right">{{formatDate(tx.timestamp)}}</div>
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
    segmentIndex: 0,
    publicAddress:'',
    privateAddress:'',
    balanceInfo:'',
    qrcode_nav:'',
    qrcode_xnav:'',
    prefix:"navcoin:",
    txs:[],
    navcoinjs_txs:[]
    };
  },
  created: function ()
  {
    this.publicAddress=db.get('addr').value()[0].publicAddress;
    this.getBalance();

    var qrcode=new QRCode(this.prefix+this.publicAddress);
    this.qrcode_nav=qrcode.svg();

    this.txhistory();
  },
  computed:
  {
  	config()
  	{
  		if (this.$store.state.config.private_address)
  		{
  			this.getxNAVQRCode();
  		}
    	return this.$store.state.config;
  	}
  },
  methods: {
  	getxNAVQRCode()
  	{
	    var qrcode=new QRCode(this.prefix+this.$store.state.config.private_address);
	    this.qrcode_xnav=qrcode.svg();
  	},
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
    },
 	getStakingReward: function (tx)
	{
		return(sb.toBitcoin(parseFloat(tx.output)-parseFloat(tx.input)));
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
        if (n) return moment.unix(n).format('DD/MM/YYYY HH:mm:ss'); else return "";
    },
    txhistory()
    {
        let vm=this;
        axios.get(window.apiURL+'history?a='+this.publicAddress+"&network="+window.network, {
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
