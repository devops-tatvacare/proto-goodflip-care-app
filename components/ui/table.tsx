import * as React from "react"
import { MaterialIcon } from "@/components/ui/material-icon"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto rounded-[var(--ds-radius-lg)] border border-[var(--ds-border-default)] bg-[var(--ds-surface-primary)] -mx-[var(--ds-space-lg)] sm:mx-0">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm text-[var(--ds-text-primary)] min-w-[600px] sm:min-w-0", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b [&_tr]:border-[var(--ds-border-default)]", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t border-[var(--ds-border-default)] bg-[var(--ds-surface-secondary)] font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-[var(--ds-border-default)] transition-colors hover:bg-[var(--ds-surface-secondary)] data-[state=selected]:bg-[var(--ds-surface-tertiary)]",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-[var(--ds-space-md)] sm:px-[var(--ds-space-lg)] text-left align-middle font-medium text-[var(--ds-text-muted)] bg-[var(--ds-surface-secondary)] [&:has([role=checkbox])]:pr-0 first:rounded-tl-[var(--ds-radius-lg)] last:rounded-tr-[var(--ds-radius-lg)] text-xs sm:text-sm",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("px-[var(--ds-space-md)] py-[var(--ds-space-md)] sm:p-[var(--ds-space-lg)] align-middle text-[var(--ds-text-primary)] [&:has([role=checkbox])]:pr-0 text-xs sm:text-sm", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-[var(--ds-space-lg)] text-sm text-[var(--ds-text-muted)]", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

/**
 * Sortable table header with visual indicators
 */
interface SortableTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /**
   * Current sort direction
   */
  sortDirection?: 'asc' | 'desc' | null
  /**
   * Whether this column is sortable
   */
  sortable?: boolean
  /**
   * Sort handler
   */
  onSort?: () => void
}

const SortableTableHead = React.forwardRef<
  HTMLTableCellElement,
  SortableTableHeadProps
>(({ className, sortDirection, sortable = false, onSort, children, ...props }, ref) => (
  <TableHead
    ref={ref}
    className={cn(
      sortable && "cursor-pointer select-none hover:bg-[var(--ds-surface-tertiary)] transition-colors",
      className
    )}
    onClick={sortable ? onSort : undefined}
    {...props}
  >
    <div className="flex items-center gap-[var(--ds-space-sm)]">
      {children}
      {sortable && (
        <MaterialIcon
          icon={
            sortDirection === 'asc' ? 'arrow_upward' :
            sortDirection === 'desc' ? 'arrow_downward' : 
            'unfold_more'
          }
          size="small"
          className={cn(
            "text-[var(--ds-text-muted)] transition-colors",
            sortDirection && "text-[var(--ds-interactive-primary)]"
          )}
        />
      )}
    </div>
  </TableHead>
))
SortableTableHead.displayName = "SortableTableHead"

/**
 * Healthcare-specific data table with built-in sorting, selection, and health data formatting
 */
interface DataTableColumn<T = any> {
  id: string
  header: string
  accessor?: keyof T | ((item: T) => any)
  sortable?: boolean
  type?: 'text' | 'number' | 'date' | 'status' | 'medication' | 'health-metric'
  width?: string
  align?: 'left' | 'center' | 'right'
}

interface DataTableProps<T = any> {
  /**
   * Table data
   */
  data: T[]
  /**
   * Column definitions
   */
  columns: DataTableColumn<T>[]
  /**
   * Whether rows are selectable
   */
  selectable?: boolean
  /**
   * Selected row IDs
   */
  selectedRows?: Set<string>
  /**
   * Selection change handler
   */
  onSelectionChange?: (selectedRows: Set<string>) => void
  /**
   * Row ID accessor
   */
  getRowId?: (item: T) => string
  /**
   * Empty state message
   */
  emptyMessage?: string
  /**
   * Loading state
   */
  loading?: boolean
  /**
   * Custom row props
   */
  getRowProps?: (item: T) => React.HTMLAttributes<HTMLTableRowElement>
  /**
   * Additional CSS classes
   */
  className?: string
}

