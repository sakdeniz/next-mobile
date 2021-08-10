<template>
	<v-ons-page>
  		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		
		<v-ons-card>
			<h3>
				{{$t('message.privateKey')}}
			</h3>
			<code>
				{{privateKeyWif}}
			</code>
		</v-ons-card>

		<v-ons-card>
			<h3>
				{{$t('message.hdPrivateKey')}}
			</h3>
			<code>
				{{xpriv}}
			</code>
		</v-ons-card>

		<v-ons-card>
			<h3>
				{{$t('message.hdPublicKey')}}
			</h3>
			<code>
				{{hdPublicKey}}
			</code>
		</v-ons-card>

		<v-ons-card>
			<h3>
				{{$t('message.mnemonics')}}
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
};
</script>