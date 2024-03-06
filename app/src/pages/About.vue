<template>
	<v-ons-page>
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-card>
			<span class="about-logo-text">NEXT</span>
			<p>Build 1.0.20</p>
			<p>Developed by Navcoin Developers</p>
			<a href="https://www.nextwallet.org">https://www.nextwallet.org</a>
			<p>
				<h5>navcoin-js</h5>
				Build {{njs.version}}
			</p>
			<p>
				<h5>bitcore-lib</h5>
				Build {{njs.wallet.bitcore.version}}
			</p>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
const njs=require('navcoin-js');
export default
{
	data()
	{
		return {
			toolbarInfo:
			{
				backLabel: 'Home',
				title: "About",
			},
			njs:null,
		};
	},
	created()
	{
		this.njs=njs;
	}
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