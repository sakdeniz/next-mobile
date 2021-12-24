<template id="main">
	<v-ons-page>
		<v-ons-modal :visible="modalVisible" @click="modalVisible = false">
			<p style="text-align: center">
				{{$t('message.pleaseWait')}} <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
			</p>
		</v-ons-modal>
		<v-ons-toolbar modifier="transparent">
			<div class="center">
				<v-ons-segment :index.sync="segmentIndex" style="width:100%">
					<button>{{$t('message.availableNFTs')}}</button>
					<button>{{$t('message.createNFT')}}</button>
					<button>{{$t('message.mintNFT')}}</button>
				</v-ons-segment>
			</div>
		</v-ons-toolbar>
		<v-ons-card v-show="segmentIndex==0">
			<div class="center" style="margin-top:20px">
				<center>
					<img src="images/nft.png" style="width:64px;height:auto;">
				</center>
			</div>
			<v-ons-list v-if="config.Balance && Object.keys(config.Balance.nfts).length>0">
				<v-ons-list-item expandable :expanded.sync="item.isExpanded" v-for="(item,index) in config.Balance.nfts">
					<img src="images/nft2.png" style="width:32px;height:auto;margin-right:10px;"><b>{{item.name}}</b>
					<div class="expandable-content">
						<div>{{$t('message.nftName')}} : {{item.name}}</div>
						<div>{{$t('message.nftMaxSupply')}} : {{formatBalance(item.supply)}}</div>
						<h3>{{$t('message.nftScheme')}}</h3>
						<code style="width:300px">{{item.scheme}}</code>
						<h3>{{$t('message.mintedNFTs')}} ({{Object.keys(item.confirmed).length}})</h3>
						<v-ons-list v-if="item.confirmed && Object.keys(item.confirmed).length>0">
							<v-ons-list-item v-for="(item2,index) in item.confirmed">
								<div class="center">
									<img src="images/file.png" style="width:32px;height:auto;margin-right:10px;">NFT ID : {{index}}
									<code style="width:300px">{{item2}}</code>
								</div>
							</v-ons-list-item>
						</v-ons-list>
					</div>
				</v-ons-list-item>
			</v-ons-list>
			<div v-else>
				<p>
					<small>{{$t('message.noPrivateTokenAvailable')}}</small>
				</p>
				<v-ons-button v-on:click="segmentIndex=1">{{$t('message.btnCreateNewToken')}}</v-ons-button>
			</div>
		</v-ons-card>
		<v-ons-card v-show="segmentIndex==1">
			<div class="center" style="margin-top:20px">
				<center>
					<img src="images/nft3.png" style="width:64px;height:auto;">
				</center>
			</div>
			<div class="center" style="margin-top:20px">
				<p>
					<small>{{$t('message.createNFTInfo')}}</small>
				</p>
			</div>
			<div class="center" style="margin-top:20px;margin-bottom:20px;">
				<small>{{$t('message.validFileFormatsCollection')}}</small>
			</div>
			<label class="custom-file-upload">
				<input type="file" ref="doc" @change="readFile()" />
				 <i class="ion-ios-filing"></i>&nbsp;{{$t('message.chooseFile')}}
			</label>
			<div style="margin-top:15px;">
				<v-ons-button :disabled="!uploadEnabled" v-on:click="addFile"><i class="fa fa-cloud-upload"></i>&nbsp;{{$t('message.uploadFileToIPFS')}}</v-ons-button>
			</div>
			<div style="margin-top:15px;" v-show="uploadSuccess">
				<img style="width:100%;height:auto" :src="url"/>
				<a :href="url">{{url}}</a>
			</div>
			<div class="center" style="margin-top:40px">
				<v-ons-input :placeholder="$t('message.nftName')" type="text" class="form-control" style="width:100%;" v-model="name"/>
			</div>
			<div class="center" style="margin-top:40px">
				<v-ons-input :placeholder="$t('message.nftScheme')" type="text" class="form-control" style="width:100%;" v-model="scheme"/>
			</div>
			<div class="center" style="margin-top:40px">
				<v-ons-input :placeholder="$t('message.nftMaxSupply')" type="number" class="form-control" style="width:100%;" v-model="max_supply" float/>
			</div>
			<div class="center" style="margin-top:40px">
				<v-ons-button v-on:click='createNFT' :disabled="!name || !scheme || !max_supply"><i class="ion-ios-color-wand"></i>&nbsp;{{$t('message.btnCreateNFT')}}</v-ons-button>
			</div>
		</v-ons-card>
		<v-ons-card v-show="segmentIndex==2">
			<div class="center" style="margin-top:20px">
				<center>
					<img src="images/nft_mint.png" style="width:64px;height:auto;">
				</center>
			</div>
			<div class="center" style="margin-top:20px">
				<p>
					<small>{{$t('message.mintNFTInfo')}}</small>
				</p>
			</div>
			<div class="center" style="margin-top:20px;margin-bottom:20px;">
				<small>{{$t('message.validFileFormatsNFT')}}</small>
			</div>
			<label class="custom-file-upload">
				<input type="file" ref="doc_nft" @change="readNFTFile()" />
				 <i class="ion-ios-filing"></i>&nbsp;{{$t('message.chooseNFTFile')}}
			</label>
			<div style="margin-top:15px;">
				<v-ons-button :disabled="!uploadNFTEnabled" v-on:click="addNFTFile"><i class="fa fa-cloud-upload"></i>&nbsp;{{$t('message.uploadNFTFileToIPFS')}}</v-ons-button>
			</div>
			<div style="margin-top:15px;" v-show="uploadSuccess">
				<img style="width:100%;height:auto" :src="nftFileUrl"/>
				<a :href="nftFileUrl">{{nftFileUrl}}</a>
			</div>
			<div class="center" style="margin-top:40px">
				<v-ons-select style="width: 100%" v-model="mint_nft_token_id">
					<option v-bind:value="item.id" v-for="(item,index) in config.privateTokens.filter(item => item.version==1)">{{item.name}}</option>
				</v-ons-select>
			</div>
			<div class="center" style="margin-top:40px">
				<v-ons-input :placeholder="$t('message.mintNFTDestination')" type="text" class="form-control" style="width:100%;" v-bind:value="config.private_address" v-model="mint_nft_destination"/>
			</div>
			<div class="center" style="margin-top:40px">
				<v-ons-input :placeholder="$t('message.mintNFTID')" type="number" class="form-control" style="width:100%;" v-model="mint_nft_id" float/>
			</div>
			<div class="center" style="margin-top:40px">
				<v-ons-input :placeholder="$t('message.mintNFTScheme')" type="text" class="form-control" style="width:100%;" v-model="mint_nft_scheme"/>
			</div>
			<div class="center" style="margin-top:40px">
				<v-ons-button v-on:click='mintNFT' :disabled="!mint_nft_id || !mint_nft_destination || !mint_nft_scheme"><i class="ion-ios-hammer"></i>&nbsp;{{$t('message.btnMintNFT')}}</v-ons-button>
			</div>
		</v-ons-card>
	</v-ons-page>
