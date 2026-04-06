"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format } from "date-fns";

type TopicPoint = {
  label: string;
  incorrectRate: number;
};

type MistakePoint = {
  label: string;
  count: number;
};

type TrendPoint = {
  date: string;
  accuracy: number;
  reviews: number;
};

type DashboardChartsProps = {
  topicAnalysis: TopicPoint[];
  mistakeDistribution: MistakePoint[];
  accuracyTrend: TrendPoint[];
};

const colors = ["#b85c38", "#2f6b62", "#e0a458", "#6a4c3b", "#8a3c1d"];

export function DashboardCharts({
  topicAnalysis,
  mistakeDistribution,
  accuracyTrend,
}: DashboardChartsProps) {
  return (
    <>
      <div className="card">
        <div className="card-title-row">
          <div>
            <h2 className="card-title">Topic analysis</h2>
            <p className="muted">% of reviews marked incorrect by topic.</p>
          </div>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={topicAnalysis}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(96, 66, 27, 0.15)" />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
              <Tooltip formatter={(value) => `${value}% incorrect`} />
              <Bar dataKey="incorrectRate" radius={[8, 8, 0, 0]} fill="#b85c38" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-title-row">
          <div>
            <h2 className="card-title">Mistake distribution</h2>
            <p className="muted">How your logged problems break down by mistake type.</p>
          </div>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mistakeDistribution}
                dataKey="count"
                nameKey="label"
                innerRadius={56}
                outerRadius={96}
                paddingAngle={4}
              >
                {mistakeDistribution.map((entry, index) => (
                  <Cell key={entry.label} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-title-row">
          <div>
            <h2 className="card-title">Accuracy over time</h2>
            <p className="muted">Daily review success rate based on recorded attempts.</p>
          </div>
        </div>
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={accuracyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(96, 66, 27, 0.15)" />
              <XAxis
                dataKey="date"
                tickFormatter={(value: string) => format(new Date(value), "MMM d")}
                tickLine={false}
                axisLine={false}
              />
              <YAxis tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} />
              <Tooltip
                labelFormatter={(value) => format(new Date(String(value)), "MMM d, yyyy")}
                formatter={(value, name) =>
                  name === "accuracy" ? `${value}% accuracy` : `${value} reviews`
                }
              />
              <Line type="monotone" dataKey="accuracy" stroke="#2f6b62" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
