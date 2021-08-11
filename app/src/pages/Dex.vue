<template>
	<v-ons-page>
	    <v-ons-pull-hook :action="loadItem" @changestate="state = $event.state">
	    	<span v-show="state === 'initial'">{{$t('message.pullToRefresh')}}</span>
	    	<span v-show="state === 'preaction'">{{$t('message.release')}}</span>
	    	<span v-show="state === 'action'">
	      		<v-ons-progress-circular indeterminate></v-ons-progress-circular>
	     	</span>
	    </v-ons-pull-hook>		
	  	<!--<v-ons-card>
			<div class="title">
				<i class="ion-social-buffer"></i>&nbsp;BinanceChain
			</div>
	  		{{BinanceChain}}
		</v-ons-card>!-->
	  	<v-ons-card>
			<div class="title">
				<i class="ion-social-buffer"></i>&nbsp;Metamask
			</div>
			
	  		<v-ons-list v-if="isMetamaskInstalled">
	  			<v-ons-list-item modifier="nodivider">
	  				chainId : {{ethereum.chainId}} {{chainName}}
	  			</v-ons-list-item>
	  			<v-ons-list-item modifier="nodivider">
	  				isMetamask : {{ethereum.isMetaMask}}
	  			</v-ons-list-item>
	  			<v-ons-list-item modifier="nodivider">
	  				initialized : {{ethereum._state.isConnected}}
	  			</v-ons-list-item>
	  			<v-ons-list-item modifier="nodivider">
	  				isConnected : {{ethereum._state.isConnected}}
	  			</v-ons-list-item>
	  			<v-ons-list-item modifier="nodivider">
	  				isUnlocked : {{ethereum._state.isUnlocked}}
	  			</v-ons-list-item>
	  			<v-ons-list-item modifier="nodivider">
	  				Gas Price : {{gasPrice}}
	  			</v-ons-list-item>
	  			<v-ons-list-item modifier="nodivider">
	  				Latest Block : {{lastEthBlock}}
	  			</v-ons-list-item>
	  			<v-ons-list-item modifier="nodivider">
	  				<v-ons-button v-on:click="addTokenMetamask()">Add wNAV Token to Metamask</v-ons-button>
	  			</v-ons-list-item>
	  		</v-ons-list>
	  		<div v-else>
	  			You need to install Metamask addon.
	  			<div style="margin-top:30px;">
	  				<v-ons-button v-on:click="MetamaskOnboarding()">Install Metamask</v-ons-button>
	  			</div>
	  		</div>

		</v-ons-card>
		<v-ons-card v-if="isMetamaskInstalled">
			<div class="title">
				<i class="ion-more"></i>&nbsp;Accounts
			</div>
	  		<v-ons-list>
	  			<v-ons-list-item v-for="item in w_accounts">
	  				<p>Address</p>
	  				<code>{{item.addr}}</code>
	  				<p>Balance</p>
	  				<code>{{parseFloat(item.balance).toFixed(4)}} {{symbol}}</code><br/>
	  			</v-ons-list-item>
	  		</v-ons-list>
		</v-ons-card>

		<v-ons-card v-if="isMetamaskInstalled">
			<div class="title">
				<i class="ion-compose"></i>&nbsp;Contract Address
			</div>
	  		<v-ons-list>
	  			<v-ons-list-item>
	  				<code>{{contractAddress}}</code>
	  			</v-ons-list-item>
	  		</v-ons-list>
		</v-ons-card>

		<v-ons-card v-if="isMetamaskInstalled">
			<div class="title">
				<i class="ion-archive"></i>&nbsp;Deposit Address
			</div>
	  		<v-ons-list>
	  			<v-ons-list-item>
	  				<span>Address</span><v-ons-button style="float:right" modifier="quiet" v-on:click="doCopy()"><i class="fa fa-clipboard"></i></v-ons-button>
	  				<code>{{navAddress}}</code>
	  				<p>Current Balance</p>
					<code>{{wBal}} wNAV</code>
	  			</v-ons-list-item>
	  		</v-ons-list>
		</v-ons-card>

		<v-ons-card v-if="isMetamaskInstalled">
			<div class="title">
				<i class="ion-arrow-up-c"></i>&nbsp;Withdrawal
			</div>
			<div class="content">
	  			<div class="center" style="margin-top:30px">
	  				<v-ons-input placeholder="Address" float type="text" v-model="withdrawAddress" style="width:100%"></v-ons-input>
	  			</div>
	  			<div class="center" style="margin-top:30px">
	  				<v-ons-input placeholder="Amount (wNAV)" float type="text" v-model="withdrawAmount" style="width:100%"></v-ons-input>
	  			</div>
	  			<div class="center" style="margin-top:30px">
	  				<v-ons-button v-on:click="Swap()">Swap</v-ons-button>
	  				<v-ons-button v-on:click="UseAllFund()" style="float:right;margin-right:5px;">Use All Funds</v-ons-button>
	  			</div>
	  		</div>
		</v-ons-card>

		<v-ons-card v-if="isMetamaskInstalled">
			<div class="title">
				<i class="ion-android-time"></i>&nbsp;History
				<v-ons-button style="float:right" v-on:click="getHistory()"><i class="ion-refresh"></i></v-ons-button>
			</div>

			<div class="content">
				<v-ons-list>
					<v-ons-list-item modifier="nodivider" v-for="item in history">
						  <div class="center">
						  	<small>{{formatDate(item.timestamp)}}</small>
						  	<span class="list-item__subtitle">{{item.event}}<br/>{{item.confirm}}</br>{{item.blockNumber}}</span>
						  </div>
					</v-ons-list-item>
				</v-ons-list>
	  		</div>
		</v-ons-card>


		<v-ons-card v-if="isMetamaskInstalled">
			<div class="title">
				<i class="ion-arrow-swap"></i>&nbsp;DEX Token Swap
			</div>
			<div class="content">
				<ons-row>
				  <ons-col>
				  	Exchange :<br/>
					<v-ons-select v-model="exchange">
				    	<option v-bind:value="exchange.url" v-for="exchange in exchanges">{{exchange.name}}</option>
				  </v-ons-select>
				  </ons-col>
				  <ons-col>
				  Amount :<br/>
				  <v-ons-input float type="text" v-model="exactAmount" style="width:100%"></v-ons-input>	
				  </ons-col>
				</ons-row>
				<ons-row style="margin-top:30px;">
				  <ons-col>
				  	From :<br/>
				  <v-ons-select v-model="pair1">
				    <option v-bind:value="pair.contractAddress" v-for="pair in pairs">{{pair.name}}</option>
				  </v-ons-select>
				  </ons-col>
				  <ons-col>
					To :<br/>
				  <v-ons-select v-model="pair2">
				    <option v-bind:value="pair.contractAddress" v-for="pair in pairs">{{pair.name}}</option>
				  </v-ons-select>				  	
				  </ons-col>
				</ons-row>
				<div>
  				</div>
  				  <p style="text-align: center">
    				<ons-button :disabled="!exchange || !pair1 || !pair2 || !exactAmount" v-on:click="showModal()"><i class="ion-arrow-swap"></i>&nbsp;START SWAP</ons-button>
  				</p>
			</div>
		</v-ons-card>

		<ons-modal direction="up">
			<ons-button v-on:click="hideModal()" style="margin-bottom:10px;"><i class="ion-close"></i>&nbsp;Cancel</ons-button>
			<div id="div1"></div>
		</ons-modal>
	</v-ons-page>
