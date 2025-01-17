"use client";
import { useEffect, useState } from "react";
import CreateUserAccountOptions from "@/lib/CreateUserAccountOptions";
import AccountInformation from "./AccountInformation";
import { useAppSelector } from "@/app/redux/hooks";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";
import { fetchCurrentUserAccounts } from "@/app/redux/features/userAccountSlice";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

const AccountsFilter = () => {
  const { currentUserAccounts: accounts, isLoading } = useAppSelector(
    (state) => state.userAccountReducer
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCurrentUserAccounts());
  }, [dispatch]);

  const [selectedAccountType, setSelectedAccountType] = useState("");

  if (isLoading && !accounts?.length) {
    return <Skeleton className="w-full h-20" />;
  }

  if (!isLoading && !accounts?.length) {
    return (
      <div className="lg:text-center">
        <h3 className="inline-block text-lg lg:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          You don&apos;t have any accounts yet.
        </h3>
        <p className="mt-3">
          Create one by clicking the Create Account button.
        </p>
      </div>
    );
  }

  const filteredAccounts = accounts?.filter((account) =>
    selectedAccountType ? account.category === selectedAccountType : true
  );

  const handleAccountTypeChange = (value: string) => {
    setSelectedAccountType(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 ">
      <div className="flex justify-start mb-2 col-span-2 w-full">
        <Select
          defaultValue={
            selectedAccountType ? selectedAccountType : "All Accounts"
          }
          value={selectedAccountType}
          onValueChange={handleAccountTypeChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Accounts" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Account Type</SelectLabel>
              <SelectItem value={""}>All Accounts</SelectItem>
              {Object.entries(CreateUserAccountOptions).map(([key, value]) => (
                <SelectItem key={key} value={key}>
                  {value}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="col-span-10">
        <AccountInformation userAccounts={filteredAccounts} />
      </div>
    </div>
  );
};

export default AccountsFilter;
