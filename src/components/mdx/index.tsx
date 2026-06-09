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
import { BeforeAfter } from "./before-after";
import { PassageScorer } from "./passage-scorer";
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

/**
 * Single registry of components available to every MDX article. Add a component
 * here once and authors can use it in any `.mdx` file — including future client
 * components (interactive widgets, calculators), which work because the map can
 * reference them directly.
 */
export const mdxComponents: MDXComponents = {
  a: MdxLink as MDXComponents["a"],
  Callout,
  Figure,
  FAQBlock,
  ComparisonTable,
  BeforeAfter,
  PassageScorer,
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
