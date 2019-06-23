# NEXT Mobile for Android & iOS
<img src="https://navcommunity.net/assets/img/next-mobile.png">

# Installation Instructions
git clone https://github.com/sakdeniz/next-mobile.git

cd next-mobile

npm install

cd app

npm install

### "More than one instance of bitcore-lib found."
You will receive the following error message because the bitcore-message and bitcore-mnemonic libraries install the bitcore-lib module.

>Error: More than one instance of bitcore-lib found. Please make sure to require bitcore-lib and check that submodules do not also include their own bitcore-lib dependency.

#### Solution
**Remove these 2 folders**

app\node_modules\bitcore-message\node_modules\bitcore-lib

app\node_modules\bitcore-mnemonic\node_modules\bitcore-lib

#### Update magic bytes

Open **app\node_modules\bitcore-message\lib\message.js** file


Change line 31
from

**Message.MAGIC_BYTES = new Buffer('Bitcoin Signed Message:\n');**

to

**Message.MAGIC_BYTES = new Buffer('Navcoin Signed Message:\n');**

## Build Application
npm run build

## Run Application on browser with live reload
npm run dev

## Run Application on Android AVD (Android Virtual Device)
npm run emulate

## Deploy Application on Android device
npm run device