import { AsyncLocalStorage } from "async_hooks";

// Ovo nam omogućava da pristupimo orgId-u bilo gde u kodu
export const tenantContext = new AsyncLocalStorage<number>();
