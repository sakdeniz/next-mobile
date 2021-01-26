<template>
   <v-ons-page v-if="!walletExist || !walletUnlocked || !walletBackedup">
		<v-ons-carousel fullscreen swipeable auto-scroll overscrollable :index.sync="carouselIndex" :auto-scroll-ratio="0.1" v-show="bCarousel">
  			<v-ons-carousel-item v-for="(itm) in carouselItems" class="carousel-item">
    			<div class="title-1"><span v-html="itm.title_1"></span></div>
    			<div class="title-2"><center><span v-html="itm.title_2"></span></center></div>
				<div>
					<v-ons-button v-show="carouselIndex<Object.keys(carouselItems).length-1" v-on:click="skip()">Skip</v-ons-button>
					<v-ons-button v-show="carouselIndex==Object.keys(carouselItems).length-1" v-on:click="skip()">Let's Start</v-ons-button>
				</div>
 	 		</v-ons-carousel-item>
		</v-ons-carousel>

    	<div class="dots" v-show="bCarousel">
    		<span v-for="dotIndex in Object.keys(carouselItems).length" :key="dotIndex" @click="carouselIndex = dotIndex - 1">
        		{{ carouselIndex === dotIndex - 1 ? '\u25CF' : '\u25CB' }}
     		</span>
    	</div>

		<div class="main" v-show="!walletExist && !languageSelected && !bCarousel">
			<div class="wrapper">
				<center>
					<div class="welcome_logo">
						NEXT
					</div>
					<h3 class="title">
						{{$t('message.selectLanguage')}}
					</h3>
				</center>
				<v-ons-list>
					<v-ons-list-item v-for="(language, $index) in config.languages" :key="language.code" tappable v-on:click="setLanguage(language)">
						<div class="left">
							<span class="ion-checkmark" v-show="language.code==selectedLanguage"></span>
						</div>
						<div class="center">
							{{language.name}}
						</div>
					</v-ons-list-item>
					<div style="margin-top:30px;">
						<center>
							<v-ons-button v-on:click="languageSelected=true">{{$t('message.continue')}}</v-ons-button>
						</center>
					</div>
				</v-ons-list>
			</div>
		</div>
		<div v-show="!walletExist && !walletUnlocked && !termsAccepted && languageSelected">
			<div class="terms">
				<div class="welcome_logo">
					NEXT
				</div>
				<h2 class="title">
			  		{{$t('message.terms')}}
				</h2>
				  <p>
				    This is a binding Agreement between NavCoin Developers (“NavCoin” or “We”) and the person, persons, or entity (“You” or “Your”) using the service, Software, or application (“Software”).
				  </p>
				  <p class="terms__heading">
				    RIGHTS AND OBLIGATIONS
				  </p>
				  <p>
				    NavCoin provides the Software solely on the terms and conditions set forth in this Agreement and on the condition that You accept and comply with them. By using the Software You (a) accept this Agreement and agree that You are legally bound by its terms; and (b) represent and warrant that: (i) You are of legal age to enter into a binding agreement; and (ii) if You are a corporation, governmental organization or other legal entity, You have the right, power and authority to enter into this Agreement on behalf of the corporation, governmental organization or other legal entity and bind them to these terms.
				  </p>
				  <p>
				    This Software functions as a free, open source, and multi-signature digital wallet. The Software does not constitute an account where We or other third parties serve as financial intermediaries or custodians of Your NavCoin(s).
				  </p>
				  <p>
				    While the Software has undergone beta testing and continues to be improved by feedback from the open-source user and developer community, We cannot guarantee there will not be bugs in the Software. You acknowledge that Your use of this Software is at Your own discretion and in compliance with all applicable laws. You are responsible for safekeeping Your passwords, private key pairs, PINs, and any other codes You use to access the Software.
				  </p>
				  <p>
				    IF YOU LOSE ACCESS TO YOUR NAV COIN WALLET OR YOUR ENCRYPTED PRIVATE KEYS AND YOU HAVE NOT SEPARATELY STORED A BACKUP OF YOUR WALLET AND CORRESPONDING PASSWORD, YOU ACKNOWLEDGE AND AGREE THAT ANY NAV COIN YOU HAVE ASSOCIATED WITH THAT WALLET WILL BECOME INACCESSIBLE. All transaction requests are irreversible. The authors of the Software, employees and affiliates of NAV COIN, copyright holders, and NAV COIN cannot retrieve Your private keys or passwords if You lose or forget them and cannot guarantee transaction confirmation as they do not have control over the NavCoin network.
				  </p>
				  <p class="terms__heading">
				    DISCLAIMER
				  </p>
				  <p>
				    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OF THE SOFTWARE, EMPLOYEES AND AFFILIATES OF NAV COIN, COPYRIGHT HOLDERS, OR NAV COIN BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
				  </p>
				  <p>
				    IN NO EVENT WILL NAV COIN OR ITS AFFILIATES, OR ANY OF ITS OR THEIR RESPECTIVE SERVICE PROVIDERS, BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY USE, INTERRUPTION, DELAY OR INABILITY TO USE THE SOFTWARE, LOST REVENUES OR PROFITS, DELAYS, INTERRUPTION OR LOSS OF SERVICES, BUSINESS OR GOODWILL, LOSS OR CORRUPTION OF DATA, LOSS RESULTING FROM SYSTEM OR SYSTEM SERVICE FAILURE, MALFUNCTION OR SHUTDOWN, FAILURE TO ACCURATELY TRANSFER, READ OR TRANSMIT INFORMATION, FAILURE TO UPDATE OR PROVIDE CORRECT INFORMATION, SYSTEM INCOMPATIBILITY OR PROVISION OF INCORRECT COMPATIBILITY INFORMATION OR BREACHES IN SYSTEM SECURITY, OR FOR ANY CONSEQUENTIAL, INCIDENTAL, INDIRECT, EXEMPLARY, SPECIAL OR PUNITIVE DAMAGES, WHETHER ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT, BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE) OR OTHERWISE, REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE AND WHETHER OR NOT WE WERE ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
				  </p>
				  <p class="terms__heading">
				    INTELLECTUAL PROPERTY
				  </p>
				  <p>
				    We retain all right, title, and interest in and to the Content and all of NavCoin’s brands, logos, and trademarks, including, but not limited to, NavCoin, NEXT, NEXT Wallet, NEXT Mobile Wallet, and variations of the wording of the aforementioned brands, logos, and trademarks.
				  </p>
				  <p class="terms__heading">
				    CHOICE OF LAW
				  </p>
				  <p>
				    This Agreement, and its application and interpretation, shall be governed exclusively by the laws of the State of Georgia, without regard to its conflict of law rules. You consent to the exclusive jurisdiction of the federal and state courts located in or near Atlanta, Georgia for any dispute arising under this Agreement.
				  </p>
				  <p class="terms__heading">
				    SEVERABILITY
				  </p>
				  <p>
				    In the event any court shall declare any section or sections of this Agreement invalid or void, such declaration shall not invalidate the entire Agreement and all other paragraphs of the Agreement shall remain in full force and effect.
				  </p>
				  <p class="terms__heading">
				    BINDING AGREEMENT
				  </p>
				  <p>
				    The terms and provisions of this Agreement are binding upon Your heirs, successors, assigns, and other representatives. This Agreement may be executed in counterparts, each of which shall be considered to be an original, but both of which constitute the same Agreement.
				  </p>
				  <p>
				    You assume any and all risks associated with the use of the Software. We reserve the right to modify this Agreement from time to time.
				  </p>
				  <center>
				  	<v-ons-button style="margin-top: 30px" v-on:click="acceptTerms()">{{$t('message.acceptTerms')}}</v-ons-button>
				  </center>
			</div>
		</div>

		<div class="main" v-show="termsAccepted">
			<div class="wrapper">
				<center>
			    	<div class="welcome_logo">NEXT</div>
				    
				    <div v-show="walletExist && walletUnlocked && termsAccepted && !walletBackedup">
	  			      	<div style="margin-bottom:15px;padding:10px;">
	 			      		<p>
	 			      			<small>
	 			      			{{$t('message.backupInfo1')}}
	 			      			</small>
	 			      		</p>
	 			      		<p>
	 			      			<small>
	 			      			{{$t('message.backupInfo2')}}
	 			      			</small>
	 			      		</p>
	  			      	</div>
				    	<div>
				    		<h3>
				    			{{$t('message.backupPhrase')}}
				    		</h3>
				    		<code>
				    			{{mnemonics}}
				    		</code>
				    	</div>
				    	<v-ons-button style="margin-top: 30px" v-on:click="confirmBackupWallet()">{{$t('message.confirmBackupWallet')}}</v-ons-button>
				    </div>

				    <div v-show="!walletExist && !walletUnlocked && termsAccepted && languageSelected">
				      <div class="title" style="margin-bottom:15px;">
				        {{$t('message.hello')}}
				      </div>
	  			      <div style="margin-bottom:15px;padding:10px;">
	 			      		<p>
	 			      			<small>
	 			      			{{$t('message.passwordInfo1')}}
	 			      			</small>
	 			      		</p>
	 			      		<p>
	 			      			<small style="color:'red'">
	 			      			{{$t('message.passwordInfo2')}}
	 			      			</small>
	 			      		</p>
	  			      </div>
				      <div class="content" style="padding:10px;">
				    	
				    	<v-ons-segment :index.sync="segmentIndex" style="width:100%;margin-bottom:30px;">
	          				<button>{{$t('message.segmentCreateWallet')}}</button>
	          				<button>{{$t('message.segmentImportWallet')}}</button>
	        			</v-ons-segment>
	        			<div v-show="segmentIndex==0">
					        <div class="center">
					          <v-ons-input type="password" :placeholder="$t('message.password')" v-model="password" float style="width:100%"></v-ons-input>
					        </div>
					        <br />
					        <div class="center" style="margin-top:10px;margin-bottom:10px;">
					          <v-ons-input type="password" :placeholder="$t('message.passwordAgain')" v-model="password_again" float style="width:100%"></v-ons-input>
					        </div>
					        <br />
					        <v-ons-button v-show="!busy" style="margin: 6px 0" v-on:click="createWallet()">{{$t('message.createWallet')}}</v-ons-button>
				            <v-ons-progress-circular indeterminate v-show="busy"></v-ons-progress-circular>
			        	</div>
			        	<div v-show="segmentIndex==1">
				        	<div class="center" style="margin-bottom:30px;">
					          	<v-ons-input type="text" :placeholder="$t('message.mnemonics')" v-model="mnemonics" float style="width:100%"></v-ons-input>
				          	</div>
							<div class="center" style="margin-top:30px;margin-bottom:30px;">
					        	<v-ons-input type="password" :placeholder="$t('message.password')" v-model="password" float style="width:100%"></v-ons-input>
					        </div>
					        <div class="center" style="margin-top:30px;margin-bottom:15px;">
					        	<v-ons-input type="password" :placeholder="$t('message.passwordAgain')" v-model="password_again" float style="width:100%"></v-ons-input>
					        </div>
					        <br />
				        	<v-ons-button v-show="!busy" style="margin: 6px 0" v-on:click="importWallet()">{{$t('message.importWallet')}}</v-ons-button>
			            	<v-ons-progress-circular indeterminate v-show="busy"></v-ons-progress-circular>
			        	</div>
				      </div>
				    </div>

				    <div v-show="walletExist && !walletUnlocked">
				      <div class="title" style="margin-bottom:30px;">
				        {{$t('message.unlock')}}
				      </div>
				      <div class="content" style="margin-bottom:15px;">
				        <div class="center">
				            <v-ons-input placeholder="Password" type="password" float v-model="password"></v-ons-input>
				        </div>
				        <v-ons-button style="margin-top: 30px" v-on:click="unlockWallet()">{{$t('message.btnUnlock')}}</v-ons-button>
				      </div>
				    </div>
				</center>
			</div>
		</div>
  </v-ons-page>
  <v-ons-navigator v-else swipeable swipe-target-width="50px"
    :page-stack="pageStack"
    :pop-page="storePop"
    :options="options"
    :class="{ 'border-radius': borderRadius }"
  ></v-ons-navigator>
