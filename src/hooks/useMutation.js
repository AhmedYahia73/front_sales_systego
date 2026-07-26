import { useState } from 'react';
import { apiClient } from '@/lib/axios';
import { toast } from 'sonner'; // استيراد sonner هنا

export const useMutation = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const mutate = async ({ method, url, data = null, showToast = true }) => { // أضفنا showToast للتحكم
        setLoading(true);
        setError(null);
        try {
            // ⚠️ مهم: لو مفيش data فعلية (null/undefined) منبعتش الـ key دي خالص للـ axios،
            // عشان ميتبعتش body زي "null" مع requests زي DELETE اللي مش محتاجة body أصلاً.
            const config = {
                method,
                url,
                ...(data !== null && data !== undefined ? { data } : {}),
            };

            const response = await apiClient(config);
            
            // نجاح تلقائي
            if (showToast) toast.success("Operation successful");
            
            return { success: true, data: response.data };
        } catch (err) {
            const errMsg = err.response?.data?.message || 'Operation failed';
            setError(errMsg);
            
            // خطأ تلقائي
            if (showToast) toast.error("Error", { description: errMsg });
            
            return { success: false, error: errMsg };
        } finally {
            setLoading(false);
        }
    };

    return { mutate, loading, error };
};