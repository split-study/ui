import { FC } from 'react';
import { Skeleton, Tr, Td } from '@chakra-ui/react';

type Props = {
  rowCount: number;
  cellsCount: number;
};

export const SkeletonTableBody: FC<Props> = ({ rowCount, cellsCount }) => {
  return (
    <>
      {Array.from({ length: rowCount }).map((_, rowIdx) => (
        <Tr key={`row-${rowIdx}`}>
          {Array.from({ length: cellsCount }).map((_, cellIdx) => (
            <Td key={`cell-${cellIdx}`}>
              <Skeleton height="20px" width="100px" />
            </Td>
          ))}
        </Tr>
      ))}
    </>
  );
};
