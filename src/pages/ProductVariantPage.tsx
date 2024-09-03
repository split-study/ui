import { FC, useState, useEffect } from 'react';
import { Table, Thead, Tbody, Tr, Th, TableContainer } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, SkeletonTableBody, TableRow } from '../components';
import toast from 'react-hot-toast';
import { getProductVariantsByProductId } from '../services/productVariantsService';
import { AxiosError } from 'axios';
import chevronLeftIcon from '../assets/icons/chevronLeft.svg';

export const ProductVariantPage: FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [editingRow, setEditingRow] = useState<string | null>(null);

  const {
    data: productVariants,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['product-variants', productId],
    queryFn: () => getProductVariantsByProductId(productId!),
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

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4">
        <Button
          variant="secondary"
          onClick={() => navigate(-1)}
          className="self-start flex items-center gap-1"
        >
          <div
            className="h-5 w-5 bg-white"
            style={{
              WebkitMask: `url(${chevronLeftIcon})`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
            }}
          />
          Back
        </Button>

        <TableContainer className="border-[3px] rounded-s-md">
          <Table variant="striped" colorScheme="teal">
            <Thead>
              <Tr>
                <Th>Title</Th>
                <Th>Sku</Th>
                <Th>Price</Th>
                <Th>Quantity</Th>
                <Th>Change Price</Th>
              </Tr>
            </Thead>
            <Tbody>
              {isLoading ? (
                <SkeletonTableBody rowCount={3} cellsCount={5} />
              ) : (
                <>
                  {(productVariants ?? []).map((variant, idx) => (
                    <TableRow
                      key={variant.id}
                      variant={variant}
                      productId={productId!}
                      isEvenRow={idx % 2 === 0}
                      isEditingPrice={editingRow === variant.id}
                      onUpdateEditingPriceRow={setEditingRow}
                    />
                  ))}
                </>
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};