</template>
<style>
input[type="file"]
{
	display: none;
}
.custom-file-upload
{
	border: 1px solid #ccc;
	display: inline-block;
	padding: 6px 12px;
	cursor: pointer;
}
</style>
<script>
import Vue from "vue";
import axios from 'axios';
import sb from 'satoshi-bitcoin';
import {
  mapState,
  mapActions
} from "vuex";

export default {
	data()
	{
		return {
			file:"",
			nftFile:"",
			uploadEnabled:false,
			uploadNFTEnabled:false,
			uploadSuccess:false,
			uploadNFTSuccess:false,
			url:"",
			nftFileUrl:"",
			modalVisible:false,
			segmentIndex: 0,
			name:'',
			scheme:'',
			nft_scheme:'',
			max_supply: "",
			mint_nft_token_id:'',
			mint_nft_id:'',
			mint_nft_scheme:'',
			mint_nft_destination:'',
		};
	},
	computed:
	{
		...mapState({
			config: state => state.config,
			privateTokens: state => state.privateTokens,
		})
	},
	updated : function()
	{
		this.mint_nft_destination=this.config.private_address;
	},
	methods:
	{
		formatBalance: n =>
		{
			if (n==0) return n;
			if (n)
			{
				var amount=sb.toBitcoin(n);
				var parts=amount.toString().split(".");
				return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
			}
			else
			{
				return "";
			}
		},
		createNFT: function()
		{
			console.log(this.name);
			console.log(this.scheme);
			console.log(this.max_supply);
			let vm=this;
			console.log("Creating transaction...");
			wallet.CreateNft(this.name,this.scheme,this.max_supply*1e8).then(function (response)
			{
				console.log(response);
				if (response.tx)
				{
					vm.$ons.notification.confirm(vm.$t('message.createNFTConfirmRequiredFree')+sb.toBitcoin(response.fee)+" xNAV<br/><br/>" + vm.$t('message.createNFTConfirmQuestion'),{title:vm.$t('message.createNFTConfirmTitle'),buttonLabels:[vm.$t('message.createNFTConfirmNo'), vm.$t('message.createNFTConfirmYes')]})
					.then((confirm) =>
					{
						if (confirm)
						{
							vm.modalVisible=true;
							console.log("Submitting transaction...");
							wallet.SendTransaction(response.tx).then(function (response)
							{
								console.log(response);
								vm.modalVisible=false;
								//response.hashes[0]
								vm.$ons.notification.alert(vm.$t('message.createNFTSuccess'),{title:vm.$t('message.createNFT')});
							}).
							catch((e) =>
							{
								vm.modalVisible=false;
								vm.$ons.notification.alert(vm.$t('message.createNFTFailed')+"<br/><br/>"+e.message,{title:vm.$t('message.createNFT')});
							});
						}
					});
				}
			})
			.catch((e) =>
			{
				vm.$ons.notification.alert(e.message,{title:vm.$t('message.createNFT')});
			});
		},
		mintNFT: function()
		{
			console.log(this.mint_nft_token_id);
			console.log(this.mint_nft_id);
			console.log(this.mint_nft_destination);
			console.log(this.mint_nft_scheme);
			console.log("Minting nft...");
			let vm=this;
			wallet.MintNft(this.mint_nft_token_id, this.mint_nft_id, this.mint_nft_destination, this.mint_nft_scheme).then(function (response)
			{
				console.log(response);
				if (response.tx)
				{
					vm.$ons.notification.confirm(vm.$t('message.mintNFTConfirmRequiredFree')+sb.toBitcoin(response.fee)+" xNAV<br/><br/>" + vm.$t('message.mintNFTConfirmQuestion'),{title:vm.$t('message.mintNFTConfirmTitle'),buttonLabels:[vm.$t('message.mintNFTConfirmNo'), vm.$t('message.mintNFTConfirmYes')]})
					.then((confirm) =>
					{
						if (confirm)
						{
							vm.modalVisible=true;
							console.log("Submitting transaction...");
							wallet.SendTransaction(response.tx).then(function (response)
							{
								vm.modalVisible=false;
								if (response.error)
								{
									console.log(response.error);
									console.log(response.hashes[0]);
									vm.$ons.notification.alert(response.error,{title:vm.$t('message.mintNFT')});
								}
								else
								{
									vm.$ons.notification.alert(vm.$t('message.mintNFTSuccess'),{title:vm.$t('message.mintNFT')});
								}
							}).
							catch((e) =>
							{
								vm.modalVisible=false;
								vm.$ons.notification.alert(vm.$t('message.mintNFTFailed')+"<br/><br/>"+e.message,{title:vm.$t('message.mintNFT')});
							});
						}
					});
				}
			})
			.catch((e) =>
			{
				console.log(e);
				vm.$ons.notification.alert(e.message,{title:vm.$t('message.mintNFT')});
			});
		},
		addFile: function()
		{
			let vm=this;
			let formData = new FormData();
			formData.append('file', this.$refs.doc.files[0]);
			axios.post('https://ipfs.nextwallet.org/add.php',formData,{headers:{'Content-Type':'multipart/form-data'}}).then(function(response)
			{
				if (response.data.success)
				{
					vm.uploadSuccess=true;
					vm.url=response.data.url+response.data.cid;
					console.log("Success!");
					console.log("URL:"+response.data.url);
					console.log("CID:"+response.data.cid);
					vm.scheme="{'resource':'"+response.data.url+response.data.cid+"'}";
				}
				else
				{
					console.log("Failed!");
					console.log("Reason:"+response.data.message);
				}
			})
			.catch(function()
			{
				console.log("Failed!");
			});
		},
		readFile: function()
		{
			const reader = new FileReader();
			let f=this.$refs.doc.files[0];
			console.log(f.name);
			console.log(f);
			if (
				f.name.includes(".jpg")
				||f.name.includes(".jpeg")
				||f.name.includes(".png")
				||f.name.includes(".gif")
			)
			{
				console.log("Image file selected.");
				this.file = this.$refs.doc.files[0];
				this.uploadEnabled=true;
				reader.onload = (res) =>
				{
					//console.log(res.target.result);
				};
				reader.onerror = (err) => console.log(err);
				reader.readAsText(this.$refs.doc.files[0]);
			}
			else
			{
				console.log("Unsupported file type.");
				vm.$ons.notification.alert("Unsupported file type.",{title:"Error"});
			}
		},
		addNFTFile: function()
		{
			let vm=this;
			let formData = new FormData();
			formData.append('file', this.$refs.doc_nft.files[0]);
			let ext=this.$refs.doc_nft.files[0].name.split('.').pop();
			axios.post('https://ipfs.nextwallet.org/add.php',formData,{headers:{'Content-Type':'multipart/form-data'}}).then(function(response)
			{
				if (response.data.success)
				{
					vm.uploadNFTSuccess=true;
					vm.nftFileUrl=response.data.url+response.data.cid;
					console.log("Success!");
					console.log("URL:"+response.data.url);
					console.log("CID:"+response.data.cid);
					console.log("Extension :" + ext);
					let type=null;
					switch(ext) {
					  case "gif":
					    type="image/gif";
					    break;
					  case "jpg":
					    type="image/jpeg";
					    break;
					  case "jpeg":
					    type="image/jpeg";
					    break;
					  case "webp":
					    type="image/webp";
					    break;
					  case "svg":
					    type="image/svg";
					    break;
					  case "webp":
					    type="image/webp";
					    break;
					  case "wav":
					    type="audio/wav";
					    break;
					  case "ogg":
					    type="audio/ogg";
					    break;
					  case "mp3":
					    type="audio/mp3";
					    break;
					  case "webm":
					    type="video/webm";
					    break;
					  case "mp4":
					    type="video/mp4";
					    break;
					  default:
					    type="undefined";
					}
					console.log("Mime type : " + type);
					vm.mint_nft_scheme="{'resource':'"+response.data.url+response.data.cid+"'}";
				}
				else
				{
					console.log("Failed!");
					console.log("Reason:"+response.data.message);
				}
			})
			.catch(function()
			{
				console.log("Failed!");
			});
		},
		readNFTFile: function()
		{
			const reader = new FileReader();
			let f=this.$refs.doc_nft.files[0];
			console.log(f.name);
			console.log(f);
			let ext=f.name.split('.').pop();
			console.log(ext);
			if (
				ext.includes("gif")
				||ext.includes("jpg")
				||ext.includes("jpeg")
				||ext.includes("png")
				||ext.includes("svg")
				||ext.includes("webp")
				||ext.includes("wav")
				||ext.includes("ogg")
				||ext.includes("mp3")
				||ext.includes("webm")
				||ext.includes("mp4")
			)
			{
				console.log("NFT file selected.");
				this.nftFile = this.$refs.doc_nft.files[0];
				this.uploadNFTEnabled=true;
				reader.onload = (res) =>
				{
					//console.log(res.target.result);
				};
				reader.onerror = (err) => console.log(err);
				reader.readAsText(this.$refs.doc_nft.files[0]);
			}
			else
			{
				console.log("Unsupported file type for your NFT.");
				vm.$ons.notification.alert("Unsupported file type for your NFT.",{title:"Error"});
			}
		}
	}
}
</script>