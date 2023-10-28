"use client";
import { useAppDispatch } from "@/app/redux/hooks";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { showErrorToast } from "@/components/ui/use-toast";
import { getGenericListByCurrentUser } from "@/actions/generic";
import { openGenericModal } from "@/lib/genericModalUtils";
import { FaExchangeAlt } from "react-icons/fa";

const CreateTransactionButton = () => {
  let [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const handleCreateTransactionClick = async () => {
    startTransition(async () => {
      const result = await getGenericListByCurrentUser({
        tableName: "userAccount",
      });

      if (result?.error)
        return showErrorToast("An error occurred.", result?.error as string);

      if (!result) {
        return showErrorToast(
          "No accounts found.",
          "You need to create an account before you can create a transaction."
        );
      } else {
        openGenericModal("Transactions", dispatch);
      }
    });
  };
  return (
    <Button
      className="font-semibold text-md mt-3 flex items-center gap-[14px]"
      onClick={handleCreateTransactionClick}
    >
      <FaExchangeAlt size={18} /> Create a transaction
    </Button>
  );
};
export default CreateTransactionButton;