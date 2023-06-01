'use client';

import useColorModeStyles from '@/app/hooks/useColorModeStyles';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  Stack,
  FormLabel,
  Input,
  FormErrorMessage,
  FormControl,
  Button,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { fetchCurrentUserAccounts } from '@/app/redux/features/userAccountSlice';
import FormLoadingSpinner from '../../FormLoadingSpinner';
import CreateBudgetOptions from '@/app/utils/CreateBudgetOptions';
import axios from 'axios';

const CreateTransactionForm = () => {
  const dispatch = useAppDispatch();
  const { currentUserAccounts, isLoading: userAccountsLoading } =
    useAppSelector((state) => state.userAccountReducer);
  const categories = Object.values(CreateBudgetOptions);

  useEffect(() => {
    dispatch(fetchCurrentUserAccounts());
  }, [dispatch]);

  const toast = useToast();

  const { btnColor, btnBgColor, btnHoverBgColor } = useColorModeStyles();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      amount: 1,
      description: '',
      category: '',
      accountId: '',
      isIncome: false,
    },
  });

  if (userAccountsLoading) {
    return <FormLoadingSpinner />;
  }

  // TODO: Handle field values properly

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const response = await axios.post('/api/user/transactions', data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.amount}>
          <FormLabel>Amount (₺)</FormLabel>
          <Input
            type='number'
            id='amount'
            {...register('amount', {
              required: 'Amount is required.',
              min: {
                value: 1,
                message: 'Amount must be at least $1.',
              },
              max: {
                value: 1000000,
                message: 'Amount cannot exceed $1,000,000.',
              },
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.amount && errors.amount.message}
          </FormErrorMessage>
        </FormControl>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.description}>
          <FormLabel>Description</FormLabel>
          <Input
            type='text'
            id='description'
            {...register('description', {
              required: 'Description is required.',
              minLength: {
                value: 3,
                message: 'Description must be at least 3 characters.',
              },
              maxLength: {
                value: 50,
                message: 'Description cannot exceed 50 characters.',
              },
            })}
          />
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.description && errors.description.message}
          </FormErrorMessage>
        </FormControl>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.category}>
          <FormLabel>Category</FormLabel>
          <Select
            id='category'
            {...register('category', {
              required: 'Please select a category.',
            })}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </Select>
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.category && errors.category.message}
          </FormErrorMessage>
        </FormControl>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.accountId}>
          <FormLabel>Account</FormLabel>
          <Select
            placeholder='Select an account'
            id='accountId'
            {...register('accountId', {
              required: 'Please select an account.',
            })}
          >
            {currentUserAccounts &&
              currentUserAccounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name}
                </option>
              ))}
          </Select>
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.accountId && errors.accountId.message}
          </FormErrorMessage>
        </FormControl>
        {/* @ts-ignore */}
        <FormControl isRequired isInvalid={errors.isExpense}>
          <FormLabel>Type</FormLabel>
          <Select
            placeholder='Transaction Type'
            id='isIncome'
            {...register('isIncome', {
              required: 'Please select a transaction type.',
            })}
          >
            <option
              value={'expense'}
              onSelect={() => setValue('isIncome', false)}
            >
              Expense
            </option>
            <option
              value={'income'}
              onSelect={() => setValue('isIncome', true)}
            >
              Income
            </option>
          </Select>
          <FormErrorMessage>
            {/* @ts-ignore */}
            {errors.isExpense && errors.isExpense.message}
          </FormErrorMessage>
        </FormControl>
        {isSubmitting ? (
          <Button>Loading...</Button>
        ) : (
          <Button
            color={btnColor}
            bg={btnBgColor}
            _hover={{
              bg: btnHoverBgColor,
            }}
            type='submit'
            isDisabled={isSubmitting}
          >
            Create
          </Button>
        )}
      </Stack>
    </form>
  );
};

export default CreateTransactionForm;