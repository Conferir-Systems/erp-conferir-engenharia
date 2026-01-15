# Validation Extraction Design

## Overview

Extract inline validation logic from components into a centralized validations folder, organized by domain/feature using Zod schemas for type-safe validation.

## Current State

**Existing validation files:**

- `src/validations/authValidation.ts` - Login validation (Zod)
- `src/validations/userRegisterValidation.ts` - Registration validation (Zod + custom validators)

**Inline validations to extract:**

- `src/pages/NewContract.tsx` - Delivery date validation, form validation
- `src/pages/Works.tsx` - Work form validation (name, address)
- `src/components/SupplierModal.tsx` - Supplier form validation (name, document, PIX)

## Design Decisions

### Validation Approach

**Choice:** Zod schemas (standardized)

- Type-safe, declarative validation
- Automatic TypeScript inference
- Works well with form libraries like react-hook-form
- More maintainable long-term

### File Organization

**Choice:** By domain/feature

- `contractValidations.ts` - Contract-related validations
- `workValidations.ts` - Work/project validations
- `supplierValidations.ts` - Supplier validations
- Easier to find and maintain related validations

### Existing Code

**Choice:** Keep existing validators as-is

- `userRegisterValidation.ts` custom validators (nameValidator, emailValidator, passwordValidator) remain unchanged
- Avoid unnecessary refactoring risk
- Focus on extracting new validations

## Architecture

### Directory Structure

```
src/
  validations/
    authValidation.ts           (existing - no changes)
    userRegisterValidation.ts   (existing - no changes)
    contractValidations.ts      (new)
    workValidations.ts          (new)
    supplierValidations.ts      (new)
```

### Validation Pattern

Each validation file exports:

1. Zod schemas for form validation
2. TypeScript types inferred from schemas using `z.infer<>`
3. Helper functions if needed (date comparisons, calculations)

### Key Principles

- Use Zod's built-in validators wherever possible
- Custom refinements only for business logic (date comparisons, complex rules)
- Clear, Portuguese error messages matching existing style
- Keep validation logic separate from UI components
- Single source of truth for validation rules

## Detailed Schemas

### 1. Contract Validations (contractValidations.ts)

**Purpose:** Validate contract creation forms

**Schemas:**

#### contractItemSchema

Validates individual contract items:

- `description` - required string (trimmed, min 1 char)
- `unitMeasure` - required string (trimmed, min 1 char)
- `quantity` - required number (positive, > 0)
- `unitLaborValue` - required number (positive, > 0)

#### contractFormSchema

Validates complete contract form:

- `workId` - required string (min 1 char, "Obra é obrigatória")
- `supplierId` - required string (min 1 char, "Fornecedor é obrigatório")
- `service` - required string (trimmed, min 1 char, "Serviço é obrigatório")
- `retentionPercentage` - number (0 to 99.9, "Retenção deve estar entre 0 e 99.9%")
- `startDate` - required string (date format, "Data de início é obrigatória")
- `deliveryTime` - required string (date format, "Prazo de entrega é obrigatório")
- `items` - array of contractItemSchema (min 1, "Adicione pelo menos um item")

**Custom Refinements:**

- Delivery date validation: `deliveryTime >= startDate`
  - Error: "O prazo de entrega não pode ser anterior à data de início"

**Exported Types:**

- `ContractFormData` - inferred from contractFormSchema
- `ContractItemData` - inferred from contractItemSchema

**Removes from NewContract.tsx:**

- `validateDeliveryDate` function (lines 144-160)
- Inline validation logic in `handleSaveContract` (lines 180-206)

### 2. Work Validations (workValidations.ts)

**Purpose:** Validate work/project creation and updates

**Schema:**

#### workFormSchema

Validates work form:

- `name` - required string (trimmed, min 1 char, "O nome do Local é obrigatório")
- `address` - required string (trimmed, min 1 char, "O endereço é obrigatório")
- `contractor` - optional string (trimmed)
- `status` - enum ('ATIVA' | 'CONCLUIDA')

**Validation Rules:**

- Name: cannot be empty after trimming
- Address: cannot be empty after trimming
- Contractor: optional field, trimmed if provided
- Status: must be one of the allowed enum values

**Exported Types:**

- `WorkFormData` - inferred from workFormSchema

**Removes from Works.tsx:**

- `validateForm` function (lines 102-119)

### 3. Supplier Validations (supplierValidations.ts)

**Purpose:** Validate supplier creation and updates

**Schema:**

#### supplierFormSchema

Validates supplier form:

- `name` - required string (trimmed, 3-60 chars)
  - "O nome/razão social é obrigatório"
  - "O nome deve ter no mínimo 3 caracteres"
  - "O nome deve ter no máximo 60 caracteres"
- `typePerson` - enum ('FISICA' | 'JURIDICA')
- `document` - required string (validated based on typePerson)
  - JURIDICA: exactly 14 digits - "O CNPJ é obrigatório", "O CNPJ deve ter exatamente 14 dígitos"
  - FISICA: exactly 11 digits - "O CPF é obrigatório", "O CPF deve ter exatamente 11 dígitos"
- `pix` - optional string (8-45 chars if provided)
  - "A chave PIX deve ter no mínimo 8 caracteres"
  - "A chave PIX deve ter no máximo 45 caracteres"

**Custom Refinements:**

- Document length validation based on person type
- Strip non-digit characters before validating length

**Exported Types:**

- `SupplierFormData` - inferred from supplierFormSchema

**Removes from SupplierModal.tsx:**

- `validateForm` function (lines 54-103)

## Implementation Steps

1. **Create contractValidations.ts**
   - Write contractItemSchema
   - Write contractFormSchema with date refinement
   - Export types

2. **Create workValidations.ts**
   - Write workFormSchema
   - Export types

3. **Create supplierValidations.ts**
   - Write supplierFormSchema with document refinement
   - Export types

4. **Update NewContract.tsx**
   - Import contractFormSchema and types
   - Remove validateDeliveryDate function
   - Remove inline validation logic
   - Use Zod schema for validation

5. **Update Works.tsx**
   - Import workFormSchema and types
   - Remove validateForm function
   - Use Zod schema for validation

6. **Update SupplierModal.tsx**
   - Import supplierFormSchema and types
   - Remove validateForm function
   - Use Zod schema for validation

7. **Test all forms**
   - Verify error messages display correctly
   - Verify validation logic matches previous behavior
   - Test edge cases (empty fields, invalid data, boundary values)

## Benefits

- **Reusability:** Validations can be reused across components
- **Testability:** Easier to test in isolation
- **Type Safety:** TypeScript types throughout form handling
- **Maintainability:** Single source of truth for validation rules
- **Consistency:** Standardized validation approach
- **Scalability:** Better organization as app grows

## Testing Checklist

- [ ] Contract form validation
  - [ ] Required fields show errors when empty
  - [ ] Delivery date validation (must be >= start date)
  - [ ] Retention percentage validation (0-99.9)
  - [ ] Items validation (at least one item with valid data)
- [ ] Work form validation
  - [ ] Name required validation
  - [ ] Address required validation
  - [ ] Status enum validation
- [ ] Supplier form validation
  - [ ] Name length validation (3-60 chars)
  - [ ] Document validation (11 for CPF, 14 for CNPJ)
  - [ ] PIX validation (8-45 chars if provided)
  - [ ] Type-specific document error messages
