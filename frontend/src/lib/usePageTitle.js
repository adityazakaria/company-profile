import { useEffect } from "react";

export function usePageTitle(title, suffix = "Catudaya Data Prakasa") {
  useEffect(() => {
    document.title = title ? `${title} | ${suffix}` : suffix;
  }, [title, suffix]);
}