</template>

<script>
import Bitcore from 'bitcore-lib';
import MetamaskOnboarding from 'metamask-onboarding';
import { ChainId } from '@uniswap/sdk';
import Vue from 'vue';
import VueClipboard from 'vue-clipboard2';
VueClipboard.config.autoSetContainer=true;
Vue.use(VueClipboard);
export default {
  data()
  {
    return {
   	    state: 'initial',
	    items: [1, 2, 3],
    	isMetamaskInstalled:false,
    	binanceChain:{},
    	ethereum:{},
 	    navNetwork: "mainnet",
    	XPUBKEY: "xpub661MyMwAqRbcGU4zstehr61rwbDzTBkZpKaWhXXEiZcNY9HYaEutrSqB4c8m2eh7Z77ggyVxdeSPXNYeN3Ns16BUh3cBwHJPAjASCfVusFK",
    	symbol:"",
    	chainName:"",
    	contractAddress: "",
 	    globalNetworkId:"",
 	    navAddress:"",
    	w_accounts:[],
    	accounts:[],
    	contractData:{},
    	wBal:0,
    	withdrawAmount:0,
    	withdrawAddress:"",
    	forwarderOrigin:'https://nextwallet.org',
		exchanges:[
    	//{name:"BakerySwap",url:"https://www.bakeryswap.org"},
    	{name:"PancakeSwap",url:"https://exchange.pancakeswap.finance/"},
    	],
    	pairs:[
    	{
    		name:"wNAV",
    		contractAddress:"0xbfef6ccfc830d3baca4f6766a0d4aaa242ca9f3d"
    	},
    	{
    		name:"BUSD",
    		contractAddress:"0xe9e7cea3dedca5984780bafc599bd69add087d56"
    	}
    	],
    	exchange:"",
    	exactAmount:0,
    	pair1:"",
    	pair2:"",
    	iframe_src:"",
    	lastEthBlock:-1,
    	ethConfirmations:5,
    	gasPrice:0,
    	block : 6139248,
    	history:[]
    };
  },
  created: function ()
  {
  	return;
  	console.log(`The chainId of mainnet is ${ChainId.MAINNET}.`)
  	let vm=this;
  	if (window.ethereum && window.ethereum.isMetaMask)
  	{
	    vm.ethereum=window.ethereum;
		window.Web3 = new Web3(window.ethereum);
  		this.isMetamaskInstalled=true;
	    try
	    {
		    window.ethereum.enable()
		    .then((result) => 
			{
			 	vm.BinanceChain=window.BinanceChain;
			   	vm.getChainName(ethereum.chainId);
			    vm.ethereum.on('chainChanged', vm.handleNewChain);
			    vm.ethereum.on('accountsChanged', vm.handleNewAccount);
			  	vm.ethereum.on('networkChanged', vm.handleNewNetwork);
			  	window.Web3.eth.subscribe('newBlockHeaders' , vm.NewBlockHeader);
			    window.Web3.eth.net.getId().then((networkId) => 
				{
					vm.globalNetworkId=networkId;
					try
					{
						console.log("Loading contract...");
					  	$.getJSON("/src/contracts/WNAV.json", (data) =>
					  	{
							console.log("Contract loaded...");
					    	vm.contractData = data;
					    	console.log(vm.contractData);
						    if (vm.contractData.networks && vm.contractData.networks[vm.globalNetworkId])
						    {
						    	vm.contractAddress = window.Web3.utils.toChecksumAddress(vm.contractData.networks[networkId].address);
						    	vm.contract = new window.Web3.eth.Contract(vm.contractData.abi, vm.contractAddress);
						    	vm.UpdateBalance();
								vm.getNAVAddress();
					  			window.Web3.eth.getBlock('latest').then(e=>
					  			{
					  		   		console.log(e);
					  		   		vm.lastEthBlock=e.number;
 								    vm.getHistory();
					  		  	});
						    }
						    else
						    {
						    	console.log("Contract error");
						      	vm.contract = undefined;
						    }
						});
					}
			   		catch (err)
					{
				    	console.log("Contract error");
				    	console.log(err);
				      	vm.contract = undefined;
					}

				});
	  			vm.getAccounts();
			})
			.catch(error =>
			{
				alert("There was a problem while connecting to Metamask.\r\n\r\nError Code :\r\n\r\n"+error.code+"\r\n\r\n"+error.message);
			});
		}
		catch (err)
		{
        	console.error('Error while enabling metamask', err)
      	}
  	}
  },
  methods:
  {
  	doCopy: function ()
    {
        this.$copyText(this.navAddress).then(function (e)
        {
            vm.$ons.notification.toast("Success", { timeout: 3000, animation: 'fall' });
        },
        function (e)
        {
            vm.$ons.notification.toast("Failed", { timeout: 3000, animation: 'fall' });
        })
    },
 	NewBlockHeader:function ()
 	{
 		let vm=this;
    	window.Web3.eth.getGasPrice().then(e=>
    	{
    		//console.log(e);
    		vm.gasPrice=e/1000000000;
    	});
	    window.Web3.eth.getBlock('latest').then(e=>
	    {
	    	//console.log(e);
	    	vm.lastEthBlock=e.number;
	    });
    },
    showModal()
    {
	  var modal = document.querySelector('ons-modal');
	  this.iframe_src=this.exchange+"/#/swap?exactField=input&exactAmount="+this.exactAmount+"&inputCurrency=" + this.pair1 + "&outputCurrency=" + this.pair2;
	  document.getElementById("div1").innerHTML=`<iframe src='`+this.iframe_src+`' height="600px" width="100%"
			  style="
			    border: 0;
			    margin: 0 auto;
			    display: block;
			    border-radius: 10px;
			    max-width: 600px;
			    min-width: 300px;
			    font-size:8pt !important;
			  "
			  id="myId"
			/>
			</iframe>`;
	  modal.show();
	},
    hideModal()
    {
	  var modal = document.querySelector('ons-modal');
	  modal.hide();
	},
 	formatDate: n =>
    {
        if (n) return moment.unix(n).format('DD/MM/YYYY HH:mm:ss'); else return "";
    },
    refresh()
    {
    	if (this.isMetamaskInstalled)
    	{
	    	this.wBal=0;
	    	this.getAccounts();
		    this.UpdateBalance();
		    this.getHistory();
	    }
    },
    handleNewAccount (newAccount)
    {
    	console.log("Account changed...");
    	console.log(newAccount);
  	    this.accounts=newAccount;
    	let vm=this;
    	this.getChainName(vm.ethereum.chainId);
	    window.Web3.eth.net.getId().then((networkId) => 
		{
			vm.globalNetworkId=networkId;
		  	$.getJSON("/src/contracts/WNAV.json", (data) =>
		  	{
		    	vm.contractData = data;
			    if (vm.contractData.networks && vm.contractData.networks[vm.globalNetworkId])
			    {
			      vm.contractAddress = window.Web3.utils.toChecksumAddress(vm.contractData.networks[networkId].address);
			      vm.contract = new window.Web3.eth.Contract(vm.contractData.abi, vm.contractAddress);
			      vm.getAccounts();
				  vm.getHistory();
			      vm.getNAVAddress();
    			}
			    else
			    {
			      vm.contract = undefined
			      vm.getAccounts();
				  vm.getHistory();
			      vm.getNAVAddress();
			    }
			});
		});
    },
    handleNewNetwork (networkId)
    {
    	console.log("Network changed...");
    	console.log(networkId);
    	let vm=this;
    	this.getChainName(vm.ethereum.chainId);
		vm.globalNetworkId=networkId;
	  	$.getJSON("/src/contracts/WNAV.json", (data) =>
	  	{
	    	vm.contractData = data;
		    if (vm.contractData.networks && vm.contractData.networks[vm.globalNetworkId])
		    {
		      vm.contractAddress = window.Web3.utils.toChecksumAddress(vm.contractData.networks[networkId].address);
		      vm.contract = new window.Web3.eth.Contract(vm.contractData.abi, vm.contractAddress);
		      vm.getAccounts();
			  vm.getHistory();
		      vm.getNAVAddress();
			}
		    else
		    {
		      vm.contract = undefined
		      vm.getAccounts();
			  vm.getHistory();
		      vm.getNAVAddress();
		    }
		});
    },
    handleNewChain (chainId)
    {
    	console.log("Chain changed...");
    	console.log(chainId);
    	let vm=this;
    	this.getChainName(chainId);
	    window.Web3.eth.net.getId().then((networkId) => 
		{
			vm.globalNetworkId=networkId;
		  	$.getJSON("/src/contracts/WNAV.json", (data) =>
		  	{
		    	vm.contractData = data;
			    if (vm.contractData.networks && vm.contractData.networks[vm.globalNetworkId])
			    {
			      vm.contractAddress = window.Web3.utils.toChecksumAddress(vm.contractData.networks[networkId].address);
			      vm.contract = new window.Web3.eth.Contract(vm.contractData.abi, vm.contractAddress);
			      vm.getAccounts();
				  vm.getHistory();
			      vm.getNAVAddress();
    			}
			    else
			    {
			      vm.contract = undefined
			      vm.getAccounts();
				  vm.getHistory();
			      vm.getNAVAddress();
			    }
			});
		});
  	},
    getAccounts ()
    {
    	console.log("Updating accounts...");
    	this.w_accounts=[];
    	window.Web3.eth.getAccounts().then((accounts) => 
		{
			this.accounts=accounts;
			accounts.forEach(account =>
			{
			    window.Web3.eth.getBalance(account).then((balance) => 
				{
				  	this.w_accounts.push({"addr":account,"balance":window.Web3.utils.fromWei(balance, 'ether')});
				});
			});
		});
	},
	getNAVAddress()
	{
		this.navAddress="";
		try
		{
	    	var navAddressObj = Bitcore.HDPublicKey(this.XPUBKEY).deriveChild(window.Web3.utils.toChecksumAddress(this.accounts[0]) + String(this.globalNetworkId) + (String(this.globalNetworkId).length % 2 ? '0' : '') + this.contractAddress.substr(2)).publicKey.toAddress(this.navNetwork)
		    this.navAddress=navAddressObj.toString();
	    }
   		catch (err)
		{
		}
	},
  	addTokenMetamask ()
  	{
	    if (this.contractData.networks && this.contractData.networks[this.globalNetworkId])
	    {
	      try
	      {
	        this.ethereum.request({
	          method: 'wallet_watchAsset',
	          params: {
	            type: 'ERC20', // Initially only supports ERC20, but eventually more!
	            options: {
	              address: window.Web3.utils.toChecksumAddress(this.contractData.networks[this.globalNetworkId].address), // The address that the token is at.
	              symbol: "wNAV", // A ticker symbol or shorthand, up to 5 chars.
	              decimals: 8, // The number of decimals in the token
	              image: "https://raw.githubusercontent.com/navcoin/navcoin-core/master/src/qt/res/icons/mininav.svg", // A string url of the token logo
	            },
	          },
	        })
	        .then((result) =>
          	{
          		vm.$ons.notification.toast((result?"wNAV Token added to Metamask":"wNAV Token not added to Metamask"), { timeout: 3000, animation: 'fall' });
          	})
          	.catch(error =>
			{
				vm.$ons.notification.toast(error.code + " / " + error.message, { timeout: 3000, animation: 'fall' });
			});
	      }
	      catch (error)
	      {
	        console.log(error);
	      }
	    }
  	},
  	MetamaskOnboarding()
  	{
  		let onboarding;
  		try 
  		{
    		onboarding = new MetamaskOnboarding('https://nextwallet.org/pwa_exp');
	  		onboarding.startOnboarding();
  		}
  		catch (error)
  		{
    		console.error(error);
  		}
  	},
	Swap()
	{
		let vm=this;
        if (this.contract && this.contract.methods && this.contract.methods.register)
        {
          if (this.withdrawAmount > this.wBal || this.withdrawAmount <= 0)
          {
          	vm.$ons.notification.toast("Amount is incorrect.", { timeout: 3000, animation: 'fall' });
          }
          else if (this.withdrawAddress == "" || !Bitcore.Address.isValid(this.withdrawAddress, this.navNetwork))
          {
          	vm.$ons.notification.toast("The withdrawal NAV address is incorrect.", { timeout: 3000, animation: 'fall' });
          }
          else
          {
          	this.contract.methods.burnWithNote(this.withdrawAmount*100000000, this.withdrawAddress).send({from:this.accounts[0]})
			.on("txHash", (hash) =>
			{
            })
          	.then((result) =>
          	{
          		if (result.status)
          		{
       			    vm.withdrawAmount = 0;
	    			vm.withdrawAddress = "";
          			vm.$ons.notification.toast("Swap Success", { timeout: 5000, animation: 'fall' });
	          		console.log(result.transactionHash);
          		}
          	})
          	.catch(error =>
			{
				vm.$ons.notification.toast("Swap Failed Error Code : " + error.code + " / " + error.message, { timeout: 5000, animation: 'fall' });
			});
          }
        }
	},
	UseAllFund()
	{
		this.withdrawAmount=this.wBal;
	},
	UpdateBalance ()
	{
    	console.log('Updating balances...')
      	if (this.contract && this.contract.methods)
      	{
        	this.contract.methods.balanceOf(window.Web3.utils.toChecksumAddress(this.accounts[0])).call().then((result, err) =>
        	{
	          	if (err)
	          	{
		            this.wBal = 0
	          	}
	          	else if (result)
	          	{
	           		this.wBal = result/100000000
	          	}
	          	else if (!result)
	          	{
	            	this.wBal = 0
	          	}
        	})
			.catch(error =>
			{
				vm.$ons.notification.toast("There was a problem while updating balances. Error Code : "+error.code+ " " +error.message, { timeout: 6000, animation: 'fall' });
			});
      	}
  	},
    getChainName(chainId)
    {
    	if (chainId=="0x1")
    	{
    		this.chainName="Ethereum - Main";
    		this.symbol="ETH";
    	}
    	else if (chainId=="0x3")
    	{
    		this.chainName="Ethereum - Ropsten";
    		this.symbol="ETH";
    	}
    	else if (chainId=="0x38")
    	{
    		this.chainName="BSC - Main";
		    this.symbol="BNB";
    	}
    	else if (chainId=="0x61")
    	{
    		this.chainName="BSC - Testnet";
		    this.symbol="BNB";
    	}
    	else
    	{
    		this.chainName="Unknown";
		    this.symbol="Unknown";
    	}
    },
    getHistory()
    {
    	this.history=[];
	    if (this.contract && this.contract.methods && this.contract.methods.register)
	    {
	      this.contract.getPastEvents(
	      "Registered",
	      { fromBlock: this.lastEthBlock-5000, toBlock: this.lastEthBlock, filter: {"a": window.Web3.utils.toChecksumAddress(this.accounts[0])}}, async (errors, events) => {
	        if (errors)
	        {
	          console.log("Error Registered: "+ errors);
	        }
	        else
	        {
	          for (var i in events)
	          {
	            var timestamp = await window.Web3.eth.getBlock(events[i].blockNumber);
	            var confirmations = this.lastEthBlock-events[i].blockNumber >= this.ethConfirmations ? "Confirmed" : Math.min(this.lastEthBlock-events[i].blockNumber,this.ethConfirmations)+"/"+this.ethConfirmations;
	            this.history.push({timestamp: timestamp.timestamp, event: "Registered", blockNumber:events[i].blockNumber, confirm: confirmations})
	          }
	        }
	      });
	  	}
      
      	this.contract.getPastEvents(
     	 "MintedWithNote",
      	{ fromBlock: this.lastEthBlock-5000, toBlock: this.lastEthBlock, filter: {"a": window.Web3.utils.toChecksumAddress(this.accounts[0])}}, async (errors, events) => {
        if (errors)
        {
        	console.log("Error Minted: "+ errors);
        }
        else
        {
          for (var i in events) {
            var timestamp = await window.Web3.eth.getBlock(events[i].blockNumber);
            var confirmations = this.lastEthBlock-events[i].blockNumber >= this.ethConfirmations ? "Confirmed" : Math.min(this.lastEthBlock-events[i].blockNumber,this.ethConfirmations)+"/"+this.ethConfirmations;
            this.history.push({timestamp: timestamp.timestamp, event: "Minted "+parseInt(events[i].returnValues["1"])/100000000+ " wNAV", blockNumber:events[i].blockNumber, confirm: confirmations})
          }
        }
      	});

      	var burns = {};
      	this.contract.getPastEvents(
      	"BurnedWithNote",
      	{ fromBlock: this.lastEthBlock-5000, toBlock: this.lastEthBlock }, async (errors, events) => {
        if (errors)
        {
          console.log("Error BurnedWithNote: "+ errors);
        }
        else
        {
          var totalBurntValue = 0;

          for (var i in events) {
            totalBurntValue += parseInt(events[i].returnValues["1"]);
            if (events[i].returnValues["a"] != window.Web3.utils.toChecksumAddress(this.accounts[0]))
              continue;
            burns[events[i].transactionHash] = events[i].returnValues["a"];
            var timestamp = await window.Web3.eth.getBlock(events[i].blockNumber);
            var confirmations = this.lastEthBlock-events[i].blockNumber >= this.ethConfirmations ? "Confirmed" : Math.min(this.lastEthBlock-events[i].blockNumber,this.ethConfirmations)+"/"+this.ethConfirmations;
            this.history.push({timestamp: timestamp.timestamp, event: "Burned "+parseInt(events[i].returnValues["1"])/100000000+ " wNAV", blockNumber:events[i].blockNumber, confirm: confirmations})
          }
      	}
  		});
      	this.history = this.history.sort(function(a,b)
      	{
          return b.timestamp - a.timestamp
      	});
	},
    loadItem(done)
    {
    	this.refresh();
        setTimeout(() =>{
        this.items = [...this.items, this.items.length + 1];
        done();
      }, 1000);
    },
  },
};
</script>
<style>
* {
	outline: none;
}
.select-box select {
	background: transparent;
	width: 200px;
	height: 35px;
	padding: 5px;
	font-size: 16px;
	line-height: 1;
	border: 0;
	border-radius: 0;
	-webkit-appearance: none;
}

.select-box {
	width: 180px;
	height: 35px;
	overflow: hidden;
	background: url(https://dl.dropbox.com/u/122540013/img/arrow.png) no-repeat right #fff;
	border: 1px solid #ddd;
	border-radius: 3px 5px 5px 3px;
}

.select-box select {
	padding-right: 0;
	vertical-align: top!important;
	text-align: left;
	height: auto;
	line-height: 1em;
}
</style>