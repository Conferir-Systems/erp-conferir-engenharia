import {
	Status,
	ApprovalStatus as ContractApprovalStatus,
} from './contracts.js'
import { ApprovalStatus as MeasurementApprovalStatus } from './measurements.js'
import { TypePerson } from './supplier.js'
import { WorkStatus } from './works.js'
import type { UUID } from './common.js'

export type UserDatabaseRow = {
	id: UUID
	first_name: string
	last_name: string
	email: string
	password: string
	type_user_id: UUID
}

export type UserTypeDatabaseRow = {
	id: UUID
	name: string
	approve_measurement: boolean
	created_at?: Date
	updated_at?: Date
}

export type WorkDatabaseRow = {
	id: UUID
	name: string
	code: number
	address: string
	contractor: string | null
	status: WorkStatus
	created_at?: Date
	updated_at?: Date
}

export type SupplierDatabaseRow = {
	id: UUID
	name: string
	type_person: TypePerson
	document: string
	pix?: string
	created_at: Date
	updated_at: Date
}

export type ContractDatabaseRow = {
	id: UUID
	work_id: UUID
	supplier_id: UUID
	service: string
	total_value: number
	retention_percentage: number
	start_date: Date
	delivery_time: Date
	status: Status
	approval_status: ContractApprovalStatus
	created_at: Date
	updated_at: Date
}

export type ContractQueryRow = {
	id: UUID
	service: string
	total_value: number
	retention_percentage: number
	start_date: Date
	delivery_time: Date | null
	status: Status
	work_id: UUID
	work_name: string
	supplier_id: UUID
	supplier_name: string
}

export type ContractItemDatabaseRow = {
	id: UUID
	contract_id: UUID
	unit_measure: string
	quantity: number
	unit_labor_value: number
	total_value: number
	description: string
	created_at: Date
	updated_at: Date
}

export type MeasurementDatabaseRow = {
	id: UUID
	contract_id: UUID
	issue_date: Date
	approval_date?: Date | null
	approval_status: MeasurementApprovalStatus
	total_gross_value: number
	retention_value: number
	total_net_value: number
	notes: string
	created_at: Date
	updated_at: Date
}

export type MeasurementItemDatabaseRow = {
	id: UUID
	measurement_id: UUID
	contract_item_id: UUID
	quantity: number
	unit_labor_value: number
	total_gross_value: number
	created_at: Date
	updated_at: Date
}

export type RefreshTokenDatabaseRow = {
	id: UUID
	user_id: UUID
	token: string
	expires_at: Date
	created_at: Date
	revoked_at: Date | null
}
