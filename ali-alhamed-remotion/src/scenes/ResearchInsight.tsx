// Scene 07 — 1:19.8 → 1:33.1 — A (calm) + journal card → C (feeling of ownership, calmer rhythm)
import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { SCENES } from "../data/timing";
import { theme } from "../theme";
import { breathe, enterStyle, popScale, useLife } from "../components/anim";
import { Icon } from "../components/Icon";
import { FullScreen } from "../components/Stage";
import { Ar, IconBadge, Kicker, Rule } from "../components/UI";

/* ---------- 07b  Journal of Housing Economics (A + left card) ---------- */
export const JournalCard: React.FC = () => {
  const { start, end } = SCENES.s07Journal;
  const frame = useCurrentFrame();
  const card = useLife(start, end, { cfg: theme.spring.smooth });
  const ic = useLife(start + 0.15, end, { cfg: theme.spring.pop });
  const name = useLife(83.85, end);
  const clear = useLife(84.8, end);
  return (
    // Card is opaque and sits over the source's own journal-cover insert (x≈100–580).
    <div
      style={{
        position: "absolute",
        left: 64,
        top: 140,
        width: 600,
        height: 740,
        borderRadius: 26,
        background: "linear-gradient(180deg, #0D0D12, #08080B)",
        border: `1.5px solid ${theme.colors.borderStrong}`,
        boxShadow: "0 40px 90px -30px rgba(0,0,0,0.95)",
        padding: 44,
        display: "flex",
        flexDirection: "column",
        gap: 26,
        overflow: "hidden",
        ...enterStyle(card.p, card.o, { dx: -40, x: card.x, s0: 0.96 }),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${theme.colors.dot} 1.2px, transparent 1.5px)`,
          backgroundSize: "30px 30px",
          opacity: 0.8,
        }}
      />
      <div style={{ position: "relative", display: "flex", justifyContent: "flex-end" }}>
        <Kicker inSec={start + 0.1} outSec={end}>
          دراسة منشورة
        </Kicker>
      </div>
      <div style={{ position: "relative", display: "flex", justifyContent: "flex-end", opacity: ic.o, transform: `scale(${popScale(ic.p) * breathe(frame, 0.012)})`, transformOrigin: "right center" }}>
        <IconBadge size={120}>
          <Icon name="document" size={60} color={theme.colors.pink} />
        </IconBadge>
      </div>
      <div style={{ position: "relative", ...enterStyle(name.p, name.o, { x: name.x, dx: -30 }) }}>
        {/* English title stays LTR */}
        <div
          dir="ltr"
          style={{
            fontFamily: theme.fonts.display,
            fontWeight: 900,
            fontSize: 66,
            lineHeight: 1.05,
            color: theme.colors.text,
            textAlign: "left",
          }}
        >
          Journal of
          <br />
          <span style={{ color: theme.colors.pink }}>Housing</span>
          <br />
          Economics
        </div>
      </div>
      <div style={{ position: "relative", marginTop: "auto", ...enterStyle(clear.p, clear.o, { x: clear.x }) }}>
        <div style={{ height: 1, background: theme.colors.border, marginBottom: 22 }} />
        <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Icon name="check" size={34} color={theme.colors.pink} stroke={2.6} />
          <Ar size={34} weight={700} font="body">
            الدراسة كانت واضحة
          </Ar>
        </div>
      </div>
    </div>
  );
};

/* ---------- 07c  الشعور بالتملّك — الراحة / الاستقرار (C, calm) ---------- */
export const OwnershipFeeling: React.FC = () => {
  const { start, end } = SCENES.s07Feeling;
  const frame = useCurrentFrame();
  const house = useLife(start + 0.1, end, { cfg: theme.spring.smooth });
  const t = useLife(start + 0.25, end);
  const nice = useLife(89.05, end);
  const c1 = useLife(89.95, end, { cfg: theme.spring.smooth });
  const c2 = useLife(91.0, end, { cfg: theme.spring.smooth });
  const glow = 0.85 + Math.sin(frame / 20) * 0.15;
  return (
    <FullScreen start={start} end={end} glowX={0.32} glowY={0.5} exit="fade">
      <AbsoluteFill>
        <div style={{ position: "absolute", left: 330, top: 260, ...enterStyle(house.p, house.o, { dx: 0, dy: 30, x: house.x, s0: 0.9 }) }}>
          <div style={{ transform: `scale(${breathe(frame, 0.015, 34)})` }}>
            <IconBadge size={420} style={{ boxShadow: `0 0 ${90 * glow}px -10px ${theme.colors.glow}, inset 0 0 50px rgba(255,26,108,0.15)` }}>
              <Icon name="house" size={220} color={theme.colors.pink} stroke={1.3} glow />
            </IconBadge>
          </div>
        </div>
        <div dir="rtl" style={{ position: "absolute", right: 200, top: 300, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 20, width: 760 }}>
          <div style={enterStyle(t.p, t.o, { x: t.x })}>
            <Ar size={40} weight={700} font="body" color={theme.colors.textDim}>
              الشعور بأنك متملّك بيت
            </Ar>
          </div>
          <div style={enterStyle(nice.p, nice.o, { x: nice.x })}>
            <Ar size={92} weight={900}>
              شعور جميل
            </Ar>
          </div>
          <Rule inSec={89.3} width={110} />
          <div style={{ display: "flex", gap: 20, marginTop: 18 }}>
            {[
              { l: c1, w: "الراحة", icon: "heart" as const },
              { l: c2, w: "الاستقرار", icon: "shield" as const },
            ].map((c, i) => (
              <div key={i} style={enterStyle(c.l.p, c.l.o, { x: c.l.x })}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 30px 18px",
                    borderRadius: 999,
                    border: `1.5px solid ${i === 0 ? theme.colors.pink : theme.colors.borderStrong}`,
                    background: "rgba(10,10,14,0.9)",
                  }}
                >
                  <Icon name={c.icon} size={36} color={theme.colors.pink} />
                  <Ar size={50} weight={800}>
                    {c.w}
                  </Ar>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </FullScreen>
  );
};
