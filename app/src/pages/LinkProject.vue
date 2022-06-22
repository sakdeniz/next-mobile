<template>
	<v-ons-page id="page-add-project">
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-card>
			<div class="content">
				<div class="center" style="margin-top:20px">
					<v-ons-input :placeholder="$t('message.projectLinkCode')" float type="text" v-model="link_code" style="width:100%"></v-ons-input>
				</div>
				<div class="center" style="margin-top:20px">
					<v-ons-input :placeholder="$t('message.projectID')" float type="number" v-model="id" style="width:100%"></v-ons-input>
				</div>
				<div class="center" style="margin-top:20px">
					<v-ons-button v-on:click="scan()"><i class="ion-ios-qr-scanner"></i>&nbsp;{{$t('message.scanLinkCode')}}</v-ons-button>
					<v-ons-button v-on:click="addProject()"><i class="ion-ios-color-wand"></i>&nbsp;{{$t('message.linkProject')}}</v-ons-button>
				</div>
			</div>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
export default
{
	data() {
		return {
			toolbarInfo:
			{
				backLabel: 'Home',
				title: "Link Project",
			},
			link_code:'',
			id:'',
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
				$("#page-add-project").hide();
				QRScanner.scan(displayContents);
				function displayContents(err, text)
				{
					if(err)
					{
						// an error occurred, or the scan was canceled (error code `6`)
					}
					else
					{
						vm.id=text.split(":")[0];
						vm.link_code=text.split(":")[1];
						QRScanner.cancelScan(function(status)
						{
						});
						$("#page-add-project").show();
					}
				}
				QRScanner.show();
			}
		},
		addProject()
		{
			{
				this.$store.commit('config/addProject', {id: this.id,link_code:this.link_code})
			}
			this.$store.commit('navigator/pop');
		}
	}
};
</script>