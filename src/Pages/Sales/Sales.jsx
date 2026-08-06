import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { useGet } from "@/hooks/useGet";
import { MapPin, StickyNote } from "lucide-react";

// استيراد مكونات الـ Dialog والمكونات الإضافية للزرار
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

const Sales = () => {
    const navigate = useNavigate();

    // ---- Search & Pagination States ----
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selectedStatusFilter, setSelectedStatusFilter] = useState("");

    // ---- Month & Year Filter States ----
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedMonths, setSelectedMonths] = useState([]);

    const months = [
        { value: "01", label: "Jan" },
        { value: "02", label: "Feb" },
        { value: "03", label: "Mar" },
        { value: "04", label: "Apr" },
        { value: "05", label: "May" },
        { value: "06", label: "Jun" },
        { value: "07", label: "Jul" },
        { value: "08", label: "Aug" },
        { value: "09", label: "Sep" },
        { value: "10", label: "Oct" },
        { value: "11", label: "Nov" },
        { value: "12", label: "Dec" },
    ];

    // ---- Notes State ----
    const [selectedNotes, setSelectedNotes] = useState(null);

    // ---- Debounce Search Logic ----
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // العودة للصفحة الأولى عند كل بحث جديد
        }, 500);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    // ---- Build Query Parameters for Backend ----
    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", "10");

    if (debouncedSearch.trim()) {
        queryParams.append("search", debouncedSearch.trim());
    }

    if (selectedStatusFilter) {
        queryParams.append("status_id", selectedStatusFilter);
    }

    if (selectedMonths.length > 0 && selectedYear) {
        queryParams.append("months", selectedMonths.join(','));
        queryParams.append("year", selectedYear);
    }

    const salesVisitsApiUrl = `/api/admin/visits/sales?${queryParams.toString()}`;

    // ---- Fetch Visits Data ----
    const { data: response, loading: isLoading } = useGet(salesVisitsApiUrl);
    const visits = response?.data?.allVisits || [];
    const paginationData = response?.data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 };

    const handleStatusFilterChange = (e) => {
        setSelectedStatusFilter(e.target.value);
        setPage(1);
    };

    // ---- Get Status List for the Select Dropdown ----
    const { data: statusResponse } = useGet("/api/admin/visits/lists");
    const statusList = statusResponse?.visit_status || statusResponse?.data?.visit_status || [];

    const columns = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "address", header: "Address" },
        { accessorKey: "phone", header: "Phone" },
        {
            accessorKey: "product",
            header: "Product",
            render: (row) => row.product?.name || row.product_name || "-",
        },
        { accessorKey: "visit_status", header: "Status" },
        { accessorKey: "status", header: "Sales Status" },   
        {
            accessorKey: "notes",
            header: "Notes",
            render: (row) => {
                if (!row.notes) return <span className="text-gray-400">-</span>;

                return (
                    <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs gap-1.5"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedNotes({
                                name: row.name,
                                notes: row.notes,
                            });
                        }}
                    >
                        <StickyNote className="h-3.5 w-3.5 text-blue-500" />
                        View Notes
                    </Button>
                );
            },
        },
        {
            accessorKey: "map_link",
            header: "Map",
            render: (row) => (
                <a
                    href={row.map_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-1"
                >
                    <MapPin className="h-4 w-4" /> View
                </a>
            ),
        },
    ];

    return (
        <div className="container mx-auto py-10">
            <div className="flex flex-col xl:flex-row gap-6 mb-6">
                {/* Left Side: Filters */}
                <div className="flex-1 flex flex-col gap-4">
                    {/* Year & Month Filter */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <label htmlFor="year-filter" className="text-sm font-semibold text-gray-700">
                                Filter by Year:
                            </label>
                            <select
                                id="year-filter"
                                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[120px]"
                                value={selectedYear}
                                onChange={(e) => {
                                    setSelectedYear(e.target.value);
                                    setPage(1);
                                }}
                            >
                                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                            <button
                                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${selectedMonths.length === 0 ? "bg-red-500 text-white font-medium shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"}`}
                                onClick={() => { setSelectedMonths([]); setPage(1); }}
                            >
                                All Months
                            </button>
                            {months.map(m => {
                                const isSelected = selectedMonths.includes(m.value);
                                return (
                                    <button
                                        key={m.value}
                                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${isSelected ? "bg-red-500 text-white font-medium shadow-md" : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"}`}
                                        onClick={() => { 
                                            if (isSelected) {
                                                setSelectedMonths(selectedMonths.filter(x => x !== m.value));
                                            } else {
                                                setSelectedMonths([...selectedMonths, m.value]);
                                            }
                                            setPage(1);
                                        }}
                                    >
                                        {m.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Controls Section: Filter */}
                    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center gap-3">
                        <label htmlFor="status-filter" className="text-sm font-semibold text-gray-700">
                            Filter by Status:
                        </label>
                        <select
                            id="status-filter"
                            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[200px]"
                            value={selectedStatusFilter}
                            onChange={handleStatusFilterChange}
                        >
                            <option value="">All Statuses (Show All)</option>
                            {statusList.map((s) => (
                                <option key={s.id} value={s.id}>
                                    {s.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Right Side: Total Sales Overview */}
                <div className="shrink-0 flex items-stretch">
                    <div className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-white border border-red-400/50 transition-transform hover:scale-[1.02] min-h-full" style={{ width: 'calc(var(--spacing) * 55)' }}>
                        <div className="bg-white/20 p-4 rounded-full mb-4 shadow-inner">
                            <MapPin className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-5xl font-extrabold leading-none mb-2">{paginationData.total}</p>
                        <h2 className="text-sm font-semibold uppercase tracking-wider text-red-100 text-center">Total Sales</h2>
                    </div>
                </div>
            </div>

            <DataTable
                title="Sales Visits Management"
                columns={columns}
                data={visits}
                isLoading={isLoading}
                search_auto={false} // إيقاف الفلترة المحلية
                showSearchInput={true} // حقل البحث داخل هيدر الجدول الموحد
                searchValue={searchQuery}
                onSearchChange={(value) => setSearchQuery(value)}
                searchPlaceholder="Search sales visits by name, phone, or address..."
            />

            {/* Pagination Controls */}
            <div className="flex items-center justify-between mt-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div className="text-sm text-gray-600">
                    Showing page <span className="font-semibold">{paginationData.page}</span> of{" "}
                    <span className="font-semibold">{paginationData.totalPages || 1}</span> (Total: {paginationData.total})
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((old) => Math.max(old - 1, 1))}
                        disabled={page === 1 || isLoading}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((old) => Math.min(old + 1, paginationData.totalPages))}
                        disabled={page >= paginationData.totalPages || isLoading}
                    >
                        Next
                    </Button>
                </div>
            </div>

            {/* PopUp / Modal لعرض الـ Notes */}
            <Dialog open={!!selectedNotes} onOpenChange={() => setSelectedNotes(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <StickyNote className="h-5 w-5 text-primary" />
                            Visit Notes - {selectedNotes?.name}
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">
                            {selectedNotes?.notes}
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Sales;