function DataTable<T = any>({
  data,
  columns,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  getRowId = (item: any, index: number) => item.id || index.toString(),
  emptyMessage = "No data available",
  loading = false,
  getRowProps,
  className
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = React.useState<string | null>(null)
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('asc')

  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data

    const column = columns.find(col => col.id === sortColumn)
    if (!column) return data

    return [...data].sort((a, b) => {
      let aVal, bVal

      if (typeof column.accessor === 'function') {
        aVal = column.accessor(a)
        bVal = column.accessor(b)
      } else if (column.accessor) {
        aVal = a[column.accessor]
        bVal = b[column.accessor]
      } else {
        return 0
      }

      // Handle null/undefined values
      if (aVal == null && bVal == null) return 0
      if (aVal == null) return sortDirection === 'asc' ? -1 : 1
      if (bVal == null) return sortDirection === 'asc' ? 1 : -1

      // Type-specific sorting
      if (column.type === 'number') {
        aVal = Number(aVal) || 0
        bVal = Number(bVal) || 0
      } else if (column.type === 'date') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      } else {
        aVal = String(aVal).toLowerCase()
        bVal = String(bVal).toLowerCase()
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortColumn, sortDirection, columns])

  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnId)
      setSortDirection('asc')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return
    
    if (checked) {
      const allIds = new Set(data.map((item, index) => getRowId(item, index)))
      onSelectionChange(allIds)
    } else {
      onSelectionChange(new Set())
    }
  }

  const handleRowSelect = (rowId: string, checked: boolean) => {
    if (!onSelectionChange) return

    const newSelection = new Set(selectedRows)
    if (checked) {
      newSelection.add(rowId)
    } else {
      newSelection.delete(rowId)
    }
    onSelectionChange(newSelection)
  }

  const formatCellValue = (value: any, type?: string) => {
    if (value == null) return '—'

    switch (type) {
      case 'date':
        return new Date(value).toLocaleDateString()
      case 'number':
        return typeof value === 'number' ? value.toLocaleString() : value
      case 'status':
        return (
          <div className={cn(
            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
            value === 'active' && "bg-[var(--ds-status-success-bg)] text-[var(--ds-status-success-text)]",
            value === 'inactive' && "bg-[var(--ds-status-error-bg)] text-[var(--ds-status-error-text)]",
            value === 'pending' && "bg-[var(--ds-status-warning-bg)] text-[var(--ds-status-warning-text)]"
          )}>
            {value}
          </div>
        )
      case 'medication':
        return (
          <div className="flex items-center gap-2">
            <MaterialIcon icon="medication" size="small" className="text-[var(--ds-blue-600)]" />
            <span>{value}</span>
          </div>
        )
      case 'health-metric':
        return (
          <div className="font-mono text-sm">
            {value}
          </div>
        )
      default:
        return value
    }
  }

  const isAllSelected = data.length > 0 && selectedRows.size === data.length
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < data.length

  return (
    <Table className={className}>
      <TableHeader>
        <TableRow>
          {selectable && (
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onCheckedChange={handleSelectAll}
                aria-label="Select all rows"
              />
            </TableHead>
          )}
          {columns.map((column) => (
            <SortableTableHead
              key={column.id}
              sortable={column.sortable}
              sortDirection={sortColumn === column.id ? sortDirection : null}
              onSort={() => handleSort(column.id)}
              style={{ width: column.width }}
              className={cn(
                column.align === 'center' && 'text-center',
                column.align === 'right' && 'text-right'
              )}
            >
              {column.header}
            </SortableTableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="text-center py-8">
              <div className="flex items-center justify-center gap-2 text-[var(--ds-text-muted)]">
                <MaterialIcon icon="hourglass_empty" className="animate-spin" />
                Loading...
              </div>
            </TableCell>
          </TableRow>
        ) : sortedData.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length + (selectable ? 1 : 0)} className="text-center py-8">
              <div className="flex flex-col items-center gap-2 text-[var(--ds-text-muted)]">
                <MaterialIcon icon="inbox" size="large" />
                {emptyMessage}
              </div>
            </TableCell>
          </TableRow>
        ) : (
          sortedData.map((item, index) => {
            const rowId = getRowId(item, index)
            const isSelected = selectedRows.has(rowId)
            const rowProps = getRowProps?.(item) || {}

            return (
              <TableRow
                key={rowId}
                data-state={isSelected ? "selected" : undefined}
                {...rowProps}
              >
                {selectable && (
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) => handleRowSelect(rowId, checked as boolean)}
                      aria-label={`Select row ${index + 1}`}
                    />
                  </TableCell>
                )}
                {columns.map((column) => {
                  let value
                  if (typeof column.accessor === 'function') {
                    value = column.accessor(item)
                  } else if (column.accessor) {
                    value = item[column.accessor]
                  } else {
                    value = ''
                  }

                  return (
                    <TableCell
                      key={column.id}
                      className={cn(
                        column.align === 'center' && 'text-center',
                        column.align === 'right' && 'text-right'
                      )}
                    >
                      {formatCellValue(value, column.type)}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })
        )}
      </TableBody>
    </Table>
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  SortableTableHead,
  DataTable,
}
