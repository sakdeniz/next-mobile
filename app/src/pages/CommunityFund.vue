<template>
	<v-ons-page>
	  	<v-ons-pull-hook :action="loadItem" @changestate="state = $event.state">
      		<span v-show="state === 'initial'">{{$t('message.pullToRefresh')}}</span>
      		<span v-show="state === 'preaction'">{{$t('message.release')}}</span>
      		<span v-show="state === 'action'"><v-ons-progress-circular indeterminate></v-ons-progress-circular></span>
    	</v-ons-pull-hook>

	   	<v-ons-dialog cancelable :visible.sync="createPaymentDialogVisible">
	   		<div style="margin:20px;">
		    	<div class="title">
					{{$t('message.createPaymentRequest')}}
				</div>
		    	<div class="center" style="margin-top:20px">
	            	<v-ons-input :placeholder="$t('message.createPaymentRequestDescription')" float type="text" v-model="paymentRequestId" style="width:100%"></v-ons-input>
	        	</div>
	        	<div class="center" style="margin-top:30px">
	            	<v-ons-input :placeholder="$t('message.createPaymentRequestAmount')" float type="number" v-model="paymentRequestAmount" style="width:100%"></v-ons-input>
	        	</div>
	        	<div class="center" style="margin-top:30px">
	        		<v-ons-button @click="createPaymentRequest()">
	  					<i class="fa fa-check"></i>&nbsp;{{$t('message.createPaymentRequestSubmit')}}
					</v-ons-button>
	        	</div>
	        </div>
	    </v-ons-dialog>

		<v-ons-action-sheet :visible.sync="actionSheetVisible" cancelable :title="$t('message.proposalFilter')">
			<v-ons-action-sheet-button v-on:click="setProposalFilter('all proposals')">{{$t('message.filterProposalAll')}}</v-ons-action-sheet-button>
			<v-ons-action-sheet-button v-on:click="setProposalFilter('my proposals')">{{$t('message.filterProposalMy')}}</v-ons-action-sheet-button>
			<v-ons-action-sheet-button v-on:click="setProposalFilter('pending')">{{$t('message.filterProposalPending')}}</v-ons-action-sheet-button>
			<v-ons-action-sheet-button v-on:click="setProposalFilter('accepted')">{{$t('message.filterProposalAccepted')}}</v-ons-action-sheet-button>
			<v-ons-action-sheet-button v-on:click="setProposalFilter('rejected')">{{$t('message.filterProposalRejected')}}</v-ons-action-sheet-button>
			<v-ons-action-sheet-button v-on:click="setProposalFilter('accepted waiting for end of voting period')">{{$t('message.filterProposalAcceptedWaitingForEndOfVotingPeriod')}}</v-ons-action-sheet-button>
			<v-ons-action-sheet-button v-on:click="setProposalFilter('expired pending voting of payment requests')">{{$t('message.filterProposalExpiredPendingVotingOfPaymentRequests')}}</v-ons-action-sheet-button>
		</v-ons-action-sheet>


		<v-ons-action-sheet :visible.sync="actionSheet2Visible" cancelable :title="$t('message.paymentRequestFilter')">
			<v-ons-action-sheet-button v-on:click="setPaymentRequestFilter('all payment requests')">{{$t('message.filterPaymentRequestAll')}}</v-ons-action-sheet-button>
			<v-ons-action-sheet-button v-on:click="setPaymentRequestFilter('my payment requests')">{{$t('message.filterPaymentRequestMy')}}</v-ons-action-sheet-button>
			<v-ons-action-sheet-button v-on:click="setPaymentRequestFilter('pending')">{{$t('message.filterPaymentRequestPending')}}</v-ons-action-sheet-button>
			<v-ons-action-sheet-button v-on:click="setPaymentRequestFilter('accepted')">{{$t('message.filterPaymentRequestAccepted')}}</v-ons-action-sheet-button>
			<v-ons-action-sheet-button v-on:click="setPaymentRequestFilter('rejected')">{{$t('message.filterPaymentRequestRejected')}}</v-ons-action-sheet-button>
			<v-ons-action-sheet-button v-on:click="setPaymentRequestFilter('accepted waiting for end of voting period')">{{$t('message.filterPaymentRequestAcceptedWaitingForEndOfVotingPeriod')}}</v-ons-action-sheet-button>
		</v-ons-action-sheet>

	    <v-ons-fab position="bottom right" :visible="fabVisible" modifier="mini" v-on:click="push(pages[0].component, 'Create Proposal')">
			<v-ons-icon icon="md-plus"></v-ons-icon>
    	</v-ons-fab>

		<v-ons-card>
			<div class="title">
				{{$t('message.communityFund')}}
			</div>
			<div class="content">
				<p class="sub-title">
					{{$t('message.communityFundSubTitle1')}}
        		</p>
        		<p style="margin-top:10px;">
    	    		{{$t('message.communityFundSubTitle2')}}
	        	</p>
        		<div class="center">
        			<ons-row>
            			<ons-col width="33%">
                			<center>
                    			<img src="images/cfu-dual-vote.svg" style="width:75%;height:auto;">
                    			<br/><small class="purple">{{$t('message.communityFundDualVoteConsensus')}}</small>
                			</center>
            			</ons-col>
            			<ons-col width="33%">
                			<center>
                    			<img src="images/cfu-anyone.svg" style="width:75%;height:auto;">
                    			<br/><small class="purple">{{$t('message.communityFundOpenToAnyone')}}</small>
                			</center>
            			</ons-col>
            			<ons-col width="33%">
                			<center>
                    			<img src="images/cfu-decentralised-fund.svg" style="width:75%;height:auto;">
                    			<br/><small class="purple">{{$t('message.communityFundNoCentralizedFund')}}</small>
                			</center>
            			</ons-col>
        			</ons-row>
        		</div>
      		</div>
    	</v-ons-card>
		
		<v-ons-card>
      		<div class="center">
        		<v-ons-segment :index.sync="segmentIndex" style="width:100%">
          			<button>{{$t('message.proposals')}}</button>
          			<button>{{$t('message.paymentRequests')}}</button>
        		</v-ons-segment>
      		</div>
		</v-ons-card>

		<v-ons-card v-show="segmentIndex==0">
			<span class="sub-title">
				{{$t('message.proposals')}}&nbsp;
				<span class="badge">{{filter(proposals).length}}</span>
			</span>
			<div style="margin-top:5px;">{{capitalize(proposalFilter)}}</div>
			<v-ons-list style="margin-top:10px;">
				<v-ons-button @click="actionSheetVisible = true" style="float:right;">
		  			<i class="fa fa-filter"></i>&nbsp;{{$t('message.filter')}}
				</v-ons-button>
	       		<v-ons-list-item v-for="proposal in filter(proposals)" :key="proposal.hash">
	            	<ons-row>
	              		<ons-col width="20%">
	                    	<img style="width:100%;height:auto;" v-if="proposal.image" :src="proposal.image">
	                    	<img v-else style="width:100%;height:auto;" src="images/placeholder.png">
	              		</ons-col>
	              		<ons-col width="80%">
               			<div class="ml-5">
	                  		<ons-row>
	                  			<ons-col width="50%" class="bg1">
	                  				<div>
	                          			{{formatNumber(proposal.requestedAmount.slice(0, -3))}} NAV
	                          		</div>
	                  			</ons-col>
	                  			<ons-col width="50%" class="bg1">
	                  				<div style="float:right">
			                          	<i class="fa fa-clock-o"></i>&nbsp;{{secondsToDhms(proposal.proposalDuration)}}
			                          	<i class="fa fa-refresh" style="margin-left:5px;"></i>&nbsp;{{proposal.votingCycle}}
	                          		</div>
	                  			</ons-col>
	                  		</ons-row>
                      		<div>
                          		<div class="bg1" style="margin-top:10px;">
                          			{{capitalize(proposal.status)}}
                          		</div>
                      		</div>
                      		<p class="description word-break">
                          		{{proposal.description}}
                      		</p>
                  		</div>
	              		</ons-col>
	          		</ons-row>
	          		<ons-row>
	          		    <ons-col width="20%" style="padding:5px">
						    <i v-if="proposal.paymentAddress==publicAddress" class="fa fa-heart" style="color:#673AB7"></i>
	            		</ons-col>
	            		<ons-col width="40%" style="padding:5px">
	            			<i class="fa fa-thumbs-o-up" style="color:#A4C639"></i>
						    <span class="voteYes">{{proposal.votesYes}}</span>
						   	<small v-if="proposal.votesYes" style="float:right"><i class="fa fa-percent" aria-hidden="true"></i>&nbsp;{{getYesVotesProportion(proposal)}}</small>
						   	<div id="positive">
						   		<v-ons-progress-bar v-if="proposal.votesYes" :value="getYesVotesProportion(proposal)" secondary-value="100"></v-ons-progress-bar>
						   	</div>
	            		</ons-col>
	            		<ons-col width="40%" style="padding:5px" modifier="material">
						    <i class="fa fa-thumbs-o-down" style="color:#DD4B39"></i>
						    <span class="voteNo">{{proposal.votesNo}}</span>
						    <small v-if="proposal.votesNo" style="float:right"><i class="fa fa-percent" aria-hidden="true"></i>&nbsp;{{getNoVotesProportion(proposal)}}</small>
						    <div id="negative">
						    	<v-ons-progress-bar v-if="proposal.votesNo" :value="getNoVotesProportion(proposal)" secondary-value="100"></v-ons-progress-bar>
						    </div>
	            		</ons-col>
	        		</ons-row>
	        		<ons-row v-show="proposal.status=='accepted' && proposal.paymentAddress==publicAddress" style="margin-top:10px;">
	            		<ons-col width="100%">
	            			<center>
						    	<v-ons-button @click="showCreatePaymentDialog(proposal)">
				  					<i class="fa fa-plus" aria-hidden="true"></i>&nbsp;{{$t('message.createPaymentRequest')}}
								</v-ons-button>
							</center>
	            		</ons-col>
	        		</ons-row>
	      		</v-ons-list-item>
	    	</v-ons-list>
	    </v-ons-card>
	    
	    <v-ons-card v-show="segmentIndex==1">
			<span class="sub-title">
				{{$t('message.paymentRequests')}}
				<span class="badge">{{filterPaymentRequest(paymentRequests).length}}</span>
			</span>
			<div style="margin-top:5px;">{{capitalize(paymentRequestFilter)}}</div>
			<div style="float:right;margin-top:5px;">
				<v-ons-button @click="actionSheet2Visible = true">
		  			<i class="fa fa-filter"></i>&nbsp;{{$t('message.filter')}}
				</v-ons-button>
			</div>
			<v-ons-list style="margin-top:10px;clear:both">
				<v-ons-list-item v-for="paymentRequest in filterPaymentRequest(paymentRequests)" :key="paymentRequests.hash">
					<div class="center">

						<ons-row>
							<ons-col width="50%">
								{{formatNumber(paymentRequest.requestedAmount.slice(0, -3))}} NAV
							</ons-col>
							<ons-col width="50%" style="text-align:right">
								{{capitalize(paymentRequest.status)}}
							</ons-col>
						</ons-row>

						<ons-row>
							<ons-col width="100%">
							<p class="description word-break">
								{{paymentRequest.description}}
							</p>
							</ons-col>
						</ons-row>

						<ons-row>
			            	<ons-col width="50%" style="padding:5px" modifier="material">
							    <i class="fa fa-thumbs-o-up" style="color:#A4C639"></i>
							    <span class="voteYes">{{paymentRequest.votesYes}}</span>
							    <small v-if="paymentRequest.votesYes" style="float:right"><i class="fa fa-percent" aria-hidden="true"></i>&nbsp;{{getYesVotesProportion(paymentRequest)}}</small>
							    <div id="positive">
							    	<v-ons-progress-bar v-if="paymentRequest.votesYes" :value="getYesVotesProportion(paymentRequest)" secondary-value="100"></v-ons-progress-bar>
							    </div>
		            		</ons-col>
			            	<ons-col width="50%" style="padding:5px" modifier="material">
							    <i class="fa fa-thumbs-o-down" style="color:#DD4B39"></i>
							    <span class="voteNo">{{paymentRequest.votesNo}}</span>
							    <small v-if="paymentRequest.votesNo" style="float:right"><i class="fa fa-percent" aria-hidden="true"></i>&nbsp;{{getNoVotesProportion(paymentRequest)}}</small>
							    <div id="negative">
							    	<v-ons-progress-bar v-if="paymentRequest.votesNo" :value="getNoVotesProportion(paymentRequest)" secondary-value="100"></v-ons-progress-bar>
							    </div>
		            		</ons-col>
		        		</ons-row>
					</div>
				</v-ons-list-item>
		  	</v-ons-list>
		</v-ons-card>
	</v-ons-page>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import sb from 'satoshi-bitcoin';
