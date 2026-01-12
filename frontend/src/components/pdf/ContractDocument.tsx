import React from 'react'
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import { ContractData } from '../../types/contractPdf'
import { formatCurrency } from '../../utils/formatters'

const styles = StyleSheet.create({
	page: {
		padding: '60px 80px 80px 60px',
		fontSize: 9,
		fontFamily: 'Helvetica',
		lineHeight: 1.3,
	},
	header: {
		textAlign: 'center',
		marginBottom: 12,
		fontWeight: 'bold',
		textTransform: 'uppercase',
	},
	title: {
		fontSize: 9,
		marginBottom: 20,
		textAlign: 'center',
		fontWeight: 'bold',
		textDecoration: 'underline',
	},
	paragraph: {
		marginBottom: 6,
		textAlign: 'justify',
		textIndent: 0,
	},
	clauseTitle: {
		marginTop: 8,
		marginBottom: 4,
		fontWeight: 'bold',
		textTransform: 'uppercase',
		fontSize: 9,
	},

	table: {
		width: '100%',
		marginTop: 6,
		marginBottom: 10,
		borderStyle: 'solid',
		borderWidth: 1,
		borderColor: '#000',
	},
	tableRow: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#000',
		minHeight: 18,
	},
	tableHeader: { backgroundColor: '#f0f0f0', fontWeight: 'bold' },
	tableCell: {
		padding: 3,
		borderRightWidth: 1,
		borderRightColor: '#000',
		fontSize: 8,
		flexWrap: 'wrap',
		justifyContent: 'center',
	},
	tableCellText: {
		width: '100%',
	},
	colItem: { width: '8%' },
	colDesc: { width: '52%' },
	colUnid: { width: '10%' },
	colQtde: { width: '15%' },
	colUnit: { width: '15%', borderRightWidth: 0 },

	signatureBlock: {
		marginTop: 40,
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	signatureLine: {
		width: '45%',
		borderTopWidth: 1,
		borderColor: '#000',
		paddingTop: 4,
		textAlign: 'center',
		fontSize: 8,
	},
})

