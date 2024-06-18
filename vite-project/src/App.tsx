import './App.css'
import { useAppSelector } from './app/hooks'
import { selectAccessToken, selectUser } from './features/user/userSlice'
import React, { Fragment } from 'react';
import './index.css';
import './App.css';
import { useReactTable, getCoreRowModel, getExpandedRowModel, ColumnDef, flexRender, Row, ExpandedState, PaginationState } from '@tanstack/react-table';
import { fetchData, makeData, Product } from './makeData.ts';
import {
  keepPreviousData,
  useQuery,
} from '@tanstack/react-query';


const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'product',
    header: 'Product',
    cell: ({ row, getValue }) => (
      <div
        style={{
          paddingLeft: `${row.depth * 2}rem`,
        }}
      >
        {getValue<string>()}
      </div>
    ),
    footer: (props) => props.column.id,
  },

  {
    accessorKey: 'uploadDate',
    header: () => 'Date Uploaded',
    footer: (props) => props.column.id,
  },

  {
    accessorKey: 'views',
    header: () => <span>Views</span>,
    footer: (props) => props.column.id,
  },

  {
    accessorKey: 'uploader',
    header: 'Uploader',
    footer: (props) => props.column.id,
  },
  {
    accessorKey: 'onlineDate',
    header: 'Last Online',
    footer: (props) => props.column.id,
  },
];

type TableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData>[];
  renderSubComponent: (props: { row: Row<TData> }) => React.ReactElement;
  getRowCanExpand: (row: Row<TData>) => boolean;
};


//const queryClient = new QueryClient();

function Table({

  columns,
  renderSubComponent,
  getRowCanExpand,
}: TableProps<Product>): JSX.Element {

  const rerender = React.useReducer(() => ({}), {})[1]

  const defaultData = React.useMemo(() => [], [])

  const [expanded, setExpanded] = React.useState<ExpandedState>({})

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  
  const dataQuery = useQuery({
    queryKey: ['data', pagination],
    queryFn: () => fetchData(pagination),
    placeholderData: keepPreviousData, // don't have 0 rows flash while changing pages/loading next page
  });
  const table = useReactTable<Product>({
    data: dataQuery.data?.rows ?? defaultData,
    columns,
    getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    rowCount: dataQuery.data?.rowCount,
    state: {
      pagination,
      expanded,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    debugTable: true,
    onExpandedChange: setExpanded,
  });


  return (
    <div className="p-2">
      <div className="h-2" />
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <Fragment key={row.id}>
                <tr onClick={row.getToggleExpandedHandler()}>
                  {/* first row is a normal row */}
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    );
                  })}
                </tr>
                {row.getIsExpanded() && (
                  <tr>
                    {/* 2nd row is a custom 1 cell row */}
                    <td colSpan={row.getVisibleCells().length}>
                      {renderSubComponent({ row })}
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
      <div className="h-2" />
      <div className="flex items-center gap-2">
        <button
          className="border rounded p-1"
          onClick={() => table.firstPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.lastPage()}
          disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount().toLocaleString()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
        {dataQuery.isFetching ? 'Loading...' : null}
      </div>
      <div>
        Showing {table.getRowModel().rows.length.toLocaleString()} of{' '}
        {dataQuery.data?.rowCount.toLocaleString()} Rows
      </div>
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div>
      <pre>{JSON.stringify(pagination, null, 2)}</pre>
      <label>Expanded State:</label>
      <pre>{JSON.stringify(expanded, null, 2)}</pre>
    </div>
  );
}

function renderSubComponent({
  row,
}: {
  row: Row<Product>;
}): React.ReactElement {
  const product: Product = row.original;

  return (
    <div style={{ padding: '10px', margin: '5px', backgroundColor: '#f0f0f0' }}>
      <h3>{product.product}</h3>
      <p>{product.description}</p>
      <img
        src={product.image}
        alt={product.product}
        style={{ width: '100px', height: 'auto' }}
      />
        <button
          className="border rounded p-1"
        >
          {'Buy'}
        </button>
    </div>
  );
}

function App() {
  const [data] = React.useState(() => makeData(10));
  const user = useAppSelector(selectUser);
  const accessToken = useAppSelector(selectAccessToken);


  return (
    <>

      <Table
        data={data}
        columns={columns}
        getRowCanExpand={() => true}
        renderSubComponent={renderSubComponent}
      />
      <p>Id Token: {user?.idToken}</p>
      <p>Access Token: {accessToken}</p>
    </>
  )
}

export default App