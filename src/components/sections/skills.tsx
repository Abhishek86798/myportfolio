"use client";

import { useState } from "react";

import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

import { 
  SiCplusplus, SiPython, SiJavascript, SiTypescript, SiMysql, 
  SiLangchain, SiHuggingface, SiNextdotjs, SiPostgresql, SiFirebase, 
  SiMongodb, SiDocker, SiGit, SiGithub, SiVercel, SiFigma, SiLinux 
} from "react-icons/si";
import { FaJava, FaRobot, FaAws } from "react-icons/fa";
import { VscVscode } from "react-icons/vsc";
import { Database, Network, ShieldCheck, Lock, Code2, Server, Globe, Binary } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "C++": SiCplusplus,
  "Java": FaJava,
  "Python": SiPython,
  "JavaScript": SiJavascript,
  "TypeScript": SiTypescript,
  "SQL": SiMysql,
  "RAG": Network,
  "LangChain": SiLangchain,
  "HuggingFace Transformers": SiHuggingface,
  "BioBERT": FaRobot,
  "Next.js": SiNextdotjs,
  "REST APIs": Network,
  "PostgreSQL": SiPostgresql,
  "Firebase Firestore": SiFirebase,
  "MongoDB": SiMongodb,
  "ChromaDB": Database,
  "Docker": SiDocker,
  "Seccomp / strace": SiLinux,
  "Row-Level Security (RLS)": ShieldCheck,
  "Zero-Trust Architecture": Lock,
  "Git": SiGit,
  "GitHub": SiGithub,
  "Vercel": SiVercel,
  "AWS (fundamentals)": FaAws,
  "Figma": SiFigma,
  "VS Code": VscVscode,
  "OOP": Code2,
  "OS": Server,
  "Computer Networks": Globe,
  "DBMS": Database,
  "DSA": Binary,
};

export function Skills({ data = [] }: { data?: any[] }) {
  const categories = data.map((g: any) => g.category);
  // Default to the first category instead of "All" to fit the 2-column layout
  const [activeTab, setActiveTab] = useState(categories[0] || "");

  const activeGroup = data.find((g: any) => g.category === activeTab);
  const skillsToDisplay = activeGroup?.skills || [];

  return (
    <Section id="skills" variant="base">
      <SectionHeading id="skills">Skills</SectionHeading>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        {/* Left Rail: Categories */}
        <div className="flex md:col-span-4 flex-col gap-1">
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`flex items-center text-left px-4 py-3 text-body font-medium transition-colors ${
                activeTab === cat 
                  ? "border-l-2 border-accent text-foreground bg-background-subtle" 
                  : "border-l-2 border-transparent text-foreground-muted hover:text-foreground hover:bg-surface"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Right Column: Dense Skill Rows */}
        <div className="md:col-span-8 flex flex-col gap-1">
          {/* File tree path in right panel */}
          <div className="flex items-center gap-1.5 pb-3 mb-2 border-b border-border/50 font-mono text-xs text-foreground-subtle">
            <span className="text-foreground-muted">skills</span>
            <span>/</span>
            <span className="text-accent font-medium">
              {activeTab.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
            </span>
          </div>
          {skillsToDisplay.map((skill: any, i: number) => {
            const skillName = skill.name || skill;
            const Icon = iconMap[skillName] || iconMap[skill.iconString];
            return (
              <Reveal key={`${skillName}-${i}`} delay={Math.min(i * 0.03, 0.3)}>
                <div className="group flex items-center gap-4 rounded-lg px-4 py-2.5 transition-colors hover:bg-surface">
                  {/* Icon or placeholder space */}
                  {Icon ? (
                    <Icon className="h-[18px] w-[18px] shrink-0 text-foreground-muted transition-colors group-hover:text-accent" />
                  ) : (
                    <div className="h-[18px] w-[18px] shrink-0" />
                  )}
                  
                  {/* Skill Name */}
                  <span className="min-w-[140px] text-body font-medium text-foreground">
                    {skillName}
                  </span>

                  {/* Mono Note / Context */}
                  {skill.context ? (
                    <span className="font-mono text-small text-foreground-subtle truncate">
                      {skill.context}
                    </span>
                  ) : null}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Category usage details */}
      {activeGroup?.usage ? (
        <Reveal delay={0.1} className="mt-10">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="text-body-lg font-semibold tracking-tight text-foreground">
              Deep Dive: {activeGroup.category}
            </h3>
            <p className="mt-2 text-body leading-relaxed text-foreground-muted">
              {activeGroup.usage}
            </p>
          </div>
        </Reveal>
      ) : null}
    </Section>
  );
}
