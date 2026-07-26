import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/DataTable";
import { DeleteDialog } from "@/components/DeleteDialog";
import { useGet } from "@/hooks/useGet";
import { useMutation } from "@/hooks/useMutation";
import { toast } from "sonner";

const WishList = () => { 

    // استخراج المصفوفة بناءً على الـ Response Schema
    const { data: response, loading: isLoading, refresh } = useGet("/api/admin/wish_list");
    const wish_list = response?.data?.allWishLists || response?.allWishLists || [];
 

    // ---- Table Columns definition ----
    const columns = [
        { accessorKey: "name", header: "Name" },
        { accessorKey: "description", header: "Description" },
    ]; 

    return (
        <div className="container mx-auto py-10">
            <DataTable
                title="Wish List Management"
                columns={columns}
                data={wish_list}
                isLoading={isLoading}
            />
        </div>
    );
};

export default WishList;