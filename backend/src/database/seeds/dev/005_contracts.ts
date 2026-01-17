import type { Knex } from 'knex'
import { WORK_IDS } from './004_works.js'
import { SUPPLIER_IDS } from './003_suppliers.js'

export async function seed(knex: Knex): Promise<void> {
	await knex('contract_items').del()
	await knex('contracts').del()

	const contract1Id = 'b1111111-1111-4111-8111-111111111111'
	await knex('contracts').insert({
		id: contract1Id,
		work_id: WORK_IDS.COND_JARDIM_FLORES,
		supplier_id: SUPPLIER_IDS.CONSTRUTORA_ALPHA,
		service: 'Estrutura de Concreto Armado',
		retention_percentage: 10,
		total_value: 285000.0,
		start_date: new Date('2025-01-15'),
		delivery_time: new Date('2025-07-15'),
		status: 'Ativo',
		approval_status: 'APROVADO',
	})

	await knex('contract_items').insert([
		{
			id: 'd1111111-1111-4111-8111-111111111111',
			contract_id: contract1Id,
			unit_measure: 'm³',
			quantity: 150,
			unit_labor_value: 850.0,
			total_value: 127500.0,
			description: 'Concretagem de lajes',
		},
		{
			id: 'd1111111-1111-4111-8111-111111111112',
			contract_id: contract1Id,
			unit_measure: 'kg',
			quantity: 12500,
			unit_labor_value: 8.5,
			total_value: 106250.0,
			description: 'Fornecimento e instalação de ferragem',
		},
		{
			id: 'd1111111-1111-4111-8111-111111111113',
			contract_id: contract1Id,
			unit_measure: 'm²',
			quantity: 850,
			unit_labor_value: 60.0,
			total_value: 51000.0,
			description: 'Forma e escoramento',
		},
	])

	const contract2Id = 'b2222222-2222-4222-8222-222222222222'
	await knex('contracts').insert({
		id: contract2Id,
		work_id: WORK_IDS.ESCOLA_EDUARDO_DIAZ,
		supplier_id: SUPPLIER_IDS.EQUIPAMENTOS_GAMMA,
		service: 'Instalações Elétricas',
		retention_percentage: 3,
		total_value: 142500.0,
		start_date: new Date('2025-02-01'),
		delivery_time: new Date('2025-05-30'),
		status: 'Ativo',
		approval_status: 'APROVADO',
	})

	await knex('contract_items').insert([
		{
			id: 'd2222222-2222-4222-8222-222222222221',
			contract_id: contract2Id,
			unit_measure: 'm',
			quantity: 2500,
			unit_labor_value: 18.5,
			total_value: 46250.0,
			description: 'Cabeamento elétrico',
		},
		{
			id: 'd2222222-2222-4222-8222-222222222222',
			contract_id: contract2Id,
			unit_measure: 'un',
			quantity: 85,
			unit_labor_value: 450.0,
			total_value: 38250.0,
			description: 'Quadros de distribuição',
		},
		{
			id: 'd2222222-2222-4222-8222-222222222223',
			contract_id: contract2Id,
			unit_measure: 'un',
			quantity: 320,
			unit_labor_value: 65.0,
			total_value: 20800.0,
			description: 'Pontos de tomada e interruptores',
		},
		{
			id: 'd2222222-2222-4222-8222-222222222224',
			contract_id: contract2Id,
			unit_measure: 'un',
			quantity: 125,
			unit_labor_value: 298.4,
			total_value: 37300.0,
			description: 'Luminárias LED',
		},
	])

	const contract3Id = 'b3333333-3333-4333-8333-333333333333'
	await knex('contracts').insert({
		id: contract3Id,
		work_id: WORK_IDS.SHOPPING_NORTE_PLAZA,
		supplier_id: SUPPLIER_IDS.MATERIAIS_BETA,
		service: 'Cobertura Metálica',
		retention_percentage: 15,
		total_value: 520000.0,
		start_date: new Date('2025-03-01'),
		delivery_time: new Date('2025-08-31'),
		status: 'Ativo',
		approval_status: 'APROVADO',
	})

	await knex('contract_items').insert([
		{
			id: 'd3333333-3333-4333-8333-333333333331',
			contract_id: contract3Id,
			unit_measure: 'm²',
			quantity: 3500,
			unit_labor_value: 120.0,
			total_value: 420000.0,
			description: 'Estrutura metálica e telhas',
		},
		{
			id: 'd3333333-3333-4333-8333-333333333332',
			contract_id: contract3Id,
			unit_measure: 'm',
			quantity: 850,
			unit_labor_value: 75.0,
			total_value: 63750.0,
			description: 'Calhas e rufos',
		},
		{
			id: 'd3333333-3333-4333-8333-333333333333',
			contract_id: contract3Id,
			unit_measure: 'un',
			quantity: 45,
			unit_labor_value: 805.55,
			total_value: 36250.0,
			description: 'Claraboias',
		},
	])

	const contract4Id = 'b4444444-4444-4444-8444-444444444444'
	await knex('contracts').insert({
		id: contract4Id,
		work_id: WORK_IDS.PONTE_RIO_TIETE,
		supplier_id: SUPPLIER_IDS.PEDRO_ALMEIDA,
		service: 'Pintura e Revestimento Anticorrosivo',
		retention_percentage: 20,
		total_value: 95000.0,
		start_date: new Date('2025-01-20'),
		delivery_time: new Date('2025-04-20'),
		status: 'Ativo',
		approval_status: 'APROVADO',
	})

	await knex('contract_items').insert([
		{
			id: 'd4444444-4444-4444-8444-444444444441',
			contract_id: contract4Id,
			unit_measure: 'm²',
			quantity: 1200,
			unit_labor_value: 45.0,
			total_value: 54000.0,
			description: 'Preparação e tratamento de superfície',
		},
		{
			id: 'd4444444-4444-4444-8444-444444444442',
			contract_id: contract4Id,
			unit_measure: 'm²',
			quantity: 1200,
			unit_labor_value: 35.0,
			total_value: 42000.0,
			description: 'Aplicação de tinta anticorrosiva',
		},
	])

	const contract5Id = 'b5555555-5555-4555-8555-555555555555'
	await knex('contracts').insert({
		id: contract5Id,
		work_id: WORK_IDS.COMPLEXO_MAIS_VIDA,
		supplier_id: SUPPLIER_IDS.FERRAGENS_OMEGA,
		service: 'Serralheria e Esquadrias',
		retention_percentage: 8,
		total_value: 178000.0,
		start_date: new Date('2025-02-10'),
		delivery_time: new Date('2025-06-30'),
		status: 'Ativo',
		approval_status: 'APROVADO',
	})

	await knex('contract_items').insert([
		{
			id: 'd5555555-5555-4555-8555-555555555551',
			contract_id: contract5Id,
			unit_measure: 'un',
			quantity: 180,
			unit_labor_value: 450.0,
			total_value: 81000.0,
			description: 'Portas de ferro',
		},
		{
			id: 'd5555555-5555-4555-8555-555555555552',
			contract_id: contract5Id,
			unit_measure: 'un',
			quantity: 240,
			unit_labor_value: 320.0,
			total_value: 76800.0,
			description: 'Janelas de alumínio',
		},
		{
			id: 'd5555555-5555-4555-8555-555555555553',
			contract_id: contract5Id,
			unit_measure: 'm',
			quantity: 420,
			unit_labor_value: 48.0,
			total_value: 20160.0,
			description: 'Corrimão de escada',
		},
	])

	const contract6Id = 'b6666666-6666-4666-8666-666666666666'
	await knex('contracts').insert({
		id: contract6Id,
		work_id: WORK_IDS.COND_JARDIM_FLORES,
		supplier_id: SUPPLIER_IDS.CONSTRUTORA_ALPHA,
		service: 'Construção Completa - Edifício Residencial',
		retention_percentage: 5,
		total_value: 2850000.0,
		start_date: new Date('2025-01-01'),
		delivery_time: new Date('2026-12-31'),
		status: 'Ativo',
		approval_status: 'APROVADO',
	})

	await knex('contract_items').insert([
		{
			id: 'd6666666-6666-4666-8666-666666666601',
			contract_id: contract6Id,
			unit_measure: 'm³',
			quantity: 500,
			unit_labor_value: 450.0,
			total_value: 225000.0,
			description: 'Escavação e movimentação de terra',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666602',
			contract_id: contract6Id,
			unit_measure: 'm³',
			quantity: 300,
			unit_labor_value: 650.0,
			total_value: 195000.0,
			description: 'Fundação - estacas e blocos',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666603',
			contract_id: contract6Id,
			unit_measure: 'm³',
			quantity: 450,
			unit_labor_value: 850.0,
			total_value: 382500.0,
			description: 'Estrutura de concreto armado - pilares',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666604',
			contract_id: contract6Id,
			unit_measure: 'm³',
			quantity: 380,
			unit_labor_value: 900.0,
			total_value: 342000.0,
			description: 'Estrutura de concreto armado - vigas',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666605',
			contract_id: contract6Id,
			unit_measure: 'm²',
			quantity: 2500,
			unit_labor_value: 120.0,
			total_value: 300000.0,
			description: 'Lajes de concreto',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666606',
			contract_id: contract6Id,
			unit_measure: 'm²',
			quantity: 3200,
			unit_labor_value: 85.0,
			total_value: 272000.0,
			description: 'Alvenaria de vedação',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666607',
			contract_id: contract6Id,
			unit_measure: 'm²',
			quantity: 4500,
			unit_labor_value: 45.0,
			total_value: 202500.0,
			description: 'Reboco interno e externo',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666608',
			contract_id: contract6Id,
			unit_measure: 'm²',
			quantity: 1800,
			unit_labor_value: 95.0,
			total_value: 171000.0,
			description: 'Revestimento cerâmico - pisos',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666609',
			contract_id: contract6Id,
			unit_measure: 'm²',
			quantity: 950,
			unit_labor_value: 110.0,
			total_value: 104500.0,
			description: 'Revestimento cerâmico - paredes',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666610',
			contract_id: contract6Id,
			unit_measure: 'm',
			quantity: 1200,
			unit_labor_value: 35.0,
			total_value: 42000.0,
			description: 'Instalações hidráulicas - água fria',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666611',
			contract_id: contract6Id,
			unit_measure: 'm',
			quantity: 450,
			unit_labor_value: 55.0,
			total_value: 24750.0,
			description: 'Instalações hidráulicas - água quente',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666612',
			contract_id: contract6Id,
			unit_measure: 'm',
			quantity: 800,
			unit_labor_value: 48.0,
			total_value: 38400.0,
			description: 'Instalações hidráulicas - esgoto',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666613',
			contract_id: contract6Id,
			unit_measure: 'un',
			quantity: 120,
			unit_labor_value: 350.0,
			total_value: 42000.0,
			description: 'Louças e metais sanitários',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666614',
			contract_id: contract6Id,
			unit_measure: 'm',
			quantity: 3500,
			unit_labor_value: 22.0,
			total_value: 77000.0,
			description: 'Instalações elétricas - fiação',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666615',
			contract_id: contract6Id,
			unit_measure: 'un',
			quantity: 280,
			unit_labor_value: 75.0,
			total_value: 21000.0,
			description: 'Instalações elétricas - tomadas e interruptores',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666616',
			contract_id: contract6Id,
			unit_measure: 'un',
			quantity: 45,
			unit_labor_value: 1200.0,
			total_value: 54000.0,
			description: 'Portas de madeira com batente',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666617',
			contract_id: contract6Id,
			unit_measure: 'un',
			quantity: 60,
			unit_labor_value: 1850.0,
			total_value: 111000.0,
			description: 'Janelas de alumínio com vidro',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666618',
			contract_id: contract6Id,
			unit_measure: 'm²',
			quantity: 650,
			unit_labor_value: 180.0,
			total_value: 117000.0,
			description: 'Cobertura - estrutura e telhas',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666619',
			contract_id: contract6Id,
			unit_measure: 'm²',
			quantity: 4200,
			unit_labor_value: 18.0,
			total_value: 75600.0,
			description: 'Pintura interna - látex PVA',
		},
		{
			id: 'd6666666-6666-4666-8666-666666666620',
			contract_id: contract6Id,
			unit_measure: 'm²',
			quantity: 1800,
			unit_labor_value: 28.0,
			total_value: 50400.0,
			description: 'Pintura externa - acrílica',
		},
	])
}