</template>

<script>
const IV_LENGTH = 16; // For AES, this is always 16
const buffer=require('buffer');
const crypto=require('crypto');
const bitcore = require('bitcore-lib');
const Mnemonic = require('bitcore-mnemonic');
var ENCRYPTION_KEY;
window.config={ headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, responseType: 'text' }
window.apiURL='https://navcommunity.net/api/lw/';
window.network='main';
function encrypt (text)
{
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}
function decrypt (text)
{
    try
    {
        let textParts=text.split(':');
        let iv=new buffer.Buffer(textParts.shift(), 'hex');
        let encryptedText=new buffer.Buffer(textParts.join(':'), 'hex');
        let decipher=crypto.createDecipheriv('aes-256-cbc', new buffer.Buffer(ENCRYPTION_KEY), iv);
        let decrypted=decipher.update(encryptedText);
        decrypted=buffer.Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }
    catch (e)
    {
        return false;
    }
}

import AppSplitter from './AppSplitter.vue';
export default {
  beforeCreate() {
    this.$store.commit('navigator/push', AppSplitter);
  },
  data() {
    return {
	  selectedLanguage: 'en',
      busy:false,
      shutUp: this.md,
      step:0,
      segmentIndex: 0,
      password:"",
      password_again:"",
      walletExist:false,
      languageSelected:false,
      walletUnlocked:false,
      walletBackedup:false,
      termsAccepted:false,
      bCarousel:false,
      mnemonics:'',
      closeConfirmActive:false,
      addr:{},
      carouselIndex: 0,
      carouselItems: [
      	{"title_1":"Welcome to NavCoin NEXT","title_2":"<p>NavCoin is an open-source, blockchain based Proof of Stake cryptocurrency.</p><p>Its design is public, nobody owns or controls NavCoin, and everyone can take part.</p><p>It’s a platform that’s run by its users, for its users - with an incentivised network of nodes verifying payments all around the world.</p>","bgcolor":"red"},
      	{"title_1":"Spend Easily","title_2":"<p>Designed for fast, cheap, and secure peer-to-peer payments.</p><p>A network that's driven to lowering the cost of doing business.</p>","bgcolor":"blue"},
      	{"title_1":"Take Control","title_2":"Take full control and customize your wallet to your needs.","bgcolor":"orange"},
      	{"title_1":"Community Fund","title_2":"<p>Projects are funded and approved by the decentralized network with no central authority.</p><p>This ensures NavCoin’s direction remains firmly in the best interest of the entire network.</p><p>This fund pays you to take your idea, nurture it, and build a team to bring it to life.</p>","bgcolor":"orange"},
      	{"title_1":"Cold Staking","title_2":"<p>Cold-staking means that your wallet is not online staking and subject to attacks.</p><p>Instead, a staking wallet which contains no NAV will be staking on behalf of your spending wallet which holds your NAV.</p><p>Bear in mind that you still need a node actively staking ideally 24⁄7 to get your staking rewards.</p>","bgcolor":"orange"},
      ]
	}
  },
  computed: {
  	config()
  	{
		return this.$store.state.config;
  	},
    pageStack() {
		return this.$store.state.navigator.stack;
    },
    options() {
		return this.$store.state.navigator.options;
    },
    borderRadius() {
		return new URL(window.location).searchParams.get('borderradius') !== null;
    }
  },
  created: function ()
  {
		let vm=this;
		if (typeof(QRScanner) != "undefined")
		{
			this.$ons.ready(() => {
				document.addEventListener('resume', this.onResume, false);
				vm.$ons.setDefaultDeviceBackButtonListener(function(event)
				{
					if (vm.closeConfirmActive) return;
					vm.closeConfirmActive=true;
					QRScanner.getStatus(function(status)
					{
						if (status.scanning)
						{
							QRScanner.cancelScan(function(status)
			    			{
							});
			    			$("#page-send").show();
			    			$("#page-add-contact").show();
					  	}
						else
						{
					    	vm.$ons.notification.confirm(vm.$t('message.confirmCloseQuestion'),{title:vm.$t('message.confirmClose'),buttonLabels:[vm.$t('message.confirmCloseNo'), vm.$t('message.confirmCloseYes')]})
							.then((response) =>
					    	{
					    		if (response)
					    		{
					    			navigator.app.exitApp();
					    		}
					    		else
					    		{
					    			vm.closeConfirmActive=false;
					    		}
					    	});
					  	}
					});
				});
			});
		}

    	if (!localStorage.getItem("config"))
    	{
    		localStorage.setItem("config",'{"language":{"name":"English","code":"en"},"currency":{"symbol":"USD","code":"USD"},"book":[]}');
    	}
    	var config=JSON.parse(localStorage.getItem("config"));
    	this.$store.commit('config/setLockWalletOnDeactivate', config.lock_wallet_on_deactivate);
    	this.$store.commit('config/setColdStakingActive', config.cold_staking_active);
    	this.$store.commit('config/setColdStakingAddress', config.cold_staking_address);
    	this.$store.commit('config/setBook', config.book);
    	this.$store.commit('config/setLanguage', {name:config.language.name,code:config.language.code})
    	this.$store.commit('config/setCurrency', {symbol:config.currency.symbol,code:config.currency.code})
		this.$i18n.locale=config.language.code;
    	if (window.network=="main")
		{
			bitcore.Networks.defaultNetwork = bitcore.Networks.livenet;
		}
		else
		{
			bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
		}
		if (localStorage.getItem('db'))
		{
			this.walletExist=true;
			this.termsAccepted=true;
            this.walletBackedup=true;
			console.log("Wallet exist.");
		}
		else
		{
			this.bCarousel=true;
			console.log("Wallet not exist.");
		}
    },
    methods:
    {
    	skip()
    	{
    		this.bCarousel=false;
    	},
    	onResume()
    	{
    		if (this.$store.state.config.lock_wallet_on_deactivate)
    		{
    			console.log("Wallet locked.")
	    		this.password="";
	    		this.walletUnlocked=false;
	    	}
	    	else
	    	{
	    		console.log("Auto locking disabled.")
	    	}
		},
    	disableScanner()
    	{
    		console.log("disable");
			$("#page1").show();
			$("#page2").show();
    	},
    	setLanguage(language)
	    {
	    	this.selectedLanguage=language.code;
			this.$store.commit('config/setLanguage', language)
			this.$i18n.locale=language.code;
			this.$store.commit('navigator/pop');
	    },
    	acceptTerms: function ()
    	{
    		this.termsAccepted=true;
    	},
    	confirmBackupWallet: function ()
    	{
    		this.walletBackedup=true;
    	},
    	importWallet: function ()
    	{
        	if (!this.mnemonics)
			{
                this.$ons.notification.toast(vm.$t('message.errorPleaseSpecifyMnemonics'), { timeout: 1000, animation: 'fall' });
			}
        	else if (!this.password)
			{
                this.$ons.notification.toast(vm.$t('message.errorPleaseSpecifyPassword'), { timeout: 1000, animation: 'fall' });
			}
			else if (this.password.length<6)
			{
				this.$ons.notification.toast(vm.$t('message.errorMinPasswordLength'), { timeout: 1000, animation: 'fall' });
			}
			else if (this.password!=this.password_again)
			{
				this.$ons.notification.toast(vm.$t('message.errorPasswordMismatch'), { timeout: 1000, animation: 'fall' });
			}
			else
			{
	    		var valid = Mnemonic.isValid(this.mnemonics);
	    		if (!valid)
	    		{
	    			this.$ons.notification.toast(vm.$t('message.invalidMnemonics'), { timeout: 1000, animation: 'fall' });
	    		}
	    		else
	    		{
	    			this.createDatabase(true);
	    		}
	    	}
    	},
        createWallet: function ()
        {
        	if (!this.password)
			{
                this.$ons.notification.toast(vm.$t('message.errorPleaseSpecifyPassword'), { timeout: 1000, animation: 'fall' });
			}
			else if (this.password.length<6)
			{
				this.$ons.notification.toast(vm.$t('message.errorMinPasswordLength'), { timeout: 1000, animation: 'fall' });
			}
			else if (this.password!=this.password_again)
			{
				this.$ons.notification.toast(vm.$t('message.errorPasswordMismatch'), { timeout: 1000, animation: 'fall' });
			}
			else
			{
				this.createDatabase(false);
        	}
        },
       	createDatabase: function (bImport)
       	{
			var code;
			this.busy=true;
            if (bImport) code=new Mnemonic(this.mnemonics); else code=new Mnemonic(Mnemonic.Words.ENGLISH);
            this.mnemonics=code;
            var xpriv=code.toHDPrivateKey();
            var value=buffer.Buffer.from(code.toString());
            var hash=bitcore.crypto.Hash.sha256(value);
            var bn=bitcore.crypto.BN.fromBuffer(hash);
            var privateKey=new bitcore.PrivateKey(bn);
            var address=privateKey.toAddress();
            var exported=privateKey.toWIF();
            ENCRYPTION_KEY=crypto.createHash('md5').update(this.password).digest("hex");
            window.ENCRYPTION_KEY=ENCRYPTION_KEY;
            window.adapter=new LocalStorage('db', {serialize: (data) => encrypt(JSON.stringify(data)),deserialize: (data) => JSON.parse(decrypt(data))});
            window.db=low(window.adapter);
            window.db.defaults({addr:[],mnemonics:code.toString(),count:0}).write();
            window.db.get('addr').push({publicAddress: address.toString(),privateKey: privateKey.toWIF(),xpriv: xpriv.toString()}).write();
            this.walletExist=true;
            this.walletUnlocked=true;
            /*console.log("*** Create wallet");
            console.log("*** Password:"+this.password);
            console.log("*** Password Again:"+this.password_again);
            console.log("*** DB:"+JSON.stringify(window.db.get('addr')));
            console.log("*** Mnemonics\r\n" + code);
            console.log("*** Private Key\r\n" + privateKey);
            console.log("*** HD Private Key\r\n" + xpriv);
            console.log("*** Public Address\r\n" + address);*/
       	},
        unlockWallet: function ()
        {
            //if (!this.password)
			//{
            //    this.$ons.notification.toast(vm.$t('message.errorPleaseSpecifyPassword'), { timeout: 2000, animation: 'fall' });
			//}
			//else
			//{
	            ENCRYPTION_KEY=crypto.createHash('md5').update(this.password).digest("hex");
	            window.ENCRYPTION_KEY=ENCRYPTION_KEY;
	            window.adapter=new LocalStorage('db', {serialize: (data) => encrypt(JSON.stringify(data)),deserialize: (data) => JSON.parse(decrypt(data))});
	            window.db=low(window.adapter);
	            if (db.has('addr').value())
	            {
	                this.walletUnlocked=true;
	                this.addr=JSON.stringify(window.db.get('addr'));
	            }
	            else
	            {
	                this.$ons.notification.toast(vm.$t('message.invalidPassword'), { timeout: 2000, animation: 'fall' });
	            }
            //}
        },
      st1: function ()
      {
        this.step=1;
      },
      storePop() {
        $("#page1").show();
        this.$store.commit('navigator/pop');
      }
    }
};
</script>
<style>
@font-face
{
	font-family: 'neo';
	src: url('../static/fonts/neo-latina.ttf');
}

