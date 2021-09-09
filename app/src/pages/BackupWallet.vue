<template>
	<v-ons-page>
  		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		
		<v-ons-card>
			<h3>
				{{$t('message.privateKey')}}
				<v-ons-button style="float:right;margin-bottom:15px;" v-on:click="doCopy(privateKeyWif)"><i class="fa fa-clipboard"></i></v-ons-button>			
			</h3>
			<code>
				{{privateKeyWif}}
			</code>
		</v-ons-card>

		<v-ons-card>
			<h3>
				{{$t('message.hdPrivateKey')}}
				<v-ons-button style="float:right;margin-bottom:15px;" v-on:click="doCopy(xpriv)"><i class="fa fa-clipboard"></i></v-ons-button>			
			</h3>
			<code>
				{{xpriv}}
			</code>
		</v-ons-card>

		<v-ons-card>
			<h3>
				{{$t('message.hdPublicKey')}}
				<v-ons-button style="float:right;margin-bottom:15px;" v-on:click="doCopy(hdPublicKey)"><i class="fa fa-clipboard"></i></v-ons-button>			
			</h3>
			<code>
				{{hdPublicKey}}
			</code>
		</v-ons-card>

		<v-ons-card>
			<h3>
				{{$t('message.mnemonics')}}
				<v-ons-button style="float:right;margin-bottom:15px;" v-on:click="doCopy(mnemonics)"><i class="fa fa-clipboard"></i></v-ons-button>			
			</h3>
			<code>
				{{mnemonics}}
			</code>
		</v-ons-card>

	</v-ons-page>
</template>
<script>
const buffer=require('buffer');
const crypto=require('crypto');
const bitcore = require('bitcore-lib');
const Mnemonic = require('bitcore-mnemonic');
export default {
  created: function ()
  {
    this.privateKeyWif=window.db.get('addr').value()[0].privateKey;
    this.mnemonics=window.db.get('mnemonics').value();
    let code=new Mnemonic(this.mnemonics);
    this.xpriv=code.toHDPrivateKey();
	var HDPrivateKey = bitcore.HDPrivateKey;
	var hdPrivateKey = new HDPrivateKey(this.xpriv);
    this.hdPublicKey = hdPrivateKey.hdPublicKey;
    
    let value=buffer.Buffer.from(code.toString());
    let hash=bitcore.crypto.Hash.sha256(value);
    let bn=bitcore.crypto.BN.fromBuffer(hash);
    let privateKey=new bitcore.PrivateKey(bn);
    this.privateKey=privateKey;
  },
  data() {
    return {
    	privateKey:'',
    	privateKeyWif:'',
    	mnemonics:'',
    	xpriv:'',
    	hdPublicKey:''
    };
  },
  methods: {
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
  }
};
</script>