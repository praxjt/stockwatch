let activebtns=document.querySelectorAll('.btn');
let input = document.querySelector('input');
const svgIcon = document.querySelector('.icon');
const container=document.querySelector('.Accionescontainer');
// container.innerHTML = '';
let homesection=document.querySelector(".home")
let stocksection=document.querySelector(".stocksection")
let watchListSection=document.querySelector(".WatchListSection")

const watchlistBtn = document.querySelector(".addtowatchlist");

let defaultunico=document.querySelector('.Unico');
let toggle=document.querySelector('.toggle')
let interactivenodes=document.querySelectorAll('button, h3, select, svg');
let pricecontainer=document.querySelector(".pricecontainer")
console.log(interactivenodes)
let bodies=document.querySelector('body');

let footerbtnlinks=document.querySelectorAll('.footerbtnlink');
console.log(activebtns[2].childNodes)

bodies.addEventListener('click',(e)=>{
        // console.log(node)
let clickedbtn=Array.from(interactivenodes).includes(e.target);
        if(!clickedbtn){

            activebtns.forEach(btn=>{
                btn.classList.remove('active') ;
            })   
        }
    

}
)

activebtns.forEach(btn=>{
    if(btn.className!=="btn"){
btn.classList.remove('active');
    }

    btn.addEventListener('click',()=>{
        activebtns.forEach(btn=>{
            btn.classList.remove('active') ;
            btn.classList.remove('activefooterbtnlink') ;

           
        })
        console.log(btn)
        if(btn.className==="btn"){
            btn.classList.add('active');

        }
        else{
            btn.classList.remove('active') ;
            btn.classList.add('activefooterbtnlink') ;

        }

})
})

