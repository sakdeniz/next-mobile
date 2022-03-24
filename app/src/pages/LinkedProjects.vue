<template>
	<v-ons-page>
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-alert-dialog modifier="rowfooter" :visible.sync="isVisible">
			<span slot="title">{{$t('message.deleteContact')}}</span>
			{{$t('message.confirmDeleteContact')}}
			<template slot="footer">
				<v-ons-alert-dialog-button v-on:click="isVisible = false">{{$t('message.btnCancel')}}</v-ons-alert-dialog-button>
				<v-ons-alert-dialog-button v-on:click="del()">{{$t('message.btnDelete')}}</v-ons-alert-dialog-button>
			</template>
		</v-ons-alert-dialog>
		<v-ons-card>
			<v-ons-fab position="bottom right" modifier="mini" v-on:click="push(pages[0].component, $t('message.linkProject'))">
				<v-ons-icon icon="md-plus"></v-ons-icon>
			</v-ons-fab>
			<v-ons-list v-if="config.projects.length>0">
				<v-ons-list-item v-for="project,index in config.projects"  tappable modifier="nodivider">
					<div class="left">
						<v-ons-button modifier="outline" v-on:click="syncNFTs(index)"><i class="ion-ios-checkmark-circle-outline"></i></v-ons-button>
						<v-ons-button modifier="outline" v-on:click="deleteConfirm(index)"><i class="ion-md-trash"></i></v-ons-button>
					</div>
					<div class="center">
						<span class="list-item__subtitle">Project ID : {{project.id}}</span>
					</div>
				</v-ons-list-item>
			</v-ons-list>
			<p v-else>
				{{$t('message.noLinkedProjectFound')}}
			</p>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
import LinkProject from './LinkProject.vue';
export default {
	data()
	{
		return {
			toolbarInfo:
			{
				backLabel: 'Home',
				title: "Linked Projects",
			},
			isVisible:false,
			id:'',
			pages:[
			{
				component: LinkProject,
				label: 'LinkProject',
				desc: 'LinkProject'
			}]
		};
	},
	created: function ()
	{
	},
	computed:
	{
		config()
		{
			return this.$store.state.config;
		}
	},
	methods:
	{
		deleteConfirm:function(id)
		{
			this.id=id;
			this.isVisible=true;
		},
		del:function()
		{
			this.isVisible=false;
			this.$store.commit('config/removeProject', this.id);
		},
		syncNFTs:function()
		{
			wallet.GetBalance().then((v) =>
			{
				for (const [tokenId, value] of Object.entries(v.nfts))
				{
					//console.log(tokenId);
					//console.log(value);
					for (const [nftId, scheme] of Object.entries(value.confirmed))
					{
						//console.log(nftId);
						//console.log(scheme);
						wallet.CreateNftProof(tokenId,parseInt(nftId),undefined).then((result) =>
						{
							//console.log(result);
							let hex=Buffer.from(result.sig).toString('hex');
							//console.log(hex);
							//console.log(Buffer.from(hex, 'hex'));
							let proof={nftId:nftId,tokenId:tokenId,sig:Buffer.from(hex,'hex')};
							console.log(proof);
							wallet.VerifyNftProof(tokenId,parseInt(nftId),proof).then((result) =>
							{
								console.log(nftId);
								console.log(result);
							});
						});
					}
				}
			});
		},
		push(page, key)
		{
			this.$store.commit('navigator/push',{
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