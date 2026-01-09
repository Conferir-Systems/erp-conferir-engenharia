# Contract Listing Screen Design

**Date:** 2026-01-08
**Status:** Approved
**Branch:** core/contracts

## Overview

Design for the contract listing screen that allows users to view, filter, and access all contracts in the system. The screen provides a clean table interface with filtering capabilities by work and supplier, following the existing application patterns.

## User Requirements

- Display all contracts in a table format
- Filter contracts by work (project) and supplier
- Show contract progress with a visual progress bar
- Click on any contract row to navigate to contract details
- Maintain consistency with existing UI patterns (Suppliers, Works pages)

## Navigation & Routing

### Sidebar Integration
- Add "Contratos" link to sidebar in Layout.tsx
- Position: Between "Fornecedores" and "Novo Contrato"
- Icon: FileText (lucide-react)
- Route: `/contracts`
- Active state styling: `bg-surfaceHighlight text-primary`

### Routes
- **List page:** `/contracts` - Main contract listing page
- **Detail page:** `/contracts/:id` - Contract details (future implementation)
- Both routes protected with ProtectedRoute wrapper

## Table Structure

### Page Layout
Following Suppliers.tsx pattern:
- Header section with:
  - Back button (ArrowLeft icon)
  - Title: "Gestão de Contratos"
  - Subtitle: "Contratos cadastrados"
- Filter section with work and supplier dropdowns
- Card component wrapping the table
- Loading state with centered Loader2 spinner
- Error state with retry button

### Table Columns

| Column | Description | Formatting |
|--------|-------------|-----------|
| Obra | Work/project name | Plain text from work.name |
| Fornecedor | Supplier name | Plain text from supplier.name |
| Serviço | Service description | Truncated with title hover |
| Valor Total | Contract total value | R$ X.XXX,XX (pt-BR currency) |
| Progresso | Payment progress | Progress bar + percentage |

### Progress Bar Implementation
```tsx
<Td className="text-center">
  <div className="flex items-center justify-center gap-2">
    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-primary"
        style={{ width: `${Math.min(percentage, 100)}%` }}
      ></div>
    </div>
    <span className="text-xs font-medium">
      {percentage.toFixed(1)}%
    </span>
  </div>
</Td>
```

### Interactive Behavior
- Entire row is clickable
- Click navigates to `/contracts/:id`
- Hover effect: `hover:bg-gray-50`
- Cursor: `cursor-pointer`
- No edit/delete action buttons (view-only)

## Filtering System

### Filter Controls
Two dropdown selects above the table:

1. **Obra Filter**
   - Fetches from: `GET /api/works`
   - Default option: "Todas as obras"
   - Shows: work.name
   - Filters by: workId query parameter

2. **Fornecedor Filter**
   - Fetches from: `GET /api/suppliers`
   - Default option: "Todos os fornecedores"
   - Shows: supplier.name
   - Filters by: supplierId query parameter

### API Integration
- Base endpoint: `GET /api/contracts`
- Query parameters: `?workId=X&supplierId=Y`
- Both parameters optional
- Returns: `ContractListItem[]` with embedded work/supplier data

## State Management

### Component State
```typescript
// Data
const [contracts, setContracts] = useState<ContractListItem[]>([])
const [works, setWorks] = useState<Work[]>([])
const [suppliers, setSuppliers] = useState<Supplier[]>([])

// UI State
const [loading, setLoading] = useState(true)
const [error, setError] = useState<string | null>(null)

// Filters
const [selectedWorkId, setSelectedWorkId] = useState<string>('')
const [selectedSupplierId, setSelectedSupplierId] = useState<string>('')
```

### Data Flow
1. Component mounts → fetch works, suppliers, and contracts
2. User changes filter → refetch contracts with query parameters
3. User clicks row → navigate to `/contracts/:id`

## API Service Layer

Create `frontend/src/pages/services/contracts.ts`:

```typescript
import { fetchClient } from '../../lib/fetchClient'
import { ContractListItem } from '../../types'

export const contractsApi = {
  getAll: async (filters?: {
    workId?: string
    supplierId?: string
  }): Promise<ContractListItem[]> => {
    const params = new URLSearchParams()
    if (filters?.workId) params.append('workId', filters.workId)
    if (filters?.supplierId) params.append('supplierId', filters.supplierId)

    const url = `/contracts${params.toString() ? `?${params}` : ''}`
    return fetchClient<ContractListItem[]>(url)
  }
}
```

## Error Handling

### Loading States
- Initial load: Centered Loader2 spinner in Card
- Filter changes: Show spinner during refetch
- Dropdown loading: "Carregando..." option

### Error Messages
- API errors: "Erro ao carregar contratos. Tente novamente."
- Network errors: Same message with retry button
- Filter errors: Silent console.error, empty dropdown options

### Empty States
- No contracts: "Nenhum contrato cadastrado."
- No filtered results: "Nenhum contrato encontrado com os filtros selecionados."
- Empty dropdowns: "Nenhuma obra disponível" / "Nenhum fornecedor disponível"

### Edge Cases
- Service truncation: CSS `truncate` class + title attribute
- Percentage > 100%: Cap at 100% with `Math.min(percentage, 100)`
- Missing optional values: Display "-"
- Zero contracts: Show empty state (not error)

## Data Types

Using existing backend types:

```typescript
// From backend/src/types/contractItems.ts
type ContractListItem = {
  id: string
  work: { id: string; name: string }
  supplier: { id: string; name: string }
  service: string
  totalValue: number
  startDate: Date
  deliveryTime: Date | null
  percentage: number
}
```

## Implementation Files

### New Files
- `frontend/src/pages/Contracts.tsx` - Main contract listing page
- `frontend/src/pages/services/contracts.ts` - API service functions
- `frontend/src/types/index.ts` - Export ContractListItem type (if not already)

### Modified Files
- `frontend/src/components/Layout.tsx` - Add Contratos sidebar link
- `frontend/src/App.tsx` - Add /contracts route

## Design Principles

- **Consistency:** Follow Suppliers.tsx patterns exactly
- **Simplicity:** View-only table, no inline actions
- **Performance:** Efficient API calls with query parameters
- **UX:** Clear loading/error states, intuitive filtering
- **Accessibility:** Keyboard navigation, focus states, hover feedback

## Future Enhancements

Not included in this implementation:
- Contract details page (`/contracts/:id`)
- Edit/delete functionality
- Search functionality
- Date range filtering
- Export to CSV/PDF
- Pagination (if needed for large datasets)

## Success Criteria

- [ ] Sidebar link navigates to contracts page
- [ ] All contracts display in table with correct formatting
- [ ] Work filter correctly filters contracts
- [ ] Supplier filter correctly filters contracts
- [ ] Progress bar displays correctly with percentage
- [ ] Clicking row navigates to details page
- [ ] Loading states display during data fetching
- [ ] Error states display with retry option
- [ ] Empty states show appropriate messages
- [ ] Page follows existing design patterns
