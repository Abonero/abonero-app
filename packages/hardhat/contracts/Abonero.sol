pragma solidity >=0.6.0 <0.9.0;
pragma experimental ABIEncoderV2;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Abonero {

  using SafeMath for uint256;
  using SafeMath for uint16;

  struct Plan {
      uint256 collateral;
      uint256 initialExpense;
      uint256 payment;
      uint256 expenses; 
      uint16 rate;
      uint8 duration;
      bool isEntity;
  }

  struct PlanState {
    uint8 month;
    uint256 payment;
    uint256 balance;
    uint256 creditLine;
  }

  event CreatePlan(address sender,
      uint256 collateral,
      uint256 initialExpense,
      uint256 payment,
      uint256 expenses, 
      uint16 rate, 
      uint8 duration);

  mapping(address => Plan) internal _plans;

  mapping(address => PlanState) internal _planStatus;

  constructor() public {
    // what should we do on deploy?
  }

  function createPlan(
    uint256 collateral, 
    uint256 initialExpense, 
    uint256 payment, 
    uint256 expenses, 
    uint16 rate, 
    uint8 duration) public payable {

    // Agregar mas validaciones para el contrato del plan.
    require(msg.value == collateral, 'Abonero : Value must match the Collateral value.');

    address planSigner = msg.sender;

    // Almacena la informacion del plan, esta no cambia en el futuro.
    _plans[planSigner].collateral = msg.value;
    _plans[planSigner].initialExpense = initialExpense;
    _plans[planSigner].payment = payment;
    _plans[planSigner].expenses = expenses; 
    _plans[planSigner].rate = rate;
    _plans[planSigner].duration = duration;
    _plans[planSigner].isEntity = true; 

    // Almacena el estado inicial.
    _planStatus[planSigner].creditLine = msg.value; 

    emit CreatePlan(planSigner, msg.value, initialExpense, payment, expenses, rate, duration);
  }


  // Funcion que se usada por el contrato para mostrar una presentacion preeliminar del plan.
  function getPlanPreview(
      uint256 collateral,
      uint256 initialExpense,
      uint256 payment,
      uint256 expenses, 
      uint16 rate, 
      uint8 duration) external pure returns (PlanState[] memory) {

      uint256 currentBalance = initialExpense;
      uint256 creditLine = collateral;
      PlanState[] memory planPreview = new PlanState[](duration);

      for(uint8 i = 0; i < duration; i++) {

        uint16 monthRate = getInteresRate(rate, i, duration, 25);
        uint256 interes = getInteres(currentBalance, monthRate);
        uint256 monthPayment =  getPayment(currentBalance, payment, interes);

        uint256 principal = monthPayment - interes;
        currentBalance = currentBalance - principal + expenses;
        creditLine = creditLine + interes;

        planPreview[i] = PlanState(i, monthPayment, currentBalance, creditLine);
      }

      return planPreview;
  }

  // Funcion para obtener el monto del pago pendiente.
  // Esta funcion es un necesaria en caso que el monto del pago sea mayor que el saldo pendiente.
  function getPayment(uint256 currentBalance, uint256 payment, uint256 interes) internal pure returns (uint256) {


    if(currentBalance < payment - interes) {
      return currentBalance + interes;
    } else {
      return payment;
    }

  }


  function getInteresRate(uint16 rate,
    uint8 month, 
    uint8 duration,
    uint16 inflationaryRate) public pure returns (uint16) {

    if(month <= duration)
      return rate;
    else
      return inflationaryRate;
  }

  function getInteres(uint256 currentBalance, 
    uint16 rate) public pure returns (uint256) {

    uint256 monthlyRate = rate.div(12);
    uint256 interest = currentBalance.mul(monthlyRate);
    interest = interest.div(10000);

    return interest;
  }



}
