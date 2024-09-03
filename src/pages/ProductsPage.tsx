import { FC, useEffect, useCallback } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { getProducts } from '../services/productService';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button, SkeletonTableBody } from '../components';
import { AxiosError } from 'axios';
import { useSearchParams } from 'react-router-dom';
import arrowLeftIcon from '../assets/icons/arrowLeft.svg';
import arrowRightIcon from '../assets/icons/arrowRight.svg';
import { getSearchWith } from '../utils';

const LIMIT_PRODUCTS = 10;

export const ProductsPage: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const limitProducts = +(searchParams.get('limit') || LIMIT_PRODUCTS);
  const beforeCursor = searchParams.get('beforeCursor') ?? '';
  const afterCursor = searchParams.get('afterCursor') ?? '';

  const { data, error, isLoading } = useQuery({
    queryKey: ['products', limitProducts, afterCursor, beforeCursor],
    queryFn: () =>
      getProducts({ limit: limitProducts, afterCursor, beforeCursor }),
  });

  useEffect(() => {
    if (!error) {
      return;
    }

    const axiosError = error as AxiosError<{
      message: string;
      errors: Record<string, string>;
    }>;

    toast(axiosError.response?.data.message ?? 'Something went wrong');
  }, [error]);

  const onChangePage = useCallback(
    (page: 'prev' | 'next') => {
      if (!data?.pageInfo) {
        return;
      }

      const { hasNextPage, hasPreviousPage } = data.pageInfo;

      const pages = {
        prev: hasPreviousPage,
        next: hasNextPage,
      };

      if (!pages[page]) {
        return;
      }

      switch (page) {
        case 'next': {
          setSearchParams(
            getSearchWith(searchParams, {
              beforeCursor: null,
              afterCursor: data.products.at(-1)?.cursor ?? null,
            }),
          );
          return;
        }

        case 'prev': {
          console.log(data.products[0]?.cursor);
          setSearchParams(
            getSearchWith(searchParams, {
              beforeCursor: data.products[0]?.cursor ?? null,
              afterCursor: null,
            }),
          );
          return;
        }

        default:
          return;
      }
    },
    [data],
  );

  return (
    <div className="w-full h-screen flex flex-col gap-2 items-center justify-center">
      <TableContainer className="border-[3px] rounded-s-md">
        <Table variant="striped" colorScheme="teal">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Description</Th>
              <Th>Variants</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <SkeletonTableBody rowCount={LIMIT_PRODUCTS} cellsCount={3} />
            ) : (
              <>
                {(data?.products ?? []).map(({ product }) => (
                  <Tr key={product.id}>
                    <Td>{product.title}</Td>
                    <Td>{product.description}</Td>
                    <Td>
                      <Button
                        href={`/products/${product.id.split('/').at(-1)}`}
                      >
                        Show variants
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </>
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <div className="flex gap-2 items-center">
        <Button
          variant="secondary"
          isDisabled={!data?.pageInfo?.hasPreviousPage || isLoading}
          onClick={() => onChangePage('prev')}
        >
          <div
            className="h-5 w-5 bg-white"
            style={{
              WebkitMask: `url(${arrowLeftIcon})`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
            }}
          />
        </Button>
        <Button
          variant="secondary"
          isDisabled={!data?.pageInfo?.hasNextPage || isLoading}
          onClick={() => onChangePage('next')}
        >
          <div
            className="h-5 w-5 bg-white"
            style={{
              WebkitMask: `url(${arrowRightIcon})`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
            }}
          />
        </Button>
      </div>
    </div>
  );
};
