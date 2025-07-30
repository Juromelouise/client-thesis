import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import PropTypes from "prop-types";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    lineHeight: 1.2,
  },
  header: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    paddingLeft: 20,
  },
  noticeInfo: {
    fontSize: 12,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'left',
  },
  boldText: {
    fontWeight: 'bold',
  },
  listItem: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 8,
    textAlign: 'left',
  },
  listNumber: {
    fontWeight: 'bold',
  },
  certifiedBy: {
    marginTop: 25,
    fontSize: 12,
    marginBottom: 5,
  },
  signatory: {
    marginTop: 30,
    fontSize: 12,
    fontWeight: 'bold',
  },
  position: {
    fontSize: 12,
    marginBottom: 3,
  },
  barangay: {
    fontSize: 12,
  },
  label: {
    fontWeight: 'bold',
  }
});

function NoticeLetterTemplate({ 
  date, 
  noticeNumber, 
  plateNumber, 
  location, 
  violationDateTime 
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.header}>NOTICE FOR ILLEGAL PARKING</Text>
          <Text style={styles.subHeader}>/ OBSTRUCTION</Text>
          
          <Text style={styles.noticeInfo}>
            <Text style={styles.label}>Date: </Text>
            {date || 'July 29, 2025'}
          </Text>
          
          <Text style={styles.noticeInfo}>
            <Text style={styles.label}>Notice No.: </Text>
            {noticeNumber || '2025-001'}
          </Text>
          
          <Text style={styles.noticeInfo}>
            <Text style={styles.label}>To: </Text>
            Owner/Driver of Vehicle {plateNumber || 'NBC1234'}
          </Text>
          
          <Text style={styles.noticeInfo}>
            <Text style={styles.label}>Location of Violation: </Text>
            {location || '123 Main Street, Western Bicutan'}
          </Text>
          
          <Text style={styles.noticeInfo}>
            <Text style={styles.label}>Date and Time of Violation: </Text>
            {violationDateTime || 'July 29, 2025 at 01:20 PM'}
          </Text>
          
          <Text style={styles.bodyText}>Dear Sir/Madam,</Text>
          
          <Text style={styles.bodyText}>
            This notice serves to inform you that your vehicle has been <Text style={styles.boldText}>illegally 
            parked</Text> at the location mentioned above, in <Text style={styles.boldText}>violation of Barangay 
            Ordinance No. 003</Text>, which prohibits unauthorized or obstructive parking 
            within the jurisdiction of Barangay Western Bicutan.
          </Text>
          
          <Text style={styles.bodyText}>
            This act causes inconvenience and obstruction to pedestrians, emergency 
            routes, and fellow motorists. The said violation has been recorded and 
            documented by barangay personnel.
          </Text>
          
          <Text style={styles.bodyText}>
            In light of this, you are hereby directed to:
          </Text>
          
          <Text style={styles.listItem}>
            <Text style={styles.listNumber}>1. </Text>
            <Text style={styles.boldText}>Remove the vehicle immediately</Text> upon receipt of this notice.
          </Text>
          
          <Text style={styles.listItem}>
            <Text style={styles.listNumber}>2. </Text>
            Report to the Barangay Hall within a whole day to settle any 
            necessary fines or clarify this matter.
          </Text>
          
          <Text style={styles.listItem}>
            <Text style={styles.listNumber}>3. </Text>
            Take proper actions to avoid future violations.
          </Text>
          
          <Text style={styles.bodyText}>
            Failure to comply may result in further sanctions, including vehicle 
            impoundment, issuance of citation tickets, or escalation to city 
            enforcement.
          </Text>
          
         <Text style={styles.certifiedBy}>Certified by:</Text>
          
          <Text style={styles.signatory}>HON. PEDRITO B. BERMAS</Text>
          <Text style={styles.position}>Punong Barangay</Text>
          <Text style={styles.barangay}>Western Bicutan</Text>
        </View>
      </Page>
    </Document>
  );
}

NoticeLetterTemplate.propTypes = {
  date: PropTypes.string,
  noticeNumber: PropTypes.string,
  plateNumber: PropTypes.string,
  location: PropTypes.string,
  violationDateTime: PropTypes.string,
};

export default NoticeLetterTemplate;    