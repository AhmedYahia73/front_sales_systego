import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export const DataTable = ({ 
  title, 
  onAdd, 
  showAdd = true, 
  columns = [], 
  data = [], 
  onEdit, 
  onDelete, 
  isLoading = false,
  searchPlaceholder = "Search...",
  search_auto = true,        // لتعطيل الفلترة المحلية والاعتماد على Backend
  showSearchInput = true,     // لإظهار/إخفاء حقل البحث الداخلي
  searchValue,                // قيمة البحث القادمة من الصفحة
  onSearchChange              // دالة التغيير القادمة من الصفحة
}) => {
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  // تحديد القيمة الفعلية وحادثة التغيير (سواء كانت خارجية من الصفحة أو محلية)
  const currentSearchTerm = searchValue !== undefined ? searchValue : localSearchTerm;
  
  const handleInputChange = (e) => {
    const val = e.target.value;
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setLocalSearchTerm(val);
    }
  };

  // الفلترة المحلية تُفعل فقط إذا تم طلب ذلك صراحة عبر search_auto
  let filteredData = data;
  if (search_auto && currentSearchTerm.trim() !== "") {
    filteredData = data.filter((item) =>
      Object.values(item).some((val) =>
        String(val ?? "").toLowerCase().includes(currentSearchTerm.toLowerCase())
      )
    );
  }

  const hasActions = Boolean(onEdit || onDelete);

  return (
    <div className="space-y-4 w-full">
      {/* العنوان وزر الإضافة وحقل البحث في الهيدر العلوي للجدول */}
      {(title || (showAdd && onAdd) || showSearchInput) && (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          {title && <h2 className="text-xl font-bold text-gray-800">{title}</h2>}

          <div className="flex items-center gap-3 ml-auto">
            {/* حقل البحث الموحد */}
            {showSearchInput && (
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder={searchPlaceholder}
                  value={currentSearchTerm}
                  onChange={handleInputChange}
                  className="pl-9 h-10 rounded-xl"
                />
              </div>
            )}

            {/* زر الإضافة */}
            {showAdd && onAdd && (
              <Button onClick={onAdd} className="gap-2 shrink-0">
                <Plus className="h-4 w-4" /> Add
              </Button>
            )}
          </div>
        </div>
      )}

      {/* الجدول */}
      <div className="rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              {columns.map((col, index) => (
                <TableHead key={col.accessorKey || index} className="font-semibold text-gray-700">
                  {col.header}
                </TableHead>
              ))}
              {hasActions && <TableHead className="text-center font-semibold text-gray-700">Actions</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length + (hasActions ? 1 : 0)} className="h-32 text-center">
                  <div className="flex items-center justify-center gap-2 text-gray-500">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    <span>Loading data...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <TableRow key={row.id || rowIndex} className="hover:bg-gray-50/50 transition-colors">
                  {columns.map((col, colIndex) => (
                    <TableCell key={colIndex}>
                      {col.render ? col.render(row) : (row[col.accessorKey] ?? "-")}
                    </TableCell>
                  ))}
                  {hasActions && (
                    <TableCell>
                      <div className="flex justify-center items-center gap-1">
                        {onEdit && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit"
                            aria-label="Edit"
                            onClick={() => onEdit(row)}
                            className="h-8 w-8 text-slate-600 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                        {onDelete && (
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Delete"
                            aria-label="Delete"
                            onClick={() => onDelete(row)}
                            className="h-8 w-8 text-slate-600 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell 
                  colSpan={columns.length + (hasActions ? 1 : 0)} 
                  className="h-32 text-center text-gray-500 font-medium"
                >
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};