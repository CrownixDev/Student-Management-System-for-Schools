import { TooltipProvider } from "@/components/shadcn/tooltip";
import { ToastContainer, Bounce } from "react-toastify";
import { NuqsAdapter } from "nuqs/adapters/next/app";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      <NuqsAdapter>{children}</NuqsAdapter>
    </TooltipProvider>
  );
}
