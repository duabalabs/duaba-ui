import { Typography } from 'antd';

const { Text } = Typography;

export const Price = ({ price }: { price: number }) => {
  return (
    <Text style={{ color: price > 0 ? 'green' : 'red' }}>
      {price ? `$${price}` : 'N/A'}
    </Text>
  );
};
