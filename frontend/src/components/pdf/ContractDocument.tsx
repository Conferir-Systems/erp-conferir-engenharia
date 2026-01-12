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
    marginBottom: 6,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    minHeight: 18,
    alignItems: 'center',
  },
  tableHeader: { backgroundColor: '#f0f0f0', fontWeight: 'bold' },
  tableCell: {
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: '#000',
    fontSize: 8,
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
        {data.contractor.cpfRepresentative}, doravante denominado CONTRATANTE, e
        a empresa {data.supplier.name}, inscrita no CNPJ nº{' '}
        {data.supplier.document}, doravante denominada CONTRATADA, ajustam o
        presente contrato mediante as seguintes cláusulas:
      </Text>

      <Text style={styles.clauseTitle}>CLÁUSULA PRIMEIRA – OBJETO</Text>
      <Text style={styles.paragraph}>
        1.1 O objeto do presente instrumento é a empreitada para execução de mão
        de obra para {data.serviceDescription}, nas dependências de edificação
        pertencente a {data.workAddress}, de acordo com a proposta comercial e
        projetos anexos.
      </Text>

      <Text style={styles.clauseTitle}>CLÁUSULA SEGUNDA – DO VALOR</Text>
      <Text style={styles.paragraph}>
        2.1 O valor total da contratação é de {formatCurrency(data.totalValue)}{' '}
        (VALOR POR EXTENSO AQUI).
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
          <Text style={[styles.tableCell, styles.colItem]}>Item</Text>
          <Text style={[styles.tableCell, styles.colDesc]}>Descrição</Text>
          <Text style={[styles.tableCell, styles.colUnid]}>Unid</Text>
          <Text style={[styles.tableCell, styles.colQtde]}>Qtde</Text>
          <Text style={[styles.tableCell, styles.colUnit]}>
            Unitário (R$) M.O.
          </Text>
        </View>

        {data.items.map((item, index) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.colItem]}>{index + 1}</Text>
            <Text style={[styles.tableCell, styles.colDesc]}>
              {item.description}
            </Text>
            <Text style={[styles.tableCell, styles.colUnid]}>
              {item.unitMeasure}
            </Text>
            <Text style={[styles.tableCell, styles.colQtde]}>
              {item.quantity.toLocaleString('pt-BR')}
            </Text>
            <Text style={[styles.tableCell, styles.colUnit]}>
              {formatCurrency(item.unitLaborValue)}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.paragraph}>
        3.5 Os pagamentos serão realizados via TED ou PIX.
      </Text>

      <Text style={styles.clauseTitle}>CLÁUSULA SEXTA – DO PRAZO</Text>
      <Text style={styles.paragraph}>
        6.1 O prazo para início do serviço é de 10 dias após assinatura.
      </Text>
      <Text style={styles.paragraph}>
        6.2 O prazo para execução total é de {data.deliveryTime} dias corridos,
        iniciando em {data.startDate}.
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

      <Text style={{ marginTop: 30, textAlign: 'right' }}>
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
