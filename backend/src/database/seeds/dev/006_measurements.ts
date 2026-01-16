import type { Knex } from 'knex'

export async function seed(knex: Knex): Promise<void> {
	await knex('measurement_items').del()
	await knex('measurements').del()

	// Contract 1 - Estrutura de Concreto Armado
	const measurement1_1Id = 'c1111111-1111-4111-8111-111111111111'
	await knex('measurements').insert({
		id: measurement1_1Id,
		contract_id: 'b1111111-1111-4111-8111-111111111111',
		issue_date: new Date('2025-02-15'),
		approval_date: new Date('2025-02-18'),
		approval_status: 'APROVADO',
		total_gross_value: 63750.0,
		retention_value: 3187.5,
		total_net_value: 60562.5,
		notes: 'Primeira medição - 50% da concretagem de lajes concluída',
	})

	await knex('measurement_items').insert([
		{
			id: 'e1111111-1111-4111-8111-111111111111',
			measurement_id: measurement1_1Id,
			contract_item_id: 'd1111111-1111-4111-8111-111111111111',
			quantity: 75,
			unit_labor_value: 850.0,
			total_gross_value: 63750.0,
		},
	])

	const measurement1_2Id = 'c1111111-1111-4111-8111-111111111112'
	await knex('measurements').insert({
		id: measurement1_2Id,
		contract_id: 'b1111111-1111-4111-8111-111111111111',
		issue_date: new Date('2025-03-15'),
		approval_date: new Date('2025-03-20'),
		approval_status: 'APROVADO',
		total_gross_value: 117125.0,
		retention_value: 5856.25,
		total_net_value: 111268.75,
		notes: 'Segunda medição - Ferragem parcial e formas',
	})

	await knex('measurement_items').insert([
		{
			id: 'e1111111-1111-4111-8111-111111111121',
			measurement_id: measurement1_2Id,
			contract_item_id: 'd1111111-1111-4111-8111-111111111112',
			quantity: 6250,
			unit_labor_value: 8.5,
			total_gross_value: 53125.0,
		},
		{
			id: 'e1111111-1111-4111-8111-111111111122',
			measurement_id: measurement1_2Id,
			contract_item_id: 'd1111111-1111-4111-8111-111111111111',
			quantity: 75,
			unit_labor_value: 850.0,
			total_gross_value: 63750.0,
		},
		{
			id: 'e1111111-1111-4111-8111-111111111123',
			measurement_id: measurement1_2Id,
			contract_item_id: 'd1111111-1111-4111-8111-111111111113',
			quantity: 4.166666667,
			unit_labor_value: 60.0,
			total_gross_value: 250.0,
		},
	])

	const measurement1_3Id = 'c1111111-1111-4111-8111-111111111113'
	await knex('measurements').insert({
		id: measurement1_3Id,
		contract_id: 'b1111111-1111-4111-8111-111111111111',
		issue_date: new Date('2025-04-10'),
		approval_status: 'PENDENTE',
		total_gross_value: 104125.0,
		retention_value: 5206.25,
		total_net_value: 98918.75,
		notes: 'Terceira medição - Restante da ferragem e formas',
	})

	await knex('measurement_items').insert([
		{
			id: 'e1111111-1111-4111-8111-111111111131',
			measurement_id: measurement1_3Id,
			contract_item_id: 'd1111111-1111-4111-8111-111111111112',
			quantity: 6250,
			unit_labor_value: 8.5,
			total_gross_value: 53125.0,
		},
		{
			id: 'e1111111-1111-4111-8111-111111111132',
			measurement_id: measurement1_3Id,
			contract_item_id: 'd1111111-1111-4111-8111-111111111113',
			quantity: 850,
			unit_labor_value: 60.0,
			total_gross_value: 51000.0,
		},
	])

	// Contract 2 - Instalações Elétricas
	const measurement2_1Id = 'c2222222-2222-4222-8222-222222222221'
	await knex('measurements').insert({
		id: measurement2_1Id,
		contract_id: 'b2222222-2222-4222-8222-222222222222',
		issue_date: new Date('2025-03-01'),
		approval_date: new Date('2025-03-05'),
		approval_status: 'APROVADO',
		total_gross_value: 46250.0,
		retention_value: 2312.5,
		total_net_value: 43937.5,
		notes: 'Cabeamento elétrico 100% concluído',
	})

	await knex('measurement_items').insert([
		{
			id: 'e2222222-2222-4222-8222-222222222211',
			measurement_id: measurement2_1Id,
			contract_item_id: 'd2222222-2222-4222-8222-222222222221',
			quantity: 2500,
			unit_labor_value: 18.5,
			total_gross_value: 46250.0,
		},
	])

	const measurement2_2Id = 'c2222222-2222-4222-8222-222222222222'
	await knex('measurements').insert({
		id: measurement2_2Id,
		contract_id: 'b2222222-2222-4222-8222-222222222222',
		issue_date: new Date('2025-03-20'),
		approval_date: new Date('2025-03-25'),
		approval_status: 'APROVADO',
		total_gross_value: 58050.0,
		retention_value: 2902.5,
		total_net_value: 55147.5,
		notes: 'Quadros de distribuição e pontos de tomada parcialmente concluídos',
	})

	await knex('measurement_items').insert([
		{
			id: 'e2222222-2222-4222-8222-222222222221',
			measurement_id: measurement2_2Id,
			contract_item_id: 'd2222222-2222-4222-8222-222222222222',
			quantity: 50,
			unit_labor_value: 450.0,
			total_gross_value: 22500.0,
		},
		{
			id: 'e2222222-2222-4222-8222-222222222222',
			measurement_id: measurement2_2Id,
			contract_item_id: 'd2222222-2222-4222-8222-222222222223',
			quantity: 180,
			unit_labor_value: 65.0,
			total_gross_value: 11700.0,
		},
		{
			id: 'e2222222-2222-4222-8222-222222222223',
			measurement_id: measurement2_2Id,
			contract_item_id: 'd2222222-2222-4222-8222-222222222224',
			quantity: 80,
			unit_labor_value: 298.125,
			total_gross_value: 23850.0,
		},
	])

	const measurement2_3Id = 'c2222222-2222-4222-8222-222222222223'
	await knex('measurements').insert({
		id: measurement2_3Id,
		contract_id: 'b2222222-2222-4222-8222-222222222222',
		issue_date: new Date('2025-04-15'),
		approval_status: 'PENDENTE',
		total_gross_value: 38200.0,
		retention_value: 1910.0,
		total_net_value: 36290.0,
		notes: 'Finalização - quadros restantes, tomadas e luminárias',
	})

	await knex('measurement_items').insert([
		{
			id: 'e2222222-2222-4222-8222-222222222231',
			measurement_id: measurement2_3Id,
			contract_item_id: 'd2222222-2222-4222-8222-222222222222',
			quantity: 35,
			unit_labor_value: 450.0,
			total_gross_value: 15750.0,
		},
		{
			id: 'e2222222-2222-4222-8222-222222222232',
			measurement_id: measurement2_3Id,
			contract_item_id: 'd2222222-2222-4222-8222-222222222223',
			quantity: 140,
			unit_labor_value: 65.0,
			total_gross_value: 9100.0,
		},
		{
			id: 'e2222222-2222-4222-8222-222222222233',
			measurement_id: measurement2_3Id,
			contract_item_id: 'd2222222-2222-4222-8222-222222222224',
			quantity: 45,
			unit_labor_value: 296.666667,
			total_gross_value: 13350.0,
		},
	])

	// Contract 3 - Cobertura Metálica
	const measurement3_1Id = 'c3333333-3333-4333-8333-333333333331'
	await knex('measurements').insert({
		id: measurement3_1Id,
		contract_id: 'b3333333-3333-4333-8333-333333333333',
		issue_date: new Date('2025-04-01'),
		approval_date: new Date('2025-04-03'),
		approval_status: 'REJEITADO',
		total_gross_value: 210000.0,
		retention_value: 10500.0,
		total_net_value: 199500.0,
		notes: 'Medição rejeitada - necessário revisão das quantidades',
	})

	await knex('measurement_items').insert([
		{
			id: 'e3333333-3333-4333-8333-333333333311',
			measurement_id: measurement3_1Id,
			contract_item_id: 'd3333333-3333-4333-8333-333333333331',
			quantity: 1750,
			unit_labor_value: 120.0,
			total_gross_value: 210000.0,
		},
	])

	const measurement3_2Id = 'c3333333-3333-4333-8333-333333333332'
	await knex('measurements').insert({
		id: measurement3_2Id,
		contract_id: 'b3333333-3333-4333-8333-333333333333',
		issue_date: new Date('2025-04-10'),
		approval_date: new Date('2025-04-15'),
		approval_status: 'APROVADO',
		total_gross_value: 168000.0,
		retention_value: 8400.0,
		total_net_value: 159600.0,
		notes: 'Primeira medição corrigida - 40% da estrutura metálica',
	})

	await knex('measurement_items').insert([
		{
			id: 'e3333333-3333-4333-8333-333333333321',
			measurement_id: measurement3_2Id,
			contract_item_id: 'd3333333-3333-4333-8333-333333333331',
			quantity: 1400,
			unit_labor_value: 120.0,
			total_gross_value: 168000.0,
		},
	])

	const measurement3_3Id = 'c3333333-3333-4333-8333-333333333333'
	await knex('measurements').insert({
		id: measurement3_3Id,
		contract_id: 'b3333333-3333-4333-8333-333333333333',
		issue_date: new Date('2025-05-15'),
		approval_status: 'PENDENTE',
		total_gross_value: 315750.0,
		retention_value: 15787.5,
		total_net_value: 299962.5,
		notes: 'Segunda medição - estrutura restante, calhas e claraboias',
	})

	await knex('measurement_items').insert([
		{
			id: 'e3333333-3333-4333-8333-333333333331',
			measurement_id: measurement3_3Id,
			contract_item_id: 'd3333333-3333-4333-8333-333333333331',
			quantity: 2100,
			unit_labor_value: 120.0,
			total_gross_value: 252000.0,
		},
		{
			id: 'e3333333-3333-4333-8333-333333333332',
			measurement_id: measurement3_3Id,
			contract_item_id: 'd3333333-3333-4333-8333-333333333332',
			quantity: 550,
			unit_labor_value: 75.0,
			total_gross_value: 41250.0,
		},
		{
			id: 'e3333333-3333-4333-8333-333333333333',
			measurement_id: measurement3_3Id,
			contract_item_id: 'd3333333-3333-4333-8333-333333333333',
			quantity: 28,
			unit_labor_value: 803.571429,
			total_gross_value: 22500.0,
		},
	])

	// Contract 4 - Pintura e Revestimento Anticorrosivo
	const measurement4_1Id = 'c4444444-4444-4444-8444-444444444441'
	await knex('measurements').insert({
		id: measurement4_1Id,
		contract_id: 'b4444444-4444-4444-8444-444444444444',
		issue_date: new Date('2025-02-15'),
		approval_date: new Date('2025-02-18'),
		approval_status: 'APROVADO',
		total_gross_value: 27000.0,
		retention_value: 1350.0,
		total_net_value: 25650.0,
		notes: 'Preparação de superfície - 50% concluído',
	})

	await knex('measurement_items').insert([
		{
			id: 'e4444444-4444-4444-8444-444444444411',
			measurement_id: measurement4_1Id,
			contract_item_id: 'd4444444-4444-4444-8444-444444444441',
			quantity: 600,
			unit_labor_value: 45.0,
			total_gross_value: 27000.0,
		},
	])

	const measurement4_2Id = 'c4444444-4444-4444-8444-444444444442'
	await knex('measurements').insert({
		id: measurement4_2Id,
		contract_id: 'b4444444-4444-4444-8444-444444444444',
		issue_date: new Date('2025-03-10'),
		approval_date: new Date('2025-03-15'),
		approval_status: 'APROVADO',
		total_gross_value: 48000.0,
		retention_value: 2400.0,
		total_net_value: 45600.0,
		notes: 'Preparação restante e início da pintura',
	})

	await knex('measurement_items').insert([
		{
			id: 'e4444444-4444-4444-8444-444444444421',
			measurement_id: measurement4_2Id,
			contract_item_id: 'd4444444-4444-4444-8444-444444444441',
			quantity: 600,
			unit_labor_value: 45.0,
			total_gross_value: 27000.0,
		},
		{
			id: 'e4444444-4444-4444-8444-444444444422',
			measurement_id: measurement4_2Id,
			contract_item_id: 'd4444444-4444-4444-8444-444444444442',
			quantity: 600,
			unit_labor_value: 35.0,
			total_gross_value: 21000.0,
		},
	])

	const measurement4_3Id = 'c4444444-4444-4444-8444-444444444443'
	await knex('measurements').insert({
		id: measurement4_3Id,
		contract_id: 'b4444444-4444-4444-8444-444444444444',
		issue_date: new Date('2025-04-05'),
		approval_status: 'PENDENTE',
		total_gross_value: 21000.0,
		retention_value: 1050.0,
		total_net_value: 19950.0,
		notes: 'Finalização da pintura anticorrosiva',
	})

	await knex('measurement_items').insert([
		{
			id: 'e4444444-4444-4444-8444-444444444431',
			measurement_id: measurement4_3Id,
			contract_item_id: 'd4444444-4444-4444-8444-444444444442',
			quantity: 600,
			unit_labor_value: 35.0,
			total_gross_value: 21000.0,
		},
	])

	// Contract 5 - Serralheria e Esquadrias
	const measurement5_1Id = 'c5555555-5555-4555-8555-555555555551'
	await knex('measurements').insert({
		id: measurement5_1Id,
		contract_id: 'b5555555-5555-4555-8555-555555555555',
		issue_date: new Date('2025-03-15'),
		approval_date: new Date('2025-03-18'),
		approval_status: 'APROVADO',
		total_gross_value: 81000.0,
		retention_value: 4050.0,
		total_net_value: 76950.0,
		notes: 'Portas de ferro instaladas - 100%',
	})

	await knex('measurement_items').insert([
		{
			id: 'e5555555-5555-4555-8555-555555555511',
			measurement_id: measurement5_1Id,
			contract_item_id: 'd5555555-5555-4555-8555-555555555551',
			quantity: 180,
			unit_labor_value: 450.0,
			total_gross_value: 81000.0,
		},
	])

	const measurement5_2Id = 'c5555555-5555-4555-8555-555555555552'
	await knex('measurements').insert({
		id: measurement5_2Id,
		contract_id: 'b5555555-5555-4555-8555-555555555555',
		issue_date: new Date('2025-04-20'),
		approval_date: new Date('2025-04-25'),
		approval_status: 'APROVADO',
		total_gross_value: 56800.0,
		retention_value: 2840.0,
		total_net_value: 53960.0,
		notes: 'Janelas de alumínio - 50% e corrimão parcial',
	})

	await knex('measurement_items').insert([
		{
			id: 'e5555555-5555-4555-8555-555555555521',
			measurement_id: measurement5_2Id,
			contract_item_id: 'd5555555-5555-4555-8555-555555555552',
			quantity: 120,
			unit_labor_value: 320.0,
			total_gross_value: 38400.0,
		},
		{
			id: 'e5555555-5555-4555-8555-555555555522',
			measurement_id: measurement5_2Id,
			contract_item_id: 'd5555555-5555-4555-8555-555555555553',
			quantity: 210,
			unit_labor_value: 48.0,
			total_gross_value: 10080.0,
		},
		{
			id: 'e5555555-5555-4555-8555-555555555523',
			measurement_id: measurement5_2Id,
			contract_item_id: 'd5555555-5555-4555-8555-555555555552',
			quantity: 26,
			unit_labor_value: 320.0,
			total_gross_value: 8320.0,
		},
	])

	const measurement5_3Id = 'c5555555-5555-4555-8555-555555555553'
	await knex('measurements').insert({
		id: measurement5_3Id,
		contract_id: 'b5555555-5555-4555-8555-555555555555',
		issue_date: new Date('2025-05-20'),
		approval_status: 'PENDENTE',
		total_gross_value: 40160.0,
		retention_value: 2008.0,
		total_net_value: 38152.0,
		notes: 'Finalização - janelas restantes e corrimão',
	})

	await knex('measurement_items').insert([
		{
			id: 'e5555555-5555-4555-8555-555555555531',
			measurement_id: measurement5_3Id,
			contract_item_id: 'd5555555-5555-4555-8555-555555555552',
			quantity: 94,
			unit_labor_value: 320.0,
			total_gross_value: 30080.0,
		},
		{
			id: 'e5555555-5555-4555-8555-555555555532',
			measurement_id: measurement5_3Id,
			contract_item_id: 'd5555555-5555-4555-8555-555555555553',
			quantity: 210,
			unit_labor_value: 48.0,
			total_gross_value: 10080.0,
		},
	])
}
