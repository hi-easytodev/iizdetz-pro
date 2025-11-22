import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts for better typography (optional)
// Font.register({
//   family: 'Inter',
//   src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
// });

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#FFFFFF',
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #8B5CF6',
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaLabel: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  metaValue: {
    fontSize: 10,
    color: '#374151',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottom: '1 solid #E5E7EB',
  },
  sectionNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8B5CF6',
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  content: {
    fontSize: 11,
    lineHeight: 1.6,
    color: '#374151',
    textAlign: 'justify',
  },
  list: {
    marginTop: 8,
    marginLeft: 15,
  },
  listItem: {
    fontSize: 10,
    lineHeight: 1.5,
    color: '#4B5563',
    marginBottom: 4,
  },
  bullet: {
    fontSize: 10,
    marginRight: 6,
    color: '#8B5CF6',
  },
  highlight: {
    backgroundColor: '#F3E8FF',
    padding: 12,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 10,
    color: '#6B21A8',
    fontWeight: 'bold',
  },
  keyInsights: {
    backgroundColor: '#F9FAFB',
    padding: 15,
    borderRadius: 4,
    marginTop: 10,
    borderLeft: '3 solid #8B5CF6',
  },
  keyInsightTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  citation: {
    fontSize: 8,
    color: '#9CA3AF',
    marginTop: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    borderTop: '1 solid #E5E7EB',
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 9,
    color: '#9CA3AF',
  },
  pageNumber: {
    fontSize: 9,
    color: '#6B7280',
  },
  gradient: {
    background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
  },
});

interface IdeaAnalysisPDFProps {
  idea: {
    title: string;
    description?: string;
    category?: string[];
    createdAt?: string;
  };
  results: {
    [key: string]: {
      stage: string;
      analysis: string;
      citations?: string[];
      relatedQuestions?: string[];
    };
  };
}