import bitcore from 'bitcore-lib';
import message from 'bitcore-message';
import CreateProposal from './CreateProposal.vue';
export default {
  data () {
    return {
    publicAddress:'',
    paymentRequestProposal:{},
    paymentRequestId:'',
    paymentRequestAmount:'',
    state: 'initial',
    items: [1, 2, 3],
    segmentIndex: 0,
    proposals:[],
    paymentRequests:[],
    fabVisible: true,
    actionSheetVisible: false,
    actionSheet2Visible: false,
    createPaymentDialogVisible: false,
    proposalFilter:'pending',
    paymentRequestFilter:'pending',
    pages:
    [
    	{
          component: CreateProposal,
          label: 'Create Proposal',
          desc: 'Desc'
        }
    ]
    };
  },
  created: function ()
  {
	this.publicAddress=db.get('addr').value()[0].publicAddress;
    this.getProposals();
    this.getPaymentRequests();
  },
  methods: {
    loadItem(done)
    {
        this.getProposals();
        this.getPaymentRequests();
        setTimeout(() =>
        {
            this.items = [...this.items, this.items.length + 1];
            done();
        }, 1000);
    },
    showCreatePaymentDialog:function(proposal)
    {
    	this.paymentRequestProposal=proposal;
		this.createPaymentDialogVisible=true;
    },
    getPaymentRequests: function (paymentRequests)
	{
		var pR=[];
		jQuery.each(paymentRequests, function(key, value)
		{
			if (value.length>0)
			{
				pR.push(value[0]); 
			}
		});
		return pR;
	},
    createPaymentRequest:function()
    {
    	let vm=this;
		axios.get(window.apiURL+'utxo', {
			params: {
				network: window.network,
				a: vm.publicAddress
			}
		})
		.then(function (response)
		{
			var randomString=moment().unix();
			var signString=randomString+"I kindly ask to withdraw "+sb.toSatoshi(vm.paymentRequestAmount)+"NAV from the proposal "+vm.paymentRequestProposal.hash+". Payment request id: " + vm.paymentRequestId;
			console.log("String");
			console.log("======");
			console.log(signString);

			var privateKey = bitcore.PrivateKey.fromWIF(window.db.get('addr').value()[0].privateKey.toString());
			var signature = message(signString).sign(privateKey);
			console.log(signature.toString());
			var utxo=response.data;
			console.log(utxo);
			try
			{
				var script = new bitcore.Script()
				.add('OP_RETURN')
				.add('OP_CFUND')
				var strdzeel='{\"h\":\"'+vm.paymentRequestProposal.hash+'\",\"n\":'+sb.toSatoshi(vm.paymentRequestAmount)+',\"s\":\"'+signature.toString()+'\",\"r\":\"'+randomString+'\",\"i\":\"'+vm.paymentRequestId+'\",\"v\":2}';
				console.log("strdzeel:"+strdzeel);
				var tx=new bitcore.Transaction()
				.from(utxo)
				.addOutput(new bitcore.Transaction.Output({
					script: script,
					satoshis: 10000
				}))
				.settime(moment().unix())
				.change(vm.publicAddress)
				.setversion("5")
				.anondest(strdzeel)
				.sign(privateKey);
				console.log("-----------");
				console.log("TRANSACTION");
				console.log("-----------");
				console.log(tx.toObject());
				console.log("----------");
				console.log("SERIALIZED");
				console.log("----------");
				console.log(tx.serialize({disableSmallFees: true,disableMoreOutputThanInput:true}));
				console.log("-----------");
				axios.post(window.apiURL+'sendrawtransaction', "network="+window.network+"&a="+tx.serialize({disableSmallFees: true,disableMoreOutputThanInput:true}).toString(),window.config)
				.then((retval) =>
				{
					console.log(retval.data);
					vm.createPaymentDialogVisible=false;
					if (retval.data.substring(0,5) == "error")
					{
						vm.$ons.notification.alert(retval.data,{title:vm.$t('message.error')});
					}
					else
					{
						vm.$ons.notification.toast(vm.$t('message.createProposalSubmitSuccess'), { timeout: 2000, animation: 'fall' });
					}
				}
				).catch((e) =>
				{
					//vm.$ons.notification.toast(e, { timeout: 2000, animation: 'fall' });
				})
			}
			catch(err)
			{
				console.log(err);
			}
		})
		.catch(function (error)
		{
			console.log(error);
		})
		.then(function ()
		{
		});
    },
    secondsToDhms:function(seconds)
	{
		seconds=Number(seconds);
		var d=Math.floor(seconds / (3600*24));
		var h=Math.floor(seconds % (3600*24) / 3600);
		var m=Math.floor(seconds % 3600 / 60);
		var s=Math.floor(seconds % 3600 % 60);
		var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
		return dDisplay;
	},
    setProposalFilter: function(filter)
    {
      this.proposalFilter=filter;
      this.actionSheetVisible=false;
    },
    setPaymentRequestFilter: function(filter)
    {
      this.paymentRequestFilter=filter;
      this.actionSheet2Visible=false;
    },
    filter: function(proposals)
    {
      if (this.proposalFilter=="all proposals")
      {
        return _.sortByOrder(proposals,['id'],['desc']);
      }
      else if (this.proposalFilter=="my proposals")
      {
      	return _.sortByOrder(proposals.filter(proposal => proposal.paymentAddress==this.publicAddress),['id'],['desc']);
      }
      else
      {
        return _.sortByOrder(proposals.filter(proposal => proposal.status==this.proposalFilter),['id'],['desc']);
      }
    },
    filterPaymentRequest: function(paymentRequests)
    {
    	let vm=this;
		var pR=[];
		jQuery.each(paymentRequests, function(key, value)
		{
			if (value.length>0)
			{
				jQuery.each(value, function(k, v)
				{
					if (vm.paymentRequestFilter=="all payment requests")
					{
						pR.push(v);
					}
					else if (vm.paymentRequestFilter=="my payment requests")
					{
						//pR.push(v);
					}
					else if (v.status==vm.paymentRequestFilter)
					{
						pR.push(v);
					}
				});
			}
		});
		return pR;
    },
    capitalize: function (s) 
    {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    },
    formatNumber: n => {
        if (!n) return "0";
        return n.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    },
    getYesVotesProportion: function (proposal)
	{
        var total_votes = proposal.votesYes + proposal.votesNo;
        return Math.round((proposal.votesYes / total_votes) * 100, 2);
	},
	getNoVotesProportion: function (proposal)
	{
        var total_votes = proposal.votesYes + proposal.votesNo;
        return Math.round((proposal.votesNo / total_votes) * 100, 2);
	},
	getRequiredVotesProportion: function (proposal)
	{
		try
		{
			var requiredVotesProportion=(((proposal.votesYes+proposal.votesNo)*100)/this.cfundStats.consensus.minSumVotesPerVotingCycle).toFixed(2);
	   		if (requiredVotesProportion>100) return 100; else return requiredVotesProportion;
        }
        catch(err){}
	},
    getProposals()
    {
        let vm=this;
        axios.get(window.apiURL+'listproposals', {
            params: {
                network: window.network
            }
        })
        .then(function (response)
        {
            vm.proposals=response.data;
            //console.log(JSON.stringify(response.data));
        })
        .catch(function (error)
        {
            console.log(error);
        })
        .then(function ()
        {
        });
    },
    getPaymentRequests()
    {
        let vm=this;
        axios.get(window.apiURL+'listpaymentrequests', {
            params: {
                network: window.network
            }
        })
        .then(function (response)
        {
            vm.paymentRequests=response.data;
            //console.log(JSON.stringify(response.data));
        })
        .catch(function (error)
        {
            console.log(error);
        })
        .then(function ()
        {
        });
    },
    push(page, key) {
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
ons-card {
	cursor: pointer;
	color: #333;
}

.card__title, .card--material__title {
	font-size: 20px;
}

p {
	width: 100%;
}

.description
{
	font-size:9pt;
	color:#787878;
}

.ml-5 { 
	margin-left:5px;
}

.ml-10 { 
	margin-left:10px;
}

.ow-anywhere { 
	overflow-wrap: anywhere; 
}

.ow-break-word {
	overflow-wrap: break-word;
}

.word-break {
	word-break: break-all;
}

.hyphens {
	hyphens: auto;
}

.title
{
	color:#7D5AB5;
}

.sub-title
{
    font-size:15px;
    color:#7D5AB5;
}
.purple
{
	color:#7D5AB5;
}

.progress-bar {
    border-radius: 10px;
    margin-top:5px;
}
#positive .progress-bar__primary,
#positive .progress-bar--material__primary {
    background-color: #A4C639;
}

#positive .progress-bar__secondary,
#positive .progress-bar--material__secondary {
    background-color: #f5f5f5;
}

#negative .progress-bar__primary,
#negative .progress-bar--material__primary {
    background-color: #DD4B39;
}

#negative .progress-bar__secondary,
#negative .progress-bar--material__secondary {
    background-color: #f5f5f5;
}

.badge
{
	background: #7D5AB5;
	color:#ffffff;
	border-radius: 4px;
	padding:5px;
}
.amount
{
	background: #7D5AB5;
	color:#ffffff;
	border-radius: 4px;
	padding:5px;
	font-size:9pt;
	margin-bottom:5px;
}
.status
{
	background: #FCFCFC;
	color:#232323;
	border-radius: 4px;
	padding:5px;
	font-size:9pt;
	margin-top:5px;
}
.bg1
{
	color:#787878;
	padding-left:0px;
	padding-right:10px;
	padding-bottom:10px;
	font-size:10pt;
	border-bottom: 1px solid #F3F3F3;
}
.voteYes
{
	color:#A4C639;
	font-size:10pt;
}
.voteNo
{
	color:#DD4B39;
	font-size:10pt;
}
</style>
