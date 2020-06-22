<template>
	<v-ons-page>
  		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-card>
	        <span class="about-logo-text">NEXT</span>
			<p>Build 1.0.4</p>
			<p>Developed by NavCoin Developers</p>
			<a href="https://www.nextwallet.org">https://www.nextwallet.org</a>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
export default {
  data() {
    return {};
  },
};
</script>
<style>
@font-face
{
	font-family: 'neo';
	src: url('../../static/fonts/neo-latina.ttf');
}
.about-logo-text
{
	font-family:'neo';
	font-size:40pt;
	font-weight:normal;
	color:#7D5AB5;
}
</style>