export const IdeaAnalysisPDF: React.FC<IdeaAnalysisPDFProps> = ({ idea, results }) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const stageNames: Record<string, string> = {
    market: 'Market Analysis',
    demand: 'Demand & Pain Points',
    communities: 'Communities & Influencers',
    competition: 'Competitive Analysis',
    forecast: 'Revenue Forecast',
    gtm: 'Go-to-Market Strategy',
    tech: 'Technical Feasibility',
    customers: 'Customer Insights',
  };

  const stageIcons: Record<string, string> = {
    market: '📊',
    demand: '🔍',
    communities: '👥',
    competition: '⚔️',
    forecast: '📈',
    gtm: '🚀',
    tech: '⚙️',
    customers: '🎯',
  };

  // Extract key insights from analysis text (first 3-5 sentences)
  const extractKeyInsights = (text: string): string[] => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    return sentences.slice(0, 5).map((s) => s.trim());
  };

  // Split long text into paragraphs for better readability
  const splitIntoParagraphs = (text: string): string[] => {
    return text
      .split('\n\n')
      .filter((p) => p.trim().length > 0)
      .map((p) => p.trim());
  };

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{idea.title}</Text>
          {idea.description && <Text style={styles.subtitle}>{idea.description}</Text>}

          <View style={styles.metaInfo}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Date:</Text>
              <Text style={styles.metaValue}>
                {idea.createdAt ? formatDate(idea.createdAt) : new Date().toLocaleDateString()}
              </Text>
            </View>
            {idea.category && idea.category.length > 0 && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Category:</Text>
                <Text style={styles.metaValue}>{idea.category.join(', ')}</Text>
              </View>
            )}
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Stages:</Text>
              <Text style={styles.metaValue}>{Object.keys(results).length}</Text>
            </View>
          </View>
        </View>

        {/* Table of Contents */}
        <View style={styles.section}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#1F2937',
              marginBottom: 15,
            }}
          >
            Analysis Overview
          </Text>

          {Object.entries(results).map(([key, result], index) => (
            <View
              key={key}
              style={{
                flexDirection: 'row',
                marginBottom: 8,
                paddingLeft: 10,
              }}
            >
              <Text style={{ fontSize: 11, color: '#6B7280', marginRight: 8 }}>
                {stageIcons[key] || '•'}
              </Text>
              <Text style={{ fontSize: 11, color: '#374151' }}>
                {index + 1}. {stageNames[key] || result.stage}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.highlight}>
          <Text style={styles.highlightText}>
            This comprehensive analysis includes market research, competitive intelligence, revenue
            projections, and actionable go-to-market strategies - all powered by AI.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated by AI Idea Analyzer</Text>
          <Text style={styles.pageNumber}>Page 1</Text>
        </View>
      </Page>

      {/* Analysis Sections */}
      {Object.entries(results).map(([key, result], index) => {
        const paragraphs = splitIntoParagraphs(result.analysis);
        const keyInsights = extractKeyInsights(result.analysis);

        return (
          <Page key={key} size="A4" style={styles.page}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionNumber}>
                {stageIcons[key] || '•'} {index + 1}
              </Text>
              <Text style={styles.sectionTitle}>{stageNames[key] || result.stage}</Text>
            </View>

            {/* Key Insights Box */}
            {keyInsights.length > 0 && (
              <View style={styles.keyInsights}>
                <Text style={styles.keyInsightTitle}>🎯 Key Insights</Text>
                {keyInsights.map((insight, i) => (
                  <View key={i} style={{ flexDirection: 'row', marginBottom: 4 }}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.listItem}>{insight}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Full Analysis */}
            <View style={styles.section}>
              {paragraphs.slice(0, 3).map((paragraph, i) => (
                <Text key={i} style={[styles.content, { marginBottom: 10 }]}>
                  {paragraph}
                </Text>
              ))}
            </View>

            {/* Citations */}
            {result.citations && result.citations.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#6B7280', marginBottom: 6 }}>
                  Sources ({result.citations.length}):
                </Text>
                {result.citations.slice(0, 5).map((citation, i) => (
                  <Text key={i} style={styles.citation}>
                    [{i + 1}] {citation}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>AI Idea Analyzer • {idea.title}</Text>
              <Text style={styles.pageNumber}>Page {index + 2}</Text>
            </View>
          </Page>
        );
      })}

      {/* Summary Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Executive Summary</Text>
          <Text style={styles.subtitle}>Key Takeaways & Next Steps</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Assessment</Text>
          <Text style={[styles.content, { marginTop: 10 }]}>
            Based on the comprehensive 8-stage analysis, this business idea shows{' '}
            {Object.keys(results).length === 8 ? 'strong' : 'promising'} potential across market
            size, demand validation, competitive positioning, and technical feasibility.
          </Text>
        </View>

        <View style={styles.keyInsights}>
          <Text style={styles.keyInsightTitle}>🎯 Recommended Next Steps</Text>
          <View style={styles.list}>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={styles.bullet}>1.</Text>
              <Text style={styles.listItem}>
                Validate assumptions with 10-20 customer interviews
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={styles.bullet}>2.</Text>
              <Text style={styles.listItem}>Build MVP focusing on core value proposition</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={styles.bullet}>3.</Text>
              <Text style={styles.listItem}>Launch beta to early adopters in target communities</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={styles.bullet}>4.</Text>
              <Text style={styles.listItem}>
                Track key metrics: user acquisition, engagement, retention
              </Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={styles.bullet}>5.</Text>
              <Text style={styles.listItem}>
                Iterate based on feedback before scaling marketing
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.highlight, { marginTop: 20 }]}>
          <Text style={styles.highlightText}>
            💡 This analysis is a starting point. Combine these insights with hands-on customer
            research and rapid experimentation to maximize your chances of success.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by AI Idea Analyzer • {new Date().toLocaleDateString()}
          </Text>
          <Text style={styles.pageNumber}>Final Page</Text>
        </View>
      </Page>
    </Document>
  );
};
