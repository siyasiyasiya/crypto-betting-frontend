import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import betABI from "../abi/bet.json";
import { ethers } from "ethers";
import { toast } from "react-toastify";
import { useState, useRef, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const questionRef = useRef();
  const deadlineRef = useRef();
  const option1Ref = useRef();
  const option2Ref = useRef();
  const questionIdRef = useRef();
  const questionIdRef2 = useRef();
  const questionIdRef3 = useRef();
  const questionIdRef4 = useRef();
  const answerRef = useRef();
  const answerRef1 = useRef();
  const selectRef = useRef();

  const [questions, setQuestions] = useState([]);
  const [options, setOption] = useState([]);
  const [id, setId] = useState(1);
  const [betid, setBId] = useState(0);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const betAddress = "0x01ce4a5cb3a70edcea8aa933cba521d57693b58d";

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast.error("MetaMask is not installed. Please install it to use this dApp.");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      const userAddress = accounts[0];
      setAddress(userAddress);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(userAddress);
      setBalance(balance.toString());

      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Error connecting wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    }
  };

  const createWriteContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum)
    const signer = await provider.getSigner();
    const betContract = new ethers.Contract(betAddress, betABI.abi, signer);
    return betContract;
  };
  
  const createGetContract = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum)
    const betContract = new ethers.Contract(betAddress, betABI.abi, provider);
    return betContract;
  };
  
  const createQuestion = async (evt) => {
    evt.preventDefault();
    const contract = await createWriteContract();
    const id = toast.loading("Transaction in progress..");
  
    try {
      const dateInSecs = Math.floor(new Date(deadlineRef.current.value).getTime() / 1000);
      const tx = await contract.setQuestion(questionRef.current.value, dateInSecs);
      await tx.wait();
      setTimeout(() => {
        window.location.href = "/";
      }, 10000);
      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    }
  };
  
  const setOptions = async (evt) => {
    evt.preventDefault();
    const contract = await createWriteContract();
    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.setOptions(questionIdRef.current.value, [option1Ref.current.value, option2Ref.current.value])
      await tx.wait();
      setTimeout(() => {
        window.location.href = "/";
      }, 10000);
      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    }
  };
  
  const setAnswer = async (evt) => {
    evt.preventDefault();
    const contract = await createWriteContract();
    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.setAnswer(questionIdRef2.current.value, answerRef.current.value)
      await tx.wait();
      setTimeout(() => {
        window.location.href = "/";
      }, 10000);
      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    }
  };

  const getQuestions = async () => {
    try {
      const contract = await createGetContract();
      const questionsFromContract = await contract.getQuestions();
      const formattedQuestions = questionsFromContract.map((item) => ({
        questionId: item.questionId.toNumber(),
        question: item.question,
        deadline: new Date(item.deadline.toNumber() * 1000).toLocaleString(), 
      }));
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to fetch questions.");
    }
  };
  
  const getOptions = async (questionId) => {
    try {
      const contract = await createGetContract();
      const optionsFromContract = await contract.getOptions(questionId);
      setOption(optionsFromContract);
    } catch (error) {
      console.error("Error fetching options:", error);
      toast.error("Failed to fetch options for this question.");
    }
  };

  const runBet = async (evt) => {
    evt.preventDefault();
    const contract = await createWriteContract();
    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.runBet(questionIdRef3.current.id);
      await tx.wait();
      setTimeout(() => {
        window.location.href = "/";
      }, 10000);
      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    }
  };

  const placeBet = async (evt) => {
    evt.preventDefault();
    const contract = await createWriteContract();
    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.placeBet(id, answerRef1.current.id);
      await tx.wait();
      setTimeout(() => {
        window.location.href = "/";
      }, 10000);
      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    }
  };
   
  const withdrawWin = async (evt) => {
    evt.preventDefault();
    const contract = await createWriteContract();
    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.withdrawWin(questionIdRef4.current.id);
      await tx.wait();
      setTimeout(() => {
        window.location.href = "/";
      }, 10000);
      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 10000,
        closeButton: true,
      });
    }
  };

  const getBalance = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = await provider.getSigner();
    const address = await signer.getAddress()
    const balance = await provider.getBalance(address);
    setBalance(Number(balance));
    setAddress(address);
  };

  useEffect(() => {
    getQuestions();
    getOptions();
    getBalance();
  }, [id]);

  return (
    <>
      <h1>DecentralizedBetting</h1>
  
      <div className="user-info">
        <div>User - {address ? address : "Not Connected"}</div>
        <div>Balance - {balance / 10 ** 18 || 0} ether</div>
      </div>
  
      <button onClick={connectWallet} className="button">
          {address ? "Connected" : "Connect Wallet"}
      </button>

      <div className="section">
        <h2>Create New Question (Admin)</h2>
        <textarea ref={questionRef} className="input textarea" placeholder="Enter your question"></textarea>
        <input
          type="datetime-local"
          ref={deadlineRef}
          className="input"
          placeholder="Enter Deadline"
        />
        <button onClick={createQuestion} className="button">Create Question</button>
      </div>
  
      <div className="section">
        <h2>Add Options to Question (Admin)</h2>
        <input ref={questionIdRef} className="input" placeholder="Question Id" />
        <input ref={option1Ref} className="input" placeholder="Option 1" />
        <input ref={option2Ref} className="input" placeholder="Option 2" />
        <button onClick={setOptions} className="button">Add Options</button>
      </div>
  
      <div className="section">
        <h2>Update Answer to Question (Admin)</h2>
        <input ref={questionIdRef2} className="input" placeholder="Question Id" />
        <input ref={answerRef} className="input" placeholder="Option Id" />
        <button onClick={setAnswer} className="button">Update Answer</button>
      </div>
  
      <div className="section">
        <h2>Get Winners (Admin)</h2>
        <input ref={questionIdRef3} className="input" placeholder="Question Id" />
        <button onClick={runBet} className="button">Get Winners</button>
      </div>
  
      <div className="section">
        <h2>Place Bet</h2>
        <select ref={selectRef} onChange={() => setId(selectRef.current.value)} className="input">
          {questions.map((item, index) => (
            <option key={index} value={item.questionId}>
              {String(item.question)}
            </option>
          ))}
        </select>
        <input
          ref={answerRef1}
          className="input"
          value={betid}
          placeholder="Option Id"
          onChange={(e) => setBId(e.target.value)}
        />
        <div className="options-container">
          {options.map((option, index) => (
            <button key={index} onClick={() => setBId(index)} className="button">
              {option}
            </button>
          ))}
        </div>
        <button onClick={placeBet} className="button">Place Bet</button>
      </div>
  
      <div className="section">
        <h2>Withdraw Winnings</h2>
        <input ref={questionIdRef4} className="input" placeholder="Question Id" />
        <button onClick={withdrawWin} className="button">Withdraw</button>
      </div>
    </>
  );
}
  

export default App
