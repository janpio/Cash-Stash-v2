'use client';
import {
  SimpleGrid,
  Stat,
  Box,
  Text,
  StatLabel,
  StatNumber,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Flex,
  useDisclosure,
  Progress,
  useColorMode,
  Badge,
} from '@chakra-ui/react';
import ActionsIcon from './ActionsIcon';
import EditIcon from './EditIcon';
import DeleteIcon from './DeleteIcon';
import EditBudgetModal from './EditBudgetModal';
import DeleteBudgetModal from './DeleteBudgetModal';
import { useState } from 'react';
import useColorModeStyles from '../hooks/useColorModeStyles';
import { Budget } from '@prisma/client';

interface IBudgetCardsProps {
  budgets: Budget[] | null;
}

const BudgetCards = ({ budgets }: IBudgetCardsProps) => {
  const [selectedBudgetId, setSelectedBudgetId] = useState<string>('');

  const { textColor, headingColor } = useColorModeStyles();
  const { colorMode } = useColorMode();
  const editModal = useDisclosure();
  const deleteModal = useDisclosure();

  const handleEditBudget = (budgetId: string) => {
    setSelectedBudgetId(budgetId);
    editModal.onOpen();
  };

  const handleDeleteBudget = (budgetId: string) => {
    setSelectedBudgetId(budgetId);
    deleteModal.onOpen();
  };

  return (
    <>
      {budgets &&
        budgets.map((budget) => (
          <Box
            key={budget.id}
            p={4}
            borderWidth={1}
            borderRadius='md'
            position={'relative'}
            borderColor={colorMode === 'light' ? 'gray.200' : 'gray.700'}
          >
            <Stat position={'relative'}>
              <StatLabel>{budget.category}</StatLabel>
              <StatNumber color={headingColor}>
                Spent: ${budget.spentAmount}
              </StatNumber>
              <Badge
                color={
                  budget.spentAmount / budget.budgetAmount > 0.5
                    ? 'red'
                    : 'green'
                }
                bg={
                  budget.spentAmount / budget.budgetAmount > 0.5
                    ? 'red.200'
                    : 'green.200'
                }
                position={'absolute'}
                top={'50%'}
                right={1}
                mb={2}
              >
                {((budget.spentAmount / budget.budgetAmount) * 100).toFixed(0)}%
              </Badge>
            </Stat>
            <Text mt={2}>Budget: ${budget.budgetAmount}</Text>
            <Progress
              value={(budget.spentAmount / budget.budgetAmount) * 100}
              mt={4}
              colorScheme={
                budget.spentAmount / budget.budgetAmount > 0.7
                  ? 'red'
                  : budget.spentAmount / budget.budgetAmount > 0.4
                  ? 'orange'
                  : 'green'
              }
              bg={colorMode === 'light' ? 'gray.300' : 'gray.600'}
              rounded={'md'}
            />
            <Text color={textColor} mt={3} fontWeight={'300'}>
              {budget.spentAmount / budget.budgetAmount > 1
                ? 'You are over budget!'
                : budget.spentAmount / budget.budgetAmount > 0.7
                ? 'You are almost over budget!'
                : budget.spentAmount / budget.budgetAmount > 0.4
                ? 'You are halfway to your budget!'
                : 'You are under budget!'}
            </Text>
            <Popover>
              <PopoverTrigger>
                <IconButton
                  icon={<ActionsIcon />}
                  aria-label='Budger actions'
                  bg={'transparent'}
                  width={5}
                  height={5}
                  position={'absolute'}
                  top={2}
                  right={2}
                  mb={2}
                />
              </PopoverTrigger>
              <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader fontWeight={'bold'} textAlign={'center'}>
                  Budget Actions
                </PopoverHeader>
                <PopoverBody>
                  <Flex justifyContent={'center'} alignItems={'center'}>
                    <SimpleGrid columns={1} gap={4}>
                      <Flex justifyContent={'center'} alignItems={'center'}>
                        <IconButton
                          aria-label={'Edit user account'}
                          onClick={() => handleEditBudget(budget.id)}
                          icon={<EditIcon />}
                          width={5}
                          height={5}
                          bg={'transparent'}
                          mr={2}
                        />
                        <Text width={'50%'}>Edit </Text>
                      </Flex>
                      <Flex justifyContent={'center'} alignItems={'center'}>
                        <IconButton
                          aria-label={'Delete user account'}
                          onClick={() => handleDeleteBudget(budget.id)}
                          icon={<DeleteIcon />}
                          width={5}
                          height={5}
                          bg={'transparent'}
                          mr={2}
                        />
                        <Text width={'50%'}>Delete </Text>
                      </Flex>
                    </SimpleGrid>
                  </Flex>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </Box>
        ))}
      <EditBudgetModal
        isOpen={editModal.isOpen}
        onClose={editModal.onClose}
        selectedBudgetId={selectedBudgetId}
      />
      <DeleteBudgetModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.onClose}
        selectedBudgetId={selectedBudgetId}
      />
    </>
  );
};

export default BudgetCards;
