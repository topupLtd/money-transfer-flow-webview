You are a senior full-stack engineer working on a modern React (Vite + TypeScript) project that uses:

- TanStack React Query v5  
- Axios or Fetch  
- Zod for validation  
- Clean architecture and separation of concerns  

First, read and understand the entire `client` folder structure before writing any code.

The backend API base URL is:
https://paycell-test.paytop.com/api

This base URL is already defined in:
`src/config.ts`

### Versioning Rule
All API calls must use:
- `v1` by default  
- Ability to override to `v2` or `v3` per request  

Example default:
https://paycell-test.paytop.com/api/v1/{endpoint}

Example override:
https://paycell-test.paytop.com/api/v2/{endpoint}

This must be handled centrally inside the API client, not hardcoded in every API call.

---

## Architecture Requirements

Follow these best practices strictly:

### 1. API Layer
Create a clean API system:

src/
└── api/
├── client.ts        # Axios or Fetch wrapper
├── version.ts       # Handles v1, v2, v3
├── endpoints.ts    # API endpoint constants
└── services/
└── currency.ts

`client.ts` must:
- Use the baseURL from `config.ts`
- Automatically prepend `/v1` unless overridden
- Handle:
  - Authorization header
  - Error normalization
  - JSON parsing
  - Timeout
  - Logging in dev

---

### 2. Currency & Country API

Implement this endpoint: GET /currency-countries

Which will become: https://paycell-test.paytop.com/api/v1/currency-countries

Create: src/api/services/currency.ts

This must export: getCurrencyCountries()

Use:
- Strong TypeScript types
- Zod schema validation
- Proper error handling

---

### 3. React Query Integration

Create: src/hooks/useCurrencyCountries.ts

This hook must:
- Use TanStack Query
- Cache properly
- Retry only on network failure
- Provide loading, error, and data states
- Be fully typed

---

### 4. UI Integration

Integrate this into the **Send Money Page**.

The UI must:
- Load currency-country data when the page opens
- Show loading skeleton
- Show error state
- Render country + currency list
- Be memoized for performance

Do not use inline API calls inside components.  
All API access must go through hooks.

---

### 5. Code Quality Rules

You must:
- Avoid any duplicated URLs
- Avoid magic strings
- Avoid any fetch calls inside React components
- Use proper file separation
- Use TypeScript everywhere
- Follow scalable folder structure

---

### 6. Final Output

Provide:
1. Folder structure
2. API client implementation
3. Currency API service
4. React Query hook
5. Send Money page integration
6. Types and Zod schema
7. Example response handling

This must be production-grade and scalable.

Do NOT simplify or skip any layer.
Do NOT write everything in one file.
Do NOT use mock data.

Proceed now.