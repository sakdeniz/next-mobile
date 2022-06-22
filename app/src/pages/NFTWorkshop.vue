<template id="main">
	<v-ons-page>
		<custom-toolbar v-bind="toolbarInfo"></custom-toolbar>
		<v-ons-modal :visible="modalVisible" @click="modalVisible = false">
			<p style="text-align: center">
				{{$t('message.pleaseWait')}} <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
			</p>
		</v-ons-modal>
		<div class="center" style="margin-top:20px;">
			<v-ons-segment :index.sync="segmentIndex" style="width:100%">
				<button>{{$t('message.availableNFTs')}}</button>
				<button>{{$t('message.createNFT')}}</button>
				<button>{{$t('message.mintNFT')}}</button>
				<button>{{$t('message.sendNFT')}}</button>
			</v-ons-segment>
		</div>
		<v-ons-card v-show="segmentIndex==0">
			<div class="content">
				<div class="center" style="margin-top:20px">
					<center>
						<img src="images/nft.png" style="width:64px;height:auto;">
					</center>
				</div>
				<div class="center" style="margin-top:20px;margin-bottom:20px;">
					<v-ons-segment :index.sync="segmentIndexSub" style="width:100%">
						<button>{{$t('message.NFTBrowse')}}</button>
						<button>{{$t('message.NFTInspect')}}</button>
					</v-ons-segment>
				</div>
				<v-ons-list v-if="segmentIndexSub==0 && config.Balance && Object.keys(config.Balance.nfts).length>0">
					<v-ons-list-item expandable :expanded.sync="item.isExpanded" v-for="(item,index) in config.Balance.nfts" v-if="parseJSON(item.scheme).version==1">
						<img src="images/nft2.png" style="width:32px;height:auto;margin-right:10px;"><b>{{item.name}}</b>
						<div class="expandable-content">
							<div class="left" style="width:25%;float:left;">
								<img class="list-item__thumbnail" style="width:100%;height:auto" :src="ipfsToURL(parseJSON(item.scheme).image)">
							</div>
							<div class="center" style="width:75%;float:right;">
								<div style="margin-left:15px">
									<div class="list-item__subtitle">
										{{parseJSON(item.scheme).description}}
									</div>
									<div class="list-item__subtitle">
										<code>{{index}}</code>
									</div>
									<div class="list-item__subtitle">
										<i class="ion-ios-open"></i>&nbsp;<a target="_blank" :href="parseJSON(item.scheme).external_url">{{parseJSON(item.scheme).external_url}}</a>
									</div>
								</div>
							</div>
							<div style="clear:both"></div>
							<v-ons-list v-if="item.confirmed && Object.keys(item.confirmed).length>0">
								<v-ons-list-header style="margin-top:15px;">NFTs ({{Object.keys(item.confirmed).length}})</v-ons-list-header>
								<v-ons-list-item v-for="(item2,index) in item.confirmed">
									<div class="left">
										<i v-if="parseJSON(item2).attributes.content_type.split('/')[0]=='audio'" class="ion-ios-musical-notes fa-2x"></i>
										<i v-if="parseJSON(item2).attributes.content_type.split('/')[0]=='video'" class="ion-ios-videocam fa-2x"></i>
										<img v-else onerror="this.style.display='none'" class="list-item__thumbnail" :src="ipfsToURL(parseJSON(item2).image)">
									</div>
									<div class="center">
										<div class="list-item__subtitle">
											ID : {{index}}
										</div>
										<span class="list-item__subtitle">
											{{parseJSON(item2).name}}
										</span>
										<span class="list-item__subtitle">
											{{parseJSON(item2).description}}
										</span>
										<!--<span class="list-item__subtitle">
											{{parseJSON(item2).attributes.content_type.split("/")[0]}}
										</span>!-->
										<span class="list-item__subtitle">
											<i class="ion-ios-open"></i>&nbsp;<a target="_blank" :href="parseJSON(item2).external_url">{{parseJSON(item2).external_url}}</a>
										</span>
										<span class="list-item__subtitle" style="margin-top:5px;" v-if="parseJSON(item2).attributes.content_type.split('/')[0]=='audio'">
											<audio controls style="width:100%">
												<source :src="ipfsToURL(parseJSON(item2).image)" type="audio/ogg">
												<source :src="ipfsToURL(parseJSON(item2).image)" type="audio/mpeg">
												Your browser does not support the audio element.
											</audio>
										</span>
										<span class="list-item__subtitle" style="margin-top:5px;" v-if="parseJSON(item2).attributes.content_type.split('/')[0]=='video'">
											<video onplay="this.webkitEnterFullscreen();" controls playsinline style="width:100%">
												<source :src="ipfsToURL(parseJSON(item2).image)" type="video/mp4">
												<source :src="ipfsToURL(parseJSON(item2).image)" type="video/ogg">
												Your browser does not support the audio element.
											</video>
										</span>
									</div>
								</v-ons-list-item>
							</v-ons-list>
						</div>
					</v-ons-list-item>
				</v-ons-list>
				<v-ons-list v-if="segmentIndexSub==1 && config.Balance && Object.keys(config.Balance.nfts).length>0">
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
				<div v-if="config.Balance && !Object.keys(config.Balance.nfts).length>0">
					<p>
						<small>{{$t('message.noNFTCollectionAvailable')}}</small>
					</p>
					<v-ons-button v-on:click="segmentIndex=1">{{$t('message.btnCreateNFT')}}</v-ons-button>
				</div>
			</div>
		</v-ons-card>
		<v-ons-card v-show="segmentIndex==1">
			<div class="content">
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
					<img style="width:100%;height:auto" :src="preview_url"/>
					<a target="_blank" :href="preview_url">{{preview_url}}</a>
				</div>
				<div class="center" style="margin-top:40px">
					{{$t('message.category')}} : <v-ons-select float style="width: 100%" v-model="category">
						<option v-bind:value="item.id" v-for="(item,index) in categories">{{item.name}}</option>
					</v-ons-select>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.nftCollectionName')" float type="text" style="width:100%;" v-model="name"/>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.nftCollectionDescription')" float type="text" style="width:100%;" v-model="description"/>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.nftCollectionExternalURL')" float type="text" style="width:100%;" v-model="external_url"/>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.nftMaxSupply')" float type="number" style="width:100%;" v-model="max_supply"/>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.nftCollectionScheme')" float type="text" style="width:100%;" v-model="scheme"/>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-button v-on:click='createNFT' :disabled="!category || !name || !scheme || !max_supply"><i class="ion-ios-color-wand"></i>&nbsp;{{$t('message.btnCreateNFT')}}</v-ons-button>
				</div>
			</div>
		</v-ons-card>
		<v-ons-card v-show="segmentIndex==2">
			<div class="content">
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
				<div style="margin-top:15px;" v-show="uploadNFTSuccess">
					<img style="width:100%;height:auto" :src="nft_preview_url" onerror="this.style.display='none'"/>
					<a target="_blank" :href="nft_preview_url">{{nft_preview_url}}</a>
				</div>
				<div class="center" style="margin-top:40px">
					{{$t('message.collection')}} : <v-ons-select float style="width: 100%" v-model="mint_nft_token_id">
						<option v-bind:value="item.id" v-for="(item,index) in config.privateTokens.filter(item => item.version==1)">{{item.name}}</option>
					</v-ons-select>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.mintNFTDestination')" float type="text" style="width:100%;" v-model="mint_nft_destination"></v-ons-input>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.mintNFTID')"float  type="number" style="width:100%;" v-model="mint_nft_id" float></v-ons-input>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.nftName')" float type="text" style="width:100%;" v-model="nft_name"></v-ons-input>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.nftDescription')" float type="text" style="width:100%;" v-model="nft_description"></v-ons-input>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.nftExternalURL')" float type="text" style="width:100%;" v-model="nft_external_url"></v-ons-input>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.mintNFTScheme')" float type="text" style="width:100%;" v-model="mint_nft_scheme"></v-ons-input>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-button v-on:click='mintNFT' :disabled="!mint_nft_id || !mint_nft_destination || !mint_nft_scheme"><i class="ion-ios-hammer"></i>&nbsp;{{$t('message.btnMintNFT')}}</v-ons-button>
				</div>
			</div>
		</v-ons-card>
		<v-ons-card v-show="segmentIndex==3">
			<div class="content">
				<div class="center" style="margin-top:20px">
					<center>
						<img src="images/nft_send.png" style="width:64px;height:auto;">
					</center>
				</div>
				<div class="center" style="margin-top:20px">
					<p>
						<small>{{$t('message.sendNFTInfo')}}</small>
					</p>
				</div>
				<div class="center" style="margin-top:40px">
					{{$t('message.collection')}} : <v-ons-select float style="width: 100%" v-model="token" v-if="config.Balance">
						<option v-bind:value="index" v-for="(item,index) in config.Balance.nfts">{{item.name}}</option>
					</v-ons-select>
				</div>
				<div class="center" style="margin-top:40px">
					{{$t('message.nft')}} : <v-ons-select float style="width: 100%" v-model="nft_id" v-if="token">
						<option v-bind:value="index" v-for="(item,index) in config.Balance.nfts[token].confirmed">{{index}} - {{(parseJSON(item)?parseJSON(item).name:item)}}</option>
					</v-ons-select>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.sendXNAVAddress')" float type="text" v-model="address" style="width:100%"></v-ons-input>
				</div>
				<div class="center" style="margin-top:30px">
					<v-ons-input :placeholder="$t('message.sendMemo')" float type="text" v-model="memo" style="width:100%"></v-ons-input>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-button :disabled="!address || !nft_id" v-on:click="send()">{{$t('message.sendSubmit')}}</v-ons-button>
				</div>
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
a {
	text-decoration: none;
	color: #673AB7;
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
			toolbarInfo:
			{
				backLabel: 'Home',
				title: "NFT Workshop",
			},
			categories:
			[
				{"id":"art",name:"Art"},
				{"id":"game_content",name:"Game Content"},
				{"id":"collectibles",name:"Collectibles"},
				{"id":"music",name:"Music"},
				{"id":"photography",name:"Photography"},
				{"id":"sports",name:"Sports"},
				{"id":"trading_cards",name:"Trading Cards"},
				{"id":"utility",name:"Utility"}
			],
			file:"",
			file_type_collection:'',
			nft_file_type_collection:'',
			nftFile:"",
			uploadEnabled:false,
			uploadNFTEnabled:false,
			uploadSuccess:false,
			uploadNFTSuccess:false,
			url:"",
			preview_url:"",
			nftFileUrl:"",
			nft_preview_url:"",
			modalVisible:false,
			segmentIndex:0,
			segmentIndexSub:0,
			category:undefined,
			name:'',
			description:'',
			external_url:'',
			scheme:'',
			nft_scheme:'',
			max_supply: "",
			nft_name:'',
			nft_description:'',
			nft_external_url:'',
			mint_nft_token_id:'',
			mint_nft_id:'',
			mint_nft_scheme:'',
			mint_nft_destination:undefined,
			version:1,
			token:'',
			nft_id:'',
			address:'',
			memo:''
		};
	},
	computed:
	{
		...mapState({
			config: state => state.config,
			privateTokens: state => state.privateTokens,
		})
	},
	updated:function()
	{
		if (this.mint_nft_destination==undefined) this.mint_nft_destination=this.config.private_address;
		this.getNFTCollectionScheme();
		this.getNFTScheme();
	},
	methods:
	{
		ipfsToURL: function(link)
		{
			let base_url="https://ipfs.nextwallet.org/ipfs/";
			let e=link.split("ipfs://");
			return base_url+e[1];
		},
		formatDate: n =>
		{
			if (n) return moment(n).format('DD.MM.YY HH:mm:ss'); else return "";
		},
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
		parseJSON: function(str)
		{
			try
			{
				//console.log(JSON.parse(str));
				return JSON.parse(str);
			}
			catch(err)
			{
				return false;
			}
		},
		createNFT: function()
		{
			console.log(this.name);
			console.log(this.scheme);
			console.log(this.max_supply);
			console.log("Creating transaction...");
			let vm=this;
			vm.modalVisible=true;
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
								vm.$ons.notification.alert(vm.$t('message.createNFTSuccess'),{title:vm.$t('message.createNFT')});
							}).
							catch((e) =>
							{
								vm.modalVisible=false;
								vm.$ons.notification.alert(vm.$t('message.createNFTFailed')+"<br/><br/>"+e.message,{title:vm.$t('message.createNFT')});
							});
						}
						else
						{
							vm.modalVisible=false;
						}
					});
				}
			})
			.catch((e) =>
			{
				vm.modalVisible=false;
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
			vm.modalVisible=true;
			wallet.MintNft(this.mint_nft_token_id, this.mint_nft_id, this.mint_nft_destination, this.mint_nft_scheme).then(function (response)
			{
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
						else
						{
							vm.modalVisible=false;
						}
					});
				}
			})
			.catch((e) =>
			{
				vm.modalVisible=false;
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
					vm.preview_url=response.data.url+response.data.cid;
					vm.url="ipfs://"+response.data.cid;
					vm.file_type_collection=vm.getFileMIMEType(vm.$refs.doc.files[0].name);
					console.log("Filename:" + vm.$refs.doc.files[0].name);
					console.log("Success!");
					console.log("URL:"+response.data.url);
					console.log("CID:"+response.data.cid);
					console.log("Extension:"+vm.file_type_collection);
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
		getFileMIMEType: function(filename)
		{
			let type="";
			let ext=filename.split('.').pop();
			switch(ext)
			{
				case "gif":
					type="image/gif";
					break;
				case "jpg":
					type="image/jpeg";
					break;
				case "jpeg":
					type="image/jpeg";
					break;
				case "png":
					type="image/png";
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
			return type;
		},
		getNFTCollectionScheme: function()
		{
			this.scheme=JSON.stringify({
				version:this.version,
				category:this.category,
				description:this.description,
				image:this.url,
				external_url:this.external_url,
				attributes:
				{
					thumbnail_url:this.url,
					content_type:this.file_type_collection
				}
			});
		},
		getNFTScheme: function()
		{
			this.mint_nft_scheme=JSON.stringify({
				version:this.version,
				name:this.nft_name,
				description:this.nft_description,
				image:this.nftFileUrl,
				external_url:this.nft_external_url,
				attributes:
				{
					thumbnail_url:this.nftFileUrl,
					content_type:this.nft_file_type_collection
				}
			});
		},
		readFile: function()
		{
			const reader = new FileReader();
			let f=this.$refs.doc.files[0];
			console.log(f.name);
			console.log(f);
			if (f.name.includes(".jpg")
				||f.name.includes(".jpeg")
				||f.name.includes(".png")
				||f.name.includes(".gif")
				||f.name.includes(".webp")
				||f.name.includes(".svg"))
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
			axios.post('https://ipfs.nextwallet.org/add.php',formData,{headers:{'Content-Type':'multipart/form-data'}}).then(function(response)
			{
				if (response.data.success)
				{
					vm.uploadNFTSuccess=true;
					vm.nft_preview_url=response.data.url+response.data.cid;
					vm.nftFileUrl="ipfs://"+response.data.cid;
					vm.nft_file_type_collection=vm.getFileMIMEType(vm.$refs.doc_nft.files[0].name);
					console.log("Success!");
					console.log("URL:"+response.data.url);
					console.log("CID:"+response.data.cid);
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
		},
		send()
		{
			console.log(this.token);
			console.log(this.nft_id);
			console.log(this.address);
			console.log(this.memo);
			console.log("Sending...");
			let vm=this;
			let amount=parseFloat((vm.amount*1e8).toFixed(0));
			try
			{
				vm.modalVisible=true;
				wallet.tokenCreateTransaction(vm.address, 1, vm.memo, undefined, vm.token,vm.nft_id).then(function (tx)
				{
					vm.modalVisible=false;
					vm.$ons.notification.confirm(vm.$t('message.transactionFee') + " : " + sb.toBitcoin(tx.fee) + " xNAV<br/><br/>"+vm.$t('message.sendConfirmQuestion'),{title:vm.$t('message.sendConfirm'),buttonLabels:[vm.$t('message.sendConfirmNo'), vm.$t('message.sendConfirmYes')]})
					.then((response) =>
					{
						if (response)
						{
							vm.modalVisible=true;
							wallet.SendTransaction(tx.tx).then(function (result)
							{
								if (result.error)
								{
									vm.modalVisible=false;
									vm.$ons.notification.alert(result.error,{title:vm.$t('message.txSubmitError')});
								}
								else
								{
									vm.modalVisible=false;
									vm.address=null;
									vm.amount=null;
									vm.$ons.notification.toast(vm.$t('message.sendSuccess'), { timeout: 3000, animation: 'fall' });
								}
							})
							.catch((e) =>
							{
								vm.modalVisible=false;
								vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
							});
						}
					})
					.catch((e) =>
					{
						vm.modalVisible=false;
						vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
					});
				})
				.catch((e) =>
				{
					vm.modalVisible=false;
					vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
				});
			}
			catch(e)
			{
				vm.modalVisible=false;
				vm.$ons.notification.alert(e.message,{title:vm.$t('message.send')});
			}
		}
	}
}
</script>