<template>
	<v-ons-page>
  		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-card>
			<h3>
				{{$t('message.privateKey')}}
			</h3>
			<code>
				{{privateKey}}
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
const Mnemonic = require('bitcore-mnemonic');
export default {
  created: function ()
  {
    this.privateKey=window.db.get('addr').value()[0].privateKey;
    this.mnemonics=window.db.get('mnemonics').value();
  },
  data() {
    return {
    	privateAddress:'',
    	mnemonics:''
    };
  },
};
</script>