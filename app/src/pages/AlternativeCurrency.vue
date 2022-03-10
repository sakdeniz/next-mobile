<template>
	<v-ons-page>
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-list>
			<v-ons-list-item v-for="(currency, $index) in currencies" :key="currency.code" tappable>
				<label class="left">
					<v-ons-radio :input-id="'radio-' + $index" :value="currency.code" v-model="selectedCurrency" v-on:click="setCurrency(currency)"></v-ons-radio>
				</label>
				<label :for="'radio-' + $index" class="center">
					{{currency.symbol}}
				</label>
			</v-ons-list-item>
		</v-ons-list>
	</v-ons-page>
</template>
<script>
export default {
	data() {
		return {
			currencies:[
			{symbol:'USD',code:'USD'},
			{symbol:'EURO',code:'EUR'},
			{symbol:'GBP',code:'GBP'},
			{symbol:'TRY',code:'TRY'},
			{symbol:'JPY',code:'JPY'},
			{symbol:'KRW',code:'KRW'},
			{symbol:'CNY',code:'CNY'},
			{symbol:'RUB',code:'RUB'}
			],
			selectedCurrency:''
		};
	},
	computed:
	{
		config()
		{
			return this.$store.state.config;
		}
	},
	created: function ()
	{
		this.selectedCurrency=this.config.currency.code;
	},
	methods: {
		setCurrency(currency)
		{
			this.$store.commit('config/setCurrency',currency);
			this.$store.commit('navigator/pop');
		}
	}
};
</script>