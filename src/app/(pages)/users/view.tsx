'use client';
import { useMemo, useState } from 'react';
import {
  MantineReactTable,
  type MRT_ColumnDef,
  MRT_EditActionButtons,
  MRT_PaginationState,
  type MRT_Row,
  MRT_SortingState,
  type MRT_TableOptions,
  useMantineReactTable,
} from 'mantine-react-table';
import { ActionIcon, Box, Button, Flex, Stack, Text, Title, Tooltip, } from '@mantine/core';
import { modals, ModalsProvider } from '@mantine/modals';
import { IconEdit, IconEye, IconTrash } from '@tabler/icons-react';
import { keepPreviousData, useMutation, useQuery, useQueryClient, } from '@tanstack/react-query';
import useRequest from '@/app/hooks/useRequest';
import { MRT_Localization_PT_BR } from 'mantine-react-table/locales/pt-BR/index.esm.mjs';
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { UsersViewProps } from "@/app/(pages)/users/types";
import { useSession } from "next-auth/react";
import useUserValidation from "@/shared/validators/hooks/useUserValidation";
import { User } from '@/shared/types/response/user';
import { MainResponse, MainResponseWithPagination } from "@/shared/types/response/dto";
import { URI_PATH } from "@/shared/constants/path";
import { ROLES } from "@/shared/constants/roles";

