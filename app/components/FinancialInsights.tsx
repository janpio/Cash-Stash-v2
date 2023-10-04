"use client";
import { InsightsData } from "@/app/redux/features/transactionsSlice";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface IFinancialInsightsProps {
  insightsData: InsightsData | null;
}

const NoDataMessage = () => (
  <div className="grid grid-cols-1 gap-4 text-primary">
    <p>No data was found to generate financial insights from.</p>
    <p>
      Please make sure you have transactions to generate the necessary data.
    </p>
  </div>
);

const SavingsRate = ({ value }: { value: number }) => (
  <div className="mb-4 flex flex-col">
    <h3 className="font-bold text-lg">Savings Rate</h3>
    <p>{value}%</p>
    <p
      className={cn("font-bold", value > 0 ? "text-green-500" : "text-red-500")}
    >
      {value > 0
        ? "You are saving more than you are spending!"
        : "You are spending more than you are saving!"}
    </p>
  </div>
);

const FinancialInsights = ({ insightsData }: IFinancialInsightsProps) => {
  if (!insightsData || (insightsData && !insightsData.totalIncome)) {
    return (
      <div className="my-3">
        <NoDataMessage />
        <Link className="mt-3" href="/transactions">
          <Button
            className="font-bold text-md mt-3 hover:bg-foreground hover:text-muted"
            variant="secondary"
          >
            Transactions
          </Button>
        </Link>
      </div>
    );
  }

  const { totalIncome, totalExpense, netIncome, savingsRate } = insightsData;

  const mappedData = [
    {
      name: "Total Income",
      value: totalIncome,
    },
    {
      name: "Total Expenses",
      value: totalExpense,
    },
    {
      name: "Net Income",
      value: netIncome,
    },
    {
      name: "Savings Rate",
      value: savingsRate,
    },
  ];

  const isAllZero = mappedData.every(
    (data) => parseFloat(data.value as string) === 0
  );

  if (isAllZero) {
    return (
      <div className="my-3">
        <NoDataMessage />
        <Link className="mt-3" href="/transactions">
          <Button
            className="font-bold text-md mt-3 hover:bg-foreground hover:text-muted"
            variant="secondary"
          >
            Transactions
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2">
      {mappedData.map((data) =>
        data.name === "Savings Rate" ? (
          <SavingsRate key={data.name} value={data.value as number} />
        ) : (
          <div className="mb-4 flex flex-col" key={data.name}>
            <h3 className="font-bold text-lg">{data.name}</h3>
            <p>{data.value}₺</p>
          </div>
        )
      )}
    </div>
  );
};

export default FinancialInsights;
