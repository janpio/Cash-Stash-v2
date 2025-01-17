"use client";
import BudgetCards from "@/app/components/BudgetsPage/BudgetCards";
import { fetchBudgets } from "@/app/redux/features/budgetSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import CreateBudgetButton from "../components/CreateButtons/CreateBudgetButton";

const BudgetsNotFoundMessage = () => (
  <div className="flex flex-col items-start lg:items-center justify-center gap-4">
    <h2 className="inline-block text-lg lg:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
      No budgets were found.
    </h2>
    <p className="text-sm lg:text-lg">Add a budget to get started!</p>
  </div>
);

const BudgetsPageClient = () => {
  const { budgets, isLoading } = useAppSelector((state) => state.budgetReducer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  return (
    <div className="p-4 mx-auto lg:max-w-[1300px] xl:max-w-[1600px]">
      <h3 className="text-4xl mb-4 text-primary">Budgets</h3>
      {!isLoading && !budgets && <BudgetsNotFoundMessage />}
      <div className="flex flex-col gap-4 items-center justify-center">
        {isLoading ? (
          <Skeleton className="h-20 w-full" />
        ) : (
          <div className="w-full">
            <div className="grid grid-cols md:grid-cols-2 xl:grid-cols-3 gap-4">
              <BudgetCards budgets={budgets} />
            </div>
          </div>
        )}
        <CreateBudgetButton className="mt-4 self-start" />
      </div>
    </div>
  );
};

export default BudgetsPageClient;
