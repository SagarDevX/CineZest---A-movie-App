import { Suspense } from "react";
import SearchPage from "./SearchPage";

export default function Page() {
  return (
    <Suspense fallback={<div className="pt-24 p-4 text-white text-center">Loading...</div>}>
      <SearchPage />
    </Suspense>
  );
}