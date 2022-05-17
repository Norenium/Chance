StartContract();
document.getElementById('contract-address').innerHTML = contractAddress;

//#region variables

/// public
var PrizeAmount = 0;
var IsPrizeAmountFetched = false;

var TicketPrice = 0;
var IsTicketPriceFetched = false;

/// private

var IsBucketReady = false;
var IsIsBucketReadyFetched = false;
var IsBucketFull = false;
var IsIsBucketFullFetched = false;
var ContractBalance = 0;
var IsContractBalanceFetched = false;
var LatestPosition = 0;
var IsLatestPositionFetched = false;


//#endregion

//#region Page Functions
//#region Send Data to contract

document.getElementById('chip-in').addEventListener('click',function(){
      
      if (TicketPrice == 0) {
            if (IsBucketReady != true) {
                  window.alert('There is no running lottery bucket now.')
            } else {
                  window.alert('Ticket Price is not defined correctly.\n Please refresh the page and' +
                        ' try again.')
            }
      } else {
            var val = ethers.utils.parseEther(TicketPrice.toString());
            console.log('sending value (10^18): '+val);
            myContract.chipIn({ value: val});
      }

})


//#endregion 



//#region FETCH contract data methods

function setPageData() {

      myContract.getBucketReady().then(function (value) {

            IsBucketReady = (value.toString());
            IsIsBucketReadyFetched = true;
            document.getElementById('bucket-ready').innerHTML = IsBucketReady;

            if (IsBucketReady) {
                  fetchBucketIsFull();
                  fetchContractBalance();
                  fetchTicketPrice();
                  fetchPrizeAmount();
                  fetchLatestPosition();
            }
      });

};

function fetchContractBalance() {

      myContract.getContractBalance().then(function (value) {

            ContractBalance = normalize(BigInt(value._hex).toString());
            IsContractBalanceFetched = true;
            document.getElementById('contract-balance').innerHTML = ContractBalance;

      });
}


function fetchBucketIsFull() {

      myContract.getBucketFull().then(res => {

            IsBucketFull = res;
            IsIsBucketFullFetched = true;
            document.getElementById('bucket-full').innerHTML = res;

      });

}


function fetchTicketPrice() {

      myContract.getTicketPrice().then(function (value) {

            TicketPrice = ((BigInt(value._hex).toString()) / 100000000);
            IsTicketPriceFetched = true;
            document.getElementById('ticket-price').innerHTML = TicketPrice;
            document.getElementById('ticket-price-2').innerHTML = TicketPrice;
      });

}

function fetchPrizeAmount() {

      myContract.getPrizeAmount().then(function (value) {

            PrizeAmount = ((BigInt(value._hex).toString()) / 100000000);
            IsPrizeAmountFetched = true;
            document.getElementById('prize-amount').innerHTML = PrizeAmount;

      });
}


function fetchLatestPosition() {

      myContract.getLatestPosition().then(function (value) {

            LatestPosition = ((BigInt(value._hex)));
            IsLatestPositionFetched = true;
            document.getElementById('latest-position').innerHTML = LatestPosition;

      });
}


//#endregion

function normalize(inp) {
      return inp / Math.pow(10, 18);
}

//#endregion







//#region Wallet  Functions


//#region         step 0: Start

async function StartContract() {
      console.log('Start Contract');
      // Step 1: get connect to metamask
      checkForMetamask().then(step1 => {
            if (step1) {
                  // step 2: init contract
                  tryInitContract().then(step2 => {

                        setPageData();

                        return Promise.resolve(true);
                  })
            }
      })
}



//#endregion


//#region         step 1: check for metamask
var provider;
var signer;
var hasMetamask = false;
async function checkForMetamask() {

      if (window.ethereum === undefined) {
            sendAlert('You need to install MetaMask Extention.')
            return Promise.resolve(false);

      } else {
            hasMetamask = true;
            provider = new ethers.providers.Web3Provider(window.ethereum, "any");
            await provider.send("eth_requestAccounts", []).then(() => {
                  signer = provider.getSigner();
            });
            console.log('step 1 done.')
            return Promise.resolve(true);
      }
}

function sendAlert(msg) {
      setTimeout(() => {
            window.alert(msg);
      }, 1000)
}

//#endregion 


//#region         step 2: init Contract

var myContract;
var isContractInit = false;

function tryInitContract() {
      try {
            myContract = new ethers.Contract(contractAddress, ABI, signer);
            isContractInit = true;
            console.log('step 2 - contract init done.');
            return Promise.resolve(true);
      } catch (error) {
            return Promise.resolve(false);
      }
}

 //#endregion




//#endregion