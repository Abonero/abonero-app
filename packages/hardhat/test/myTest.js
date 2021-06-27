const { ethers } = require("hardhat");
const { use, expect } = require("chai");
const { solidity, MockProvider } = require("ethereum-waffle");

use(solidity);

const provider = new MockProvider();
const [wallet, otherWallet] = provider.getWallets();

describe("Abonero Testing", function () {
  let myContract;

  describe("Abonero", function () {
    it("Should deploy YourContract", async function () {
      const YourContract = await ethers.getContractFactory("Abonero");

      myContract = await YourContract.deploy();
    });

    describe("getInteresRate() First",  function() {
      it("Should be able to set a new purpose", async function () {



        expect(await myContract.getInteresRate(2700, 0, 36, 25)).to.equal(2700);
      });
    });

    describe("getInteresRate() Last",  function() {
      it("Should be able to set a new purpose", async function () {

        

        expect(await myContract.getInteresRate(2700, 36, 36, 25)).to.equal(2700);
      });
    });

    describe("getInteresRate() Inflation",  function() {
      it("Should be able to set a new purpose", async function () {

        

        expect(await myContract.getInteresRate(2700, 37, 36, 25)).to.equal(25);
      });
    });

    describe("getAmortization()",  function() {
      it("Should be able to set a new purpose", async function () {

        

        expect(await myContract.getInteres("1000000000000000000", 2700)).to.equal("22500000000000000");
      });
    });

    describe("getPlanPreview()",  function() {
      it("Should be able to set a new purpose", async function () {

        

        expect(await myContract.getPlanPreview("1000000000000000000", "750000000000000000", "20000000000000000", "15000000000000000", 2700, 36));
      });
    });


    describe("createPlan()",  function() {
      it("Should be able to set a new purpose", async function () {

        
        await expect(myContract.createPlan("1000000000000000000", "750000000000000000", "20000000000000000", "15000000000000000", 2700, 36, { value: "1000000000000000000" })).to
          .emit(myContract, "CreatePlan")
          .withArgs( "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266", "1000000000000000000", "750000000000000000", "20000000000000000", "15000000000000000", 2700, 36);;
      });
    });

  });
});
