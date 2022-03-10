<template>
	<v-ons-page>
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-list>
			<v-ons-list-item v-for="(language, $index) in config.languages" :key="language.code" tappable>
				<label class="left">
					<v-ons-radio :input-id="'radio-' + $index" :value="language.code" v-model="selectedLanguage" v-on:click="setLanguage(language)"></v-ons-radio>
				</label>
				<label :for="'radio-' + $index" class="center">
					{{language.name}}
				</label>
			</v-ons-list-item>
		</v-ons-list>
	</v-ons-page>
</template>
<script>
export default {
	data()
	{
		return {
			languages:config.languages,
			selectedLanguage:''
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
		this.selectedLanguage=this.config.language.code;
	},
	methods:
	{
		setLanguage(language)
		{
			this.selectedLanguage=language.code;
			this.$store.commit('config/setLanguage', language)
			this.$i18n.locale=language.code;
			this.$store.commit('navigator/pop');
		}
	}
};
</script>