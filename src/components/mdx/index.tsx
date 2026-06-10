/*
 * Constructing a React component from a string at render time is inherent to
 * rendering runtime-compiled MDX (the same pattern as next-mdx-remote). The MDX
 * body is trusted build output and these pages are statically prerendered, so
 * the static-components rule does not apply to this file.
 */
/* eslint-disable react-hooks/static-components */
import * as runtime from "react/jsx-runtime";
import type { MDXComponents } from "mdx/types";

import { Callout } from "./callout";
import { Figure } from "./figure";
import { FAQBlock } from "./faq-block";
import { ComparisonTable } from "./comparison-table";
import { DecisionBlock } from "./decision-block";
import { BeforeAfter } from "./before-after";
import { PassageScorer } from "./passage-scorer";
import { RoiEstimator } from "./roi-estimator";
import { DownloadButton } from "./download-button";
import { Pre } from "./pre";
import { MdxLink } from "./mdx-link";
import {
  KeyTakeaways,
  Stat,
  StatGrid,
  BarChart,
  Steps,
  PullQuote,
  Tenets,
} from "./visuals";
import { Checklist, Quiz, Accordion, AiCitableCheck } from "./interactive";
import { RagPipeline } from "./diagrams";
import { CanonMap } from "./canon-map";
import { CanonDiagnostic } from "./canon-diagnostic";
import { RelatedQuestions } from "./related-questions";
import { ToolComparison } from "./tool-comparison";
import { ProsCons } from "./pros-cons";
import { AuthorityAudit } from "@/components/authority/authority-audit";
import { AeoAuditChecklist } from "./aeo-audit-checklist";
import { PromptSetBuilder } from "./prompt-set-builder";
import { RobotsTxtGenerator } from "./robots-txt-generator";
import { ContentBriefBuilder } from "./content-brief-builder";
import { PillarSelfAssessment } from "./pillar-self-assessment";
import { CanonSpine } from "./canon-spine";
import { PillarMark, PillarChip } from "./pillar-mark";
import { LiftedPassage } from "./lifted-passage";
import { SemanticSpace } from "./semantic-space";
import { EntityGraph } from "./entity-graph";
import { TokenStrip } from "./token-strip";
import { ContextWindow } from "./context-window";
import { Timeline } from "./timeline";
import { ThreeLayers } from "./three-layers";
import { SovBars, Heatmap, Gauge, Funnel, VersusSplit, ProcessFlow } from "./data-viz";
import { EngineTabs } from "./engine-tabs";

/**
 * Single registry of components available to every MDX article. Add a component
 * here once and authors can use it in any `.mdx` file — including future client
 * components (interactive widgets, calculators), which work because the map can
 * reference them directly.
 */
export const mdxComponents: MDXComponents = {
  a: MdxLink as MDXComponents["a"],
  pre: Pre as MDXComponents["pre"],
  Callout,
  Figure,
  FAQBlock,
  ComparisonTable,
  DecisionBlock,
  BeforeAfter,
  PassageScorer,
  RoiEstimator,
  DownloadButton,
  KeyTakeaways,
  Stat,
  StatGrid,
  BarChart,
  Steps,
  PullQuote,
  Checklist,
  Quiz,
  Accordion,
  AiCitableCheck,
  RagPipeline,
  Tenets,
  CanonMap,
  CanonDiagnostic,
  RelatedQuestions,
  ToolComparison,
  ProsCons,
  AuthorityAudit,
  AeoAuditChecklist,
  PromptSetBuilder,
  RobotsTxtGenerator,
  ContentBriefBuilder,
  PillarSelfAssessment,
  CanonSpine,
  PillarMark,
  PillarChip,
  LiftedPassage,
  SemanticSpace,
  EntityGraph,
  TokenStrip,
  ContextWindow,
  Timeline,
  ThreeLayers,
  SovBars,
  Heatmap,
  Gauge,
  Funnel,
  VersusSplit,
  ProcessFlow,
  EngineTabs,
};

// Evaluate Velite's compiled MDX (outputFormat: 'function-body') into a React
// component. Runs on the server — the rendered HTML is fully static, ideal for
// AEO parsing and performance.
function getMDXComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default as React.ComponentType<{
    components?: MDXComponents;
  }>;
}

export function MDXContent({
  code,
  components,
}: {
  code: string;
  components?: MDXComponents;
}) {
  const Component = getMDXComponent(code);
  return <Component components={{ ...mdxComponents, ...components }} />;
}
