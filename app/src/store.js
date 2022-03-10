export default {
  modules: {
    navigator: {
      strict: true,
      namespaced: true,
      state: {
        stack: [],
        options: {}
      },
      mutations: {
        push(state, page) {
          state.stack.push(page);
        },
        pop(state) {
          if (state.stack.length > 1) {
            state.stack.pop();
          }
        },
        replace(state, page) {
          state.stack.pop();
          state.stack.push(page);
        },
        reset(state, page) {
          state.stack = [page || state.stack[0]];
        },
        options(state, newOptions = {}) {
          state.options = newOptions;
        }
      }
    },
    splitter: {
      strict: true,
      namespaced: true,
      state: {
        open: false
      },
      mutations: {
        toggle(state, shouldOpen) {
          if (typeof shouldOpen === 'boolean') {
            state.open = shouldOpen;
          } else {
            state.open = !state.open;
          }
        }
      }
    },

    tabbar: {
      strict: true,
      namespaced: true,
      state: {
        index: 0
      },
      mutations: {
        set(state, index) {
          state.index = index;
        }
      }
    },

    config: {
      strict: true,
      namespaced: true,
      state:
      {
      	address:"",
      	public_address:undefined,
      	private_address:undefined,
      	block_height:"",
      	sync_status:"",
      	sync_progress:"",
      	Balance:null,
        addresses:{
        	spending:
        	{
        		public:
        		{
        		},
        		private:
        		{
        		}
        	},
        	staking:
        	{
        	}
        },
      	txs:[],
      	privateTokens:[],
        names:[],
      	lock_wallet_on_deactivate:false,
      	cold_staking_active:false,
      	cold_staking_address:"",
        language:{},
        wallet_type:{},
        network:{},
        currency:{},
        book:[],
        projects:[],
        languages:[
			{name:'English',code:'en'},
			{name:'Español',code:'es'},
			//{name:'Français',code:'fr'},
			//{name:'Italiano',code:'it'},
			//{name:'Polski',code:'pl'},
			{name:'Deutsch',code:'de'},
			//{name:'Nederlands',code:'ne'},
			//{name:'Pусский',code:'ru'},
			//{name:'Português',code:'pr'},
			{name:'Türkçe',code:'tr'},
			//{name:'中國',code:'jp'}
			],
        wallet_types:[
			{name:'Next Wallet',code:'next'},
			{name:'Navcoin Core',code:'navcoin-core'},
			{name:'NavCash',code:'navcash'},
			{name:'NavPay',code:'navpay'}
			],
        networks:[
			{name:'Mainnet',code:'mainnet'},
			{name:'Testnet',code:'testnet'}
			]
      },
      mutations: {
      	setAddress(state,address)
        {
			state.address=address;
        },
      	setPublicAddress(state,address)
        {
			state.public_address=address;
        },
      	setPrivateAddress(state,address)
        {
			state.private_address=address;
        },
      	setBlockHeight(state,height)
        {
			state.block_height=height;
        },
      	setAllAddresses(state,addresses)
        {
			state.addresses=addresses;
        },
      	setTXHistory(state,txs)
        {
			state.txs=txs;
        },
      	setPrivateTokens(state,privateTokens)
        {
			state.privateTokens=privateTokens;
        },
        setNames(state,names)
        {
      		state.names=names;
        },
      	setSyncStatus(state,status)
        {
			state.sync_status=status;
        },
      	setSyncProgress(state,progress)
        {
			state.sync_progress=progress;
        },
      	setCurrentNode(state,node)
        {
			state.current_node=node;
        },
		setBalance(state,balance)
        {
			state.Balance=balance;
        },
      	setLockWalletOnDeactivate(state,b)
        {
			state.lock_wallet_on_deactivate=b;
			localStorage.setItem("config", JSON.stringify(this.state.config));
        },
        setColdStakingActive(state,b)
        {
			state.cold_staking_active=b;
			localStorage.setItem("config", JSON.stringify(this.state.config));
        },
        setColdStakingAddress(state,address)
        {
			state.cold_staking_address=address;
			localStorage.setItem("config", JSON.stringify(this.state.config));
        },
        setLanguage(state,language)
        {
			state.language=language;
			localStorage.setItem("config", JSON.stringify(this.state.config));
        },
        setWalletType(state,wallet_type)
        {
			state.wallet_type=wallet_type;
			localStorage.setItem("config", JSON.stringify(this.state.config));
        },
        setNetwork(state,network)
        {
			state.network=network;
			localStorage.setItem("config", JSON.stringify(this.state.config));
        },
        setCurrency(state,currency)
        {
			state.currency=currency;
         	localStorage.setItem("config", JSON.stringify(this.state.config));
        },
        setBook(state,book)
        {
			state.book=book;
			localStorage.setItem("config", JSON.stringify(this.state.config));
        },
        addContact(state,contact)
        {
        	state.book.push(contact);
         	localStorage.setItem("config", JSON.stringify(this.state.config));
        },
        removeContact(state,id)
        {
        	state.book.splice(id,1);
         	localStorage.setItem("config", JSON.stringify(this.state.config));
        },
        updateContact(state,contact)
        {
        	state.book.splice(contact.id,1,{name: contact.name,email: contact.email,address: contact.address});
         	localStorage.setItem("config", JSON.stringify(this.state.config));
        },
        addProject(state,project)
        {
        	state.projects.push(project);
         	localStorage.setItem("config", JSON.stringify(this.state.config));
        },
        removeProject(state,id)
        {
        	state.projects.splice(id,1);
         	localStorage.setItem("config", JSON.stringify(this.state.config));
        },
        setProjects(state,projects)
        {
			state.projects=projects;
			localStorage.setItem("config", JSON.stringify(this.state.config));
        }
      }
    }
  }
};