import { FC, useState, useCallback } from 'react';
import { ProductVariant } from '../types';
import { Tr, Td } from '@chakra-ui/react';
import { Button, NumberInput } from '.';
import { updateProductVariant } from '../services/productVariantsService';
import { AxiosError } from 'axios';
import { formatIdToShopifyGID, getNumberFromString } from '../utils';
import toast from 'react-hot-toast';
import editIcon from '../assets/icons/editIcon.svg';
import acceptIcon from '../assets/icons/accept.svg';
import closeIcon from '../assets/icons/close.svg';

type Props = {
  variant: ProductVariant;
  productId: string;
  isEvenRow?: boolean;
  isEditingPrice?: boolean;
  onUpdateEditingPriceRow?: (variantId: string | null) => void;
};

export const TableRow: FC<Props> = ({
  variant,
  productId,
  isEvenRow = false,
  isEditingPrice = false,
  onUpdateEditingPriceRow = () => {},
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [produtVariant, setProductVariant] = useState<ProductVariant>(variant);
  const [newPrice, setNewPrice] = useState('');
  const [invalidPriceMessage, setInvalidPriceMessage] = useState<string | null>(
    null,
  );

  const updateProductVariantHandler = useCallback(
    async (variantId: string) => {
      if (invalidPriceMessage) {
        return;
      }

      try {
        setIsUpdating(true);

        const [updatedProductVariant] = await updateProductVariant(
          formatIdToShopifyGID({
            id: productId!,
            type: 'Product',
          }),
          [{ id: variantId, price: newPrice ?? '' }],
        );

        setProductVariant(updatedProductVariant);
        toast.success('Product has been successfully updated');
      } catch (err) {
        const error = err as AxiosError<{
          message: string;
          errors: Record<string, string>;
        }>;

        toast.error(
          error.response?.data?.message ??
            'An error occurred while updating the product',
        );
      } finally {
        setIsUpdating(false);
        onUpdateEditingPriceRow(null);
      }
    },
    [newPrice, invalidPriceMessage],
  );

  return (
    <Tr>
      <Td>{produtVariant.title}</Td>
      <Td>{produtVariant.sku}</Td>
      <Td>
        {isEditingPrice ? (
          <NumberInput
            autoFocus
            value={newPrice}
            onChange={setNewPrice}
            backgroundColor={isEvenRow ? 'white' : 'lightgray'}
            invalidMessage={invalidPriceMessage}
            onUpdateInvalidMessage={setInvalidPriceMessage}
            isDisabled={isUpdating}
          />
        ) : (
          <span>{produtVariant.price}</span>
        )}
      </Td>
      <Td>{produtVariant.inventoryQuantity}</Td>
      <Td>
        {isEditingPrice ? (
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="secondary"
              onClick={() => updateProductVariantHandler(produtVariant.id)}
              isDisabled={!!invalidPriceMessage}
              isLoading={isUpdating}
            >
              <div
                className="h-5 w-5 bg-white"
                style={{
                  WebkitMask: `url(${acceptIcon})`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                }}
              />
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                onUpdateEditingPriceRow(null);
                setInvalidPriceMessage(null);
                setNewPrice('');
              }}
              isDisabled={isUpdating}
            >
              <div
                className="h-5 w-5 bg-white"
                style={{
                  WebkitMask: `url(${closeIcon})`,
                  WebkitMaskSize: 'contain',
                  WebkitMaskRepeat: 'no-repeat',
                }}
              />
            </Button>
          </div>
        ) : (
          <Button
            className="flex items-center gap-1"
            onClick={() => {
              onUpdateEditingPriceRow(produtVariant.id);
              setNewPrice(String(getNumberFromString(produtVariant.price)));
            }}
          >
            <div
              className="h-5 w-5 bg-white"
              style={{
                WebkitMask: `url(${editIcon})`,
                WebkitMaskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
              }}
            />
            Edit Price
          </Button>
        )}
      </Td>
    </Tr>
  );
};
