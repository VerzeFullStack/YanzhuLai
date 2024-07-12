import { faker } from '@faker-js/faker';

export type Product = {
  product: string;
  views: number;
  subRows?: Product[];
  uploadDate: Date | number | string;
  onlineDate: Date | number | string;
  uploader: string;
  description: string;
  image: string;
};

const range = (len: number) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newProduct = (): Product => {
  const randomDate1 = faker.date.past();
  const uploadDate = randomDate1.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
  const randomDate2 = faker.date.past();
  const onlineDate = randomDate2.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });

  return {
    product: faker.commerce.product(),
    views: faker.number.int(1000),
    uploadDate: uploadDate,
    uploader: faker.person.firstName(),
    onlineDate: onlineDate,
    description: faker.lorem.sentences({ min: 1, max: 3 }),
    image: faker.image.url(),
  };
};

export function makeData(...lens: number[]) {
  const makeDataLevel = (depth = 0): Product[] => {
    const len = lens[depth]!;
    return range(len).map((): Product => {
      return {
        ...newProduct(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}

//Generate Data outside of React Component
const data = makeData(10000);

export async function fetchData(options: {
  pageIndex: number;
  pageSize: number;
}) {
  // Simulate some network latency
  await new Promise((r) => setTimeout(r, 500));

  return {
    rows: data.slice(
      options.pageIndex * options.pageSize,
      (options.pageIndex + 1) * options.pageSize
    ),
    pageCount: Math.ceil(data.length / options.pageSize),
    rowCount: data.length,
  };
}
