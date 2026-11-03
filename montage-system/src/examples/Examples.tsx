// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLES — one small composition per component (Studio → folder "Examples").
// Open any of them in Remotion Studio to see the component and copy its usage.
// ─────────────────────────────────────────────────────────────────────────────
import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { type as T } from "../theme/theme";
import { useColors } from "../theme/ThemeContext";
import { PlaceholderSpeaker } from "../components/footage/PlaceholderSpeaker";
import { SafeArea } from "../components/layout/SafeArea";
import { GlassCard } from "../components/layout/GlassCard";
import { Grain, Vignette } from "../components/fx/Finish";
import { SafeZoneGuide } from "../components/fx/SafeZoneGuide";
import { Stagger } from "../components/motion/Stagger";
import { TextReveal } from "../components/text/TextReveal";
import { IconAnimation } from "../components/graphics/IconAnimation";
import { StaggerList } from "../components/graphics/StaggerList";
import { LowerThird } from "../components/graphics/LowerThird";
import { CTAButton } from "../components/graphics/CTAButton";
import { Counter } from "../components/graphics/Counter";
import { Tag } from "../components/graphics/Tag";
import { Icon } from "../components/graphics/icons-preview";

const Stage: React.FC<{ children: React.ReactNode; guide?: boolean }> = ({ children, guide }) => (
  <AbsoluteFill>
    <PlaceholderSpeaker />
    {children}
    <Grain />
    <Vignette />
    {guide ? <SafeZoneGuide /> : null}
  </AbsoluteFill>
);

/** TextReveal: word / char / line modes, with the three highlight styles. */
export const TextRevealExample: React.FC = () => (
  <Stage>
    <SafeArea placement="center">
      <div style={{ display: "flex", flexDirection: "column", gap: 70 }}>
        <TextReveal text="كلمة بكلمة مع تمييز" highlight={["تمييز"]} highlightStyle="pill" size={T.title} />
        <Sequence from={20} layout="none">
          <TextReveal text="حرف بحرف بالعربي" mode="char" highlight={["بالعربي"]} highlightStyle="underline" size={T.title} />
        </Sequence>
        <Sequence from={40} layout="none">
          <TextReveal text="Letter by letter" mode="char" size={T.title} />
        </Sequence>
        <Sequence from={60} layout="none">
          <TextReveal text={"سطر بسطر\nمن خلف قناع"} mode="line" highlight={["قناع"]} size={T.title} />
        </Sequence>
      </div>
    </SafeArea>
  </Stage>
);

/** IconAnimation + Tag: badges that pop, draw and breathe. */
export const IconsExample: React.FC = () => (
  <Stage>
    <SafeArea placement="center">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 50 }}>
        <Stagger direction="row" every={6} gap={30}>
          <IconAnimation name="check" tone="success" exit={false} />
          <IconAnimation name="x" tone="danger" exit={false} />
          <IconAnimation name="bulb" tone="hero" exit={false} />
        </Stagger>
        <Stagger direction="row" every={6} delay={18} gap={30}>
          <IconAnimation name="mic" exit={false} />
          <IconAnimation name="rocket" exit={false} />
          <IconAnimation name="chart" exit={false} />
        </Stagger>
        <Sequence from={36} layout="none">
          <Tag text="خطأ شائع" tone="danger" />
        </Sequence>
        <IconGrid />
      </div>
    </SafeArea>
  </Stage>
);

const IconGrid: React.FC = () => {
  const c = useColors();
  return <Icon color={c.paperDim} />;
};

/** StaggerList: numbered, check, icon bullets — synced with `at`. */
export const StaggerListExample: React.FC = () => (
  <Stage>
    <SafeArea placement="bottom">
      <StaggerList
        bullet="number"
        items={[
          { text: "الإضاءة من الشباك", at: 0.3 },
          { text: "الكاميرا على مستوى العين", at: 1.3 },
          { text: "الصوت أهم من الصورة", at: 2.3 },
        ]}
      />
    </SafeArea>
  </Stage>
);

/** LowerThird: name + role. */
export const LowerThirdExample: React.FC = () => (
  <Stage>
    <SafeArea placement="bottom" align="start">
      <LowerThird name="عبدالله المشهور" role="خبير صناعة المحتوى" />
    </SafeArea>
  </Stage>
);

/** CTAButton with tap ripple + Counter. */
export const CTAExample: React.FC = () => (
  <Stage>
    <SafeArea placement="center">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 80 }}>
        <Counter to={87} suffix="%" />
        <CTAButton label="احفظ الفيديو" icon="bookmark" delay={20} tapAt={50} />
        <Sequence from={30} layout="none">
          <CTAButton label="Follow for more" icon="arrow" delay={0} />
        </Sequence>
      </div>
    </SafeArea>
  </Stage>
);

/** GlassCard + SafeZoneGuide: shows where Instagram's UI covers the frame. */
export const SafeZoneExample: React.FC = () => (
  <Stage guide>
    <SafeArea placement="center">
      <GlassCard accentEdge>
        <TextReveal text={"كل النصوص المهمة\nتبقى داخل المنطقة الآمنة"} highlight={["الآمنة"]} size={T.body} />
      </GlassCard>
    </SafeArea>
  </Stage>
);
