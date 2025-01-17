import AccountsPageClient from "@/app/accounts/AccountPageClient";
import BudgetsPageClient from "@/app/budgets/BudgetsPageClient";
import Dashboard from "@/app/components/Dashboard";
import GoalsPageClient from "@/app/goals/GoalsPageClient";
import ReportsPageClient from "@/app/reports/ReportsPageClient";
import TransactionsClient from "@/app/transactions/TransactionsClient";
import prisma from "@/app/libs/prismadb";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ZodObject } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MONTHS_OF_THE_YEAR = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type TableMap = {
  [key in TableName]: (typeof prisma)[key];
};

export type WhereCondition<T> = {
  [key in keyof T]?: T[key];
};

export type SelectCondition<T> = {
  [key in keyof T]?: boolean;
};

export interface IGenericParams<T> {
  tableName: TableName;
  whereCondition?: WhereCondition<T>;
  selectCondition?: SelectCondition<T>;
}

export type CreateGenericInput<T> = {
  [key in keyof Omit<T, "id" | "createdAt" | "updatedAt">]: T[key];
};

export type CreateGenericWithCurrentUserInput<T> = {
  [key in keyof Omit<T, "id" | "createdAt" | "updatedAt" | "userId">]: T[key];
};

export type UpdateGenericInput<T> = {
  [key in keyof Partial<T>]: T[key];
};

export type TableName =
  | "userAccount"
  | "transaction"
  | "budget"
  | "goal"
  | "reminder";

export type Page =
  | "Dashboard"
  | "Accounts"
  | "Budgets"
  | "Goals"
  | "Transactions"
  | "Reports"
  | "Settings";

export interface IPage {
  label: Page;
  content: any;
}

export const PAGES: IPage[] = [
  {
    label: "Dashboard",
    content: Dashboard,
  },
  {
    label: "Accounts",
    content: AccountsPageClient,
  },
  {
    label: "Budgets",
    content: BudgetsPageClient,
  },
  {
    label: "Goals",
    content: GoalsPageClient,
  },
  {
    label: "Transactions",
    content: TransactionsClient,
  },
  {
    label: "Reports",
    content: ReportsPageClient,
  },
];

export function generateFormFields(schema: ZodObject<any>) {
  const formFields = [];

  for (const key of Object.keys(schema.shape)) {
    const fieldSchema = schema.shape[key];
    const description = fieldSchema._def.description;

    const parsedDescription = description
      .split(",")
      .map((item: string) => item.trim());

    const fieldType = parsedDescription
      .find((item: string) => item.startsWith("type:"))
      .split(":")[1]
      .trim();

    const fieldLabel = parsedDescription
      .find((item: string) => item.startsWith("label:"))
      .split(":")[1]
      .trim();

    const fieldObject: {
      name: string;
      type: string;
      label: string;
      options?: string[];
    } = {
      name: key,
      type: fieldType,
      label: fieldLabel,
    };

    if (fieldType === "combobox") {
      console.log(parsedDescription);
      const fieldOptions = parsedDescription
        .find((item: string) => item.startsWith("options:"))
        .split(":")[1]
        .trim()
        .split("-");

      console.log(fieldOptions);

      fieldObject["options"] = fieldOptions;
    }

    formFields.push(fieldObject);
  }

  return formFields;
}