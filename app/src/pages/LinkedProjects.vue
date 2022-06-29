<template>
	<v-ons-page>
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-alert-dialog modifier="rowfooter" :visible.sync="isVisible">
			<span slot="title">{{$t('message.deleteLinkedProject')}}</span>
			{{$t('message.confirmDeleteLinkedProject')}}
			<template slot="footer">
				<v-ons-alert-dialog-button v-on:click="isVisible = false">{{$t('message.btnCancel')}}</v-ons-alert-dialog-button>
				<v-ons-alert-dialog-button v-on:click="del()">{{$t('message.btnUnlink')}}</v-ons-alert-dialog-button>
			</template>
		</v-ons-alert-dialog>
		<v-ons-card v-show="total>0">
			<div class="content">
				<div v-if="total!=completed">
					<v-ons-progress-circular indeterminate></v-ons-progress-circular>
					Verifying <b>{{total}}</b> NFTs...
				</div>
				<div v-if="verified" style="color:green"><span class="ion-md-checkmark"></span> {{verified}} NFTs successfully verified.</div>
				<div v-if="already_verified"  style="color:orange"><span class="ion-md-checkmark"></span> {{already_verified}} NFTs already verified.</div>
				<div v-if="failed"  style="color:red"><span class="ion-md-close"></span> {{failed}} NFTs verification failed.</div>
			</div>
		</v-ons-card>
		<v-ons-card>
			<div class="content">
				<v-ons-fab position="bottom right" modifier="mini" v-on:click="push(pages[0].component, $t('message.linkProject'))">
					<v-ons-icon icon="md-plus"></v-ons-icon>
				</v-ons-fab>
				<v-ons-list v-if="config.projects.length>0">
					<v-ons-list-item v-for="project,index in config.projects" tappable modifier="nodivider">
						<div class="center">
							<span class="list-item__subtitle">Project Name : {{project.name}}</span>
							<span class="list-item__subtitle">Project ID : {{project.id}}</span>
							<span class="list-item__subtitle">Code : {{project.link_code}}</span>
							<span class="list-item__subtitle" style="margin-top:15px;">
								<v-ons-button v-on:click="syncNFTs(index)"><i class="ion-ios-checkmark-circle-outline"></i>&nbsp;Sync NFts</v-ons-button>
								<v-ons-button style="float:right" v-on:click="deleteConfirm(index)"><i class="ion-md-trash"></i>&nbsp;Unlink Project</v-ons-button>
							</span>
						</div>
					</v-ons-list-item>
				</v-ons-list>
				<p v-else>
					{{$t('message.noLinkedProjectFound')}}
				</p>
			</div>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
import axios from 'axios';
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
			total:0,
			completed:0,
			verified:0,
			already_verified:0,
			failed:0,
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
		syncNFTs:function(project_index)
		{
			let vm=this;
			console.log("Syncing NFTs...");
			vm.total=0;
			vm.completed=0;
			vm.verified=0;
			vm.already_verified=0;
			vm.failed=0;
			wallet.GetBalance().then((v) =>
			{
				if (Object.keys(v.nfts).length==0)
				{
					vm.$ons.notification.alert(vm.$t('message.noNFTFound'),{title:vm.$t('message.proofNFT')});
					return;
				}
				console.log(Object.keys(v.nfts).length + " NFT collection found...");
				for (const [tokenId, value] of Object.entries(v.nfts))
				{
					//console.log(tokenId);
					//console.log(value);
					console.log(Object.keys(value.confirmed).length + " NFT found...");
					for (const [nftId, scheme] of Object.entries(value.confirmed))
					{
						//console.log(scheme);
						console.log("Creating proof for NFT -> "+ nftId);
						vm.total++;
						wallet.CreateNftProof(tokenId,parseInt(nftId),undefined).then((p) =>
						{
							//console.log(p);
							let hex=Buffer.from(p.sig).toString('hex');
							//console.log(hex);
							//console.log(Buffer.from(hex, 'hex'));
							let proof={nftId:nftId,tokenId:tokenId,sig:Buffer.from(hex,'hex')};
							console.log("Creating proof...");
							console.log(proof);
							console.log("Verifying proof...");
							wallet.VerifyNftProof(tokenId,parseInt(nftId),proof).then((v) =>
							{
								console.log(nftId);
								console.log(v);
								axios.post(vm.$store.state.config.api_url+'CreateNftProof',
									{
										"project_id":vm.config.projects[project_index].id,
										"link_code":vm.config.projects[project_index].link_code,
										"private_address":vm.config.private_address,
										"proof":proof
									},config).then(function(retval)
								{
									vm.completed++;
									if (retval.data.status=="verified")
									{
										vm.verified++;
									}
									else if (retval.data.status=="already_verified")
									{
										vm.already_verified++;
									}
									else if (retval.data.status=="failed")
									{
										vm.failed++;
									}
									console.log(retval.data);
								}).
								catch(function(err)
								{
									console.log(err);
								})
							}).
							catch((e) =>
							{
								console.log("Error while verifying nft proof -> " + e.message);
								vm.$ons.notification.alert(vm.$t('message.nftVerifyError')+"<br/><br/>"+e.message,{title:vm.$t('message.proofNFT')});
							});
						}).
						catch((e) =>
						{
							console.log("Error while creating nft proof -> " + e.message);
							vm.$ons.notification.alert(vm.$t('message.nftProofError')+"<br/><br/>"+e.message,{title:vm.$t('message.proofNFT')});
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