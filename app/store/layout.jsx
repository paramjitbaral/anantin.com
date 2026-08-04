import StoreLayout from "@/components/store/StoreLayout";
import FloatingAssistant from "@/components/FloatingAssistant";

export const metadata = {
    title: "Anantin. - Store Dashboard",
    description: "Anantin. - Store Dashboard",
};

export default function RootAdminLayout({ children }) {

    return (
        <>
            <StoreLayout>
                {children}
            </StoreLayout>
            <FloatingAssistant role="supplier" />
        </>
    );
}