async function listOfStocks(query) {
  
  let proxyurl=`https://api.allorigins.win/raw?url=`;

    const searchUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${query}&lang=en-US&region=US&quotesCount=6&newsCount=0&listsCount=2&enableFuzzyQuery=false&quotesQueryId=tss_match_phrase_query&multiQuoteQueryId=multi_quote_single_token_query&newsQueryId=news_cie_vespa&enableCb=true&enableNavLinks=true&enableEnhancedTrivialQuery=true&enableResearchReports=true&enableCulturalAssets=true&enableLogoUrl=true&enableLists=false&recommendCount=5`;

    try {
        // container.classList.remove('.hide');

        const response = await fetch(proxyurl+searchUrl.trim(), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });
        const data = await response.json();
        const quotesList = data.quotes;

        container.innerHTML = '';
        let countid=0

        quotesList.forEach((quote) => {
            let newUnico = defaultunico.cloneNode(true);
            countid++
            newUnico.id=countid;
            newUnico.style.zIndex=1;
            const h3 = newUnico.querySelector('h3');
            const h6=newUnico.querySelector('h6')
           
                h3.textContent = quote.shortname; 
                h6.textContent=quote.symbol;
                // localStorage.setItem(countid, quote.shortname);
                // console.log(quote.shortname, "|", quote.symbol);
           
           

            container.appendChild(newUnico);
            newUnico.addEventListener('click',async (e)=>{
                if(e.target.id){
                  
                   const stockname= e.target.querySelector("h3").textContent
                   const symbol=e.target.querySelector("h6").textContent.trim()
                   console.log("fucjkyou",stockname,symbol)
                homesection.classList.add("hidesection")
                stocksection.classList.remove("hidesection")
    document.querySelector(".stockname").textContent = "Loading...";
    watchlistBtn.classList.add("hidewatchlist")
   
               await fetchStockData( symbol,stockname,e.target.id);

                }
            })
        });

    } catch (error) {
        console.error('Error fetching stock data:', error);
    }
//     newUnico.addEventListener('click',(e)=>{
               
//         if(e.target.id){
//             homesection.classList.add("hidesection")
//             stocksection.classList.remove("hidesection")
        
// // fetchStockData()
//         }})
}

// Event listener for input field
input.addEventListener('input', () => {
    const query = input.value.trim();

    if (query.length > 0) {
        // container.innerHTML = '';

        container.classList.remove('hide');
        listOfStocks(query);
    }
    else{
        const allUnicos = container.querySelectorAll('.Unico');
        allUnicos.forEach((unico) => {
            unico.textContent=''

            unico.remove();
        })
    }
});

toggle.addEventListener('click',()=>{
    clearStockSection() 

homesection.classList.remove("hidesection")
stocksection.classList.add("hidesection")
})
function clearStockSection() {
    document.querySelector(".stockname").textContent = '';
    document.querySelector(".price").textContent = '';
    document.querySelector(".change").textContent = '';
    document.querySelector(".perchnge").textContent = '';

}
function getUnixTimestamps() {
    const now = new Date(); 
    const period1 = Math.floor(new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime() / 1000); // Start of the day (midnight)
    const period2 = Math.floor(Date.now() / 1000); // Current time
    return { period1, period2 };
  }
  async function fetchStockData(stockname,symbol,id) {
    // console.log("hfhgsehfgwgefe",symbol)
    const { period1, period2 } = getUnixTimestamps();
    console.log("period1",period1,"period2",period2)
  let proxyurl=`https://api.allorigins.win/raw?url=`;
  console.log(stockname,symbol)
    const url = `https://query2.finance.yahoo.com/v8/finance/chart/${stockname}?period2=${period1}&period1=${period2}&interval=1m&includePrePost=true&events=div%7Csplit%7Cearn&&lang=en-US&region=US`;
    // const url="https://query2.finance.yahoo.com/v8/finance/chart/TCS.NS?period1=1735916400&period2=1735922537&interval=1m&includePrePost=true&events=div%7Csplit%7Cearn&&lang=en-US&region=US"
  
    try {
      const response = await fetch(proxyurl+url,{
        method: 'GET',
//         headers: {
//             // User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',  // User-Agent header
//   }
});
      const data = await response.json();

  console.log("daata",data)
      // Extract required information
      if(data){
        let change,percentChange
      let chart = data.chart.result[0].meta;
      const price = chart.regularMarketPrice;
      const previousClose = chart.previousClose;
      watchlistBtn.classList.remove("hidewatchlist")

      document.querySelector(".stockname").textContent = `${symbol}\t(${stockname})`;
      document.querySelector(".price").textContent = price;
pricecontainer.id=id
     

      if(previousClose !== undefined && previousClose !== null){
        change = (price - previousClose).toFixed(2);
        percentChange = ((change / previousClose) * 100).toFixed(2);
        document.querySelector(".change").textContent = change
        document.querySelector(".perchnge").textContent = `(${percentChange})`
      

        if(change<0){
            document.querySelector(".change").style.color = "red";
            document.querySelector(".perchnge").style.color = "red";
                }
        else{
            document.querySelector(".change").style.color = "green";
            document.querySelector(".perchnge").style.color = "green";
        }
      }
      else{
        document.querySelector(".change").textContent = ""
        document.querySelector(".perchnge").textContent = ""
  
      }
      watchlistBtn.addEventListener('click', () => {
        stocksection.classList.add("hidesection")
        watchListSection.classList.remove("hidesection")

  createWatchlistButton(stockname,symbol,price,change,percentChange);

      });

     
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
    }
  }
  
  // Fetch and display stock data
//   fetchStockData();
let myfavstock=document.querySelector(".francezawatchlist")
let watchlistContainer=document.querySelector(".watchlistContainer")
// let watchlistContainer=document.querySelector(".watchlistContainer")

let favStockContainerID=0
const addedStocks = new Set();
function createWatchlistButton(stockname, symbol, price, change, percentChange) {  
  console.log(stockname, symbol, price, change, percentChange)
favStockContainerID=favStockContainerID+1

  let favStockContainer = myfavstock.cloneNode(true);
//   uuiry3iuri23yriu23yi
favStockContainer.id=favStockContainerID
favStockContainer.classList.remove("hide");
myfavstock.classList.add("hide");

// fkjhefiywo
  favStockContainer.querySelector(".change").textContent = change
  favStockContainer.querySelector(".perchnge").textContent = `(${percentChange})`
  favStockContainer.querySelector(".stockname").textContent = `${symbol}\t(${stockname})`;
  favStockContainer.querySelector(".price").textContent = price;

  if(!addedStocks.has(symbol)){
  watchlistContainer.prepend(favStockContainer)
  addedStocks.add(symbol)

  }

 document.querySelector('.WatchListSection').classList.remove('hidesection');

  }

  let search =document.querySelector("#search")
  let watchListbtn =document.querySelector("#watchlist")

search.addEventListener("click",()=>{
    stocksection.classList.add("hidesection")
        watchListSection.classList.add("hidesection")
        homesection.classList.remove("hidesection")
})  

watchListbtn.addEventListener("click",()=>{
    stocksection.classList.add("hidesection")
        watchListSection.classList.remove("hidesection")
        homesection.classList.add("hidesection")
})  

  
  
