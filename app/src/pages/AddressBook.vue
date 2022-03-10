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
			<v-ons-fab position="bottom right" modifier="mini" v-on:click="push(pages[0].component, $t('message.addContact'))">
				<v-ons-icon icon="md-plus"></v-ons-icon>
			</v-ons-fab>
			<v-ons-list v-if="config.book.length>0">
				<v-ons-list-item v-for="user,index in config.book"  tappable modifier="nodivider">
					<div class="center">
						<v-ons-button modifier="outline" v-on:click="send(user.address)"><i class="ion-ios-paper-plane fa-2x"></i></v-ons-button>
						<v-ons-button modifier="outline" v-on:click="update(index)"><i class="ion-ios-create fa-2x"></i></v-ons-button>
						<v-ons-button modifier="outline" v-on:click="deleteConfirm(index)"><i class="ion-ios-trash fa-2x"></i></v-ons-button>
						<span class="list-item__subtitle">{{user.name}}</span>
						<span class="list-item__subtitle">{{user.email}}</span>
						<span class="list-item__subtitle"><code>{{user.address}}</code></span>
					</div>
				</v-ons-list-item>
			</v-ons-list>
			<p v-else>
				{{$t('message.noContact')}}
			</p>
		</v-ons-card>
	</v-ons-page>
</template>
<script>
import Contact from './Contact.vue';
import Send from './Send.vue';
export default {
	data()
	{
		return {
			isVisible:false,
			id:'',
			pages:[
			{
				component: Contact,
				label: 'Contact',
				desc: 'Contact'
			},
			{
				component: Send,
				label: 'Send',
				desc: 'Send'
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
			this.$store.commit('config/removeContact', this.id);
		},
		update:function(id)
		{
			var page=this.pages[0].component;
			this.$store.commit('navigator/push', {
			extends: page,
			data() {
				return {
					toolbarInfo: {
						backLabel: 'Home',
						title: vm.$t('message.updateContact'),
					},
					index:id,
					update:true,
					contactName:this.$store.state.config.book[id].name,
					contactEMail:this.$store.state.config.book[id].email,
					contactAddress:this.$store.state.config.book[id].address,
				}
			}
			});
		},
		send:function(address)
		{
			this.$store.commit('config/setAddress', address);
			this.$store.commit('navigator/pop');
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