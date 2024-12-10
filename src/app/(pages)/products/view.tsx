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
import { useSession } from "next-auth/react";
import { ProductsViewProps } from "@/app/(pages)/products/types";
import useProductValidation from "@/shared/validators/hooks/useProductValidation";
import { Product } from "@/shared/types/response/product";
import { MainResponse, MainResponseWithPagination } from "@/shared/types/response/dto";

export default function ProductsView({ clientUri, initialData }: ProductsViewProps) {
  const session = useSession();
  const [ globalFilter, setGlobalFilter ] = useState(String());
  const [ sorting, setSorting ] = useState<MRT_SortingState>([]);
  const [ pagination, setPagination ] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const { show, list, create, update, destroy } = useRequest();
  const queryClient = useQueryClient();
  const { validateProduct, validationErrors, setValidationErrors } = useProductValidation();
  const [ rowCount, setRowCount ] = useState<number>(initialData.metadata?.pagination.totalItems);
  const {
    data: fetchedProducts = [],
    isError: isLoadingProductsError,
    isFetching: isFetchingProducts,
    isLoading: isLoadingProduct,
  } = useListProducts();
  const { mutateAsync: createProduct, isPending: isCreatingProduct } = useCreateProduct();
  const { mutateAsync: deleteProduct, isPending: isDeletingProduct } = useDeleteProduct();
  const { mutateAsync: updateProduct, isPending: isUpdatingProduct } = useUpdateProduct();
  const { mutateAsync: showProduct } = useShowProduct();

  const columns = useMemo<MRT_ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'Id',
        enableEditing: false,
        enableClickToCopy: true,
      },
      {
        accessorKey: 'name',
        header: 'Nome',
        mantineEditTextInputProps: {
          type: 'text',
          error: validationErrors?.name,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              name: undefined,
            }),
        },
      },
      {
        accessorKey: 'description',
        header: 'Descrição',
        mantineEditTextInputProps: {
          type: 'text',
          error: validationErrors?.description,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              description: undefined,
            }),
        },
      },
      {
        accessorKey: 'price',
        header: 'Preço',
        mantineEditTextInputProps: {
          type: 'number',
          error: validationErrors?.price,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              price: undefined,
            }),
        },
      },
      {
        accessorKey: 'stock',
        header: 'Quantidade',
        mantineEditTextInputProps: {
          type: 'number',
          error: validationErrors?.stock,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              stock: undefined,
            }),
        },
      },
      {
        accessorKey: 'category',
        header: 'Categoria',
        mantineEditTextInputProps: {
          type: 'text',
          error: validationErrors?.category,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              category: undefined,
            }),
        },
      },
    ],
    [ setValidationErrors, validationErrors ],
  );

  function useShowProduct() {
    return useMutation({
      mutationFn: async (ProductId: string) => {
        return show<MainResponse<Product>>(clientUri, ProductId).then(response => response.data.data);
      },
    });
  }

  function useListProducts() {
    return useQuery<Product[]>({
      queryKey: [
        'products',
        pagination.pageIndex,
        pagination.pageIndex,
        pagination.pageSize,
        globalFilter,
        sorting
      ],
      initialData: initialData.data,
      placeholderData: keepPreviousData,
      staleTime: !!session.data?.user.data.accessToken ? 0 : Infinity,
      queryFn: async () => {
        const sortingParam = sorting ? encodeURIComponent(JSON.stringify(sorting)) : [];
        const response = await list<MainResponseWithPagination<Product>>(clientUri, {
          params: {
            page: pagination.pageIndex + 1,
            pageSize: pagination.pageSize,
            searchTerm: globalFilter,
            sorting: sortingParam,
          },
        });

        setRowCount(response.data.metadata.pagination.totalItems);
        return (response.data.data);
      },
    });
  }

  function useCreateProduct() {
    return useMutation({
      mutationFn: async (product: Product) => {
        const req = create<Product>(clientUri, product).then(response => response.data);

        await toast.promise(
          req,
          {
            loading: 'Cadastrando produto...',
            success: <Text fw={500}>Cadastrado com sucesso!</Text>,
            error: 'Erro ao cadastrar produto!',
          },
        );

        return req;
      },
      onMutate: (newProductInfo: Product) => {
        queryClient.setQueryData(
          [ 'products' ],
          (prevProducts: Product[] | undefined) => [
            ...(prevProducts || []),
            {
              ...newProductInfo,
            },
          ]
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: [ 'products' ] }),
      onError: (error: AxiosError<MainResponse<Product>>) => {
        error.response?.data.metadata[0].messages.forEach((message) => {
          if (message.errorCode === 'VALIDATION_ERROR')
            setValidationErrors({
              ...validationErrors,
              name: 'Dados inválidos, verifique os campos!',
            });
        });
      },
    });
  }

  function useUpdateProduct() {
    return useMutation({
      mutationFn: async (product: Product) => {
        const req = update<Product>(clientUri, product.id, product).then(response => response.data);

        await toast.promise(
          req,
          {
            loading: 'Atualizando produto...',
            success: <Text fw={500}>Atualizado com sucesso!</Text>,
            error: 'Erro ao atualizar produto!',
          }
        );

        return req;
      },
      onMutate: (newProductInfo: Product) => {
        queryClient.setQueryData(
          [ 'products' ],
          (prevProducts: any) =>
            prevProducts?.map((prevProduct: Product) =>
              prevProduct.id === newProductInfo.id ? newProductInfo : prevProduct
            )
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: [ 'products' ] }),
      onError: (error: AxiosError<MainResponse<Product>>) => {
        error.response?.data.metadata[0].messages.forEach((message) => {
          if (message.errorCode === 'VALIDATION_ERROR')
            setValidationErrors({
              ...validationErrors,
              name: 'Dados inválidos, verifique os campos!',
            });
        });
      },
    });
  }

  function useDeleteProduct() {
    return useMutation({
      mutationFn: async (ProductId: string) => {
        const req = destroy(clientUri, ProductId).then(response => response.data);

        await toast.promise(
          req,
          {
            loading: 'Excluindo produto...',
            success: <Text fw={500}>Excluído com sucesso!</Text>,
            error: () => <Text fw={500}>Erro ao excluir produto!</Text>,
          }
        );

        return req;
      },
      onMutate: (productId: string) => {
        queryClient.setQueryData(
          [ 'products' ],
          (prevProducts: any) =>
            prevProducts?.filter((product: Product) => product.id !== productId)
        );
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: [ 'products' ] }),
    });
  }

  const handleCreateProduct: MRT_TableOptions<Product>['onCreatingRowSave'] =
    async (
      {
        values,
        exitCreatingMode,
      }) => {
      const newValidationErrors = validateProduct(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await createProduct(values);
      exitCreatingMode();
    };

  const handleSaveProduct: MRT_TableOptions<Product>['onEditingRowSave'] =
    async (
      {
        values,
        table,
      }
    ) => {
      const newValidationErrors = validateProduct(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      await updateProduct(values);
      table.setEditingRow(null);
    };

  const openShowModal = (product: Product) => {
    const fields = [
      { label: 'Id', value: product.id },
      { label: 'Nome', value: `${product.name}` },
      { label: 'Descrição', value: `${product.description}` },
      { label: 'Preço', value: `${product.price}` },
      { label: 'Quantidade', value: `${product.stock}` },
      { label: 'Categoria', value: `${product.category}` },
    ];

    modals.open({
      title: <Text size="lg" fw={600}>Detalhes do Produto</Text>,
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

  const openDeleteConfirmModal = (row: MRT_Row<Product>) =>
    modals.openConfirmModal({
      title: (
        <Text size='lg' fw={500}>
          Excluir Registro
        </Text>
      ),
      children: (
        <Text>
          Você tem certeza que deseja excluir {row.original.name}?
          Esta ação não pode ser desfeita.
        </Text>
      ),
      labels: { confirm: 'Excluir', cancel: 'Cancelar' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteProduct(row.original.id),
    });

  const table = useMantineReactTable({
    columns,
    getRowId: (row) => row.id,
    data: fetchedProducts,
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
      isLoading: isLoadingProduct,
      isSaving: isCreatingProduct || isUpdatingProduct || isDeletingProduct,
      showAlertBanner: isLoadingProductsError,
      showProgressBars: isFetchingProducts,
      density: 'xs',
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
    mantineToolbarAlertBannerProps: isLoadingProductsError
      ? {
        color: 'red',
        children: 'Erro ao carregar produtos. Tente novamente mais tarde.',
      }
      : undefined,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateProduct,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveProduct,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Cadastrar Produto</Title>
        {internalEditComponents}
        <Flex justify='flex-end' mt='xl'>
          <MRT_EditActionButtons variant='text' table={table} row={row}/>
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Editar Produto</Title>
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
            onClick={async () => await showProduct(row.original.id).then((product) => openShowModal(product))}>
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
        Adicionar Produto
      </Button>
    ),
  });

  return (
    <ModalsProvider>
      <MantineReactTable table={table}/>
    </ModalsProvider>
  );
};
