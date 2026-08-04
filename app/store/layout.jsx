export const dynamic = 'force-dynamic'

import StoreLayout from "@/components/store/StoreLayout";

export const metadata = {
    title: "Anantin. - Store Dashboard",
    description: "Anantin. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <StoreLayout>
            {children}
        </StoreLayout>
    );
}
