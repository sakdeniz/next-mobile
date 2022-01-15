<template>
	<v-ons-page>
		<v-ons-modal :visible="modalVisible" @click="modalVisible = false">
			<p style="text-align: center">
				{{$t('message.pleaseWait')}} <v-ons-icon icon="fa-spinner" spin></v-ons-icon>
			</p>
		</v-ons-modal>
		<v-ons-toolbar modifier="transparent">
			<div class="center">
				<v-ons-segment :index.sync="segmentIndex" style="width:100%">
					<button>{{$t('message.availableNames')}}</button>
					<button>{{$t('message.registerName')}}</button>
					<button>{{$t('message.updateName')}}</button>
				</v-ons-segment>
			</div>
		</v-ons-toolbar>
		<v-ons-card v-show="segmentIndex==0">
			<div class="content">
				<div class="center" style="margin-top:20px">
					<center>
						<img src="images/dns.png" style="width:64px;height:auto;">
					</center>
					<v-ons-list v-if="config.names.length>0">
						<v-ons-list-item expandable :expanded.sync="item.isExpanded" v-for="(item,index) in config.names">
							<img src="images/block.png" style="width:32px;height:auto;margin-right:10px;"><b>{{item.name}}</b>
							<div class="expandable-content">
								<div>{{$t('message.name')}} : {{item.name}}</div>
							</div>
						</v-ons-list-item>
					</v-ons-list>
					<div v-else>
						<p>
							<small>{{$t('message.noNameAvailable')}}</small>
						</p>
						<v-ons-button v-on:click="segmentIndex=1">{{$t('message.btnRegisterName')}}</v-ons-button>
					</div>
				</div>
			</div>
		</v-ons-card>
		<v-ons-card v-show="segmentIndex==1">
			<div class="content">
				<div class="center" style="margin-top:20px">
					<center>
						<img src="images/name_register.png" style="width:64px;height:auto;">
					</center>
				</div>
				<div class="center" style="margin-top:20px">
					<p>
						<small>{{$t('message.registerNameInfo')}}</small>
					</p>
				</div>
				<div class="center" style="margin-top:20px">
					<p>
						<small>{{$t('message.registerNameInfo2')}}</small>
					</p>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.name')" type="text" class="form-control" style="width:100%;" v-model="name" v-on:input="IsValidDotNavName()"/>
					<p v-if="name" v-html="(is_name_valid?'<span style=\'color:#228B22\'><i class=\'ion-ios-checkmark\'></i>&nbsp;Name valid</span>':'<span style=\'color:#DC143C\'><i class=\'ion-ios-close\'></i>&nbsp;Name not valid</span>')"></p>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-button v-on:click='registerName' :disabled="!name || !is_name_valid"><i class="ion-ios-color-wand"></i>&nbsp;{{$t('message.btnRegisterName')}}</v-ons-button>
				</div>
			</div>
		</v-ons-card>
			<v-ons-card v-show="segmentIndex==2">
			<div class="content">
				<div class="center" style="margin-top:20px">
					<center>
						<img src="images/plan.png" style="width:64px;height:auto;">
					</center>
				</div>
				<div class="center" style="margin-top:20px">
					<p>
						<small>{{$t('message.updateNameInfo')}}</small>
					</p>
				</div>
				<div class="center" style="margin-top:40px">
					Name : <v-ons-select style="width: 100%" v-model="domain">
						<option v-bind:value="item.name" v-for="(item,index) in config.names">{{item.name}}</option>
					</v-ons-select>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.subDomain')" type="text" class="form-control" style="width:100%;" v-model="sub_domain"/>
					<p v-if="sub_domain" v-html="(is_sub_domain_valid?'<span style=\'color:#228B22\'><i class=\'ion-ios-checkmark\'></i>&nbsp;Name valid</span>':'<span style=\'color:#DC143C\'><i class=\'ion-ios-close\'></i>&nbsp;Name not valid</span>')"></p>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.subDomainKey')" type="text" class="form-control" style="width:100%;" v-model="sub_domain_key" float/>
					<p v-if="sub_domain_key" v-html="(is_sub_domain_key_valid?'<span style=\'color:#228B22\'><i class=\'ion-ios-checkmark\'></i>&nbsp;Key valid</span>':'<span style=\'color:#DC143C\'><i class=\'ion-ios-close\'></i>&nbsp;Key not valid</span>')"></p>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-input :placeholder="$t('message.subDomainValue')" type="text" class="form-control" style="width:100%;" v-model="sub_domain_value" float/>
				</div>
				<div class="center" style="margin-top:40px">
					<v-ons-button v-on:click='updateName' :disabled="!domain || !sub_domain || !sub_domain_key || !sub_domain_value  || !is_sub_domain_valid || !is_sub_domain_key_valid"><i class="ion-ios-checkmark"></i>&nbsp;{{$t('message.btnUpdateName')}}</v-ons-button>
				</div>
			</div>
		</v-ons-card>
	</v-ons-page>
