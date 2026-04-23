import {
  Document,
  Page,
  View,
  Text,
  Link,
  StyleSheet,
} from '@react-pdf/renderer'
import { yearsSince, formatDuration } from '../lib/date'

const COLORS = {
  accent: '#10b981', // emerald-500
  accentDark: '#047857', // emerald-700
  heading: '#111827',
  text: '#1f2937',
  muted: '#6b7280',
  subtle: '#9ca3af',
  line: '#e5e7eb',
  pillStrongBg: '#059669', // emerald-600
  pillSoftBg: '#ecfdf5', // emerald-50
  pillSoftBorder: '#a7f3d0', // emerald-200
  pillSubtleBg: '#f5f5f5',
  pillSubtleBorder: '#e5e5e5',
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 40,
    paddingBottom: 40,
    paddingHorizontal: 44,
    fontFamily: 'Helvetica',
    fontSize: 9.5,
    color: COLORS.text,
    lineHeight: 1.45,
  },
  header: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.accent,
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    marginBottom: 14,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.heading,
    marginBottom: 12,
    lineHeight: 1.1,
  },
  title: {
    fontSize: 10,
    color: COLORS.accent,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontFamily: 'Helvetica-Bold',
  },
  tagline: {
    fontSize: 10,
    color: COLORS.muted,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 9,
    color: COLORS.muted,
  },
  contactItem: {
    marginRight: 14,
    marginBottom: 2,
  },
  contactLink: {
    color: COLORS.accent,
    textDecoration: 'none',
    marginRight: 14,
    marginBottom: 2,
  },
  section: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.heading,
    textTransform: 'uppercase',
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.line,
    borderBottomStyle: 'solid',
  },
  item: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  role: {
    fontFamily: 'Helvetica-Bold',
    color: COLORS.heading,
    fontSize: 10.5,
  },
  org: {
    color: COLORS.accent,
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
  },
  meta: {
    fontSize: 9,
    color: COLORS.muted,
  },
  bullet: {
    flexDirection: 'row',
    marginTop: 2,
  },
  bulletDot: {
    width: 8,
    color: COLORS.accent,
  },
  bulletText: {
    flex: 1,
  },
  projectName: {
    fontFamily: 'Helvetica-Bold',
    color: COLORS.heading,
    fontSize: 10.5,
  },
  projectTech: {
    color: COLORS.accent,
    fontSize: 8.5,
    marginTop: 1,
    marginBottom: 2,
  },
  projectDesc: {
    color: COLORS.muted,
    marginBottom: 2,
  },
  inlineList: {
    fontSize: 9.5,
    color: COLORS.text,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    backgroundColor: COLORS.pillSoftBg,
    borderColor: COLORS.pillSoftBorder,
    borderWidth: 0.5,
    borderStyle: 'solid',
    borderRadius: 3,
    paddingHorizontal: 6,
    paddingTop: 2,
    paddingBottom: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  pillText: {
    fontSize: 8.5,
    color: COLORS.accentDark,
    lineHeight: 1,
  },
  publication: {
    marginBottom: 3,
  },
})

function Bullet({ children }) {
  return (
    <View style={styles.bullet}>
      <Text style={styles.bulletDot}>•</Text>
      <Text style={styles.bulletText}>{children}</Text>
    </View>
  )
}

function SkillPill({ skill }) {
  return (
    <View style={styles.pill}>
      <Text style={styles.pillText}>{skill.name}</Text>
    </View>
  )
}

export function ResumeDocument({ cv }) {
  const years = yearsSince(cv.about_me.from_date)
  const summary = cv.about_me.text.replace('{years}', years)

  return (
    <Document
      author={cv.personal_info.name}
      title={`${cv.personal_info.name} — Resume`}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{cv.personal_info.name}</Text>
          <Text style={styles.title}>{cv.personal_info.title}</Text>
          {cv.personal_info.tagline && (
            <Text style={styles.tagline}>{cv.personal_info.tagline}</Text>
          )}
          <View style={styles.contactRow}>
            {cv.contact.email && (
              <Text style={styles.contactItem}>{cv.contact.email}</Text>
            )}
            {cv.contact.mobile && (
              <Text style={styles.contactItem}>{cv.contact.mobile}</Text>
            )}
            {cv.personal_info.location && (
              <Text style={styles.contactItem}>
                {cv.personal_info.location}
              </Text>
            )}
            {cv.contact.github && (
              <Link src={cv.contact.github} style={styles.contactLink}>
                GitHub
              </Link>
            )}
            {cv.contact.linkedin && (
              <Link src={cv.contact.linkedin} style={styles.contactLink}>
                LinkedIn
              </Link>
            )}
            {cv.contact.website && (
              <Link src={cv.contact.website} style={styles.contactLink}>
                Website
              </Link>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text>{summary}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {cv.experience.map((exp) => (
            <View
              key={`${exp.company}-${exp.start}`}
              style={styles.item}
              wrap={false}
            >
              <View style={styles.itemHeader}>
                <Text>
                  <Text style={styles.role}>{exp.role}</Text>
                  <Text style={{ color: COLORS.subtle }}> · </Text>
                  <Text style={styles.org}>{exp.company}</Text>
                </Text>
                <Text style={styles.meta}>
                  {formatDuration(exp.start, exp.end)}
                </Text>
              </View>
              {exp.location && <Text style={styles.meta}>{exp.location}</Text>}
              {exp.highlights.map((h, i) => (
                <Bullet key={i}>{h}</Bullet>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Selected Projects</Text>
          {cv.projects.map((p) => (
            <View key={p.name} style={styles.item} wrap={false}>
              <Text style={styles.projectName}>{p.name}</Text>
              {p.tech?.length > 0 && (
                <Text style={styles.projectTech}>{p.tech.join(' · ')}</Text>
              )}
              <Text style={styles.projectDesc}>{p.description}</Text>
              {p.contributions.map((c, i) => (
                <Bullet key={i}>{c}</Bullet>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsWrap}>
            {cv.skills.map((skill) => (
              <SkillPill key={skill.name} skill={skill} />
            ))}
          </View>
        </View>

        <View style={styles.section} wrap={false}>
          <Text style={styles.sectionTitle}>Education</Text>
          {cv.education.map((e) => (
            <View
              key={`${e.institution}-${e.start}`}
              style={{ marginBottom: 4 }}
            >
              <View style={styles.itemHeader}>
                <Text>
                  <Text style={styles.role}>{e.degree}</Text>
                  <Text style={{ color: COLORS.subtle }}> · </Text>
                  <Text style={styles.org}>{e.institution}</Text>
                </Text>
                <Text style={styles.meta}>
                  {formatDuration(e.start, e.end)}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {cv.publications?.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Publications</Text>
            {cv.publications.map((p, i) => (
              <View key={i} style={styles.publication}>
                <Text>
                  <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                    {p.title}
                  </Text>
                  {'. '}
                  {p.authors}. {p.venue}
                  {p.volume && ` ${p.volume}`}
                  {p.year && ` (${p.year})`}
                  {p.page && `, p. ${p.page}`}
                </Text>
              </View>
            ))}
          </View>
        )}

        {cv.open_source_contributions?.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>Open Source</Text>
            <Text style={styles.inlineList}>
              {cv.open_source_contributions.join(' · ')}
            </Text>
          </View>
        )}
      </Page>
    </Document>
  )
}
