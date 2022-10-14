<template>
	<v-ons-page v-if="!scanning">
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-card >
			<div class="content">
				<div class="center" style="margin-top:20px">
					<v-ons-input :placeholder="$t('message.contactName')" float type="text" v-model="contactName" style="width:100%"></v-ons-input>
				</div>
				<div class="center" style="margin-top:20px">
					<v-ons-input :placeholder="$t('message.contactEmail')" float type="text" v-model="contactEMail" style="width:100%"></v-ons-input>
				</div>
				<div class="center" style="margin-top:20px">
					<v-ons-input :placeholder="$t('message.contactAddress')" float type="text" v-model="contactAddress" style="width:100%"></v-ons-input>
				</div>
				<div class="center" style="margin-top:20px">
					<v-ons-button v-on:click="addContact()"><i class="ion-ios-checkmark"></i>&nbsp;{{(update?$t('message.updateContact'):$t('message.addContact'))}}</v-ons-button>
				</div>
				<div class="center" style="margin-top:20px">
					<v-ons-button v-on:click="scan()"><i class="ion-ios-qr-scanner"></i>&nbsp;{{$t('message.scan')}}</v-ons-button>
				</div>
			</div>
		</v-ons-card>
	</v-ons-page>
	<v-ons-fab v-else id="cancel-scan" position="bottom right" v-on:click="cancelScan()">
		<v-ons-icon icon="md-close"></v-ons-icon>
	</v-ons-fab>
</template>
<script>
function onDone(err, status)
{
	console.log("STATUS:"+JSON.stringify(status));
	console.log("err:"+err);
	if (err)
	{
		alert(JSON.stringify(err._message));
	}
	if (status.authorized)
	{
	}
	else if (status.denied)
	{
		alert("Camera access denied");
	}
	else
	{
	}
}
export default
{
	data() {
		return {
			toolbarInfo:
			{
				backLabel: 'Home',
				title: "Add Contact",
			},
			contactName:'',
			contactEMail:'',
			contactAddress:'',
			index:'',
			update:false,
			scanning: false
		};
	},
	computed:
	{
		config()
		{
			return this.$store.state.config;
		}
	},
	methods: {
		scan()
		{
			QRScanner.prepare(onDone);
			if (typeof(QRScanner) != "undefined")
			{
				let vm=this;
				QRScanner.scan(displayContents);
				vm.scanning=true;
				function displayContents(err, text)
				{
					if(err)
					{
						// an error occurred, or the scan was canceled (error code `6`)
					}
					else
					{
						if (text.startsWith("navcoin:"))
						{
							vm.contactAddress=text.split(":")[1];
						}
						QRScanner.cancelScan(function(status)
						{
						});
						vm.scanning=false;
					}
				}
				QRScanner.show();
			}
		},
		cancelScan()
		{
			console.log("cancelling scan...");
			QRScanner.cancelScan(function(status)
			{
			});
			this.scanning=false;
		},
		addContact()
		{
			if (!this.contactName)
			{
				vm.$ons.notification.toast(vm.$t('message.addContactMissingName'), { timeout: 2000, animation: 'fall' });
				return;
			}
			if (!this.contactAddress)
			{
				vm.$ons.notification.toast(vm.$t('message.addContactMissingAddress'), { timeout: 2000, animation: 'fall' });
				return;
			}
			if (this.update)
			{
				this.$store.commit('config/updateContact', {id:this.index,name: this.contactName,email: this.contactEMail,address: this.contactAddress})
			}
			else
			{
				this.$store.commit('config/addContact', {name: this.contactName,email: this.contactEMail,address: this.contactAddress})
			}
			this.$store.commit('navigator/pop');
		}
	}
};
</script>