import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function PlanChart ({
  data
}) {

  return (
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 600, margin: "auto", marginTop: 64 }}>
          <LineChart
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="creditLine" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="balance" stroke="#6fbf6b" />
            <Line type="monotone" dataKey="payment" stroke="#6b8ebf" />
          </LineChart>
      </div>
 )
};