import * as React from "react";
import { cn } from "@/lib/utils";

interface VelocityDataTableProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function VelocityDataTable({ children, className, ...props }: VelocityDataTableProps) {
  return (
    <div
      className={cn(
        "rounded-lg overflow-hidden border border-slate-700/50",
        "bg-gradient-to-br from-slate-900/95 via-slate-800/90 to-slate-900/95",
        "shadow-xl shadow-black/20",
        "backdrop-blur-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface VelocityTableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  compact?: boolean;
}

function VelocityTable({ children, className, compact = false, ...props }: VelocityTableProps) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={cn(
          "w-full caption-bottom",
          compact ? "text-xs" : "text-sm",
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

interface VelocityTableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

function VelocityTableHeader({ children, className, ...props }: VelocityTableHeaderProps) {
  return (
    <thead
      className={cn(
        "bg-gradient-to-r from-slate-800/80 via-slate-700/60 to-slate-800/80",
        "border-b border-slate-600/50",
        "[&_tr]:border-0",
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
}

interface VelocityTableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

function VelocityTableBody({ children, className, ...props }: VelocityTableBodyProps) {
  return (
    <tbody
      className={cn(
        "[&_tr:last-child]:border-0",
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
}

interface VelocityTableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
  clickable?: boolean;
  selected?: boolean;
}

function VelocityTableRow({ children, className, clickable = false, selected = false, ...props }: VelocityTableRowProps) {
  return (
    <tr
      className={cn(
        "border-b border-slate-700/30",
        "transition-all duration-200",
        "even:bg-slate-800/20 odd:bg-slate-900/40",
        "hover:bg-cyan-900/20 hover:border-cyan-500/30",
        clickable && "cursor-pointer",
        selected && "bg-cyan-900/30 border-cyan-500/40",
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
}

interface VelocityTableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  sortable?: boolean;
  sorted?: "asc" | "desc" | false;
}

function VelocityTableHead({ children, className, sortable, sorted, ...props }: VelocityTableHeadProps) {
  return (
    <th
      className={cn(
        "h-10 px-4 text-left align-middle",
        "font-semibold text-slate-300 uppercase tracking-wider text-xs",
        "whitespace-nowrap",
        sortable && "cursor-pointer hover:text-cyan-300 transition-colors",
        sorted && "text-cyan-400",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {children}
        {sorted === "asc" && <span className="text-cyan-400">↑</span>}
        {sorted === "desc" && <span className="text-cyan-400">↓</span>}
      </div>
    </th>
  );
}

interface VelocityTableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  children: React.ReactNode;
  highlight?: boolean;
  numeric?: boolean;
  muted?: boolean;
}

function VelocityTableCell({ 
  children, 
  className, 
  highlight = false,
  numeric = false,
  muted = false,
  ...props 
}: VelocityTableCellProps) {
  return (
    <td
      className={cn(
        "px-4 py-3 align-middle",
        "text-slate-200",
        numeric && "font-mono tabular-nums text-right",
        muted && "text-slate-400",
        highlight && "text-cyan-300 font-medium",
        "[&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
}

interface VelocityTableCaptionProps extends React.HTMLAttributes<HTMLTableCaptionElement> {
  children: React.ReactNode;
}

function VelocityTableCaption({ children, className, ...props }: VelocityTableCaptionProps) {
  return (
    <caption
      className={cn(
        "mt-4 text-sm text-slate-400",
        className
      )}
      {...props}
    >
      {children}
    </caption>
  );
}

interface VelocityTableFooterProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

function VelocityTableFooter({ children, className, ...props }: VelocityTableFooterProps) {
  return (
    <tfoot
      className={cn(
        "border-t border-slate-700/50",
        "bg-gradient-to-r from-slate-800/60 via-slate-700/40 to-slate-800/60",
        "font-medium text-slate-300",
        className
      )}
      {...props}
    >
      {children}
    </tfoot>
  );
}

interface VelocityEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

function VelocityEmptyState({ icon, title, description, action }: VelocityEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && (
        <div className="mb-4 text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-slate-300 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-slate-400 text-center max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}

interface VelocityTableToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function VelocityTableToolbar({ children, className, ...props }: VelocityTableToolbarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-3",
        "border-b border-slate-700/50",
        "bg-gradient-to-r from-slate-800/40 to-slate-700/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

interface VelocityTablePaginationProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

function VelocityTablePagination({ children, className, ...props }: VelocityTablePaginationProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 px-4 py-3",
        "border-t border-slate-700/50",
        "bg-gradient-to-r from-slate-800/40 to-slate-700/30",
        "text-sm text-slate-400",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export {
  VelocityDataTable,
  VelocityTable,
  VelocityTableHeader,
  VelocityTableBody,
  VelocityTableRow,
  VelocityTableHead,
  VelocityTableCell,
  VelocityTableCaption,
  VelocityTableFooter,
  VelocityTableToolbar,
  VelocityTablePagination,
  VelocityEmptyState,
};
