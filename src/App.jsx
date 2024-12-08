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
  const betAddress = "0xa04F0bB994775bDe9f642F02A7A814cCDf5ee571";

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
      const tx = await contract.runBet(questionIdRef4.current.id);
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

      <div className='options2'>
        <div>User - {address}</div>
        <div>Balance - {balance / 10 ** 18} ether</div>
      </div>

      <div>
        <div>
          <div className='text1'>Create New Question (Admin)</div>
          <textarea ref={questionRef} className='textarea'>
          </textarea>
          <input type='datetime-local' ref={deadlineRef} className='input1' placeholder='Enter Deadline' />
          <button onClick={createQuestion} className='but1'>Create Question</button>
        </div>
        <div className='options'>
          <div className='text1'>Add Options to Question (Admin)</div>
          <input ref={questionIdRef} className='input1' placeholder='Question Id' />
          <input ref={option1Ref} className='input1' placeholder='Option 1' />
          <input ref={option2Ref} className='input1' placeholder='Option 2' />
          <button onClick={setOptions} className='but1'>Add Options</button>
        </div>
        <div className='options'>
          <div className='text1'>Update Answer to Question (Admin)</div>
          <input ref={questionIdRef2} className='input1' placeholder='Question Id' />
          <input ref={answerRef} className='input1' placeholder='Option Id' />
          <button onClick={setAnswer} className='but1'>Update Answer</button>
        </div>

        <div className='options'>
          <div className='text1'>Get Winners (Admin)</div>
          <input ref={questionIdRef3} className='input1' placeholder='Question Id' />
          <button onClick={runBet} className='but1'>Get winners</button>
        </div>

        <div className='options'>
          <div className='text1'>Place Bet</div>
          <select ref={selectRef} onChange={() => setId(selectRef.current.value)} className='input1' name="cars" id="cars">
            {
              questions.map((item, index) => {
                return <option key={index} value={item.questionId}>{String(item.question)}</option>
              })
            }
          </select>
          <input ref={answerRef1} className='input1' value={betid} placeholder='Option Id' />
          <div className='placebet'>
            <button onClick={() => setBId(0)} className='but1'>{options[0]}</button>
            <button onClick={() => setBId(1)} className='but1'>{options[1]}</button>
          </div>
          <button onClick={placeBet} className='but1'>Place Bet</button>
        </div>

        <div className='options'>
          <div className='text1'>Withdraw Winnings</div>
          <input ref={questionIdRef4} className='input1' placeholder='Question Id' />
          <button onClick={withdrawWin} className='but1'>Withdraw</button>
        </div>

      </div>
    </>
  )
}
  

export default App
