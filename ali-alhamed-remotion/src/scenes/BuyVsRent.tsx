// Scene 06 — 1:06.6 → 1:19.8 — C (price ≠ full cost) → B (buy vs rent) → C (key idea)
import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { F, SCENES } from "../data/timing";
import { glowText, theme } from "../theme";
import { breathe, enterStyle, popScale, useHit, useLife } from "../components/anim";
import { Icon, IconName } from "../components/Icon";
import { FullScreen } from "../components/Stage";
import { Ar, Card, IconBadge, Kicker, Num, Rule } from "../components/UI";

/* ---------- 06a  سعر العقار ≠ التكلفة الكاملة ---------- */
export const NotOnlyPrice: React.FC = () => {
  const { start, end } = SCENES.s06NotOnlyPrice;
  const frame = useCurrentFrame();
  const a = useLife(start + 0.15, end);
  const ne = useLife(start + 0.45, end, { cfg: theme.spring.pop });
  const b = useLife(68.27, end, { cfg: theme.spring.pop });
  const hit = useHit(68.3, 1.08, 12);
  return (
    <FullScreen start={start} end={end} glowX={0.5} glowY={0.55}>
      <AbsoluteFill>
        <div style={{ position: "absolute", top: 170, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
          <Kicker inSec={start + 0.1} outSec={end}>
            مصاريف أكثر بكثير
          </Kicker>
        </div>
        <div dir="rtl" style={{ position: "absolute", top: 360, left: 0, right: 0, display: "flex", justifyContent: "center", alignItems: "center", gap: 60 }}>
          <div style={enterStyle(a.p, a.o, { x: a.x })}>
            <Card pad={44} style={{ width: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <IconBadge size={96} dim>
                <Icon name="building" size={46} color={theme.colors.textDim} />
              </IconBadge>
              <Ar size={64} weight={900}>
                سعر العقار
              </Ar>
              <Ar size={26} weight={500} font="body" color={theme.colors.textDim}>
                الرقم اللي تشوفه
              </Ar>
            </Card>
          </div>
          <div style={{ opacity: ne.o, transform: `scale(${popScale(ne.p) * breathe(frame, 0.02)})` }}>
            <Num size={190} weight={900} color={theme.colors.pink} glow={1}>
              ≠
            </Num>
          </div>
          <div style={{ opacity: b.o, transform: `scale(${popScale(b.p) * hit.s})` }}>
            <Card active pad={44} style={{ width: 560, display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
              <IconBadge size={96}>
                <Icon name="coins" size={46} color={theme.colors.pink} />
              </IconBadge>
              <Ar size={64} weight={900}>
                التكلفة الكاملة
              </Ar>
              <Ar size={26} weight={500} font="body" color={theme.colors.textDim}>
                رسوم + صيانة + عمولات
              </Ar>
            </Card>
          </div>
        </div>
      </AbsoluteFill>
    </FullScreen>
  );
};

/* ---------- shared: buy / rent option card ---------- */
const Option: React.FC<{
  icon: IconName;
  title: string;
  state: "idle" | "no" | "yes";
  width?: number;
}> = ({ icon, title, state, width = 360 }) => {
  const active = state === "yes";
  const no = state === "no";
  return (
    <Card active={active} pad={36} style={{ width, display: "flex", flexDirection: "column", alignItems: "center", gap: 16, opacity: no ? 0.55 : 1 }}>
      <div style={{ position: "relative" }}>
        <IconBadge size={120} active={!no} dim={no}>
          <Icon name={icon} size={60} color={no ? theme.colors.textDim : theme.colors.pink} />
        </IconBadge>
        {state !== "idle" && (
          <div style={{ position: "absolute", left: -10, bottom: -6 }}>
            <IconBadge size={52} active={active} dim={no} style={{ background: active ? theme.colors.pink : "#16161B" }}>
              <Icon name={active ? "check" : "x"} size={28} color="#fff" stroke={2.8} />
            </IconBadge>
          </div>
        )}
      </div>
      <Ar size={66} weight={900} color={no ? theme.colors.textDim : theme.colors.text}>
        {title}
      </Ar>
    </Card>
  );
};

/* ---------- 06b  «ما بشتري شقة… بأستأجر» (B) ---------- */
export const BuyVsRentSplit: React.FC = () => {
  const { start, end } = SCENES.s06BuyVsRent;
  const frame = useCurrentFrame();
  const head = useLife(start + 0.05, end);
  const buy = useLife(start + 0.12, end);
  const vs = useLife(start + 0.22, end, { cfg: theme.spring.pop });
  const rent = useLife(start + 0.2, end);
  const buyState = frame >= F(71.2) ? "no" : "idle";
  const rentState = frame >= F(72.15) ? "yes" : "idle";
  const hitB = useHit(71.2, 1.05, 10);
  const hitR = useHit(72.15, 1.07, 10);
  return (
    <AbsoluteFill>
      <div dir="rtl" style={{ position: "absolute", left: 950, width: 850, top: 200, display: "flex", flexDirection: "column", alignItems: "center", gap: 34 }}>
        <div style={enterStyle(head.p, head.o, { x: head.x })}>
          <Ar size={50} weight={800} color={theme.colors.textDim}>
            «فأكيد هنا غلط…»
          </Ar>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
          <div style={{ ...enterStyle(buy.p, buy.o, { x: buy.x }), transform: `${enterStyle(buy.p, buy.o, { x: buy.x }).transform} scale(${hitB.s})` }}>
            <Option icon="house" title="شراء" state={buyState} />
          </div>
          <div style={{ opacity: vs.o, transform: `scale(${popScale(vs.p)})` }}>
            <Ar size={40} weight={800} color={theme.colors.textMute}>
              أو
            </Ar>
          </div>
          <div style={{ ...enterStyle(rent.p, rent.o, { x: rent.x }), transform: `${enterStyle(rent.p, rent.o, { x: rent.x }).transform} scale(${hitR.s})` }}>
            <Option icon="key" title="إيجار" state={rentState} />
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 06c  «لا لا» reset → key idea ---------- */
export const KeyIdea: React.FC = () => {
  const { start, end } = SCENES.s06KeyIdea;
  const frame = useCurrentFrame();
  // «لا لا» : the buy/rent pair returns, a pink line wipes the verdicts away
  const pairOut = 73.7;
  const pair = useLife(start, pairOut, { exit: 5 });
  const sweep = interpolate(frame, [F(73.3), F(73.62)], [0, 1], { easing: theme.ease.inOut, extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lala = useLife(start + 0.02, pairOut, { cfg: theme.spring.pop, exit: 5 });

  const studies = useLife(73.72, 77.05);
  const r1 = useLife(75.45, 77.05);
  const r2 = useLife(76.35, 77.05);
  const idea = useLife(77.17, end, { cfg: theme.spring.smooth });
  const w2 = useLife(77.6, end, { cfg: theme.spring.pop });
  const hit = useHit(78.3, 1.08, 14);
  return (
    <FullScreen start={start} end={end} enter="cut" glowX={0.5} glowY={0.55}>
      <AbsoluteFill>
        {/* reset beat */}
        <div style={{ position: "absolute", top: 300, left: 0, right: 0, display: "flex", justifyContent: "center", ...enterStyle(pair.p, pair.o, { x: pair.x, dx: 0 }) }}>
          <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 40, position: "relative" }}>
            <Option icon="house" title="شراء" state={sweep > 0.5 ? "idle" : "no"} width={340} />
            <Option icon="key" title="إيجار" state={sweep > 0.5 ? "idle" : "yes"} width={340} />
            <div style={{ position: "absolute", top: "50%", right: 0, width: `${sweep * 100}%`, height: 6, borderRadius: 3, background: theme.colors.pink, boxShadow: `0 0 18px ${theme.colors.glow}` }} />
          </div>
        </div>
        <div style={{ position: "absolute", top: 140, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: lala.o, transform: `scale(${popScale(lala.p)})` }}>
          <Ar size={96} weight={900} color={theme.colors.pink} style={{ textShadow: glowText(0.9) }}>
            لا لا!
          </Ar>
        </div>

        {/* studies */}
        <div dir="rtl" style={{ position: "absolute", top: 230, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, ...enterStyle(studies.p, studies.o, { x: studies.x }) }}>
            <Icon name="document" size={44} color={theme.colors.pink} />
            <Ar size={46} weight={800} color={theme.colors.textDim}>
              الدراسات الاقتصادية ما تقول:
            </Ar>
          </div>
          {[
            { l: r1, a: "التملّك", b: "الأفضل دائمًا" },
            { l: r2, a: "الإيجار", b: "الأفضل دائمًا" },
          ].map((r, i) => (
            <div key={i} style={{ ...enterStyle(r.l.p, r.l.o, { x: r.l.x }) }}>
              <Card pad={26} style={{ display: "flex", alignItems: "center", gap: 34, width: 980, justifyContent: "center" }}>
                <div dir="rtl" style={{ display: "flex", alignItems: "center", gap: 34 }}>
                  <Ar size={72} weight={900}>
                    {r.a}
                  </Ar>
                  <Num size={96} color={theme.colors.pink} glow={0.8}>
                    ≠
                  </Num>
                  <Ar size={72} weight={900} color={theme.colors.textDim}>
                    {r.b}
                  </Ar>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* key idea — quote card (R8 language) */}
        <div style={{ position: "absolute", top: 280, left: 0, right: 0, display: "flex", justifyContent: "center", ...enterStyle(idea.p, idea.o, { x: idea.x, dx: 0, dy: 24 }) }}>
          <div dir="rtl" style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18, width: 1180 }}>
            <Kicker inSec={77.2} outSec={end}>
              فكرة أساسية
            </Kicker>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 30 }}>
              <Ar size={190} weight={900} color={theme.colors.pink} glow={0.5} style={{ lineHeight: 0.85 }}>
                ”
              </Ar>
              <div>
                <Ar size={110} weight={900}>
                  القرار يعتمد على
                </Ar>
                <div style={{ opacity: w2.o, transform: `scale(${popScale(w2.p) * hit.s})`, transformOrigin: "right center" }}>
                  <Ar size={130} weight={900} color={theme.colors.pink} glow={0.8}>
                    عوامل عدّة
                  </Ar>
                </div>
              </div>
            </div>
            <div style={{ marginRight: 150 }}>
              <Rule inSec={77.8} width={140} />
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </FullScreen>
  );
};
