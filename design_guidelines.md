# Posture Analysis App - Design Guidelines

## Design Approach
**System-Based with Health Tech References**
- Primary inspiration: Clean, professional health/wellness apps (Peloton, Headspace, Fitbit)
- Design system foundation: Material Design for consistent, accessible interactions
- Clinical precision meets modern wellness aesthetics
- Focus on clarity and actionable feedback over decoration

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**
- Background: 220 15% 8% (deep navy-black)
- Surface: 220 12% 12% (elevated cards/panels)
- Surface elevated: 220 10% 16% (video player, timeline)

**Posture Status Colors**
- Good posture (green): 142 76% 45%
- Warning (yellow): 45 93% 58%
- Poor posture (red): 0 72% 58%
- Neutral overlay: 220 10% 85% with 20% opacity

**Accent & UI**
- Primary action: 217 91% 60% (blue for CTAs)
- Text primary: 220 10% 95%
- Text secondary: 220 8% 65%
- Border/divider: 220 10% 20%

### B. Typography

**Font Family**
- Primary: Inter (Google Fonts) for UI and data
- Monospace: JetBrains Mono for timestamps and metrics

**Type Scale**
- Headings: font-semibold tracking-tight
- H1: text-3xl lg:text-4xl
- H2: text-2xl lg:text-3xl
- Body: text-base leading-relaxed
- Small/Caption: text-sm text-secondary
- Metrics/Data: text-lg font-mono tabular-nums

### C. Layout System

**Spacing Primitives**
- Core units: 4, 6, 8, 12, 16, 24 (e.g., p-4, gap-6, my-8)
- Container: max-w-7xl mx-auto px-6 lg:px-8
- Section padding: py-12 lg:py-16

**Grid System**
- Analysis view: 2-column split (video left 60%, data panel right 40%) on desktop
- Timeline: Full-width below video player
- Upload section: Centered single column, max-w-2xl

### D. Component Library

**Video Player (Custom)**
- Aspect ratio: 16:9 contained in rounded-lg card
- Posture overlay: SVG lines (green/red) drawn on skeletal key points
- Skeleton joints: Small circles (8px) with colored glow
- Connecting lines: 3px stroke width, semi-transparent
- Playback controls: Custom minimal controls with scrubber

**Timeline Scrubber**
- Full-width horizontal bar below video
- Color-coded segments: Green/yellow/red blocks showing posture quality over time
- Timestamp markers: Every 30 seconds
- Draggable playhead: Larger touch target (h-8), blue accent color
- Height: h-16 for adequate touch/click area

**Data Cards**
- Rounded corners: rounded-xl
- Padding: p-6
- Shadow: Subtle elevation with shadow-lg
- Border: 1px border in surface color

**Metrics Display**
- Large numbers: text-4xl font-bold tabular-nums
- Labels: text-sm uppercase tracking-wide text-secondary
- Icon indicators: 24px health-related icons (clock, alert, check)
- Progress bars: h-2 rounded-full with gradient fills matching status colors

**Upload Zone**
- Dashed border: border-2 border-dashed rounded-xl
- Large drop area: min-h-64 with centered content
- Icon: 48px upload icon in accent color
- Drag-active state: Background tint with accent color at 10% opacity
- Accepted formats indicator: Small text below CTA

**Buttons**
- Primary: bg-blue rounded-lg px-6 py-3 font-medium
- Secondary: variant="outline" with backdrop-blur when over images
- Icon buttons: p-2 rounded-lg hover states

**Navigation**
- Top bar: Sticky header with logo, nav links, user menu
- Height: h-16
- Background: Semi-transparent backdrop-blur-md
- Border bottom: 1px in border color

### E. Key Screens Layout

**Upload Screen**
- Hero section: py-20 with headline and subtitle
- Centered upload card: max-w-2xl
- Instructions: Numbered steps with icons (1. Prepare side view, 2. Record video, 3. Upload)
- Example visualization: Small preview of what analysis looks like

**Analysis Screen**
- Top section: Video player (left 60%) + Real-time metrics (right 40%)
- Video dimensions: Maintain aspect ratio, max 800px width
- Metrics panel: Sticky during scroll, 3-4 key stat cards stacked vertically
- Bottom section: Full-width timeline with posture history
- Data table: Scrollable list of posture events with timestamps

**Results Dashboard**
- Session summary cards in grid: grid-cols-1 md:grid-cols-3 gap-6
- Charts: Line graph showing posture score over time (green/red gradient)
- Recommendations: Cards with improvement tips and exercises
- Export options: Download report, share results

### F. Animations

**Minimal, Purposeful Motion**
- Skeleton overlay: Smooth 60fps updates as video plays
- Timeline scrubbing: Immediate feedback, no lag
- Card hover: Subtle lift (translateY -2px) with shadow increase
- Transitions: 150-200ms cubic-bezier easing for state changes
- Loading states: Skeleton screens, no spinners

### G. Images

**Hero Image**
- Not applicable - functional tool leads with upload interface
- Instead: Subtle background gradient from dark to darker blue-black

**Instructional Images**
- 3 small example images (200x200px) showing correct side profile setup
- Placement: Below upload zone in grid layout
- Style: Semi-transparent overlay showing dos and don'ts

**Icon Library**
- Heroicons for UI elements (outline style)
- Health/body icons: Custom or from health-focused icon sets
- Consistent 24px sizing throughout

## Accessibility Features

- High contrast posture indicators (green/red) with additional shape coding (circle vs triangle joints)
- Keyboard navigation: Full timeline and video control access
- Screen reader: Announce posture changes and timestamps
- Captions/labels: All metrics clearly labeled
- Touch targets: Minimum 44x44px for mobile interactions
- Focus states: Clear blue outline on interactive elements

## Unique Design Details

- Posture overlay uses soft glow effect (filter: drop-shadow) for visibility over varying backgrounds
- Timeline segments fade in/out as analysis progresses
- Skeleton visualization updates in real-time with smooth interpolation
- Data cards use tabular numbers for alignment
- Export button generates shareable posture report card with branding