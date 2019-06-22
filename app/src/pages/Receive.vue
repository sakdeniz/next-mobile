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
                {{publicAddress}}
            </div>

            <center>
            	<div v-html="qrcode"></div>
            </center>
        </v-ons-card>
        <v-ons-card>
            <div class="title">
                {{$t('message.transactionHistory')}}
            </div>
            <div class="content">
                <v-ons-list>
                    <v-ons-list-item v-for="tx in txs">
                        <div class="left">
                          <v-ons-icon v-if="tx.type=='SEND'" style="color:#cc6600" icon="ion-arrow-up-a" class="list-item__icon"></v-ons-icon>
                          <v-ons-icon v-if="tx.type=='RECEIVE'" style="color:#669900" icon="ion-arrow-down-a" class="list-item__icon"></v-ons-icon>
                          <a v-bind:href="'https://www.navexplorer.com/tx/'+tx.transaction">
                        	  <v-ons-icon style="color:#232323" icon="ion-android-open" class="list-item__icon"></v-ons-icon>
                      		</a>
                        </div>
                        <div class="center">
                            <span style="color:#cc6600" v-if="tx.type=='SEND'">-{{formatBalance(tx.sent-tx.received)}}</span>
                            <span style="color:#669900" v-if="tx.type=='RECEIVE'">+{{formatBalance(tx.received)}}</span>
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
    qrcode:'',
    prefix:"navcoin:",
    txs:[]
    };
  },
  created: function ()
  {
    this.publicAddress=db.get('addr').value()[0].publicAddress;
    var qrcode=new QRCode(this.prefix+this.publicAddress);
    this.qrcode=qrcode.svg();
    this.txhistory();
  },
  methods: {
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
        if (n) return sb.toBitcoin(n); else return "";
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
            console.log(JSON.stringify(response.data));
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
</style>
