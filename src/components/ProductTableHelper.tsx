
import React from 'react';

import { ColumnDef, Row } from '@tanstack/react-table';
import { Product } from '../makeData.ts';

export type TableProps<TData> = {
    
    columns: ColumnDef<TData>[];
    renderSubComponent: (props: { row: Row<TData> }) => React.ReactElement;
    getRowCanExpand: (row: Row<TData>) => boolean;
  };
  
export function renderSubComponent({
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

  export const columns: ColumnDef<Product>[] = [
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