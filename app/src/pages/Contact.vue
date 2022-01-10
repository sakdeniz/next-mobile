<template>
	<v-ons-page id="page-add-contact">
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-card>
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
</template>
<script>
export default {
  data() {
    return {
    contactName:'',
    contactEMail:'',
    contactAddress:'',
    index:'',
    update:false
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
		if (typeof(QRScanner) != "undefined")
		{
			let vm=this;
			$("#page-add-contact").hide();
			QRScanner.scan(displayContents);
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
			    	$("#page-add-contact").show();
			  	}
			}
			QRScanner.show();
		}
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