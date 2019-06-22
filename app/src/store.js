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
        language:{},
        currency:{},
        book:[],
        languages:[
			{name:'English',code:'en'},
			//{name:'Español',code:'es'},
			//{name:'Français',code:'fr'},
			//{name:'Italiano',code:'it'},
			//{name:'Polski',code:'pl'},
			//{name:'Deutsch',code:'de'},
			//{name:'Nederlands',code:'ne'},
			//{name:'Pусский',code:'ru'},
			//{name:'Português',code:'pr'},
			{name:'Türkçe',code:'tr'},
			//{name:'中國',code:'jp'}
			]
      },
      mutations: {
        setLanguage(state,language)
        {
			state.language=language;
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
        }
      }
    }
  }
};