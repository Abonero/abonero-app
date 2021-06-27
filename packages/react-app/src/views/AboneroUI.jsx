/* eslint-disable jsx-a11y/accessible-emoji */

import { SyncOutlined } from "@ant-design/icons";
import { formatEther, parseEther } from "@ethersproject/units";
import { Form, Row, Col, Input, InputNumber, List, Progress, Slider, Spin, Switch, Radio } from "antd";
import React, { useState } from "react";
import { Address, Balance, PlanChart } from "../components";
import Async from 'react-async';


export default function AboneroUI ({
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  useContractReader,
  readContracts,
  writeContracts,
}) {

  const [collateral, setCollateral] = useState(1);
  const [planDuration, setPlanDuration] = useState(50);
  const [anualInteres, setAnualInteres] = useState(27);
  const [initialExpense, setInitialExpense] = useState(0.75);
  const [payment, setPayment] = useState(0.04);
  const [expenses, setExpenses] = useState(0.015);

  const dataTransformer = () => {

      return readContracts.Abonero.getPlanPreview(
          parseEther(collateral.toString()),
          parseEther(initialExpense.toString()),
          parseEther(payment.toString()),
          parseEther(expenses.toString()),
          anualInteres * 100,
          planDuration).then(data => { 
        let chartData = [];

        for(let i = 0; i < data.length; i++) {
          chartData.push({name: "Month " + i,
                    creditLine: formatEther(data[i]['creditLine']),
                    balance: formatEther(data[i]['currentBalance']),
                    payment: formatEther(data[i]['monthPayment'])
                    });
        }

        return chartData;
      });

    }

  


  return (
    <div>
      <Async promiseFn={dataTransformer}>
        {({ data, err, isLoading }) => {
          if (isLoading) return "Loading..."
          if (err) return `Something went wrong: ${err.message}`

          if (data)
            return (
              <PlanChart data={data} />
            )
        }}
      </Async>
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 600, margin: "auto", marginTop: 10 }}>
        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          layout="horizontal"
          size="large"
        >
          <Form.Item label="Plan duration:">
            <InputNumber value={planDuration} onChange={value => {
              setPlanDuration(value);
            }}/>
          </Form.Item>
          <Form.Item label="Collateral:">
            <InputNumber value={collateral} onChange={value => {
              setCollateral(value);
            }} />
          </Form.Item>
          <Form.Item label="Initial Expense:">
            <InputNumber value={initialExpense} onChange={value => {
              setInitialExpense(value);
            }} />
          </Form.Item>
          <Form.Item label="Anual Interest:">
            <InputNumber value={anualInteres} onChange={value => {
              setAnualInteres(value);
            }} />
          </Form.Item>
          <Form.Item label="Estimated Payment:">
            <InputNumber value={payment} onChange={value => {
              setPayment(value);
            }} />
          </Form.Item>
          <Form.Item label="Monthly Expenses:">
            <InputNumber value={expenses} onChange={value => {
              setExpenses(value);
            }} />
          </Form.Item>
        </Form>
      </div>
    </div>
  );

}