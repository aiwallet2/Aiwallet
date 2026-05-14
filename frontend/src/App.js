import { useState } from "react";
import { ethers } from "ethers";

function App() {
  const [prompt, setPrompt] = useState("");
  const [walletAddress, setWalletAddress] =
    useState("");

  const [balance, setBalance] =
    useState("0");

  const [parsedData, setParsedData] =
    useState(null);

  const [chains, setChains] = useState([]);

  const [showPreview, setShowPreview] =
    useState(false);

  async function connectWallet() {
    try {
      if (!window.ethereum) {
        alert("Install MetaMask");
        return;
      }

      const provider =
        new ethers.BrowserProvider(
          window.ethereum
        );

      await provider.send(
        "eth_requestAccounts",
        []
      );

      const signer =
        await provider.getSigner();

      const address =
        await signer.getAddress();

      setWalletAddress(address);

      const walletBalance =
        await provider.getBalance(address);

      const formattedBalance =
        ethers.formatEther(walletBalance);

      setBalance(
        Number(formattedBalance).toFixed(4)
      );

      await detectChains(address);
    } catch (err) {
      console.log(err);
    }
  }

  async function detectChains(address) {
    const chainList = [
      {
        name: "Ethereum",
        rpc: "https://eth.llamarpc.com",
      },

      {
        name: "Base",
        rpc: "https://mainnet.base.org",
      },

      {
        name: "Arbitrum",
        rpc: "https://arb1.arbitrum.io/rpc",
      },

      {
        name: "BNB",
        rpc:
          "https://bsc-dataseed.binance.org",
      },
    ];

    const results = [];

    for (const chain of chainList) {
      try {
        const provider =
          new ethers.JsonRpcProvider(
            chain.rpc
          );

        const bal =
          await provider.getBalance(address);

        const formatted = Number(
          ethers.formatEther(bal)
        ).toFixed(4);

        results.push({
          name: chain.name,
          balance: formatted,
        });
      } catch (err) {
        console.log(err);
      }
    }

    setChains(results);
  }

  async function analyzeTransaction() {
    try {
      const response = await fetch(
        "https://aiwallet-a4mv.onrender.com/parse",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            prompt,
          }),
        }
      );

      const data =
        await response.json();

      const parsed = JSON.parse(
        data.output
      );

      parsed.recommendedChain =
        "Ethereum";

      parsed.estimatedGas = "₹2";

      setParsedData(parsed);

      setShowPreview(true);
    } catch (err) {
      console.log(err);

      alert("AI Parsing Failed");
    }
  }

  async function sendTransaction() {
    try {
      if (!window.ethereum) {
        alert("Install MetaMask");
        return;
      }

      const provider =
        new ethers.BrowserProvider(
          window.ethereum
        );

      const signer =
        await provider.getSigner();

      const tx =
        await signer.sendTransaction({
          to: parsedData.address,

          value: ethers.parseEther(
            parsedData.amount
          ),
        });

      alert(
        "Transaction Sent: " +
          tx.hash
      );
    } catch (err) {
      console.log(err);

      alert("Transaction Failed");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "white",
        padding: 20,
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          marginBottom: 30,
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>
            AI Wallet
          </h1>

          <p
            style={{
              color: "#94a3b8",
              marginTop: 6,
            }}
          >
            Smart crypto routing
            assistant
          </p>
        </div>

        <div
          style={{
            background: "#1e293b",
            padding: "10px 14px",
            borderRadius: 12,
            fontSize: 14,
          }}
        >
          {walletAddress
            ? walletAddress.slice(
                0,
                6
              ) +
              "..." +
              walletAddress.slice(-4)
            : "Not Connected"}
        </div>
      </div>

      <div
        style={{
          background: "#0f172a",
          padding: 20,
          borderRadius: 20,
          marginBottom: 20,
          border:
            "1px solid #1e293b",
        }}
      >
        <p
          style={{
            color: "#94a3b8",
            marginBottom: 10,
          }}
        >
          Wallet Balance
        </p>

        <h1
          style={{
            margin: 0,
            fontSize: 42,
          }}
        >
          {balance} ETH
        </h1>

        <p
          style={{
            color: "#22c55e",
            marginTop: 10,
          }}
        >
          Live On-Chain Balance
        </p>
      </div>

      <div
        style={{
          background: "#0f172a",
          padding: 20,
          borderRadius: 20,
          marginBottom: 20,
          border:
            "1px solid #1e293b",
        }}
      >
        <h3>Detected Chains</h3>

        {chains.map(
          (chain, index) => (
            <div
              key={index}
              style={{
                background:
                  "#1e293b",
                padding: 14,
                borderRadius: 12,
                marginTop: 10,
              }}
            >
              <p>{chain.name}</p>

              <p>
                {chain.balance} ETH
              </p>
            </div>
          )
        )}
      </div>

      <div
        style={{
          background: "#0f172a",
          padding: 20,
          borderRadius: 20,
          border:
            "1px solid #1e293b",
        }}
      >
        <p
          style={{
            marginBottom: 15,
            fontSize: 18,
          }}
        >
          AI Transaction
          Assistant
        </p>

        <button
          onClick={connectWallet}
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 14,
            border: "none",
            background: "#22c55e",
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 20,
          }}
        >
          Connect Wallet
        </button>

        <input
          value={prompt}
          onChange={(e) =>
            setPrompt(
              e.target.value
            )
          }
          placeholder="Send 0.001 ETH to 0x..."
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 14,
            border: "none",
            background: "#1e293b",
            color: "white",
            fontSize: 16,
            outline: "none",
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={
            analyzeTransaction
          }
          style={{
            marginTop: 20,
            width: "100%",
            padding: 16,
            borderRadius: 14,
            border: "none",
            background: "#2563eb",
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
          }}
        >
          Analyze Transaction
        </button>

        {parsedData && (
          <div
            style={{
              marginTop: 20,
              background:
                "#1e293b",
              padding: 16,
              borderRadius: 14,
            }}
          >
            <p>
              Amount:
              {" "}
              {parsedData.amount}
            </p>

            <p>
              Token:
              {" "}
              {parsedData.token}
            </p>

            <p>
              Recommended Chain:
              {" "}
              {
                parsedData.recommendedChain
              }
            </p>

            <p>
              Estimated Gas:
              {" "}
              {
                parsedData.estimatedGas
              }
            </p>

            <p
              style={{
                wordBreak:
                  "break-all",
              }}
            >
              Address:
              {" "}
              {
                parsedData.address
              }
            </p>
          </div>
        )}

        {showPreview &&
          parsedData && (
            <div
              style={{
                marginTop: 20,
                background:
                  "#111827",
                padding: 20,
                borderRadius: 20,
                border:
                  "1px solid #374151",
              }}
            >
              <h3>
                Transaction
                Preview
              </h3>

              <p>
                Amount:
                {" "}
                {
                  parsedData.amount
                }
                {" "}
                {
                  parsedData.token
                }
              </p>

              <p>
                Chain:
                {" "}
                {
                  parsedData.recommendedChain
                }
              </p>

              <p>
                Gas Fee:
                {" "}
                {
                  parsedData.estimatedGas
                }
              </p>

              <p
                style={{
                  wordBreak:
                    "break-all",
                }}
              >
                To:
                {" "}
                {
                  parsedData.address
                }
              </p>

              <button
                onClick={
                  sendTransaction
                }
                style={{
                  marginTop: 20,
                  width: "100%",
                  padding: 16,
                  borderRadius: 14,
                  border: "none",
                  background:
                    "#22c55e",
                  color: "white",
                  fontSize: 16,
                  fontWeight:
                    "bold",
                }}
              >
                Confirm
                Transaction
              </button>
            </div>
          )}
      </div>
    </div>
  );
}

export default App;