"use client";

import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchBudgetById } from "@/app/redux/features/currentBudgetSlice";
import CreateBudgetOptions from "@/app/../lib/CreateBudgetOptions";
import { getOptionLabel } from "@/lib/CreateUserAccountOptions";
import { fetchBudgets } from "@/app/redux/features/budgetSlice";
import FormLoadingSpinner from "../../FormLoadingSpinner";
import { closeGenericModal } from "@/app/redux/features/genericModalSlice";
import { showErrorToast, showSuccessToast } from "@/components/ui/use-toast";
import EditBudgetSchema, {
  EditBudgetSchemaType,
} from "@/schemas/EditBudgetSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/FormInput";
import FormSelect from "@/components/FormSelect";
import { Button } from "@/components/ui/button";
import { updateBudgetByIdAction } from "@/actions";

interface IEditBudgetFormProps {
  entityId: number;
}

const EditUserBudgetForm = ({ entityId }: IEditBudgetFormProps) => {
  let [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const budgetOptions = Object.values(CreateBudgetOptions);
  const { currentBudget, isLoading: isCurrentBudgetLoading } = useAppSelector(
    (state) => state.currentBudgetReducer
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading, isSubmitting },
    setValue,
  } = useForm<EditBudgetSchemaType>({
    defaultValues: {
      budgetAmount: 0,
      category: "",
      spentAmount: 0,
    },
    resolver: zodResolver(EditBudgetSchema),
  });

  const loading = isCurrentBudgetLoading || isLoading;

  useEffect(() => {
    if (entityId) {
      dispatch(fetchBudgetById(entityId));
    }
  }, [dispatch, entityId]);

  useEffect(() => {
    if (currentBudget) {
      setValue("budgetAmount", currentBudget.budgetAmount);
      setValue(
        "category",
        getOptionLabel(CreateBudgetOptions, currentBudget.category)
      );
      setValue("spentAmount", currentBudget.spentAmount);
    }
  }, [currentBudget, setValue]);

  const onSubmit = async (data: EditBudgetSchemaType) => {
    let payload = {
      budgetId: entityId,
      ...data,
    };

    startTransition(async () => {
      const result = await updateBudgetByIdAction(payload);
      if (result.error) {
        showErrorToast("An error occurred.", result.error);
      } else {
        dispatch(fetchBudgets());
        showSuccessToast("Budget updated", "Budget updated successfully.");
        dispatch(closeGenericModal());
      }
    });
  };

  if (loading) {
    return <FormLoadingSpinner />;
  }

  const BudgetCategorySelectOptions = budgetOptions.map((option) => {
    return {
      label: option,
      value: option,
    };
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 gap-4">
        <FormInput
          name={"budgetAmount"}
          label={"Budget Amount"}
          placeholder={"Budget Amount"}
          type={"number"}
          register={register}
          errors={errors}
        />
        <FormSelect
          defaultValue={getOptionLabel(
            CreateBudgetOptions,
            currentBudget?.category!
          )}
          selectOptions={BudgetCategorySelectOptions}
          nameParam={"category"}
          label={"Budget Category"}
          placeholder={""}
          register={register}
          errors={errors}
          onChange={(value) => {
            setValue("category", value);
          }}
        />
        <FormInput
          name={"spentAmount"}
          label={"Budget Spent (₺)"}
          placeholder={"Budget Spent (₺)"}
          type={"number"}
          register={register}
          errors={errors}
        />
        <Button type="submit" disabled={isLoading || isSubmitting || isPending}>
          Update
        </Button>
      </div>
    </form>
  );
};

export default EditUserBudgetForm;
