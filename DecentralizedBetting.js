const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecentralizedBetting Contract", function () {
  let contract;
  let owner, user1, user2, user3;

  beforeEach(async function () {
    const Betting = await ethers.getContractFactory("DecentralizedBetting");
    [owner, user1, user2, user3] = await ethers.getSigners();
    contract = await Betting.deploy();
    await contract.deployed();
  });

  describe("Deployment", function () {
    it("should set the correct owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("should initialize with questionId 1", async function () {
      const questionId = await contract.questionId();
      expect(questionId).to.equal(1);
    });
  });

  describe("setQuestion", function () {
    it("should allow owner to set a question", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 1000; // 1000 seconds from now
      await contract.setQuestion("Will it rain tomorrow?", deadline);

      const questions = await contract.getQuestions();
      expect(questions.length).to.equal(1);
      expect(questions[0].question).to.equal("Will it rain tomorrow?");
    });

    it("should fail if not owner calls setQuestion", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 1000;
      await expect(
        contract.connect(user1).setQuestion("Will it rain tomorrow?", deadline)
      ).to.be.revertedWith("only owner can set question");
    });

    it("should fail if deadline is in the past", async function () {
      const pastDeadline = Math.floor(Date.now() / 1000) - 1000;
      await expect(
        contract.setQuestion("Will it rain tomorrow?", pastDeadline)
      ).to.be.revertedWith("deadline of bet must be past current time");
    });
  });

  describe("setOptions", function () {
    it("should allow owner to set options", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 1000; // 1000 seconds from now
      await contract.setQuestion("Will it rain tomorrow?", deadline);
      const options = ["Yes", "No"];
      await contract.setOptions(1, options);

      const storedOptions = await contract.getOptions(1);
      expect(storedOptions).to.deep.equal(options);
    });

    it("should fail if options are more than 2", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 1000; // 1000 seconds from now
      await contract.setQuestion("Will it rain tomorrow?", deadline);
      const options = ["Yes", "No", "Maybe"];
      await expect(contract.setOptions(1, options)).to.be.revertedWith(
        "options must be of length 2"
      );
    });

    it("should fail if not owner calls setOptions", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 1000; // 1000 seconds from now
      await contract.setQuestion("Will it rain tomorrow?", deadline);
      const options = ["Yes", "No"];
      await expect(contract.connect(user1).setOptions(1, options)).to.be.revertedWith(
        "only owner can set options"
      );
    });
  });

  describe("placeBet", function () {
    it("should allow a user to place a bet", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 1000; // 1000 seconds from now
      await contract.setQuestion("Will it rain tomorrow?", deadline);
      await contract.setOptions(1, ["Yes", "No"]);
      await contract.connect(user1).placeBet(1, 0, { value: ethers.utils.parseEther("0.1") });
      const userBet = await contract.UserToId(user1.address, 1);
      expect(userBet).to.equal(0);
    });

    it("should fail if bet amount is not 0.1 ETH", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 1000; // 1000 seconds from now
      await contract.setQuestion("Will it rain tomorrow?", deadline);
      await contract.setOptions(1, ["Yes", "No"]);
      await expect(
        contract.connect(user1).placeBet(1, 0, { value: ethers.utils.parseEther("0.05") })
      ).to.be.revertedWith("you must bet 0.1 ETH");
    });

    it("should fail if user tries to place bet after deadline", async function () {
      const deadline = Math.floor(Date.now() / 1000) - 1000; // 1000 seconds ago
      await contract.setQuestion("Will it rain tomorrow?", deadline);
      await contract.setOptions(1, ["Yes", "No"]);
      await expect(
        contract.connect(user1).placeBet(1, 0, { value: ethers.utils.parseEther("0.1") })
      ).to.be.revertedWith("bet deadline has passed");
    });

    it("should prevent user from placing multiple bets on the same question", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 1000; // 1000 seconds from now
      await contract.setQuestion("Will it rain tomorrow?", deadline);
      await contract.setOptions(1, ["Yes", "No"]);
      await contract.connect(user1).placeBet(1, 0, { value: ethers.utils.parseEther("0.1") });
      await expect(
        contract.connect(user1).placeBet(1, 1, { value: ethers.utils.parseEther("0.1") })
      ).to.be.revertedWith("you have already placed this bet");
    });
  });

  describe("setAnswer and runBet", function () {
    it("should allow owner to set the correct answer", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 1000; // 1000 seconds from now
      await contract.setQuestion("Will it rain tomorrow?", deadline);
      await contract.setOptions(1, ["Yes", "No"]);
      await contract.connect(user1).placeBet(1, 0, { value: ethers.utils.parseEther("0.1") });
      await contract.setAnswer(1, 0);
      const answer = await contract.IdToAnswer(1);
      expect(answer).to.equal(0);
    });

    it("should mark winners correctly after running the bet", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 1000; // 1000 seconds from now
      await contract.setQuestion("Will it rain tomorrow?", deadline);
      await contract.setOptions(1, ["Yes", "No"]);
      await contract.connect(user1).placeBet(1, 0, { value: ethers.utils.parseEther("0.1") });
      await contract.connect(user2).placeBet(1, 1, { value: ethers.utils.parseEther("0.1") });
      await contract.setAnswer(1, 0);
      await contract.runBet(1);
      const user1Winning = await contract.UserToWinning(user1.address, 1);
      const user2Winning = await contract.UserToWinning(user2.address, 1);
      expect(user1Winning).to.equal(true);
      expect(user2Winning).to.equal(false);
    });
  });

  describe("withdrawWin", function () {
    it("should allow winners to withdraw winnings", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 1000; // 1000 seconds from now
      await contract.setQuestion("Will it rain tomorrow?", deadline);
      await contract.setOptions(1, ["Yes", "No"]);
      await contract.connect(user1).placeBet(1, 0, { value: ethers.utils.parseEther("0.1") });
      await contract.setAnswer(1, 0);
      await contract.runBet(1);
      const initialBalance = await ethers.provider.getBalance(user1.address);
      await contract.connect(user1).withdrawWin(1);
      const finalBalance = await ethers.provider.getBalance(user1.address);
      expect(finalBalance).to.be.gt(initialBalance);
    });

    it("should fail if a non-winner tries to withdraw winnings", async function () {
      const deadline = Math.floor(Date.now() / 1000) + 1000; // 1000 seconds from now
      await contract.setQuestion("Will it rain tomorrow?", deadline);
      await contract.setOptions(1, ["Yes", "No"]);
      await contract.connect(user1).placeBet(1, 0, { value: ethers.utils.parseEther("0.1") });
      await contract.setAnswer(1, 1); // Set answer to 1, not 0
      await contract.runBet(1);
      await expect(contract.connect(user1).withdrawWin(1)).to.be.revertedWith(
        "failed to send Ether"
      );
    });
  });
});
