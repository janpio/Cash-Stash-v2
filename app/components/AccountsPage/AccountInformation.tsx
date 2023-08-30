"use client";
import CreateUserAccountOptions, {
  getOptionLabel,
} from "@/lib/CreateUserAccountOptions";
import EditUserAccountModal from "./modals/EditUserAccountModal";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import {
  setIsEditAccountModalOpen,
  SerializedUserAccount,
  fetchCurrentUserAccounts,
} from "@/app/redux/features/userAccountSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { showGenericConfirm } from "@/app/redux/features/genericConfirmSlice";
import { deleteAccountByIdAction } from "@/actions";
import { useToast } from "@/components/ui/use-toast";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import ActionPopover from "@/components/ActionPopover";

interface IAccountInformationProps {
  userAccounts: SerializedUserAccount[] | undefined | null;
}

const AccountInformation = ({ userAccounts }: IAccountInformationProps) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const { isEditAccountModalOpen } = useAppSelector(
    (state) => state.userAccountReducer
  );

  const handleActionCallback = (
    result: Awaited<ReturnType<typeof deleteAccountByIdAction>>,
    cleanUp: ActionCreatorWithoutPayload<"genericConfirm/cleanUp">
  ) => {
    if (result.error) {
      console.log(result.error);
      toast({
        title: "An error occurred.",
        description: result.error,
        variant: "destructive",
        duration: 5000,
      });
    } else {
      dispatch(fetchCurrentUserAccounts());
      toast({
        title: "Account deleted.",
        description: "The account has been deleted.",
        variant: "default",
        duration: 5000,
      });
      dispatch(cleanUp());
    }
  };

  const handleDeleteAccount = (id: number) => {
    dispatch(
      showGenericConfirm({
        title: "Delete Account",
        message: "Are you sure you want to delete this account?",
        primaryActionLabel: "Delete",
        primaryAction: async () => deleteAccountByIdAction(id),
        resolveCallback: handleActionCallback,
      })
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {userAccounts && userAccounts?.length > 0 ? (
          userAccounts
            .sort((a, b) => a.id - b.id)
            .map((userAccount) => (
              <Card key={userAccount.id} className="relative">
                <ActionPopover
                  popoverHeading={"Account Actions"}
                  onEditActionClick={() => {
                    dispatch(
                      setIsEditAccountModalOpen({
                        isEditAccountModalOpen: !isEditAccountModalOpen,
                        selectedUserAccountId: userAccount.id,
                      })
                    );
                  }}
                  onDeleteActionClick={() =>
                    handleDeleteAccount(userAccount.id)
                  }
                />
                <CardHeader className="text-primary">
                  <h2 className="text-lg font-bold">{userAccount.name}</h2>
                  <CardDescription>
                    <p className="text-lg capitalize">
                      Account type:{" "}
                      {getOptionLabel(
                        CreateUserAccountOptions,
                        userAccount.category
                      )}
                    </p>
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-primary">
                  <p className="font-bold">
                    Account Balance: ${userAccount.balance}
                  </p>
                </CardContent>
              </Card>
            ))
        ) : (
          <div className="my-4">
            <h3 className="text-lg text-primary">No accounts found</h3>
            <p>
              You can remove the filter to see all accounts or create a new one
              with this category.
            </p>
          </div>
        )}
      </div>
      <EditUserAccountModal />
    </>
  );
};

export default AccountInformation;