export default function UsersView({ initialData }: UsersViewProps) {
  const session = useSession();
  const [ globalFilter, setGlobalFilter ] = useState(String());
  const [ sorting, setSorting ] = useState<MRT_SortingState>([]);
  const [ pagination, setPagination ] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const { show, list, create, update, destroy } = useRequest();
  const queryClient = useQueryClient();
  const { validateUser, validationErrors, setValidationErrors } = useUserValidation();
  const [ rowCount, setRowCount ] = useState<number>(initialData.metadata.pagination.totalItems)
  const {
    data: fetchedUsers = [],
    isError: isLoadingUsersError,
    isFetching: isFetchingUsers,
    isLoading: isLoadingUsers,
  } = useListUsers();
  const { mutateAsync: createUser, isPending: isCreatingUser } = useCreateUser();
  const { mutateAsync: deleteUser, isPending: isDeletingUser } = useDeleteUser();
  const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUpdateUser();
  const { mutateAsync: showUser } = useShowUser();

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        enableClickToCopy: true,
      },
      {
        accessorKey: 'firstName',
        header: 'Nome',
        mantineEditTextInputProps: {
          type: 'text',
          error: validationErrors?.firstName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              firstName: undefined,
            }),
        },
      },
      {
        accessorKey: 'lastName',
        header: 'Sobrenome',
        mantineEditTextInputProps: {
          type: 'text',
          error: validationErrors?.lastName,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lastName: undefined,
            }),
        },
      },
      {
        accessorKey: 'email',
        header: 'Email',
        mantineEditTextInputProps: {
          type: 'email',
          error: validationErrors?.email,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              email: undefined,
            }),
        },
      },
      {
        accessorKey: 'role',
        header: 'Permissão',
        editVariant: 'select',
        mantineEditTextInputProps: {
          type: 'text',
          required: true,
          error: validationErrors?.role,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              role: undefined,
            }),
        },
        mantineEditSelectProps: {
          data: ROLES,
          error: validationErrors?.role,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              role: undefined,
            }),
        },
        Cell: ({ cell }) => {
          const role = cell.getValue<string>();
          const roleLabel = ROLES
            .find(r => r.value.toLowerCase() === role.toLowerCase())?.label || 'Não especificado';
          return <span>{roleLabel}</span>;
        },
      },
      {
        accessorKey: 'password',
        header: 'Senha',
        mantineEditTextInputProps: {
          type: 'password',
          error: validationErrors?.password,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              password: undefined,
            }),
        },
      },
      {
        accessorKey: 'confirmPassword',
        header: 'Confirmar Senha',
        mantineEditTextInputProps: {
          type: 'password',
          error: validationErrors?.confirmPassword,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              confirmPassword: undefined,
            }),
        },
      },
    ],
    [ setValidationErrors, validationErrors ],
  );

  function useShowUser() {
    return useMutation({
      mutationFn: async (userId: string) => {
        return show<MainResponse<User>>(URI_PATH.API.USERS, userId).then(response => response.data.data);
      },
    });
  }

  function useListUsers() {
    return useQuery<User[]>({
      queryKey: [
        'users',
        pagination.pageIndex,
        pagination.pageIndex,
        pagination.pageSize,
        globalFilter,
        sorting
      ],
      initialData: initialData.data,
      placeholderData: keepPreviousData,
      staleTime: !!session.data?.user.data.accessToken ? 0 : Infinity,
      refetchIntervalInBackground: true,
      queryFn: async () => {
        const sortingParam = sorting ? encodeURIComponent(JSON.stringify(sorting)) : [];
        const response = await list<MainResponseWithPagination<User>>(URI_PATH.API.USERS, {
          params: {
            page: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
            searchTerm: globalFilter,
            sorting: sortingParam,
          },
        });

        setRowCount(response.data.metadata.pagination.totalItems);
        return response.data.data;
      },
    });
  }

  function useCreateUser() {
    return useMutation({
      mutationFn: async (user: User) => {
        const req = create<User>(URI_PATH.API.USERS, user).then(response => response.data);
        await toast.promise(
          req,
          {
            loading: 'Cadastrando usuário...',
            success: <Text fw={500}>Cadastrado com sucesso!</Text>,
            error: 'Erro ao cadastrar usuário!',
          }
        );
        return req;
      },
      onMutate: (newUserInfo: User) => {
        queryClient.setQueryData([ 'users' ], (prevUsers: User[] | undefined) => [
          ...(prevUsers || []),
          {
            ...newUserInfo,
          },
        ]);
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: [ 'users' ] }).then();
      },
      onError: (error: AxiosError<MainResponse<User>>) => {
        error.response?.data.metadata.messages.forEach((message) => {
          if (message.errorCode === 'EMAIL_ALREADY_EXISTS')
            setValidationErrors({
              ...validationErrors,
              email: 'Email já cadastrado!',
            });
        });
      },
    });
  }

  function useUpdateUser() {
    return useMutation({
      mutationFn: async (user: User) => {
        const req = update<User>(URI_PATH.API.USERS, user.id, user).then(response => response.data);
        await toast.promise(
          req,
          {
            loading: 'Atualizando usuário...',
            success: <Text fw={500}>Atualizado com sucesso!</Text>,
            error: 'Erro ao atualizar usuário!',
          }
        );
        return req;
      },
      onMutate: (newUserInfo: User) => {
        queryClient.setQueryData(
          [ 'users' ],
          (prevUsers: any) =>
            prevUsers?.map((prevUser: User) =>
              prevUser.id === newUserInfo.id ? newUserInfo : prevUser
            )
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: [ 'users' ] }),
      onError: (error: AxiosError<MainResponse<User>>) => {
        error.response?.data.metadata.messages.forEach((message) => {
          if (message.errorCode === 'EMAIL_ALREADY_EXISTS')
            setValidationErrors({
              ...validationErrors,
              email: 'Email já cadastrado!',
            });
        });
      },
    });
  }

  function useDeleteUser() {
    return useMutation({
      mutationFn: async (userId: string) => {
        const req = destroy(URI_PATH.API.USERS, userId).then(response => response.data);

        await toast.promise(
          req,
          {
            loading: 'Excluindo usuário...',
            success: <Text fw={500}>Excluído com sucesso!</Text>,
            error: () => <Text fw={500}>Erro ao excluir usuário!</Text>,
          }
        );

        return req;
      },
      onMutate: (userId: string) => {
        queryClient.setQueryData(
          [ 'users' ],
          (prevUsers: any) =>
            prevUsers?.filter((user: User) => user.id !== userId)
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: [ 'users' ] }),
    });
  }

  const handleCreateUser: MRT_TableOptions<User>['onCreatingRowSave'] =
    async (
      {
        values,
        exitCreatingMode,
      }) => {
      const newValidationErrors = validateUser(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createUser(values);
      exitCreatingMode();
    };

  const handleSaveUser: MRT_TableOptions<User>['onEditingRowSave'] =
    async ({
             values,
             table,
           }) => {
      const newValidationErrors = validateUser(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await updateUser(values);
      table.setEditingRow(null);
    };

  const openShowModal = (user: User) => {
    const fields = [
      { label: 'Id', value: user.id },
      { label: 'Nome', value: `${user.firstName} ${user.lastName}` },
      { label: 'Email', value: user.email },
    ];

    modals.open({
      title: <Text size="lg" fw={600}>Detalhes do Usuário</Text>,
      children: (
        <Stack gap="md" mt="md">
          {fields.map((field) => (
            <Box key={field.label}>
              <Text fw={500}>
                {field.label}:
              </Text>
              <Text>{field.value}</Text>
            </Box>
          ))}
        </Stack>
      ),
    });
  };

  const openDeleteConfirmModal = (row: MRT_Row<User>) =>
    modals.openConfirmModal({
      title: (
        <Text size='lg' fw={500}>
          Excluir Registro
        </Text>
      ),
      children: (
        <Text>
          Você tem certeza que deseja excluir {row.original.firstName} {row.original.lastName}?
          Esta ação não pode ser desfeita.
        </Text>
      ),
      labels: { confirm: 'Excluir', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteUser(row.original.id),
    });

  const table = useMantineReactTable({
    columns,
    getRowId: (row) => row.id,
    data: fetchedUsers,
    rowCount: rowCount,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    enableDensityToggle: false,
    enableStickyHeader: true,
    enableFullScreenToggle: false,
    enableColumnFilters: false,
    enableColumnActions: false,
    manualPagination: true,
    manualSorting: true,
    state: {
      isLoading: isLoadingUsers,
      isSaving: isCreatingUser || isUpdatingUser || isDeletingUser,
      showAlertBanner: isLoadingUsersError,
      showProgressBars: isFetchingUsers,
      density: 'xs',
      columnVisibility: {
        password: false,
        confirmPassword: false,
        'mrt-row-expand': false,
      },
      globalFilter,
      sorting,
      pagination,
    },
    localization: { ...MRT_Localization_PT_BR },
    mantineSearchTextInputProps: {
      placeholder: 'Pesquisar',
    },
    mantinePaperProps: {
      shadow: 'none',
    },
    mantineTableContainerProps: {
      style: {
        maxHeight: 'calc(100vh - 15.2rem)',
        minHeight: 'calc(100vh - 15.2rem)',
      },
    },
    mantineToolbarAlertBannerProps: isLoadingUsersError
      ? {
        color: 'red',
        children: 'Erro ao carregar usuários. Tente novamente mais tarde.',
      }
      : undefined,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveUser,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Cadastrar Usuário</Title>
        {internalEditComponents}
        <Flex justify='flex-end' mt='xl'>
          <MRT_EditActionButtons variant='text' table={table} row={row}/>
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Editar Usuário</Title>
        {internalEditComponents}
        <Flex justify='flex-end' mt='xl'>
          <MRT_EditActionButtons variant='text' table={table} row={row}/>
        </Flex>
      </Stack>
    ),
    renderRowActions: ({ row, table }) => (
      <Flex gap='md'>
        <Tooltip label='Visualizar'>
          <ActionIcon
            variant='subtle'
            onClick={async () => await showUser(row.original.id).then((user) => openShowModal(user))}>
            <IconEye/>
          </ActionIcon>
        </Tooltip>
        <Tooltip label='Editar'>
          <ActionIcon variant='subtle' onClick={() => table.setEditingRow(row)}>
            <IconEdit/>
          </ActionIcon>
        </Tooltip>
        <Tooltip label='Excluir'>
          <ActionIcon variant='subtle' color='red' onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash/>
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button
        onClick={() => {
          table.setCreatingRow(true);
        }}>
        Adicionar Usuário
      </Button>
    ),
  });

  return (
    <ModalsProvider>
      <MantineReactTable table={table}/>
    </ModalsProvider>
  );
};
