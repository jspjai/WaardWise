# **App Name**: WardWise Pro

## Core Features:

- Secure User Authentication & Role Management: Implement robust login with distinct access levels for Super Admin, Field Surveyor, and Candidate, including surveyor assignment to specific wards.
- Mobile-First Survey Form (PWA Enabled): A step-by-step, mobile-optimized survey form wizard with offline capabilities, allowing surveyors to collect data seamlessly door-to-door, complete with a progress bar and section indicators.
- Centralized Data Storage & Tagging: Securely store all survey submissions in a PostgreSQL database, automatically tagging data with ward, booth, and surveyor information.
- Interactive Admin Analytics Dashboard: A dashboard providing Super Admins with real-time insights, including total survey counts, ward-wise breakdowns, issue heatmaps, voter sentiment analysis, and demographic charts.
- AI-Powered Sentiment & Key Issue Extractor: An AI tool that processes free-text entries from 'Field Observer Notes' and 'Top 1 local issue' to identify emergent trends, underlying sentiments, and frequently mentioned concerns across wards, assisting in report generation.
- Candidate Data Access Portal & Reporting: Allow candidates to browse available wards, view survey counts, pay/unlock ward-specific aggregated data, and download comprehensive reports in Excel and PDF formats for their purchased wards.

## Style Guidelines:

- Pure white background (#ffffff) with soft light grey sections (#f5f7fa) for cards and panels, creating a crisp and airy foundation.
- Primary accent color: Deep indigo (#4F46E5) for buttons, highlights, active states, and navigational elements.
- Secondary accent color: Emerald green (#10B981) for success states, submitted counts, and positive sentiment indicators.
- Text colors: Headings in dark charcoal (#111827), body text in medium grey (#374151), and muted labels in light grey (#9CA3AF).
- Issue severity buttons: Low status represented by emerald green text (#10B981) on a very light green background (#F0FBFA); Medium by amber text (#D98A00) on a very light amber background (#FCF7EB); High by muted red text (#CB3942) on a very light red background (#FCF2F2).
- Headings: 'Plus Jakarta Sans' (sans-serif) for a bold, modern feel. Body text: 'Inter' (sans-serif) for clean readability.
- Cards feature subtle box shadows, generous padding, and smooth 8px rounded corners to maintain a premium SaaS product feel.
- Mobile surveyor form: full white cards, large tap targets, soft shadows, and smooth step transitions for a polished consumer app experience.
- Data tables: clean white with alternating very-light-grey rows (#F9FAFB), deep indigo column headers, and no heavy grid lines for a professional, clutter-free presentation.
- Clean, functional iconography for intuitive navigation and data representation, particularly in dashboards and surveyor forms.
- Smooth step transitions within the survey form wizard and subtle visual feedback animations for chip/toggle button state changes and interactions.