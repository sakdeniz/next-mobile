<template>
	<v-ons-page>
		<v-ons-toolbar>
			<div class="center">{{$t('message.settings')}}</div>
		</v-ons-toolbar>
		<v-ons-list>
			<v-ons-list-item tappable modifier="nodivider" v-on:click="push(pages['0'].component, $t('message.settingsAddressBook'))">
				<div class="left">
					<v-ons-icon icon="ion-ios-contacts" class="list-item__icon"></v-ons-icon>
				</div>
				<div class="center">
					{{$t('message.settingsAddressBook')}}
				</div>
			</v-ons-list-item>
			<v-ons-list-item tappable modifier="nodivider" v-on:click="push(pages['1'].component, $t('message.settingsHelp'))">
				<div class="left">
					<v-ons-icon icon="ion-ios-help-buoy" class="list-item__icon"></v-ons-icon>
				</div>
				<div class="center">
					{{$t('message.settingsHelp')}}
				</div>
			</v-ons-list-item>
			<v-ons-list-header>{{$t('message.settingsPreferences')}}</v-ons-list-header>
			<v-ons-list-item tappable modifier="nodivider" v-on:click="push(pages['2'].component, $t('message.settingsLanguage'))">
				<div class="left">
					<v-ons-icon icon="ion-ios-globe" class="list-item__icon"></v-ons-icon>
				</div>
				<div class="center">
					<span class="list-item__title">{{$t('message.settingsLanguage')}}</span>
					<span class="list-item__subtitle">
						{{config.language.name}}
					</span>
				</div>
			</v-ons-list-item>
			<v-ons-list-item tappable modifier="nodivider" v-on:click="push(pages['3'].component, $t('message.settingsAlternativeCurrency'))">
				<div class="left">
					<v-ons-icon icon="ion-ios-cash" class="list-item__icon"></v-ons-icon>
				</div>
				<div class="center">
					{{$t('message.settingsAlternativeCurrency')}}
					<span class="list-item__subtitle">
						{{config.currency.symbol}}
					</span>
				</div>
			</v-ons-list-item>
			<v-ons-list-header>{{$t('message.settingsMessage')}}</v-ons-list-header>
			<v-ons-list-item tappable modifier="nodivider" v-on:click="push(pages['4'].component, $t('message.settingsSign'))">
				<div class="left">
					<v-ons-icon icon="ion-ios-create" class="list-item__icon"></v-ons-icon>
				</div>
				<div class="center">
					{{$t('message.settingsSign')}}
				</div>
			</v-ons-list-item>
			<v-ons-list-item tappable modifier="nodivider" v-on:click="push(pages['5'].component, $t('message.settingsVerify'))">
				<div class="left">
					<v-ons-icon icon="ion-ios-checkmark-circle-outline" class="list-item__icon"></v-ons-icon>
				</div>
				<div class="center">
					{{$t('message.settingsVerify')}}
				</div>
			</v-ons-list-item>
			<v-ons-list-header>{{$t('message.settingsOther')}}</v-ons-list-header>
			<v-ons-list-item tappable modifier="nodivider" v-on:click="push(pages['6'].component, $t('message.settingsAbout'))">
				<div class="left">
					<v-ons-icon icon="ion-ios-help-circle-outline" class="list-item__icon"></v-ons-icon>
				</div>
				<div class="center">
					{{$t('message.settingsAbout')}}
				</div>
			</v-ons-list-item>
			<v-ons-list-item tappable modifier="nodivider" v-on:click="push(pages['7'].component, $t('message.settingsTermsOfUse'))">
				<div class="left">
					<v-ons-icon icon="ion-ios-information-circle-outline" class="list-item__icon"></v-ons-icon>
				</div>
				<div class="center">
					{{$t('message.settingsTermsOfUse')}}
				</div>
			</v-ons-list-item>
			<v-ons-list-item tappable modifier="nodivider" v-on:click="push(pages['8'].component, $t('message.settingsShare'))">
				<div class="left">
					<v-ons-icon icon="ion-md-share" class="list-item__icon"></v-ons-icon>
				</div>
				<div class="center">
					{{$t('message.settingsShare')}}
				</div>
			</v-ons-list-item>
			<v-ons-list-header></v-ons-list-header>
			<v-ons-list-item>
				<div class="left">
					<v-ons-icon icon="ion-ios-unlock" class="list-item__icon"></v-ons-icon>
				</div>
				<div class="center">
					{{$t('message.lockWalletIfAppGoesBackground')}}
				</div>
				<div class="right">
					<v-ons-switch v-model="bLockWalletOnDeactivate" v-on:click="$store.commit('config/setLockWalletOnDeactivate',bLockWalletOnDeactivate);"></v-ons-switch>
				</div>
			</v-ons-list-item>
			<v-ons-list-header></v-ons-list-header>
			<v-ons-list-item tappable modifier="nodivider" v-on:click="push(pages['10'].component, $t('message.settingsSweepPrivateKey'))">
				<div class="left">
					<v-ons-icon icon="ion-md-flash" class="list-item__icon"></v-ons-icon>
				</div>
				<div class="center">
					{{$t('message.settingsSweepPrivateKey')}}
				</div>
			</v-ons-list-item>
			<v-ons-list-item tappable modifier="nodivider" v-on:click="backupWallet()">
				<div class="left">
					<v-ons-icon icon="ion-ios-key" class="list-item__icon"></v-ons-icon>
				</div>
				<div class="center">
					{{$t('message.settingsBackupWallet')}}
				</div>
			</v-ons-list-item>
			<v-ons-list-item tappable modifier="nodivider" v-on:click="zapWallet()">
				<div class="left">
					<v-ons-icon icon="ion-md-sync" class="list-item__icon"></v-ons-icon>
				</div>
				<div class="center">
					{{$t('message.settingsZapWallet')}}
				</div>
			</v-ons-list-item>
			<v-ons-list-item tappable modifier="nodivider" v-on:click="deleteWallet()">
				<div class="left">
					<v-ons-icon icon="ion-md-trash" class="list-item__icon"></v-ons-icon>
				</div>
				<div class="center">
					{{$t('message.settingsRemoveWallet')}}
				</div>
			</v-ons-list-item>
		</v-ons-list>
	</v-ons-page>
