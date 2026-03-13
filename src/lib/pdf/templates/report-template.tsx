import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 10,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
  },
  subtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  table: {
    marginTop: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  cell: {
    flex: 1,
  },
  cellBold: {
    flex: 1,
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: "center",
    fontSize: 9,
    color: "#999",
  },
});

interface ReportRow {
  label: string;
  value: string;
}

interface ReportTemplateProps {
  title: string;
  subtitle?: string;
  generatedAt?: string;
  rows: ReportRow[];
}

export function ReportTemplate({
  title,
  subtitle,
  generatedAt,
  rows,
}: ReportTemplateProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.cellBold}>Item</Text>
            <Text style={styles.cellBold}>Value</Text>
          </View>
          {rows.map((row, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={styles.cell}>{row.label}</Text>
              <Text style={styles.cell}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Generated on {generatedAt ?? new Date().toISOString().split("T")[0]}
        </Text>
      </Page>
    </Document>
  );
}