html, body {
  height: 100%;
}

.welcome_logo
{
	font-family:'neo';
	font-size:50pt;
	font-weight:normal;
	color:#7D5AB5;
	margin-bottom:15px;
}

.title
{
	color:#232323;
}

.page__background
{
	background: #FFFFFF;
}

.main
{
    height: 100%;
    width: 100%;
    display: table;
}

.wrapper {
    display: table-cell;
    height: 100%;
    vertical-align: middle;
}

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
.progress-bar__primary,
.progress-bar--material__primary {
    background-color: #A4C639;
}

.progress-bar__secondary,
.progress-bar--material__secondary {
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
	padding-left:10px;
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

.terms__heading
{
	font-size:12pt;
	color:#7D5AB5;
}
.terms
{
	padding:10px;
}

.carousel-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
ons-carousel
{
  background: rgb(2,0,36);
  background: radial-gradient(circle, rgba(2,0,36,1) 0%, rgba(99,35,95,1) 0%, rgba(19,0,22,1) 100%); 
}
.title-1 {
  color: #ffffff;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 1px 1px #232323;

}
.title-2{
  color: #ffffff;
  font-size: 20px;
  text-shadow: 1px 1px #232323;
  padding:30px;
}
.dots {
  text-align: center;
  font-size: 30px;
  color: #fff;
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
}
.dots > span {
  cursor: pointer;
}
</style>