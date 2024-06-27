'use client'
import { Card, Text, Group, Grid, Box } from "@mantine/core";
import { BarChart } from '@mantine/charts';
import { DashboardViewProps, PriceByCategory, StockByCategory } from "@/app/(pages)/dashboard/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Product } from "@/shared/types/response/product";
import { MainResponseWithPagination } from "@/shared/types/response/dto";
import { URI_PATH } from "@/shared/constants/path";
import { useSession } from "next-auth/react";
import useRequest from "@/app/hooks/useRequest";

export default function DashboardView({ initialProducts }: DashboardViewProps) {
  const session = useSession();
  const { list } = useRequest();
  const { data: fetchedProducts = [] } = useListProducts();

  const stockByCategoryData: StockByCategory[] = fetchedProducts.reduce<StockByCategory[]>((acc, product) => {
    const existingCategory = acc.find(item => item.category === product.category);
    if (existingCategory) {
      existingCategory.stock += product.stock;
    } else {
      acc.push({ category: product.category, stock: product.stock });
    }
    return acc;
  }, []);

  const priceByCategoryData: PriceByCategory[] = fetchedProducts.reduce<PriceByCategory[]>((acc, product) => {
    const existingCategory = acc.find(item => item.category === product.category);
    if (existingCategory) {
      existingCategory.totalPrice += product.price * product.stock;
    } else {
      acc.push({ category: product.category, totalPrice: product.price * product.stock });
    }
    return acc;
  }, []);

  function useListProducts() {
    return useQuery<Product[]>({
      queryKey: [ 'products' ],
      initialData: initialProducts,
      placeholderData: keepPreviousData,
      staleTime: !!session.data?.user.data.accessToken ? 0 : Infinity,
      queryFn: async () => {
        const response = await list<MainResponseWithPagination<Product>>(URI_PATH.API.PRODUCTS, {
          params: {
            pageSize: 100 * 1000,
          }
        });
        return (response.data.data);
      },
    });
  }

  return (
    <Grid>
      <Grid.Col span={{ base: 12, sm: 6 }}>
        <Card w='100%' withBorder radius='md'>
          <Card.Section withBorder inheritPadding py='xs'>
            <Group justify="space-between">
              <Text fw={500}>Estoque por Categoria</Text>
            </Group>
          </Card.Section>
          <Box py='md'>
            <BarChart
              h={400}
              data={stockByCategoryData}
              dataKey="category"
              series={[
                { name: 'stock', label: 'Estoque', color: 'violet.6' },
              ]}
            />
          </Box>
        </Card>
      </Grid.Col>
      <Grid.Col span={{ base: 12, sm: 6 }}>
        <Card w='100%' withBorder radius='md'>
          <Card.Section withBorder inheritPadding py='xs'>
            <Group justify="space-between">
              <Text fw={500}>Valor Total por Estoque</Text>
            </Group>
          </Card.Section>
          <Box py='md'>
            <BarChart
              h={400}
              data={priceByCategoryData}
              dataKey="category"
              tickLine="y"
              series={[
                { name: 'totalPrice', label: 'Valor total', color: 'blue.4' },
              ]}
            />
          </Box>
        </Card>
      </Grid.Col>
    </Grid>
  )
}