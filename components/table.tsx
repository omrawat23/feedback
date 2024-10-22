"use client";
import React from 'react';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft } from 'lucide-react';
import Ratings from './ratings';

import {
  Column,
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table as ReactTable } from '@tanstack/react-table'; 
import { InferSelectModel } from 'drizzle-orm';
import { feedbacks } from '@/db/schema';

type Feedback = InferSelectModel<typeof feedbacks>;

function Table({ data }: { data: Feedback[] }) {
  const columns = React.useMemo<ColumnDef<Feedback>[]>(() => [
    {
      accessorKey: 'userName',
      header: 'Name',
      cell: info => info.getValue() as string, // Cast to string
      footer: props => props.column.id,
    },
    {
      accessorFn: row => row.userEmail,
      id: 'userEmail',
      cell: info => info.getValue() as string, // Cast to string
      header: () => <span>Email</span>,
      footer: props => props.column.id,
    },
    {
      accessorFn: row => row.rating,
      id: 'rating',
      cell: info => info.getValue() === null
        ? <span>N/A</span>
        : <Ratings rating={info.getValue() as number} count={5} />, // Cast to number
      header: () => <span>Rating</span>,
      footer: props => props.column.id,
    },
    {
      accessorKey: 'message',
      header: () => 'Message',
      footer: props => props.column.id,
      cell: info => {
        const message = info.getValue() as string; // Cast to string
        return (
          <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl">
            {message.length > 100 ? `${message.substring(0, 100)}...` : message}
          </div>
        );
      },
    },
  ], []);

  return (
    <div className="w-full overflow-x-auto">
      <MyTable data={data} columns={columns} />
    </div>
  );
}

function MyTable({ data, columns }: { data: Feedback[]; columns: ColumnDef<Feedback>[] }) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: { pagination },
  });

  return (
    <div className="p-2 mt-5">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div
                      className={header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() ? (
                        header.column.getIsSorted() === 'asc' ? ' 🔼' : ' 🔽'
                      ) : null}
                    </div>
                    {header.column.getCanFilter() && (
                      <div className="mt-2">
                        <Filter column={header.column} table={table} />
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2 whitespace-nowrap text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            className="p-1 border rounded bg-gray-50 disabled:opacity-50"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            className="p-1 border rounded bg-gray-50 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            className="p-1 border rounded bg-gray-50 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            className="p-1 border rounded bg-gray-50 disabled:opacity-50"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Page</span>
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="w-16 p-1 border rounded"
          />
          <span className="text-sm">of {table.getPageCount()}</span>
        </div>
        <select
          value={table.getState().pagination.pageSize}
          onChange={e => table.setPageSize(Number(e.target.value))}
          className="p-1 border rounded"
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function Filter({ column, table }: { column: Column<Feedback>; table: ReactTable<Feedback> }) {
  const firstValue = table.getPreFilteredRowModel().flatRows[0]?.getValue(column.id);
  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === 'number' ? (
    <div className="flex space-x-2">
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[0] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            e.target.value,
            old?.[1],
          ])
        }
        placeholder="Min"
        className="w-24 p-1 text-sm border rounded"
      />
      <input
        type="number"
        value={(columnFilterValue as [number, number])?.[1] ?? ''}
        onChange={e =>
          column.setFilterValue((old: [number, number]) => [
            old?.[0],
            e.target.value,
          ])
        }
        placeholder="Max"
        className="w-24 p-1 text-sm border rounded"
      />
    </div>
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? '') as string}
      onChange={e => column.setFilterValue(e.target.value)}
      placeholder="Search..."
      className="w-full p-1 text-sm border rounded"
    />
  );
}

export default Table;