</template>
<script>
const crypto=require('crypto');
import AddressBook from './AddressBook.vue';
import Help from './Help.vue';
import Languages from './Languages.vue';
import AlternativeCurrency from './AlternativeCurrency.vue';
import Sign from './Sign.vue';
import Verify from './Verify.vue';
import About from './About.vue';
import SweepPrivateKey from './SweepPrivateKey.vue';
import TermsOfUse from './TermsOfUse.vue';
import Share from './Share.vue';
import BackupWallet from './BackupWallet.vue';
const njs = require('navcoin-js');

export default {
	data ()
	{
		return {
			bLockWalletOnDeactivate:false,
			pages: [
			{
				component: AddressBook,
				label: 'Address Book',
				desc: 'Address Book'
			},
			{
				component: Help,
				label: 'Help',
				desc: 'Help'
			},
			{
				component: Languages,
				label: 'Languages',
				desc: 'Languages'
			},
			{
				component: AlternativeCurrency,
				label: 'Alternative Currency',
				desc: 'Alternative Currency'
			},
			{
				component: Sign,
				label: 'Sign',
				desc: 'Sign'
			},
			{
				component: Verify,
				label: 'Verify',
				desc: 'Verify'
			},
			{
				component: About,
				label: 'About',
				desc: 'About'
			},
			{
				component: TermsOfUse,
				label: 'Terms Of Use',
				desc: 'Terms Of Use'
			},
			{
				component: Share,
				label: 'Share',
				desc: 'Share'
			},
			{
				component: BackupWallet,
				label: 'Backup Wallet',
				desc: 'Backup Wallet'
			},
			{
				component: SweepPrivateKey,
				label: 'Sweep Private Key',
				desc: 'Sweep Private Key'
			},
			]
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
		this.bLockWalletOnDeactivate=this.config.lock_wallet_on_deactivate;
	},
	methods:
	{
		getSetting: function (key)
			{
				return localStorage.getItem(key);
			},
		backupWallet: function ()
		{
			let vm=this;
			vm.$ons.notification.prompt(vm.$t('message.enterYourPassphrase'),{title:vm.$t('message.settingsBackupWallet'),inputType:"password"})
			.then(function(input)
			{
				if (input)
				{
					if (crypto.createHash('md5').update(input).digest("hex")==window.ENCRYPTION_KEY)
					{
						vm.push(vm.pages['9'].component, vm.$t('message.backupWallet'))
					}
					else
					{
						vm.$ons.notification.alert(vm.$t('message.invalidPassword'),{title:vm.$t('message.backupWallet')});
					}
				}
			});
		},
		zapWallet: function ()
		{
			let vm=this;
			vm.$ons.notification.confirm(vm.$t('message.confirmZapWalletMessage'),{title:vm.$t('message.confirmZapWalletTitle'),buttonLabels:[vm.$t('message.confirmZapWalletNo'), vm.$t('message.confirmZapWalletYes')]})
			.then((response) =>
			{
				if (response)
				{
					localStorage.setItem("ZapWallet",true);
					navigator.app.exitApp();
				}
			});
		},
		deleteWallet: function ()
		{
			let vm=this;
			vm.$ons.notification.prompt(vm.$t('message.enterYourPassphrase'),{title:vm.$t('message.settingsRemoveWallet'),inputType:"password"})
			.then(function(input)
			{
				if (input)
				{
					if (crypto.createHash('md5').update(input).digest("hex")==window.ENCRYPTION_KEY)
					{
						localStorage.clear();
						njs.wallet.WalletFile.RemoveWallet("wallet.db").then(() =>
						{
							console.log("Wallet removed.");
						});
						vm.$ons.notification.toast(vm.$t('message.walletRemoved'), { timeout: 3000, animation: 'fall' });
						navigator.app.exitApp();
					}
					else
					{
						vm.$ons.notification.alert(vm.$t('message.invalidPassword'),{title:vm.$t('message.settingsRemoveWallet')});
					}
				}
			});
		},
		push(page, key)
		{
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