export const ContractDocument: React.FC<{ data: ContractData }> = ({
	data,
}) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<Text style={styles.title}>
				CONTRATO DE PRESTAÇÃO DE SERVIÇO DE EXECUÇÃO DE{' '}
				{data.serviceDescription.toUpperCase()}
			</Text>

			<Text style={styles.paragraph}>
				{data.contractor.name}, inscrita no CNPJ nº {data.contractor.cnpj},
				sediada na {data.contractor.address}, neste ato representada pelo Sr.{' '}
				{data.contractor.representative}, CPF nº{' '}
				{data.contractor.cpfRepresentative}, doravante denominado CONTRATANTE, e{' '}
				{data.supplier.typePerson === 'JURIDICA'
					? `a empresa ${data.supplier.name}, inscrita no CNPJ nº ${data.supplier.document}, doravante denomidada CONTRATADA, `
					: `${data.supplier.name}, CPF nº ${data.supplier.document}, doravante denomidado CONTRATADO, `}
				ajustam o presente contrato mediante as seguintes cláusulas:
			</Text>

			<Text style={styles.clauseTitle}>CLÁUSULA PRIMEIRA – OBJETO</Text>
			<Text style={styles.paragraph}>
				1.1 O objeto do presente instrumento é a empreitada para execução de mão
				de obra para {data.serviceDescription}, nas dependências de edificação
				pertencente a {data.workName}, de acordo com a proposta comercial,
				projetos, memoriais, especificações técnicas, e outros documentos
				técnicos, que ficam fazendo parte da presente avença como se nela
				estivessem inteiramente descritos.
			</Text>

			<Text style={styles.clauseTitle}>CLÁUSULA SEGUNDA – DO VALOR</Text>
			<Text style={styles.paragraph}>
				2.1 O valor total da contratação é de {formatCurrency(data.totalValue)}{' '}
				.
			</Text>

			<Text style={styles.clauseTitle}>CLÁUSULA TERCEIRA – DO PAGAMENTO</Text>
			<Text style={styles.paragraph}>
				3.1 As medições serão quinzenais. Os pagamentos serão realizados em até
				2 (dois) dias úteis após aprovação da medição.
			</Text>
			<Text style={styles.paragraph}>
				3.2 Para fins de medição, consideram-se os valores unitários abaixo:
			</Text>

			<View style={styles.table}>
				<View style={[styles.tableRow, styles.tableHeader]}>
					<View style={[styles.tableCell, styles.colItem]}>
						<Text style={styles.tableCellText}>Item</Text>
					</View>
					<View style={[styles.tableCell, styles.colDesc]}>
						<Text style={styles.tableCellText}>Descrição</Text>
					</View>
					<View style={[styles.tableCell, styles.colUnid]}>
						<Text style={styles.tableCellText}>Unid</Text>
					</View>
					<View style={[styles.tableCell, styles.colQtde]}>
						<Text style={styles.tableCellText}>Qtde</Text>
					</View>
					<View style={[styles.tableCell, styles.colUnit]}>
						<Text style={styles.tableCellText}>Unitário (R$) M.O.</Text>
					</View>
				</View>

				{data.items.map((item, index) => (
					<View key={item.id} style={styles.tableRow}>
						<View style={[styles.tableCell, styles.colItem]}>
							<Text style={styles.tableCellText}>{index + 1}</Text>
						</View>
						<View style={[styles.tableCell, styles.colDesc]}>
							<Text style={styles.tableCellText}>{item.description}</Text>
						</View>
						<View style={[styles.tableCell, styles.colUnid]}>
							<Text style={styles.tableCellText}>{item.unitMeasure}</Text>
						</View>
						<View style={[styles.tableCell, styles.colQtde]}>
							<Text style={styles.tableCellText}>
								{item.quantity.toLocaleString('pt-BR')}
							</Text>
						</View>
						<View style={[styles.tableCell, styles.colUnit]}>
							<Text style={styles.tableCellText}>
								{formatCurrency(item.unitLaborValue)}
							</Text>
						</View>
					</View>
				))}
			</View>

			<Text style={styles.paragraph}>
				3.5 Os pagamentos serão realizados via Transferência Eletrônica Direta –
				TED ou PIX, para a conta-corrente a ser indicada pela contratante.
			</Text>
			<Text style={styles.paragraph}>
				3.6 Havendo atraso no pagamento de qualquer parcela do preço por culpa
				do contratante, ocorrerá automaticamente a incidência de juros
				moratórios de 1% (um por cento) ao mês, além de uma multa de 2% (dois
				por cento) calculada sobre o valor da parcela em atraso, bem como de
				correção monetária calculada pela variação “pro-rata-dies” do IGP-M/FGV,
				tomando como base a data do vencimento e a da sua efetiva liquidação.
				Caso o IGP-M/FGV venha a ser extinto, prevalecerá o índice que venha
				substituí-lo de acordo com instruções dos órgãos governamentais
				competentes, além de custas e honorários advocatícios na base de 10%
				(dez por cento) sobre o total do débito, se for o caso de cobrança
				judicial.
			</Text>

			<Text style={styles.clauseTitle}>
				CLÁUSULA QUARTA – OBRIGAÇÕES DA CONTRATADA
			</Text>
			<Text style={styles.paragraph}>
				4.1 Prestar o serviço do objeto em consonância com as melhores técnicas,
				observando todas as normas técnicas da Associação Brasileira de Normas
				Técnicas pertinentes em vigor na data da assinatura da presente avença
				em especial, bem como cumprir rigorosamente as recomendações dos
				fabricantes e fornecedores para atendimento pleno do objeto.
			</Text>
			<Text style={styles.paragraph}>
				4.3 Fornecer Equipamentos de Proteção Individual – EPI, para os
				funcionários envolvidos na obra.
			</Text>
			<Text style={styles.paragraph}>
				4.4 Responsabilizar-se pelas obrigações previdenciárias e trabalhista de
				seus funcionários, bem como das obrigações fiscais e assumir riscos de
				engenharia da presente avença, de modo que nenhuma dessas obrigações
				recaiam sobre a contratante.
			</Text>
			<Text style={styles.paragraph}>
				4.5 comprovar o vínculo com seus funcionários e/ ou representantes antes
				de iniciar a obra. Todos os envolvidos na obra deverão pertencer ao
				quadro permanente da contratada na data prevista início dos serviços,
				entendendo-se como tal, para fins desta avença, o sócio que comprove seu
				vínculo por intermédio de contrato social/estatuto social; o
				administrador ou o diretor; o empregado devidamente registrado em
				Carteira de Trabalho e Previdência Socia
			</Text>
			<Text style={styles.paragraph}>
				4.6 Isentar totalmente a contratante do reconhecimento judicial de
				solidariedade desta no cumprimento das obrigações civis, trabalhistas,
				fiscais ou previdenciárias, visto que as mesmas são de responsabilidade
				única da contratada, bem como indenizá-la por todo e qualquer prejuízo
				que venha a suportar em razão de ter sido indevidamente demandada de
				forma exclusiva por ato de seus prepostos e/ou em decorrência do vínculo
				empregatício existente entre esses e a contratada;
			</Text>
			<Text style={styles.paragraph}>
				4.7 Ressarcir à contratante todo e qualquer prejuízo que ela venha a
				sofrer em razão de ação judicial ou reclamação trabalhista vinculada ao
				objeto do presente contrato, seja de forma direta, solidária ou
				subsidiária;
			</Text>
			<Text style={styles.paragraph}>
				4.8 Assumir integral e exclusivamente a responsabilidade pelos acidentes
				de trabalho que porventura ocorrerem com seus funcionários, na execução
				de suas tarefas regulares, isentando a CONTRATANTE de qualquer
				responsabilidade civil, trabalhista ou criminal;
			</Text>
			<Text style={styles.paragraph}>
				4.9 Substituir seus funcionários quando, a critério da contratante, por
				algum motivo os mesmos se incompatibilizarem com os propósitos da mesma.
			</Text>
			<Text style={styles.paragraph}>
				4.10 Efetuar o devido recolhimento dos tributos devidos em razão da
				execução do presente contrato, bem como contribuições à Previdência
				Social, seguros de trabalho, responsabilidade civil e todos os direitos
				trabalhistas dos empregados que executarão em seu nome os serviços
				contratados, devendo apresentar juntamente com a fatura, cópia das guias
				de INSS, FGTS e da Folha de Pagamento do mês anterior, no que tange aos
				empregados designados para o cumprimento dos serviços objeto do presente
				contrato, assim, como cópia da GPS que comprove a regularidade do
				recolhimento do INSS dos Serviços.
			</Text>
			<Text style={styles.paragraph}>
				4.13 A não disponibilização da respectiva documentação pela contratada,
				além de acarretar a rescisão do contrato por culpa da contratada, também
				autorizará que a contratante retenha o valor da medição devida até a
				efetiva data da respectiva entrega da documentação, sem que a contratada
				possa-lhe cobrar qualquer tipo de juro, multa ou correção monetária pelo
				fato de retenção dos valores
			</Text>
			<Text style={styles.paragraph}>
				4.14 A contratada não procederá a qualquer alteração ou modificação sem
				a prévia e expressa autorização escrita da contratante inclusive no que
				se refere a materiais e equipamentos especificados.
			</Text>
			<Text style={styles.paragraph}>
				4.15 Somente empregar a mão de obra após a autorização expressa da
				contratada, que dependerá da anuência da universidade após criteriosa
				análise da documentação dos funcionários, cuja relação de documentos
				segue em anexo ao presente instrumento.
			</Text>
			<Text style={styles.paragraph}>
				4.16 Empregar sob suas expensas os materiais de consumo empregados no
				serviço, tais como: discos, lixas, parafusos, eletrodos e outros.
			</Text>
			<Text style={styles.paragraph}>
				4.17 Manter no canteiro profissional habilitado a responder por e com
				atribuições de encarregado, bem como providenciar acompanhamento técnico
				de Engenheiro.
			</Text>
			<Text style={styles.paragraph}>
				4.18 Fica autorizado a visita da contratante, mediante agendamento, ao
				galpão onde a estrutura será produzida.
			</Text>
			<Text style={styles.paragraph}>
				4.20 Montagem e desmontagem de andaimes na estrutura interna da escada
				(sobre patamares).
			</Text>
			<Text style={styles.paragraph}>
				4.21 Transporte horizontal dos componentes da escada
			</Text>
			<Text style={styles.paragraph}>
				4.22 Conferir in loco os dados topográficos.
			</Text>

			<Text style={styles.clauseTitle}>
				CLÁUSULA QUINTA – OBRIGAÇÕES DA CONTRATANTE
			</Text>
			<Text style={styles.paragraph}>
				5.1 Efetuar o pagamento conforme descrito na cláusula terceira.
			</Text>
			<Text style={styles.paragraph}>
				5.2 Viabilizar acesso às dependências da universidade
			</Text>
			<Text style={styles.paragraph}>
				5.3 Obter eventuais licenças necessárias, no caso de a contratada não
				possuir autorização para obtê-las.
			</Text>
			<Text style={styles.paragraph}>
				5.4 Providenciar local para depósito de materiais, pertences pessoais e
				banheiro para funcionários.
			</Text>

			<Text style={styles.clauseTitle}>CLÁUSULA SEXTA – DO PRAZO</Text>
			<Text style={styles.paragraph}>
				6.1 O prazo para início do serviço é de 10 dias após assinatura.
			</Text>
			<Text style={styles.paragraph}>
				6.2 O prazo para execução total é de {data.deliveryTime} dias corridos,
				iniciando em {data.startDate}.
			</Text>

			<Text style={styles.clauseTitle}>CLÁUSULA SÉTIMA – DA RESCISÃO</Text>
			<Text style={styles.paragraph}>
				7.1 O presente Contrato é celebrado em caráter irrevogável e
				irretratável, obrigando às partes seu fiel cumprimento.
			</Text>
			<Text style={styles.paragraph}>
				7.2 O presente contrato poderá ser rescindido pelo contratante, mediante
				notificação, se a contratada deixar de cumprir alguma cláusula ou
				condição aqui estipulada, sem prejuízo da multa prevista na cláusula
				oitava.
			</Text>
			<Text style={styles.paragraph}>
				7.3 A avença poderá ser rescindida pela contratada, mediante
				notificação, se a contratante, extrapolar em exigências e
				inconformidades de itens ou serviços não previstos neste contrato que
				não estejam no controle ou ascendência da contratada.
			</Text>
			<Text style={styles.paragraph}>
				7.4 A parte que desistir da avença sem justo motivo deverá indenizar a
				outra no montante de 20% do valor global a título de multa
				compensatória.
			</Text>

			<Text style={styles.clauseTitle}>CLÁUSULA OITAVA – DAS PENALIDADES</Text>
			<Text style={styles.paragraph}>
				8.1 A contratada deve cumprir rigorosamente as prescrições contidas nos
				documentos abaixo relacionados elaborados pela Universidade, que acabam
				por integrar o presente instrumento.
			</Text>
			<Text style={styles.paragraph}>
				8.1.1 CHECKLIST DOCUMENTAÇÃO INICIAL FUNCIONÁRIOS/EMPRESA/MENSAL
			</Text>
			<Text style={styles.paragraph}>
				8.2 Caso a contratada seja penalizada administrativamente pela
				Universidade em razão de culpa exclusiva da contratada, a contratada
				deverá indenizar a contratante na exata extensão da multa aplicada.
			</Text>
			<Text style={styles.paragraph}>
				8.3 No caso de a contratante ser sancionada com impedimento de licitar e
				contratar com a administração pública por ação ou omissão da contratada
				na execução do objeto da presente avença, a contratada deverá indenizar
				a contratante em 50% (cinquenta por cento) do valor global desta avença.
			</Text>

			<Text style={styles.clauseTitle}>CLÁUSULA NONA – DO FORO</Text>
			<Text style={styles.paragraph}>
				9.1 As partes elegem o Foro da Comarca de Porto Alegre/RS, foro do local
				da obra, para dirimir as dúvidas ou questões oriundas deste Contrato,
				renunciando-se a qualquer outro por mais privilegiado que seja.
			</Text>

			<Text style={styles.paragraph}>
				E assim, estando justas e contratadas, firmam as partes o presente
				instrumento, em 02 (duas) vias de igual teor e forma, para que produza
				os jurídicos e legais efeitos
			</Text>

			<Text style={{ marginTop: 30, marginBottom: 60, textAlign: 'right' }}>
				Porto Alegre, {data.issueDate}.
			</Text>

			<View style={styles.signatureBlock}>
				<View style={styles.signatureLine}>
					<Text>{data.contractor.name}</Text>
					<Text>CONTRATANTE</Text>
				</View>
				<View style={styles.signatureLine}>
					<Text>{data.supplier.name}</Text>
					<Text>CONTRATADA</Text>
				</View>
			</View>
		</Page>
	</Document>
)