</template>
<script type="text/javascript">
import Vue from "vue";
import sb from 'satoshi-bitcoin';
import {
  mapState,
  mapActions
} from "vuex";

export default {
	data: function ()
	{
		return {
			modalVisible:false,
			segmentIndex: 0,
			name:'',
			is_name_valid:false,
			domain:'',
			sub_domain:'',
			is_sub_domain_valid:false,
			sub_domain_key:'',
			is_sub_domain_key_valid:false,
			sub_domain_value:'',
		}
	},
	computed:
	{
		...mapState({
			config: state => state.config,
			names: state => state.names,
		})
	},
	watch:
	{
		name(value)
		{
			this.is_name_valid=wallet.IsValidDotNavName(value);
		},
		sub_domain(value)
		{
			this.is_sub_domain_valid=wallet.IsValidDotNavKey(value);
		},
		sub_domain_key(value)
		{
			this.is_sub_domain_key_valid=wallet.IsValidDotNavKey(value);
		}
	},
	methods:
	{
		registerName: function()
		{
			console.log(this.name);
			console.log("Registering name...");
			let vm=this;
			vm.modalVisible=true;
			wallet.RegisterName(this.name).then(function (response)
			{
				vm.modalVisible=false;
				console.log(response);
				if (response.tx)
				{
					vm.$ons.notification.confirm(vm.$t('message.registerNameConfirmRequiredFree')+sb.toBitcoin(response.fee)+" xNAV<br/><br/>" + vm.$t('message.registerNameConfirmQuestion'),{title:vm.$t('message.registerNameConfirmTitle'),buttonLabels:[vm.$t('message.registerNameConfirmNo'), vm.$t('message.registerNameConfirmYes')]})
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
								vm.$ons.notification.alert(vm.$t('message.registerNameSuccess'),{title:vm.$t('message.registerName')});
							}).
							catch((e) =>
							{
								vm.modalVisible=false;
								vm.$ons.notification.alert(vm.$t('message.registerNameFailed')+"<br/><br/>"+e.message,{title:vm.$t('message.registerName')});
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
				vm.$ons.notification.alert(e.message,{title:vm.$t('message.registerName')});
			});
		},
		updateName: function()
		{
			console.log(this.domain);
			console.log(this.sub_domain);
			console.log(this.sub_domain_key);
			console.log(this.sub_domain_value);
			console.log("Updating name...");
			let vm=this;
			vm.modalVisible=true;
			wallet.UpdateName(this.domain,this.sub_domain,this.sub_domain_key,this.sub_domain_value).then(function (response)
			{
				vm.modalVisible=false;
				console.log(response);
				if (response.tx)
				{
					vm.$ons.notification.confirm(vm.$t('message.updateNameConfirmRequiredFree')+sb.toBitcoin(response.fee)+" xNAV<br/><br/>" + vm.$t('message.updateNameConfirmQuestion'),{title:vm.$t('message.updateNameConfirmTitle'),buttonLabels:[vm.$t('message.updateNameConfirmNo'), vm.$t('message.updateNameConfirmYes')]})
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
								vm.$ons.notification.alert(vm.$t('message.updateNameSuccess'),{title:vm.$t('message.updateName')});
							}).
							catch((e) =>
							{
								vm.modalVisible=false;
								vm.$ons.notification.alert(vm.$t('message.updateNameFailed')+"<br/><br/>"+e.message,{title:vm.$t('message.updateName')});
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
				vm.$ons.notification.alert(e.message,{title:vm.$t('message.updateName')});
			});
		}	
	}
}
</script>