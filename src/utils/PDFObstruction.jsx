import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import PropTypes from "prop-types";

Font.register({
  family: "Open Sans",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/opensans/v27/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVc.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/opensans/v27/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVc.ttf",
      fontWeight: 600,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 20,
    fontFamily: "Open Sans",
    fontSize: 10,
  },
  header: {
    marginBottom: 15,
    paddingBottom: 8,
    borderBottom: "1px solid #3B82F6",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 10,
    color: "#6B7280",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 5,
    backgroundColor: "#EFF6FF",
    padding: 3,
    borderRadius: 3,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  card: {
    width: "48%",
    padding: 8,
    backgroundColor: "#F9FAFB",
    borderRadius: 4,
    borderLeft: "3px solid #3B82F6",
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: "#6B7280",
    marginBottom: 2,
  },
  value: {
    fontSize: 11,
    fontWeight: "semibold",
    color: "#111827",
  },
  description: {
    fontSize: 10,
    color: "#374151",
    lineHeight: 1.3,
    marginBottom: 10,
    padding: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 3,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  imageContainer: {
    width: "30%",
    marginBottom: 8,
  },
  image: {
    width: "100%",
    height: 80,
    borderRadius: 4,
    objectFit: "cover",
  },
  footer: {
    marginTop: 15,
    paddingTop: 8,
    borderTop: "1px solid #E5E7EB",
    fontSize: 8,
    color: "#6B7280",
    textAlign: "center",
  },
  violationItem: {
    fontSize: 10,
    marginBottom: 3,
  },
});

const getStatusColor = (status) => {
  switch (status) {
    case "Approved": return "#10B981";
    case "Pending": return "#F59E0B";
    case "Declined": return "#EF4444";
    default: return "#3B82F6";
  }
};

const formatDate = (dateString, withTime = false) => {
  if (!dateString) return "N/A";
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  if (withTime) {
    options.hour = "2-digit";
    options.minute = "2-digit";
  }
  return new Date(dateString).toLocaleString("en-US", options);
};

const PDFObstruction = ({ report }) => {
  if (!report) return null;
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Obstruction Report</Text>
          <Text style={styles.subtitle}>Generated on {formatDate(new Date())}</Text>
        </View>

        <View style={styles.grid}>
          <View style={styles.card}>
            <Text style={styles.label}>Report ID</Text>
            <Text style={styles.value}>{report._id?.slice(-8) || "N/A"}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Status</Text>
            <Text style={[styles.value, { color: getStatusColor(report.status) }]}>
              {report.status}
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Date Reported</Text>
            <Text style={styles.value}>{formatDate(report.createdAt, true)}</Text>
          </View>
        </View>

        {report.original && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>
              {report.original.length > 200 
                ? `${report.original.substring(0, 200)}...` 
                : report.original}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Violations</Text>
          <View style={{ paddingLeft: 10 }}>
            {report.violations?.map((violation, index) => (
              <Text key={index} style={styles.violationItem}>• {violation}</Text>
            ))}
          </View>
        </View>

        {report.images?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Evidence Photos</Text>
            <View style={styles.imageGrid}>
              {report.images.slice(0, 3).map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image src={image.url} style={styles.image} />
                </View>
              ))}
            </View>
          </View>
        )}

        {report.confirmationImages?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Confirmation Photos</Text>
            <View style={styles.imageGrid}>
              {report.confirmationImages.slice(0, 3).map((image, index) => (
                <View key={index} style={styles.imageContainer}>
                  <Image src={image.url} style={styles.image} />
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reporter Details</Text>
          <View style={styles.grid}>
            <View style={styles.card}>
              <Text style={styles.label}>Name</Text>
              <Text style={styles.value}>
                {report.reporter?.firstName} {report.reporter?.lastName}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.label}>Email</Text>
              <Text style={styles.value}>{report.reporter?.email || "N/A"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Generated by BOVO System</Text>
        </View>
      </Page>
    </Document>
  );
};

PDFObstruction.propTypes = {
  report: PropTypes.object.isRequired,
};

export default PDFObstruction;