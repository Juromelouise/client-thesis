import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toPng } from 'html-to-image';

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Helvetica',
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  chartContainer: {
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  table: {
    display: 'flex',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    padding: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    fontSize: 12,
  },
  tableCell: {
    padding: 8,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    fontSize: 10,
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    textAlign: 'center',
  },
});

const PDFChart = ({ data, type, chartImage }) => {
  const months = [
    "", "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getTitle = () => {
    switch (type) {
      case 'yearly': return 'Yearly Violations Report';
      case 'quarterly': return 'Quarterly Violations Report';
      default: return 'Monthly Violations Report';
    }
  };

  const getHeaders = () => {
    switch (type) {
      case 'yearly': return ['Year', 'Illegal Parking', 'Obstructions', 'Total'];
      case 'quarterly': return ['Quarter', 'Illegal Parking', 'Obstructions', 'Total'];
      default: return ['Month', 'Illegal Parking', 'Obstructions', 'Total'];
    }
  };

  const formatData = (item) => {
    switch (type) {
      case 'yearly': 
        return [item.year, item.reportCount, item.obstructionCount, item.total];
      case 'quarterly': 
        return [`Q${item.quarter} ${item.year}`, item.reportCount, item.obstructionCount, item.total];
      case 'monthly': 
        return [
          `${months[item.month]} ${item.year}`, 
          item.reportCount, 
          item.obstructionCount, 
          item.total || (item.reportCount + item.obstructionCount) // Fallback if total doesn't exist
        ];
      default: 
        return [`${item.year}-${String(item.month).padStart(2, '0')}`, item.reportCount, item.obstructionCount, item.total];
    }
  };

  // Calculate total properly
  const total = data.reduce((sum, item) => sum + (item.total || (item.reportCount + item.obstructionCount)), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{getTitle()}</Text>
        
        {chartImage && (
          <View style={styles.chartContainer}>
            <Text style={styles.chartTitle}>Violations Chart</Text>
            <Image src={chartImage} style={{ width: '100%', height: '200px' }} />
          </View>
        )}
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            {getHeaders().map((header, index) => (
              <View key={index} style={[styles.tableHeader, { flex: index === 0 ? 2 : 1 }]}>
                <Text>{header}</Text>
              </View>
            ))}
          </View>
          
          {data.map((item, rowIndex) => (
            <View key={rowIndex} style={styles.tableRow}>
              {formatData(item).map((cell, cellIndex) => (
                <View key={cellIndex} style={[styles.tableCell, { flex: cellIndex === 0 ? 2 : 1 }]}>
                  <Text>{cell}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
        
        <Text style={styles.footer}>Total Violations: {total}</Text>
      </Page>
    </Document>
  );
};
export default PDFChart;