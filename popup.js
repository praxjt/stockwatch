document.addEventListener("DOMContentLoaded", () => {
  let activebtns = document.querySelectorAll(".btn");

  const container = document.querySelector(".Accionescontainer");
  let homesection = document.querySelector(".home");
  let stocksection = document.querySelector(".stocksection");
  let watchListSection = document.querySelector(".WatchListSection");

  const addtowatchlistbtn = document.querySelector(".addtowatchlist");

  let toggle = document.querySelector(".toggle");
  let interactivenodes = document.querySelectorAll("button, h3, select, svg");

  let bodies = document.querySelector("body");

  bodies.addEventListener("click", (e) => {
    let clickedbtn = Array.from(interactivenodes).includes(e.target);
    if (!clickedbtn) {
      activebtns.forEach((btn) => {
        btn.classList.remove("active");
      });
    }
  });

  activebtns.forEach((btn) => {
    if (btn.className !== "btn") {
      btn.classList.remove("active");
    }

    btn.addEventListener("click", () => {
      activebtns.forEach((btn) => {
        btn.classList.remove("active");
        btn.classList.remove("activefooterbtnlink");
      });
      if (btn.className === "btn") {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
        btn.classList.add("activefooterbtnlink");
      }
    });
  });

  const input = document.querySelector("input");
  let currentQuery = "";

  input.addEventListener("input", async () => {
    const query = input.value.trim();
    currentQuery = query;

    if (query === "") {
      container.classList.add("hide");
      // container.innerHTML = "";
      return;
    }

    try {
      const url1 =
        "https://livestockerserve-backend.onrender.com/api/search-scrip";
      const response = await fetch(url1, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "12345678",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (query !== currentQuery) {
        return;
      }

      await searchScrips(data);
    } catch (error) {
      console.error("Error fetching scrips:", error);

      if (query === currentQuery) {
        container.classList.remove("hide");
        container.classList.add("emptysearchlist");
        container.textContent = "Try Again Later";
      }
    }
  });

  toggle.addEventListener("click", () => {
    clearStockSection();

    homesection.classList.remove("hidesection");
    stocksection.classList.add("hidesection");
    watchListSection.classList.add("hidesection");
  });

  function clearStockSection() {
    document.querySelector(".stockname").textContent = "";
    document.querySelector(".price").textContent = "";
    document.querySelector(".change").textContent = "";
    document.querySelector(".perchnge").textContent = "";
  }
  let watchlistContainer = document.querySelector(".watchlistContainer");

  function getFavWatchlistToken() {
    return JSON.parse(localStorage.getItem("watchlistTemp")) || [];
  }

  function saveWatchlistToken(tokens) {
    localStorage.setItem("watchlistTemp", JSON.stringify(tokens));
  }

  function AddToWatchlistToken(token) {
    let favWatchlistToken = getFavWatchlistToken();
    if (!favWatchlistToken.includes(token)) {
      favWatchlistToken.push(token);
      saveWatchlistToken(favWatchlistToken);
    }

    // localStorage.setItem(`stock-${token}`, JSON.stringify(stockObject));
  }

  function RemoveFromWatchlistToken(token, stockDiv) {
    let favWatchlistToken = getFavWatchlistToken();
    favWatchlistToken = favWatchlistToken.filter((tk) => tk !== token);
    localStorage.removeItem(`stock-${token}`);
    saveWatchlistToken(favWatchlistToken);
    stockDiv.remove();
    toseeempty();
  }

  function createWatchlistcontainer() {
    if (!watchlistContainer) {
      console.error("watchlistContainer not found.");
    }
// if in case by clicking watchlistbtn watchlistContainer not loads call createWatchlistcontainer() in watclistbtn
    // watchlistContainer.innerHTML = "";

    let favWatchlistToken = getFavWatchlistToken();

    if (favWatchlistToken.length === 0) {
      watchlistContainer.classList.add("emptywatchlist");
      watchlistContainer.textContent = "Watchlist is empty";
      watchlistContainer.style.color = "red";
      return;
    } else {
      watchlistContainer.classList.remove("emptywatchlist");
      watchlistContainer.textContent = "";
      watchlistContainer.style.color = "black";
      favWatchlistToken.forEach((token) => {
        let stockData = JSON.parse(localStorage.getItem(`stock-${token}`));

        if (!stockData) {
          console.warn(`Stock data not found for token: ${token}`);
          return;
        }

        let favStockContainer = document.createElement("div");
        favStockContainer.className = "francezawatchlist";
        favStockContainer.id = token;

        let clearbtn = document.createElement("button");
        clearbtn.classList.add("clear");
        clearbtn.textContent = "X";
        let pricecontainer = document.createElement("div");
        pricecontainer.classList.add("pricecontainer");

        let stocknamee = document.createElement("h2");
        stocknamee.classList.add("stockname");
        stocknamee.textContent = `${stockData.stockname}`;

        let lastprice = document.createElement("span");
        lastprice.classList.add("price");
        lastprice.textContent = stockData.lastprice;

        let currentchange = document.createElement("span");
        currentchange.classList.add("change");
        currentchange.textContent =
          !isNaN(stockData.formatchange) && stockData.formatchange !== null
            ? stockData.formatchange
            : "";

        let percenteChange = document.createElement("span");
        percenteChange.className = "perchange";

        percenteChange.textContent = `${
          stockData.percentChange ?? "" ? `(${stockData.percentChange}%)` : ""
        }`;

        if (stockData.formatchange < 0) {
          currentchange.style.color = "red";
          percenteChange.style.color = "red";
        } else {
          currentchange.style.color = "green";
          percenteChange.style.color = "green";
        }

        pricecontainer.appendChild(lastprice);
        pricecontainer.appendChild(currentchange);
        pricecontainer.appendChild(percenteChange);

        favStockContainer.appendChild(stocknamee);
        favStockContainer.appendChild(pricecontainer);
        favStockContainer.appendChild(clearbtn);

        watchlistContainer.prepend(favStockContainer);

        if (clearbtn) {
          clearbtn.addEventListener("click", () => {
            RemoveFromWatchlistToken(token, favStockContainer);
            createWatchlistcontainer();
          });
        }
      });
    }
  }

  let search = document.querySelector("#search");
  let watchListbtn = document.querySelector("#watchlist");
  let selectedtoken;
  search.addEventListener("click", () => {
    stocksection.classList.add("hidesection");
    watchListSection.classList.add("hidesection");
    homesection.classList.remove("hidesection");
  });

  watchListbtn.addEventListener("click", () => {
    stocksection.classList.add("hidesection");
    watchListSection.classList.remove("hidesection");
    homesection.classList.add("hidesection");
    let favWatchlistToken = getFavWatchlistToken();

    if (favWatchlistToken.length === 0) {
      toseeempty();

      return;
    } else {
      const updatedTokens = favWatchlistToken.map((token, index) =>
        index === 0 ? token : `NSE|${token}`
      );
      const tokenString = updatedTokens.join("#");
      watchlistdata(tokenString);
      // createWatchlistcontainer()
    }
  });

  function toseeempty() {
    let favWatchlistToken = getFavWatchlistToken();
    if (favWatchlistToken.length == 0) {
      watchlistContainer.classList.add("emptywatchlist");
      watchlistContainer.textContent = "Watchlist is empty";
      watchlistContainer.style.color = "red";
    }
  }

  let userid;

  async function createPost() {
    const url1 = "https://livestockerserve-backend.onrender.com/api/get-token";
    // const url2 = "http://localhost:3000/api/get-token";

    try {
      let response = await fetch(url1, {
        method: "POST",
        headers: {
          "x-api-key": "12345678",
        },
      });
      let data = await response.json();

      localStorage.setItem("sessionid", data.susertoken);

      userid = data.actid;
      container.classList.remove("emptysearchlist");
      container.classList.add("Accionescontainer");
      container.classList.remove("hide");
    } catch (error) {
      console.error("Error:", error.message);
      container.textContent = "Try Again Later";
      container.classList.add("emptysearchlist");
      container.classList.remove("hide");
    }
  }

  async function getUserId() {
    await createPost();
  }
  getUserId();
  async function searchScrips(data) {
    try {
      // container.innerHTML = "";
      container.classList.remove("hide");
      if (data.stat === "Ok") {
        container.classList.remove("emptysearchlist");
        container.classList.add("Accionescontainer");
        container.textContent = "";

        const quotesList = data.values;
        let countid = 0;

        quotesList.forEach((quote, id) => {
          let newUnico = document.createElement("div");
          let sicmund = document.createElement("div");
          newUnico.setAttribute("data-token", quote.token);
          sicmund.classList.add("sicmund");
          newUnico.classList.add("Unico");

          countid++;
          newUnico.id = countid;

          newUnico.style.zIndex = 1;

          const h3 = document.createElement("h3");
          h3.classList.add("Manzana");
          h3.textContent = quote.cname;
          h3.id = countid;

          newUnico.appendChild(h3);

          const h5 = document.createElement("h5");
          h5.textContent = quote.tsym;
          h5.classList.add("manzil");
          h5.id = countid;

          sicmund.appendChild(h5);

          const h6 = document.createElement("span");
          h6.textContent = quote.exch;
          h6.classList.add("manas");
          h6.id = countid;
          sicmund.appendChild(h6);

          newUnico.appendChild(sicmund);
          container.appendChild(newUnico);

          newUnico.addEventListener("click", async (e) => {
            if (e.currentTarget.id) {
              const stockname =
                e.currentTarget.querySelector(".Manzana").textContent;
              const symbol =
                e.currentTarget.querySelector(".manzil").textContent;
              const token = e.currentTarget.getAttribute("data-token");
              selectedtoken = token;

              homesection.classList.add("hidesection");
              stocksection.classList.remove("hidesection");

              document.querySelector(".stockname").textContent = "Loading...";
              document.querySelector(".price").textContent = " ";
              document.querySelector(".change").textContent = " ";
              document.querySelector(".perchnge").textContent = " ";

              addtowatchlistbtn.classList.add("hidewatchlist");

              getdata(stockname, symbol, token, e.currentTarget.id);
              let favWatchlistToken = getFavWatchlistToken();

              if (favWatchlistToken.includes(token)) {
                addtowatchlistbtn.textContent = "Added";
                addtowatchlistbtn.classList.add("addedwatchlist");
                addtowatchlistbtn.classList.remove("addtowatchlist");
              } else {
                addtowatchlistbtn.textContent = "Add to watchlist";
                addtowatchlistbtn.classList.remove("addedwatchlist");
                addtowatchlistbtn.classList.add("addtowatchlist");
              }
            }
          });
        });
      } else {
        console.error("Error:", data.emsg);

        container.classList.add("emptysearchlist");
        container.classList.remove("Accionescontainer");
        container.textContent = "No result found";
        container.style.color = "red";
      }
    } catch (error) {
      if (error.response && error.response.status === 502) {
        document.querySelector(".stockname").textContent = "try again later";
        console.error(
          "Server is temporarily unavailable. Please try again later."
        );
      }
    }
  }
  let lastprice = "";
  let lastchange = "";
  let lastpercent = "";

  function selectedstocks(ws, response, symbol, stockname, token, id) {

    if (selectedtoken !== token) {
      return;
    }
    addtowatchlistbtn.classList.remove("hidewatchlist");

    // document.querySelector(".stockname").textContent = `${(symbol && symbol.trim()) || " " } (${(stockname && stockname.trim()) || " "})`;
    document.querySelector(".stockname").textContent = `${(stockname && stockname.trim()) || " "} (${(symbol && symbol.trim()) || " "})`;


    const lp = parseFloat(response.lp);
    const pc = parseFloat(response.pc);

    if (!isNaN(lp)) {
      lastprice = lp.toFixed(2);
    }
    document.querySelector(".price").textContent = lastprice;

    if (!isNaN(lp) && !isNaN(pc)) {
      const change = ((pc * lp) / 100).toFixed(2);
      lastchange = change > 0 ? `+${change}` : `${change}`;
      lastpercent = `(${pc}%)`;

      const color = change < 0 ? "red" : "green";
      document.querySelector(".change").style.color = color;
      document.querySelector(".perchnge").style.color = color;
    }

    document.querySelector(".change").textContent = lastchange;
    document.querySelector(".perchnge").textContent = lastpercent;

    if (response.t === "ck") {
      const subscribeRequest = {
        t: "t",
        k: `NSE|${token}`,
      };
      ws.send(JSON.stringify(subscribeRequest));
    }

    addtowatchlistbtn.classList.add("addtowatchlist");

    addtowatchlistbtn.addEventListener("click", () => {
      // location.reload();

      AddToWatchlistToken(selectedtoken);

      let favWatchlistToken = getFavWatchlistToken();
      if (favWatchlistToken.includes(token)) {
        addtowatchlistbtn.textContent = "Added";
        addtowatchlistbtn.classList.add("addedwatchlist");
        addtowatchlistbtn.classList.remove("addtowatchlist");
      } else {
        addtowatchlistbtn.textContent = "Add to watchlist";
        addtowatchlistbtn.classList.remove("addedwatchlist");
        addtowatchlistbtn.classList.add("addtowatchlist");
      }
    });
  }

  function watchlistdata(token) {
    const ws = new WebSocket("wss://api.shoonya.com/NorenWSTP/");

    ws.onopen = async function () {
      const connectRequest = {
        t: "c",
        uid: userid,
        actid: userid,
        source: "API",
        susertoken: localStorage.getItem("sessionid"),
      };

      ws.send(JSON.stringify(connectRequest));
    };

    ws.onmessage = async function (event) {
      const response = JSON.parse(event.data);

      if (response.t === "ck") {
        const subscribeRequest = {
          t: "t",
          k: `NSE|${token}`,
        };
        ws.send(JSON.stringify(subscribeRequest));
        return;
      }

      let { tk, lp, pc,ts } = response;
      let favWatchlistToken = getFavWatchlistToken();
      if (favWatchlistToken.includes(tk)) {
        let storedStock = JSON.parse(localStorage.getItem(`stock-${tk}`)) || {};

        const parsedLP = parseFloat(lp);
        const parsedPC = parseFloat(pc);
        storedStock.stockname=ts

        if (!isNaN(parsedLP)) {
          storedStock.lastprice = parsedLP.toFixed(2);
        }

        if (!isNaN(parsedLP) && !isNaN(parsedPC)) {
          const change = ((parsedPC * parsedLP) / 100).toFixed(2);
          storedStock.percentChange = parsedPC.toFixed(2);
          storedStock.formatchange = change > 0 ? `+${change}` : `${change}`;
        }

        localStorage.setItem(`stock-${tk}`, JSON.stringify(storedStock));
        createWatchlistcontainer();
      }
    };

    ws.onclose = function (event) {
      console.error("Connection closed");
    };

    ws.onerror = function (error) {
      console.error("error while fetching data");
    };
  }

  function getdata(stockname, symbol, token, id) {
    const ws = new WebSocket("wss://api.shoonya.com/NorenWSTP/");
    ws.onopen = function () {
      const connectRequest = {
        t: "c",
        uid: userid,
        actid: userid,
        source: "API",
        susertoken: localStorage.getItem("sessionid"),
      };

      ws.send(JSON.stringify(connectRequest));
    };

    ws.onmessage = function (event) {
      const response = JSON.parse(event.data);
      selectedstocks(ws, response, symbol, stockname, token, id);
    };

    ws.onclose = function (event) {
      if (event.wasClean) {
        console.log(
          `[close] Connection closed cleanly, code=${event.code}, reason=${event.reason}`
        );
      } else {
        console.log("[close] Connection died unexpectedly.");
      }
    };

    ws.onerror = function (error) {
      console.error("[error]", error);
    };
  }
});
